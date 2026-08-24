import datetime
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Client, ComplianceTask, TaskAssignment, User
from ..schemas import DashboardAnalyticsOut
from ..auth import get_current_user
from ..engine import calculate_urgency

router = APIRouter(prefix="/api/v1/analytics", tags=["Firm Owner Dashboard Analytics"])

@router.get("", response_model=DashboardAnalyticsOut)
def get_firm_owner_analytics(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    total_clients = db.query(Client).count()

    now = datetime.datetime.utcnow()
    one_week_later = now + datetime.timedelta(days=7)
    
    all_tasks = db.query(ComplianceTask).all()

    due_this_week = 0
    overdue_count = 0
    completed_this_month = 0
    completed_last_month = 0

    first_day_this_month = datetime.datetime(now.year, now.month, 1)
    first_day_last_month = (first_day_this_month - datetime.timedelta(days=1)).replace(day=1)

    for t in all_tasks:
        urgency = calculate_urgency(t.due_date, t.status)
        if urgency == "OVERDUE":
            overdue_count += 1
        
        if now <= t.due_date <= one_week_later and t.status != "Filed":
            due_this_week += 1

        if t.status == "Filed":
            if t.due_date >= first_day_this_month:
                completed_this_month += 1
            elif first_day_last_month <= t.due_date < first_day_this_month:
                completed_last_month += 1

    total_tasks = len(all_tasks)
    filed_total = sum(1 for t in all_tasks if t.status == "Filed")
    completion_rate = (filed_total / total_tasks * 100) if total_tasks > 0 else 100.0

    # Staff Workload Distribution
    users = db.query(User).all()
    staff_workload = []
    for u in users:
        assigned_tasks_count = db.query(TaskAssignment).filter(TaskAssignment.user_id == u.id).count()
        staff_workload.append({
            "user_id": u.id,
            "full_name": u.full_name,
            "role": u.role,
            "assigned_tasks_count": assigned_tasks_count
        })

    # Client Category Distribution
    categories = ["Individual", "Firm", "Company", "LLP"]
    cat_distribution = {}
    for cat in categories:
        cat_distribution[cat] = db.query(Client).filter(Client.entity_type == cat).count()

    return DashboardAnalyticsOut(
        total_clients=total_clients,
        tasks_due_this_week=due_this_week,
        overdue_count=overdue_count,
        completed_this_month=completed_this_month,
        completed_last_month=completed_last_month,
        completion_rate_percentage=round(completion_rate, 1),
        staff_workload=staff_workload,
        client_category_distribution=cat_distribution
    )
