from pydantic import BaseModel, EmailStr
from typing import Optional, List, Any
import datetime

# --- AUTH SCHEMAS ---
class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    role: Optional[str] = "junior"  # admin, senior, junior

class UserOut(BaseModel):
    id: str
    email: EmailStr
    full_name: str
    role: str
    created_at: datetime.datetime

    class Config:
        from_attributes = True

class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut

# --- CLIENT SCHEMAS ---
class ClientBase(BaseModel):
    name: str
    pan: str
    gstin: Optional[str] = None
    entity_type: str  # Individual, Firm, Company, LLP
    filing_frequency: Optional[str] = "Monthly"
    is_audit_required: Optional[bool] = False
    contact_person: Optional[str] = None
    email: EmailStr
    phone: Optional[str] = None

class ClientCreate(ClientBase):
    pass

class ClientUpdate(BaseModel):
    name: Optional[str] = None
    pan: Optional[str] = None
    gstin: Optional[str] = None
    entity_type: Optional[str] = None
    filing_frequency: Optional[str] = None
    is_audit_required: Optional[bool] = None
    contact_person: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None

class ClientOut(ClientBase):
    id: str
    created_at: datetime.datetime

    class Config:
        from_attributes = True

# --- COMPLIANCE TASK SCHEMAS ---
class ComplianceTaskBase(BaseModel):
    client_id: str
    title: str
    category: str  # GST, TDS, ITR, ROC
    due_date: datetime.datetime
    status: Optional[str] = "Pending"  # Pending, In Progress, Filed, Overdue
    recurring_rule: Optional[str] = None
    period_month: Optional[int] = None
    period_year: Optional[int] = None

class ComplianceTaskCreate(ComplianceTaskBase):
    pass

class ComplianceTaskUpdate(BaseModel):
    title: Optional[str] = None
    due_date: Optional[datetime.datetime] = None
    status: Optional[str] = None
    urgency: Optional[str] = None

class ComplianceTaskOut(ComplianceTaskBase):
    id: str
    urgency: str
    created_at: datetime.datetime
    client_name: Optional[str] = None
    assigned_user_ids: Optional[List[str]] = []
    assigned_user_names: Optional[List[str]] = []

    class Config:
        from_attributes = True

# --- DOCUMENT SCHEMAS ---
class DocumentOut(BaseModel):
    id: str
    task_id: Optional[str] = None
    client_id: str
    doc_name: str
    doc_type: Optional[str] = None
    file_path: Optional[str] = None
    status: str  # Requested, Uploaded, Verified, Rejected
    token: str
    uploaded_at: Optional[datetime.datetime] = None

    class Config:
        from_attributes = True

class PublicTokenUploadInfo(BaseModel):
    token: str
    client_name: str
    doc_name: str
    doc_type: Optional[str] = None
    status: str
    task_title: Optional[str] = None
    due_date: Optional[datetime.datetime] = None

# --- RECONCILIATION SCHEMAS ---
class ReconciliationRunRequest(BaseModel):
    job_name: str
    tolerance_amount: Optional[float] = 1.0
    tolerance_days: Optional[int] = 3

class ReconciliationJobOut(BaseModel):
    id: str
    job_name: str
    file_a_name: str
    file_b_name: str
    matched_count: int
    unmatched_a_count: int
    unmatched_b_count: int
    tolerance_amount: float
    tolerance_days: int
    summary_json: Optional[Any] = None
    created_at: datetime.datetime

    class Config:
        from_attributes = True

# --- TASK ASSIGNMENT SCHEMAS ---
class TaskAssignRequest(BaseModel):
    task_id: str
    user_id: str

# --- FIRM OWNER DASHBOARD SCHEMAS ---
class DashboardAnalyticsOut(BaseModel):
    total_clients: int
    tasks_due_this_week: int
    overdue_count: int
    completed_this_month: int
    completed_last_month: int
    completion_rate_percentage: float
    staff_workload: List[Any]
    client_category_distribution: Any
