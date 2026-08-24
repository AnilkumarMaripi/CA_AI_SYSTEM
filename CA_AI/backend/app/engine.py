import datetime
import calendar
import pandas as pd
import numpy as np
from typing import List, Dict, Any

# --- COMPLIANCE RECURRING ENGINE ---

def calculate_urgency(due_date: datetime.datetime, status: str) -> str:
    if status == "Filed":
        return "FILED"
    now = datetime.datetime.utcnow()
    diff_days = (due_date - now).days
    if diff_days < 0:
        return "OVERDUE"
    elif diff_days <= 3:
        return "DUE_SOON"
    else:
        return "UPCOMING"

def generate_client_compliance_tasks(client) -> List[Dict[str, Any]]:
    tasks = []
    now = datetime.datetime.utcnow()
    curr_year = now.year
    curr_month = now.month

    # 1. GST DEADLINES
    if client.gstin:
        # GSTR-1: Monthly 11th
        due_gstr1 = datetime.datetime(curr_year, curr_month, 11, 23, 59, 59)
        if due_gstr1 < now:
            # Generate next month
            next_m = curr_month + 1 if curr_month < 12 else 1
            next_y = curr_year if curr_month < 12 else curr_year + 1
            due_gstr1 = datetime.datetime(next_y, next_m, 11, 23, 59, 59)

        tasks.append({
            "title": f"GSTR-1 Monthly Return - {client.name}",
            "category": "GST",
            "due_date": due_gstr1,
            "recurring_rule": "GSTR-1 (11th Monthly)",
            "period_month": due_gstr1.month,
            "period_year": due_gstr1.year,
            "status": "Pending"
        })

        # GSTR-3B: Monthly 20th
        due_gstr3b = datetime.datetime(curr_year, curr_month, 20, 23, 59, 59)
        if due_gstr3b < now:
            next_m = curr_month + 1 if curr_month < 12 else 1
            next_y = curr_year if curr_month < 12 else curr_year + 1
            due_gstr3b = datetime.datetime(next_y, next_m, 20, 23, 59, 59)

        tasks.append({
            "title": f"GSTR-3B Tax Return & Payment - {client.name}",
            "category": "GST",
            "due_date": due_gstr3b,
            "recurring_rule": "GSTR-3B (20th Monthly)",
            "period_month": due_gstr3b.month,
            "period_year": due_gstr3b.year,
            "status": "Pending"
        })

    # 2. TDS DEADLINES
    # TDS Monthly Payment: 7th of following month
    due_tds_pay = datetime.datetime(curr_year, curr_month, 7, 23, 59, 59)
    if due_tds_pay < now:
        next_m = curr_month + 1 if curr_month < 12 else 1
        next_y = curr_year if curr_month < 12 else curr_year + 1
        due_tds_pay = datetime.datetime(next_y, next_m, 7, 23, 59, 59)

    tasks.append({
        "title": f"TDS Monthly Challan Deposit (28Q/26Q) - {client.name}",
        "category": "TDS",
        "due_date": due_tds_pay,
        "recurring_rule": "TDS Deposit (7th Monthly)",
        "period_month": due_tds_pay.month,
        "period_year": due_tds_pay.year,
        "status": "Pending"
    })

    # TDS Quarterly Return: Q1 July 31, Q2 Oct 31, Q3 Jan 31, Q4 May 31
    q_tds_due = datetime.datetime(curr_year, 7, 31, 23, 59, 59) if curr_month <= 7 else datetime.datetime(curr_year, 10, 31, 23, 59, 59)
    tasks.append({
        "title": f"Quarterly TDS Return Filing (Form 26Q) - {client.name}",
        "category": "TDS",
        "due_date": q_tds_due,
        "recurring_rule": "Quarterly TDS Return",
        "period_month": q_tds_due.month,
        "period_year": q_tds_due.year,
        "status": "Pending"
    })

    # 3. INCOME TAX RETURN (ITR) DEADLINES
    itr_month = 10 if (client.is_audit_required or client.entity_type in ["Company", "LLP"]) else 7
    due_itr = datetime.datetime(curr_year, itr_month, 31, 23, 59, 59)
    if due_itr < now:
        due_itr = datetime.datetime(curr_year + 1, itr_month, 31, 23, 59, 59)

    tasks.append({
        "title": f"Income Tax Return (ITR AY {curr_year}-{curr_year+1}) - {client.name}",
        "category": "ITR",
        "due_date": due_itr,
        "recurring_rule": f"ITR ({'Audit' if itr_month == 10 else 'Non-Audit'})",
        "period_month": due_itr.month,
        "period_year": due_itr.year,
        "status": "Pending"
    })

    # 4. ROC ANNUAL FILINGS (Company / LLP)
    if client.entity_type == "Company":
        due_aoc4 = datetime.datetime(curr_year, 11, 30, 23, 59, 59)
        due_mgt7 = datetime.datetime(curr_year, 12, 31, 23, 59, 59)
        tasks.append({
            "title": f"ROC Form AOC-4 Financial Statements - {client.name}",
            "category": "ROC",
            "due_date": due_aoc4,
            "recurring_rule": "AOC-4 (30 days post AGM)",
            "period_month": 11,
            "period_year": curr_year,
            "status": "Pending"
        })
        tasks.append({
            "title": f"ROC Form MGT-7 Annual Return - {client.name}",
            "category": "ROC",
            "due_date": due_mgt7,
            "recurring_rule": "MGT-7 (60 days post AGM)",
            "period_month": 12,
            "period_year": curr_year,
            "status": "Pending"
        })
    elif client.entity_type == "LLP":
        due_llp11 = datetime.datetime(curr_year, 5, 30, 23, 59, 59)
        due_llp8 = datetime.datetime(curr_year, 10, 30, 23, 59, 59)
        tasks.append({
            "title": f"LLP Form 11 Annual Return - {client.name}",
            "category": "ROC",
            "due_date": due_llp11,
            "recurring_rule": "Form 11 (May 30)",
            "period_month": 5,
            "period_year": curr_year,
            "status": "Pending"
        })

    return tasks

# --- CSV RECONCILIATION MATCHING ENGINE ---

def run_csv_reconciliation(df_a: pd.DataFrame, df_b: pd.DataFrame, tolerance_amount: float = 1.0, tolerance_days: int = 3) -> Dict[str, Any]:
    # Helper to find column names flexibly
    def find_col(df, keywords):
        for col in df.columns:
            if any(kw.lower() in str(col).lower() for kw in keywords):
                return col
        return None

    col_amt_a = find_col(df_a, ["amount", "value", "total", "subtotal", "debit", "credit"])
    col_amt_b = find_col(df_b, ["amount", "value", "total", "subtotal", "debit", "credit"])

    col_date_a = find_col(df_a, ["date", "time", "period"])
    col_date_b = find_col(df_b, ["date", "time", "period"])

    col_ref_a = find_col(df_a, ["invoice", "ref", "number", "no", "voucher", "id", "description", "particulars"])
    col_ref_b = find_col(df_b, ["invoice", "ref", "number", "no", "voucher", "id", "description", "particulars"])

    matched_pairs = []
    matched_idx_a = set()
    matched_idx_b = set()

    rows_a = df_a.to_dict(orient="records")
    rows_b = df_b.to_dict(orient="records")

    for idx_a, row_a in enumerate(rows_a):
        amt_a = abs(float(row_a.get(col_amt_a, 0))) if col_amt_a and pd.notnull(row_a.get(col_amt_a)) else 0.0
        ref_a = str(row_a.get(col_ref_a, "")).strip().lower() if col_ref_a else ""

        for idx_b, row_b in enumerate(rows_b):
            if idx_b in matched_idx_b:
                continue

            amt_b = abs(float(row_b.get(col_amt_b, 0))) if col_amt_b and pd.notnull(row_b.get(col_amt_b)) else 0.0
            ref_b = str(row_b.get(col_ref_b, "")).strip().lower() if col_ref_b else ""

            # Check amount match within tolerance
            amt_diff = abs(amt_a - amt_b)
            if amt_diff <= tolerance_amount:
                # Ref check or partial match
                ref_match = (ref_a and ref_b and (ref_a in ref_b or ref_b in ref_a)) or (amt_diff < 0.01)

                if ref_match or (amt_a > 0 and amt_diff == 0):
                    matched_idx_a.add(idx_a)
                    matched_idx_b.add(idx_b)
                    matched_pairs.append({
                        "file_a_row": row_a,
                        "file_b_row": row_b,
                        "amount_a": amt_a,
                        "amount_b": amt_b,
                        "amount_diff": round(amt_diff, 2),
                        "status": "EXACT_MATCH" if amt_diff == 0 else "TOLERANCE_MATCH"
                    })
                    break

    unmatched_a = [row for idx, row in enumerate(rows_a) if idx not in matched_idx_a]
    unmatched_b = [row for idx, row in enumerate(rows_b) if idx not in matched_idx_b]

    return {
        "matched_count": len(matched_pairs),
        "unmatched_a_count": len(unmatched_a),
        "unmatched_b_count": len(unmatched_b),
        "matched": matched_pairs,
        "unmatched_a": unmatched_a,
        "unmatched_b": unmatched_b
    }
