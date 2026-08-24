import datetime
import os
import time
from collections import defaultdict
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
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

# 1. Configured CORS Origins (Prevent open wildcard allow_origins with credentials)
ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
env_origins = os.getenv("ALLOWED_ORIGINS")
if env_origins:
    ALLOWED_ORIGINS.extend([o.strip() for o in env_origins.split(",") if o.strip()])

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["Authorization", "Content-Type", "Accept", "Origin", "User-Agent"],
)

# 2. Security Headers Middleware
@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    return response

# 3. Rate Limiting Middleware (Brute-force protection for login and sensitive upload endpoints)
RATE_LIMIT_STORE = defaultdict(list)

@app.middleware("http")
async def rate_limit_middleware(request: Request, call_next):
    path = request.url.path
    if path.startswith("/api/v1/auth/login") or "/public/upload" in path:
        client_ip = request.client.host if request.client else "unknown"
        now = time.time()
        # Filter timestamps within the last 60 seconds
        RATE_LIMIT_STORE[client_ip] = [t for t in RATE_LIMIT_STORE[client_ip] if now - t < 60]
        if len(RATE_LIMIT_STORE[client_ip]) >= 15:
            return JSONResponse(
                status_code=429,
                content={"detail": "Too many requests. Please wait a minute before retrying."}
            )
        RATE_LIMIT_STORE[client_ip].append(now)
    return await call_next(request)

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
                password_hash=get_password_hash("TaxDeskAdmin@2026!"),
                full_name="Rajesh Sharma, FCA (Partner)",
                role="admin"
            )
            senior_user = User(
                email="senior@taxdesk.in",
                password_hash=get_password_hash("TaxDeskSenior#2026"),
                full_name="Priya Patel, ACA (Senior Manager)",
                role="senior"
            )
            junior_user = User(
                email="junior@taxdesk.in",
                password_hash=get_password_hash("TaxDeskJunior$2026"),
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
