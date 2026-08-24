import datetime
import uuid
from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from .database import Base

def generate_uuid():
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=generate_uuid)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    role = Column(String, default="junior")  # admin, senior, junior
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    task_assignments = relationship("TaskAssignment", back_populates="user")


class Client(Base):
    __tablename__ = "clients"

    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String, index=True, nullable=False)
    pan = Column(String, index=True, nullable=False)
    gstin = Column(String, index=True, nullable=True)
    entity_type = Column(String, nullable=False)  # Individual, Firm, Company, LLP
    filing_frequency = Column(String, default="Monthly")  # Monthly, Quarterly
    is_audit_required = Column(Boolean, default=False)
    contact_person = Column(String, nullable=True)
    email = Column(String, nullable=False)
    phone = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    compliance_tasks = relationship("ComplianceTask", back_populates="client", cascade="all, delete-orphan")
    documents = relationship("Document", back_populates="client", cascade="all, delete-orphan")


class ComplianceTask(Base):
    __tablename__ = "compliance_tasks"

    id = Column(String, primary_key=True, default=generate_uuid)
    client_id = Column(String, ForeignKey("clients.id"), nullable=False)
    title = Column(String, nullable=False)
    category = Column(String, nullable=False)  # GST, TDS, ITR, ROC
    due_date = Column(DateTime, nullable=False)
    status = Column(String, default="Pending")  # Pending, In Progress, Filed, Overdue
    urgency = Column(String, default="UPCOMING")  # OVERDUE, DUE_SOON, UPCOMING
    recurring_rule = Column(String, nullable=True)  # e.g., GSTR-1, GSTR-3B, TDS-26Q
    period_month = Column(Integer, nullable=True)
    period_year = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    client = relationship("Client", back_populates="compliance_tasks")
    documents = relationship("Document", back_populates="task", cascade="all, delete-orphan")
    assignments = relationship("TaskAssignment", back_populates="task", cascade="all, delete-orphan")


class Document(Base):
    __tablename__ = "documents"

    id = Column(String, primary_key=True, default=generate_uuid)
    task_id = Column(String, ForeignKey("compliance_tasks.id"), nullable=True)
    client_id = Column(String, ForeignKey("clients.id"), nullable=False)
    doc_name = Column(String, nullable=False)
    doc_type = Column(String, nullable=True)  # e.g. Sales Register, Bank Statement
    file_path = Column(String, nullable=True)
    status = Column(String, default="Requested")  # Requested, Uploaded, Verified, Rejected
    token = Column(String, unique=True, index=True, default=generate_uuid)
    uploaded_at = Column(DateTime, nullable=True)

    client = relationship("Client", back_populates="documents")
    task = relationship("ComplianceTask", back_populates="documents")


class ReconciliationJob(Base):
    __tablename__ = "reconciliation_jobs"

    id = Column(String, primary_key=True, default=generate_uuid)
    job_name = Column(String, nullable=False)
    file_a_name = Column(String, nullable=False)
    file_b_name = Column(String, nullable=False)
    matched_count = Column(Integer, default=0)
    unmatched_a_count = Column(Integer, default=0)
    unmatched_b_count = Column(Integer, default=0)
    tolerance_amount = Column(Float, default=1.0)
    tolerance_days = Column(Integer, default=3)
    summary_json = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class TaskAssignment(Base):
    __tablename__ = "task_assignments"

    id = Column(String, primary_key=True, default=generate_uuid)
    task_id = Column(String, ForeignKey("compliance_tasks.id"), nullable=False)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    assigned_by = Column(String, nullable=True)
    assigned_at = Column(DateTime, default=datetime.datetime.utcnow)

    task = relationship("ComplianceTask", back_populates="assignments")
    user = relationship("User", back_populates="task_assignments")
