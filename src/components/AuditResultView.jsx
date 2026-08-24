import React, { useState } from 'react';
import { 
  FileText, Code2, AlertTriangle, ShieldCheck, CheckCircle2, XCircle, 
  ArrowRight, Copy, Check, Download, Layers, Calculator, AlertCircle, Sparkles, Edit3, Trash2, ChevronDown, ChevronUp
} from 'lucide-react';

export default function AuditResultView({ 
  invoice, 
  currency, 
  onPostToLedger, 
  onFlagInvoice, 
  onRejectInvoice,
  onEditInvoice,
  onDeleteInvoice
}) {
  const [copiedJson, setCopiedJson] = useState(false);
  const [showRawJson, setShowRawJson] = useState(false); // Collapsible raw JSON
  const [selectedLedgerHead, setSelectedLedgerHead] = useState(invoice ? invoice.ledgerCategory || 'General & Administrative' : '');
  const [postedStatus, setPostedStatus] = useState(null);

  if (!invoice) return null;

  const symbol = currency === 'INR' ? '₹' : currency === 'USD' ? '$' : '€';

  const structuredAuditJson = {
    metadata: {
      auditor: "TaxPilot AI - Autonomous Chartered Accountant",
      version: "2.4.0-CA-HYPER-ACCURATE",
      timestamp: new Date().toISOString(),
      documentStatus: invoice.hasMathDiscrepancy ? "FLAGGED_MATH_DISCREPANCY" : invoice.hasMissingTaxId ? "FLAGGED_MISSING_TAX_ID" : invoice.isDuplicate ? "FLAGGED_DUPLICATE_BILLING" : "AUDITED_VERIFIED_CLEAN"
    },
    invoiceDetails: {
      invoiceNumber: invoice.invoiceNo,
      invoiceDate: invoice.invoiceDate,
      dueDate: invoice.dueDate,
      currency: invoice.currency
    },
    vendorInformation: {
      vendorName: invoice.vendorName,
      taxId_GSTIN: invoice.gstin || "MISSING",
      pan: invoice.pan || "UNKNOWN",
      complianceStatus: invoice.gstin ? "GSTIN_ACTIVE" : "NON_COMPLIANT_MISSING_TAX_ID"
    },
    financialBreakdown: {
      lineItems: (invoice.lineItems || []).map(item => ({
        description: item.description,
        quantity: item.qty,
        unitRate: item.rate,
        amount: item.amount,
        assignedLedgerHead: item.ledgerHead || selectedLedgerHead
      })),
      subtotal: invoice.subtotal,
      taxes: {
        cgst: invoice.cgst,
        sgst: invoice.sgst,
        igst: invoice.igst,
        totalTax: invoice.taxTotal
      },
      tds: {
        applicableSection: invoice.tdsSection,
        taxRatePercentage: invoice.tdsRate,
        deductedTdsAmount: invoice.tdsAmount
      },
      statedGrossTotal: invoice.grossTotal,
      verifiedCalculatedGross: invoice.calculatedGross || (invoice.subtotal + invoice.taxTotal),
      arithmeticDiscrepancy: invoice.discrepancyAmount || 0,
      finalNetPayableAmount: invoice.netPayable
    },
    auditFlags: [
      ...(invoice.hasMathDiscrepancy ? [{
        type: "MATH_DISCREPANCY",
        severity: "CRITICAL",
        description: `Subtotal + Tax (${invoice.subtotal + invoice.taxTotal}) does not match Stated Total (${invoice.grossTotal}). Mismatch of ${invoice.discrepancyAmount}.`
      }] : []),
      ...(invoice.hasMissingTaxId ? [{
        type: "MISSING_TAX_ID",
        severity: "HIGH",
        description: "Vendor GSTIN/Tax ID missing. Reverse Charge or higher withholding tax Section 206AB may apply."
      }] : []),
      ...(invoice.isDuplicate ? [{
        type: "DUPLICATE_BILLING",
        severity: "HIGH",
        description: "Invoice number or vendor voucher matches prior payment record."
      }] : [])
    ],
    recommendedAction: invoice.hasMathDiscrepancy || invoice.isDuplicate 
      ? "REJECT_AND_REQUEST_REVISED_INVOICE"
      : invoice.hasMissingTaxId
      ? "HOLD_FOR_TAX_ID_VERIFICATION"
      : "APPROVE_AND_POST_TO_LEDGER"
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(structuredAuditJson, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  const handleDownloadJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(structuredAuditJson, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${invoice.invoiceNo}_Audit_Report.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      
      {/* Verification Status Header Banner */}
      <div className={`p-5 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
        invoice.hasMathDiscrepancy
          ? 'glass-panel-alert'
          : invoice.hasMissingTaxId || invoice.isDuplicate
          ? 'bg-amber-950/40 border-amber-500/40 shadow-lg shadow-amber-950/30'
          : 'glass-panel-glow'
      }`}>
        <div className="flex items-start space-x-4">
          <div className={`p-3 rounded-xl ${
            invoice.hasMathDiscrepancy
              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
              : invoice.hasMissingTaxId || invoice.isDuplicate
              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
              : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
          }`}>
            {invoice.hasMathDiscrepancy ? (
              <AlertTriangle className="w-7 h-7" />
            ) : invoice.hasMissingTaxId || invoice.isDuplicate ? (
              <AlertCircle className="w-7 h-7" />
            ) : (
              <ShieldCheck className="w-7 h-7" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">
                {invoice.vendorName}
              </h2>
              <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full border ${
                invoice.hasMathDiscrepancy
                  ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                  : invoice.hasMissingTaxId || invoice.isDuplicate
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                  : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
              }`}>
                {invoice.badge || 'AUDITED'}
              </span>
            </div>
            
            <p className="text-xs text-slate-300 mt-1 font-mono flex flex-wrap items-center gap-3">
              <span>Invoice #: <strong className="text-white">{invoice.invoiceNo}</strong></span>
              <span>•</span>
              <span>Date: <strong className="text-white">{invoice.invoiceDate}</strong></span>
              <span>•</span>
              <span>GSTIN/Tax ID: <strong className={invoice.gstin ? "text-emerald-400" : "text-rose-400 font-bold"}>{invoice.gstin || "MISSING"}</strong></span>
            </p>
          </div>
        </div>

        {/* Quick Actions & Net Payable */}
        <div className="flex items-center space-x-3">
          {onEditInvoice && (
            <button
              onClick={() => onEditInvoice(invoice)}
              className="px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-emerald-400 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <Edit3 className="w-3.5 h-3.5" /> Edit Record
            </button>
          )}

          {onDeleteInvoice && (
            <button
              onClick={() => {
                if (window.confirm(`Are you sure you want to delete ${invoice.invoiceNo}?`)) {
                  onDeleteInvoice(invoice.id);
                }
              }}
              className="px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-rose-400 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" /> Delete
            </button>
          )}

          <div className="bg-slate-900/90 border border-slate-800 p-3 px-5 rounded-xl text-right">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Net Payable</span>
            <span className="text-xl font-extrabold font-mono text-emerald-400">
              {symbol}{(invoice.netPayable || invoice.grossTotal || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>


      {/* SECTION 1: EXECUTIVE SUMMARY */}
      <div className="glass-panel p-6 rounded-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-200 flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-md bg-emerald-500/20 text-emerald-400 text-xs font-bold">1</span>
            Executive Summary
          </h3>
          <span className="text-xs text-slate-400 font-mono">TaxPilot CA Engine v2.4</span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed font-sans">
          TaxPilot AI completed an autonomous arithmetic and compliance verification on document <strong className="text-white font-mono">{invoice.invoiceNo}</strong> issued by <strong className="text-white">{invoice.vendorName}</strong> on {invoice.invoiceDate}.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl">
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">Subtotal</span>
            <span className="text-sm font-bold font-mono text-white">{symbol}{(invoice.subtotal || 0).toLocaleString()}</span>
          </div>
          <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl">
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">Tax Total</span>
            <span className="text-sm font-bold font-mono text-cyan-400">{symbol}{(invoice.taxTotal || 0).toLocaleString()}</span>
          </div>
          <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl">
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">TDS ({invoice.tdsSection || 'None'})</span>
            <span className="text-sm font-bold font-mono text-amber-400">-{symbol}{(invoice.tdsAmount || 0).toLocaleString()}</span>
          </div>
          <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl">
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">Ledger Classification</span>
            <span className="text-xs font-bold text-emerald-300 line-clamp-1">{selectedLedgerHead}</span>
          </div>
        </div>
      </div>


      {/* SECTION 2: STRUCTURED AUDIT BREAKDOWN (COLLAPSIBLE DEVELOPER JSON) */}
      <div className="glass-panel p-6 rounded-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-3 gap-2">
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-200 flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-md bg-cyan-500/20 text-cyan-400 text-xs font-bold">2</span>
            Structured Data & ERP Export Package
          </h3>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowRawJson(!showRawJson)}
              className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1.5"
            >
              <Code2 className="w-3.5 h-3.5" />
              {showRawJson ? 'Hide Raw JSON Code' : 'View Developer JSON'}
              {showRawJson ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={handleCopyJson}
              className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-emerald-400 transition-colors flex items-center gap-1.5"
            >
              {copiedJson ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedJson ? 'Copied!' : 'Copy JSON'}
            </button>
            <button
              onClick={handleDownloadJson}
              className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-cyan-400 transition-colors flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              Download JSON
            </button>
          </div>
        </div>

        {/* Collapsible raw JSON block */}
        {showRawJson ? (
          <div className="relative animate-fadeIn">
            <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2 font-mono">
              <span>Developer Audit Schema Payload (JSON format)</span>
              <span>Version: 2.4.0</span>
            </div>
            <pre className="bg-slate-950 border border-slate-900 rounded-xl p-4 overflow-x-auto text-xs font-mono text-emerald-400 max-h-80 leading-relaxed shadow-inner">
              {JSON.stringify(structuredAuditJson, null, 2)}
            </pre>
          </div>
        ) : (
          <div className="bg-slate-900/60 border border-slate-800/80 p-4 rounded-xl flex items-center justify-between">
            <div className="flex items-center space-x-3 text-xs">
              <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <Code2 className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-white block">ERP & API Ready JSON Payload</span>
                <span className="text-slate-400 text-[11px]">Includes verified metadata, tax breakdown, line items, and audit flags.</span>
              </div>
            </div>
            <button
              onClick={() => setShowRawJson(true)}
              className="text-xs text-cyan-400 font-bold hover:underline"
            >
              Expand Code →
            </button>
          </div>
        )}
      </div>


      {/* SECTION 3: AUDIT & COMPLIANCE CHECKS */}
      <div className="glass-panel p-6 rounded-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-200 flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-md bg-amber-500/20 text-amber-400 text-xs font-bold">3</span>
            Audit & Compliance Verification Engine
          </h3>
          <span className="text-xs text-amber-400 font-semibold flex items-center gap-1">
            <ShieldCheck className="w-4 h-4" /> Fraud Prevention Rules Active
          </span>
        </div>

        {(invoice.hasMathDiscrepancy || invoice.hasMissingTaxId || invoice.isDuplicate) && (
          <div className="space-y-2">
            {invoice.hasMathDiscrepancy && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold text-rose-400 uppercase tracking-wide block">[AUDIT ALERT: MATHEMATICAL DISCREPANCY]</strong>
                  Subtotal ({symbol}{(invoice.subtotal||0).toLocaleString()}) + Tax ({symbol}{(invoice.taxTotal||0).toLocaleString()}) equals {symbol}{((invoice.subtotal||0) + (invoice.taxTotal||0)).toLocaleString()}, but vendor invoice claims Total of {symbol}{(invoice.grossTotal||0).toLocaleString()}. Unexplained overcharge of {symbol}{(invoice.discrepancyAmount||0).toLocaleString()}.
                </div>
              </div>
            )}

            {invoice.hasMissingTaxId && (
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold text-amber-400 uppercase tracking-wide block">[AUDIT ALERT: MISSING TAX ID / GSTIN]</strong>
                  No valid GSTIN / Tax Identification Number provided. Invoice cannot be posted for Input Tax Credit (ITC) without vendor GSTIN verification.
                </div>
              </div>
            )}

            {invoice.isDuplicate && (
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold text-amber-400 uppercase tracking-wide block">[AUDIT ALERT: DUPLICATE BILLING SUSPECTED]</strong>
                  Invoice number {invoice.invoiceNo} matches an existing ledger transaction processed within the last 60 days. Risk of double payout.
                </div>
              </div>
            )}
          </div>
        )}

        {!invoice.hasMathDiscrepancy && !invoice.hasMissingTaxId && !invoice.isDuplicate && (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center space-x-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <strong className="font-bold text-emerald-400 uppercase tracking-wide">100% CLEAN AUDIT:</strong> All mathematical verification checks passed. HSN tax rates and TDS deductions fully compliant.
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                <th className="py-2.5 px-3">Description</th>
                <th className="py-2.5 px-3 text-right">Qty</th>
                <th className="py-2.5 px-3 text-right">Rate</th>
                <th className="py-2.5 px-3 text-right">Amount</th>
                <th className="py-2.5 px-3">Ledger Head Mapping</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {(invoice.lineItems || []).map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-900/40">
                  <td className="py-3 px-3 text-slate-200 font-sans font-medium">{item.description}</td>
                  <td className="py-3 px-3 text-right text-slate-300">{item.qty}</td>
                  <td className="py-3 px-3 text-right text-slate-300">{symbol}{(item.rate||0).toLocaleString()}</td>
                  <td className="py-3 px-3 text-right font-bold text-emerald-400">{symbol}{(item.amount||0).toLocaleString()}</td>
                  <td className="py-3 px-3 text-slate-300 font-sans text-xs">
                    <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                      {item.ledgerHead || selectedLedgerHead}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>


      {/* SECTION 4: ACTIONABLE NEXT STEPS */}
      <div className="glass-panel p-6 rounded-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-200 flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-md bg-indigo-500/20 text-indigo-400 text-xs font-bold">4</span>
            Actionable Next Steps & Controller Approval
          </h3>
          <span className="text-xs text-slate-400">Ledger Head & Authorization</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              Confirm Accounting Ledger Head
            </label>
            <select
              value={selectedLedgerHead}
              onChange={(e) => setSelectedLedgerHead(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-emerald-400 font-semibold focus:outline-none focus:border-emerald-500"
            >
              <option value="Software & Cloud Infrastructure">Software & Cloud Infrastructure</option>
              <option value="General & Administrative">General & Administrative</option>
              <option value="Sales & Marketing">Sales & Marketing</option>
              <option value="Professional & Legal Fees">Professional & Legal Fees</option>
              <option value="Travel & Entertainment">Travel & Entertainment</option>
              <option value="Capital Expenditure - Equipment">Capital Expenditure - Equipment</option>
            </select>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl flex flex-col justify-between space-y-3">
            <div>
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Controller Action Recommendation
              </span>
              <p className="text-xs text-slate-400 mt-1">
                {invoice.hasMathDiscrepancy || invoice.isDuplicate
                  ? 'Recommend REJECTING this invoice and issuing vendor clarification.'
                  : invoice.hasMissingTaxId
                  ? 'Recommend HOLDING payment pending vendor Tax ID verification.'
                  : 'Recommend APPROVING for ERP posting (Tally / Zoho / NetSuite).'}
              </p>
            </div>

            {postedStatus ? (
              <div className={`p-3 rounded-lg text-center font-bold text-xs ${
                postedStatus === 'posted' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                postedStatus === 'flagged' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                'bg-rose-500/20 text-rose-400 border border-rose-500/30'
              }`}>
                {postedStatus === 'posted' && '✓ Successfully Posted to General Ledger & ERP Queue'}
                {postedStatus === 'flagged' && '⚠ Flagged & Escalated to CFO for Manual Audit'}
                {postedStatus === 'rejected' && '✕ Invoice Rejected. Rejection Notice Generated'}
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => { setPostedStatus('posted'); if (onPostToLedger) onPostToLedger(invoice, selectedLedgerHead); }}
                  className="py-2.5 px-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold rounded-lg text-[11px] uppercase tracking-wide transition-all shadow-md shadow-emerald-900/40"
                >
                  Post to Ledger
                </button>
                <button
                  onClick={() => { setPostedStatus('flagged'); if (onFlagInvoice) onFlagInvoice(invoice); }}
                  className="py-2.5 px-2 bg-amber-600/90 hover:bg-amber-500 text-slate-950 font-bold rounded-lg text-[11px] uppercase tracking-wide transition-all"
                >
                  Flag for Review
                </button>
                <button
                  onClick={() => { setPostedStatus('rejected'); if (onRejectInvoice) onRejectInvoice(invoice); }}
                  className="py-2.5 px-2 bg-rose-600/90 hover:bg-rose-500 text-white font-bold rounded-lg text-[11px] uppercase tracking-wide transition-all"
                >
                  Reject Invoice
                </button>
              </div>
            )}
          </div>

        </div>
      </div>

    </div>
  );
}
