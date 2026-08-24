import os
import shutil
import datetime
import uuid
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from sqlalchemy.orm import Session
from typing import List, Optional
from ..database import get_db
from ..models import Document, Client, ComplianceTask, User
from ..schemas import DocumentOut, PublicTokenUploadInfo
from ..auth import get_current_user

router = APIRouter(prefix="/api/v1/documents", tags=["Document Collection"])

UPLOAD_DIR = os.path.join(os.getcwd(), "backend", "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.get("", response_model=List[DocumentOut])
def list_documents(
    client_id: Optional[str] = None,
    task_id: Optional[str] = None,
    status_filter: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(Document)
    if client_id:
        query = query.filter(Document.client_id == client_id)
    if task_id:
        query = query.filter(Document.task_id == task_id)
    if status_filter and status_filter != "ALL":
        query = query.filter(Document.status == status_filter)
    return query.order_by(Document.uploaded_at.desc().nullslast()).all()

@router.post("/request", response_model=DocumentOut)
def request_document_from_client(
    client_id: str,
    doc_name: str,
    doc_type: Optional[str] = "Sales Register",
    task_id: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    client = db.query(Client).filter(Client.id == client_id).first()
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")

    new_doc = Document(
        client_id=client_id,
        task_id=task_id,
        doc_name=doc_name,
        doc_type=doc_type,
        status="Requested",
        token=str(uuid.uuid4())
    )
    db.add(new_doc)
    db.commit()
    db.refresh(new_doc)
    return new_doc

@router.put("/{doc_id}/status")
def update_document_status(
    doc_id: str,
    status_value: str,  # Requested, Uploaded, Verified, Rejected
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    doc = db.query(Document).filter(Document.id == doc_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    doc.status = status_value
    db.commit()
    return {"message": f"Document status updated to {status_value}"}

# --- PUBLIC CLIENT-FACING TOKEN PORTAL (NO AUTH REQUIRED) ---

@router.get("/public/token/{token}", response_model=PublicTokenUploadInfo)
def get_public_token_info(token: str, db: Session = Depends(get_db)):
    doc = db.query(Document).filter(Document.token == token).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Invalid or expired upload link token")

    task_title = doc.task.title if doc.task else None
    due_date = doc.task.due_date if doc.task else None

    return PublicTokenUploadInfo(
        token=doc.token,
        client_name=doc.client.name if doc.client else "Client",
        doc_name=doc.doc_name,
        doc_type=doc.doc_type,
        status=doc.status,
        task_title=task_title,
        due_date=due_date
    )

ALLOWED_EXTENSIONS = {".pdf", ".png", ".jpg", ".jpeg", ".csv", ".xlsx", ".xls", ".docx"}
MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024  # 15 MB limit

@router.post("/public/upload/{token}")
async def public_client_file_upload(
    token: str,
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    doc = db.query(Document).filter(Document.token == token).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Invalid or expired upload link token")

    if not file.filename:
        raise HTTPException(status_code=400, detail="No file filename provided")

    raw_filename = os.path.basename(file.filename)
    file_ext = os.path.splitext(raw_filename)[1].lower()

    if file_ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400, 
            detail=f"Disallowed file extension '{file_ext}'. Allowed formats: PDF, PNG, JPG, JPEG, CSV, XLSX, DOCX."
        )

    # Validate file size (max 15 MB)
    contents = await file.read()
    if len(contents) > MAX_FILE_SIZE_BYTES:
        raise HTTPException(
            status_code=400,
            detail="File size exceeds maximum permitted limit of 15MB."
        )

    saved_filename = f"{token}_{int(datetime.datetime.utcnow().timestamp())}{file_ext}"
    file_path = os.path.join(UPLOAD_DIR, saved_filename)

    with open(file_path, "wb") as buffer:
        buffer.write(contents)

    doc.file_path = file_path
    doc.status = "Uploaded"
    doc.uploaded_at = datetime.datetime.utcnow()

    # Automatically update related task status to In Progress if pending
    if doc.task and doc.task.status == "Pending":
        doc.task.status = "In Progress"

    db.commit()
    return {
        "message": "File uploaded successfully!",
        "filename": raw_filename,
        "doc_status": "Uploaded"
    }

