import datetime
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base, SessionLocal
from .models import User, Client, ComplianceTask, Document, TaskAssignment
from .auth import get_password_hash
from .engine import generate_client_compliance_tasks, calculate_urgency
from .routers import auth, clients, compliance, documents, reconciliation, tasks, analytics

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="TaxDesk API - B2B CA Practice Management Platform",
    description="Automated Practice Management for Chartered Accountants",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers
app.include_router(auth.router)
app.include_router(clients.router)
app.include_router(compliance.router)
app.include_router(documents.router)
app.include_router(reconciliation.router)
app.include_router(tasks.router)
app.include_router(analytics.router)

@app.on_event("startup")
def seed_initial_practice_data():
    db = SessionLocal()
    try:
        # Seed default Admin & Staff Users if none exist
        if db.query(User).count() == 0:
            admin_user = User(
                email="admin@taxdesk.in",
                password_hash=get_password_hash("admin123"),
                full_name="Rajesh Sharma, FCA (Partner)",
                role="admin"
            )
            senior_user = User(
                email="senior@taxdesk.in",
                password_hash=get_password_hash("senior123"),
                full_name="Priya Patel, ACA (Senior Manager)",
                role="senior"
            )
            junior_user = User(
                email="junior@taxdesk.in",
                password_hash=get_password_hash("junior123"),
                full_name="Amit Verma (Audit Assistant)",
                role="junior"
            )
            db.add_all([admin_user, senior_user, junior_user])
            db.commit()

        # Seed sample Clients if none exist
        if db.query(Client).count() == 0:
            c1 = Client(
                name="TechSolutions Private Limited",
                pan="AAACT1234F",
                gstin="27AAACT1234F1Z5",
                entity_type="Company",
                filing_frequency="Monthly",
                is_audit_required=True,
                contact_person="Rohan Gupta (CFO)",
                email="rohan@techsolutions.com",
                phone="+91 98200 11223"
            )
            c2 = Client(
                name="QuickPrint Furnishings LLP",
                pan="AAPFQ8821K",
                gstin="27AAPFQ8821K1Z2",
                entity_type="LLP",
                filing_frequency="Monthly",
                is_audit_required=False,
                contact_person="Sunil Kumar",
                email="accounts@quickprint.in",
                phone="+91 98111 44556"
            )
            c3 = Client(
                name="Dr. Alok Verma (Dental Clinic)",
                pan="APGPM9921K",
                gstin="",
                entity_type="Individual",
                filing_frequency="Quarterly",
                is_audit_required=False,
                contact_person="Dr. Alok Verma",
                email="dr.alok@healthclinic.org",
                phone="+91 98333 77889"
            )
            db.add_all([c1, c2, c3])
            db.commit()
            db.refresh(c1)
            db.refresh(c2)
            db.refresh(c3)

            # Generate Compliance Deadlines for seeded clients
            for client in [c1, c2, c3]:
                tasks_list = generate_client_compliance_tasks(client)
                for t_dict in tasks_list:
                    urgency = calculate_urgency(t_dict["due_date"], t_dict["status"])
                    c_task = ComplianceTask(
                        client_id=client.id,
                        urgency=urgency,
                        **t_dict
                    )
                    db.add(c_task)
            db.commit()

            # Seed Sample Document Requests
            first_task = db.query(ComplianceTask).first()
            if first_task:
                d1 = Document(
                    client_id=c1.id,
                    task_id=first_task.id,
                    doc_name="July 2026 Sales & Output Tax Register",
                    doc_type="Sales Register",
                    status="Requested",
                    token="demo-token-techsolutions-sales"
                )
                d2 = Document(
                    client_id=c1.id,
                    task_id=first_task.id,
                    doc_name="July 2026 Purchase Register & GSTR-2B",
                    doc_type="Purchase Register",
                    status="Uploaded",
                    token="demo-token-techsolutions-purchase",
                    uploaded_at=datetime.datetime.utcnow()
                )
                db.add_all([d1, d2])
                db.commit()

    finally:
        db.close()

@app.get("/")
def root():
    return {
        "app": "TaxDesk API",
        "status": "Online",
        "timestamp": datetime.datetime.utcnow().isoformat()
    }
