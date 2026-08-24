import io
import pandas as pd
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, Response
from sqlalchemy.orm import Session
from typing import List, Optional
from ..database import get_db
from ..models import ReconciliationJob, User
from ..schemas import ReconciliationJobOut
from ..auth import get_current_user
from ..engine import run_csv_reconciliation

router = APIRouter(prefix="/api/v1/reconciliation", tags=["Reconciliation Tool"])

@router.get("", response_model=List[ReconciliationJobOut])
def list_reconciliation_jobs(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(ReconciliationJob).order_by(ReconciliationJob.created_at.desc()).all()

@router.post("/match")
async def run_reconciliation(
    job_name: str = Form("GST GSTR-2B vs Purchase Register Match"),
    tolerance_amount: float = Form(1.0),
    tolerance_days: int = Form(3),
    file_a: UploadFile = File(...),
    file_b: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        contents_a = await file_a.read()
        contents_b = await file_b.read()

        df_a = pd.read_csv(io.BytesIO(contents_a))
        df_b = pd.read_csv(io.BytesIO(contents_b))

        result = run_csv_reconciliation(df_a, df_b, tolerance_amount, tolerance_days)

        rec_job = ReconciliationJob(
            job_name=job_name,
            file_a_name=file_a.filename,
            file_b_name=file_b.filename,
            matched_count=result["matched_count"],
            unmatched_a_count=result["unmatched_a_count"],
            unmatched_b_count=result["unmatched_b_count"],
            tolerance_amount=tolerance_amount,
            tolerance_days=tolerance_days,
            summary_json={
                "matched_sample": result["matched"][:20],
                "unmatched_a_sample": result["unmatched_a"][:20],
                "unmatched_b_sample": result["unmatched_b"][:20]
            }
        )
        db.add(rec_job)
        db.commit()
        db.refresh(rec_job)

        return {
            "job_id": rec_job.id,
            "job_name": job_name,
            "matched_count": result["matched_count"],
            "unmatched_a_count": result["unmatched_a_count"],
            "unmatched_b_count": result["unmatched_b_count"],
            "result": result
        }

    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Reconciliation error: {str(e)}")

@router.post("/export-excel")
async def export_reconciliation_excel(
    file_a: UploadFile = File(...),
    file_b: UploadFile = File(...),
    tolerance_amount: float = Form(1.0),
    tolerance_days: int = Form(3),
    current_user: User = Depends(get_current_user)
):
    try:
        contents_a = await file_a.read()
        contents_b = await file_b.read()

        df_a = pd.read_csv(io.BytesIO(contents_a))
        df_b = pd.read_csv(io.BytesIO(contents_b))

        res = run_csv_reconciliation(df_a, df_b, tolerance_amount, tolerance_days)

        output = io.BytesIO()
        with pd.ExcelWriter(output, engine='openpyxl') as writer:
            # 1. Matched Tab
            if res["matched"]:
                matched_rows = []
                for m in res["matched"]:
                    row = {**m["file_a_row"], "STATUS": m["status"], "DIFF_AMOUNT": m["amount_diff"]}
                    matched_rows.append(row)
                pd.DataFrame(matched_rows).to_excel(writer, sheet_name="Matched Rows", index=False)
            else:
                pd.DataFrame([{"Message": "No matched rows"}]).to_excel(writer, sheet_name="Matched Rows", index=False)

            # 2. Unmatched File A Tab
            if res["unmatched_a"]:
                pd.DataFrame(res["unmatched_a"]).to_excel(writer, sheet_name=f"Unmatched in {file_a.filename[:15]}", index=False)
            else:
                pd.DataFrame([{"Message": "Zero unmatched rows"}]).to_excel(writer, sheet_name="Unmatched File A", index=False)

            # 3. Unmatched File B Tab
            if res["unmatched_b"]:
                pd.DataFrame(res["unmatched_b"]).to_excel(writer, sheet_name=f"Unmatched in {file_b.filename[:15]}", index=False)
            else:
                pd.DataFrame([{"Message": "Zero unmatched rows"}]).to_excel(writer, sheet_name="Unmatched File B", index=False)

        output.seek(0)
        return Response(
            content=output.getvalue(),
            media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            headers={"Content-Disposition": "attachment; filename=Reconciliation_Report_TaxDesk.xlsx"}
        )

    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Excel generation error: {str(e)}")
