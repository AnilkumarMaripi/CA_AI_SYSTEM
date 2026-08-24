from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
import datetime
from ..database import get_db
from ..models import ComplianceTask, Client, User, TaskAssignment
from ..schemas import ComplianceTaskOut, ComplianceTaskUpdate, ComplianceTaskCreate
from ..auth import get_current_user
from ..engine import calculate_urgency, generate_client_compliance_tasks

router = APIRouter(prefix="/api/v1/compliance", tags=["Compliance Calendar"])

@router.get("", response_model=List[ComplianceTaskOut])
def list_compliance_tasks(
    category: Optional[str] = None,
    urgency: Optional[str] = None,
    client_id: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(ComplianceTask).join(Client)
    
    if category and category != "ALL":
        query = query.filter(ComplianceTask.category == category)
    if client_id:
        query = query.filter(ComplianceTask.client_id == client_id)
    if search:
        s = f"%{search}%"
        query = query.filter((ComplianceTask.title.ilike(s)) | (Client.name.ilike(s)))
        
    tasks = query.order_by(ComplianceTask.due_date.asc()).all()
    
    result = []
    for t in tasks:
        # Recalculate live urgency
        t.urgency = calculate_urgency(t.due_date, t.status)
        if urgency and urgency != "ALL" and t.urgency != urgency:
            continue
            
        assignments = db.query(TaskAssignment).filter(TaskAssignment.task_id == t.id).all()
        assigned_uids = [a.user_id for a in assignments]
        assigned_names = [a.user.full_name for a in assignments if a.user]

        task_out = ComplianceTaskOut.model_validate(t)
        task_out.client_name = t.client.name if t.client else "Unknown Client"
        task_out.assigned_user_ids = assigned_uids
        task_out.assigned_user_names = assigned_names
        result.append(task_out)

    return result

@router.post("/generate-all")
def generate_all_client_deadlines(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    clients = db.query(Client).all()
    generated_count = 0

    for client in clients:
        tasks = generate_client_compliance_tasks(client)
        for t_dict in tasks:
            # Check if task for this period already exists
            existing = db.query(ComplianceTask).filter(
                ComplianceTask.client_id == client.id,
                ComplianceTask.recurring_rule == t_dict["recurring_rule"],
                ComplianceTask.period_month == t_dict["period_month"],
                ComplianceTask.period_year == t_dict["period_year"]
            ).first()

            if not existing:
                urgency = calculate_urgency(t_dict["due_date"], t_dict["status"])
                c_task = ComplianceTask(
                    client_id=client.id,
                    urgency=urgency,
                    **t_dict
                )
                db.add(c_task)
                generated_count += 1

    db.commit()
    return {"message": f"Successfully generated {generated_count} compliance deadlines."}

@router.put("/{task_id}", response_model=ComplianceTaskOut)
def update_compliance_task(
    task_id: str,
    task_data: ComplianceTaskUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    task = db.query(ComplianceTask).filter(ComplianceTask.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Compliance task not found")

    for key, value in task_data.model_dump(exclude_unset=True).items():
        setattr(task, key, value)

    task.urgency = calculate_urgency(task.due_date, task.status)
    db.commit()
    db.refresh(task)

    assignments = db.query(TaskAssignment).filter(TaskAssignment.task_id == task.id).all()
    assigned_uids = [a.user_id for a in assignments]
    assigned_names = [a.user.full_name for a in assignments if a.user]

    task_out = ComplianceTaskOut.model_validate(task)
    task_out.client_name = task.client.name if task.client else "Unknown Client"
    task_out.assigned_user_ids = assigned_uids
    task_out.assigned_user_names = assigned_names
    return task_out
