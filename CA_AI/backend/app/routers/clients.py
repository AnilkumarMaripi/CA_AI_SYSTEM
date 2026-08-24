from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from ..database import get_db
from ..models import Client, ComplianceTask, Document, User
from ..schemas import ClientCreate, ClientUpdate, ClientOut
from ..auth import get_current_user
from ..engine import generate_client_compliance_tasks, calculate_urgency

router = APIRouter(prefix="/api/v1/clients", tags=["Clients"])

@router.get("", response_model=List[ClientOut])
def list_clients(
    entity_type: Optional[str] = None, 
    search: Optional[str] = None,
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    query = db.query(Client)
    if entity_type and entity_type != "ALL":
        query = query.filter(Client.entity_type == entity_type)
    if search:
        s = f"%{search}%"
        query = query.filter((Client.name.ilike(s)) | (Client.pan.ilike(s)) | (Client.gstin.ilike(s)))
    return query.order_by(Client.created_at.desc()).all()

@router.post("", response_model=ClientOut)
def create_client(
    client_data: ClientCreate, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    existing = db.query(Client).filter(Client.pan == client_data.pan).first()
    if existing:
        raise HTTPException(status_code=400, detail=f"Client with PAN {client_data.pan} already exists.")
    
    new_client = Client(**client_data.model_dump())
    db.add(new_client)
    db.commit()
    db.refresh(new_client)

    # Automatically trigger compliance deadline generator for this new client
    generated_tasks = generate_client_compliance_tasks(new_client)
    for task_dict in generated_tasks:
        urgency = calculate_urgency(task_dict["due_date"], task_dict["status"])
        c_task = ComplianceTask(
            client_id=new_client.id,
            urgency=urgency,
            **task_dict
        )
        db.add(c_task)
    
    db.commit()
    return new_client

@router.get("/{client_id}", response_model=ClientOut)
def get_client(client_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    client = db.query(Client).filter(Client.id == client_id).first()
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")
    return client

@router.put("/{client_id}", response_model=ClientOut)
def update_client(
    client_id: str, 
    client_data: ClientUpdate, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    client = db.query(Client).filter(Client.id == client_id).first()
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")

    for key, value in client_data.model_dump(exclude_unset=True).items():
        setattr(client, key, value)
    
    db.commit()
    db.refresh(client)
    return client

@router.delete("/{client_id}")
def delete_client(client_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    client = db.query(Client).filter(Client.id == client_id).first()
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")

    db.delete(client)
    db.commit()
    return {"message": "Client deleted successfully"}

@router.get("/{client_id}/dashboard")
def get_client_dashboard(client_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    client = db.query(Client).filter(Client.id == client_id).first()
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")

    tasks = db.query(ComplianceTask).filter(ComplianceTask.client_id == client_id).all()
    docs = db.query(Document).filter(Document.client_id == client_id).all()

    pending_count = sum(1 for t in tasks if t.status in ["Pending", "In Progress"])
    overdue_count = sum(1 for t in tasks if calculate_urgency(t.due_date, t.status) == "OVERDUE")
    filed_count = sum(1 for t in tasks if t.status == "Filed")

    requested_docs = sum(1 for d in docs if d.status == "Requested")
    uploaded_docs = sum(1 for d in docs if d.status in ["Uploaded", "Verified"])

    return {
        "client": client,
        "total_compliance_tasks": len(tasks),
        "pending_tasks": pending_count,
        "overdue_tasks": overdue_count,
        "filed_tasks": filed_count,
        "document_status": {
            "requested": requested_docs,
            "uploaded_verified": uploaded_docs
        },
        "recent_tasks": tasks[:5]
    }
