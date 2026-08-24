from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from ..database import get_db
from ..models import ComplianceTask, TaskAssignment, User, Client
from ..schemas import TaskAssignRequest, ComplianceTaskOut
from ..auth import get_current_user
from ..engine import calculate_urgency

router = APIRouter(prefix="/api/v1/tasks", tags=["Kanban Workflow & Assignments"])

@router.post("/assign")
def assign_task_to_user(
    req: TaskAssignRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    task = db.query(ComplianceTask).filter(ComplianceTask.id == req.task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    target_user = db.query(User).filter(User.id == req.user_id).first()
    if not target_user:
        raise HTTPException(status_code=404, detail="User not found")

    # Check if already assigned
    existing = db.query(TaskAssignment).filter(
        TaskAssignment.task_id == req.task_id,
        TaskAssignment.user_id == req.user_id
    ).first()

    if not existing:
        assignment = TaskAssignment(
            task_id=req.task_id,
            user_id=req.user_id,
            assigned_by=current_user.full_name
        )
        db.add(assignment)
        db.commit()

    return {"message": f"Task assigned to {target_user.full_name}"}

@router.delete("/unassign/{task_id}/{user_id}")
def unassign_task_user(
    task_id: str,
    user_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    assignment = db.query(TaskAssignment).filter(
        TaskAssignment.task_id == task_id,
        TaskAssignment.user_id == user_id
    ).first()

    if assignment:
        db.delete(assignment)
        db.commit()
    return {"message": "Assignment removed"}

@router.put("/{task_id}/stage")
def update_kanban_stage(
    task_id: str,
    status_stage: str,  # Pending (To Do), In Progress, Review, Filed (Done)
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    task = db.query(ComplianceTask).filter(ComplianceTask.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    task.status = status_stage
    task.urgency = calculate_urgency(task.due_date, task.status)
    db.commit()
    return {"message": f"Task stage updated to {status_stage}"}
