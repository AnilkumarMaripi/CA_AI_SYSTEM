import { SAMPLE_INVOICES } from '../data/samples';

const STORAGE_KEYS = {
  INVOICES: 'taxpilot_invoices_v1',
  LEDGER_HEADS: 'taxpilot_ledger_heads_v1',
  AUDIT_RULES: 'taxpilot_audit_rules_v1',
  CUSTOM_PANDL: 'taxpilot_pandl_settings_v1'
};

export const DEFAULT_LEDGER_HEADS = [
  { id: 1, name: "Software & Cloud Infrastructure", code: "EXP-6001", defaultTds: "194J (10%)", hsnCode: "998313" },
  { id: 2, name: "General & Administrative", code: "EXP-6002", defaultTds: "None (0%)", hsnCode: "998599" },
  { id: 3, name: "Sales & Marketing Expenses", code: "EXP-6003", defaultTds: "194C (2%)", hsnCode: "998361" },
  { id: 4, name: "Professional & Legal Fees", code: "EXP-6004", defaultTds: "194J (10%)", hsnCode: "998211" },
  { id: 5, name: "Capital Expenditure - Equipment", code: "CAPEX-1001", defaultTds: "194C (2%)", hsnCode: "847130" },
  { id: 6, name: "Travel & Entertainment", code: "EXP-6005", defaultTds: "None (0%)", hsnCode: "996411" }
];

export const DEFAULT_AUDIT_RULES = {
  mathTolerance: "0.00",
  duplicateLookbackDays: "90",
  requireGstinForItc: true,
  autoFlagMissingPan: true
};

// --- INVOICES CRUD STORAGE ---

export function getStoredInvoices() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.INVOICES);
    if (raw !== null) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.error("Error reading stored invoices:", e);
  }
  // Return empty array by default if no user input/file added yet!
  return [];
}

export function saveInvoices(invoices) {
  try {
    localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(invoices));
  } catch (e) {
    console.error("Error saving invoices:", e);
  }
}

// --- LEDGER HEADS CRUD STORAGE ---

export function getStoredLedgerHeads() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LEDGER_HEADS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error("Error reading stored ledger heads:", e);
  }
  saveLedgerHeads(DEFAULT_LEDGER_HEADS);
  return DEFAULT_LEDGER_HEADS;
}

export function saveLedgerHeads(heads) {
  try {
    localStorage.setItem(STORAGE_KEYS.LEDGER_HEADS, JSON.stringify(heads));
  } catch (e) {
    console.error("Error saving ledger heads:", e);
  }
}

// --- AUDIT RULES STORAGE ---

export function getStoredAuditRules() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.AUDIT_RULES);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error("Error reading audit rules:", e);
  }
  saveAuditRules(DEFAULT_AUDIT_RULES);
  return DEFAULT_AUDIT_RULES;
}

export function saveAuditRules(rules) {
  try {
    localStorage.setItem(STORAGE_KEYS.AUDIT_RULES, JSON.stringify(rules));
  } catch (e) {
    console.error("Error saving audit rules:", e);
  }
}

// --- RESET & DEMO DATA ---

export function clearAllInvoices() {
  saveInvoices([]);
  return [];
}

export function resetAllDataToDemo() {
  saveInvoices(SAMPLE_INVOICES);
  saveLedgerHeads(DEFAULT_LEDGER_HEADS);
  saveAuditRules(DEFAULT_AUDIT_RULES);
  localStorage.removeItem(STORAGE_KEYS.CUSTOM_PANDL);
  return {
    invoices: SAMPLE_INVOICES,
    heads: DEFAULT_LEDGER_HEADS,
    rules: DEFAULT_AUDIT_RULES
  };
}

// --- AUTONOMOUS CA AUDIT RUNNER ENGINE ---

export function auditSingleInvoice(invoiceData, existingInvoices = [], auditRules = DEFAULT_AUDIT_RULES) {
  const tolerance = parseFloat(auditRules.mathTolerance || 0);

  // Line item subtotal verification
  let computedSubtotal = 0;
  if (Array.isArray(invoiceData.lineItems) && invoiceData.lineItems.length > 0) {
    computedSubtotal = invoiceData.lineItems.reduce((acc, item) => acc + (parseFloat(item.amount) || 0), 0);
  } else {
    computedSubtotal = parseFloat(invoiceData.subtotal) || 0;
  }

  const cgst = parseFloat(invoiceData.cgst) || 0;
  const sgst = parseFloat(invoiceData.sgst) || 0;
  const igst = parseFloat(invoiceData.igst) || 0;
  const computedTaxTotal = cgst + sgst + igst;

  const calculatedGross = computedSubtotal + computedTaxTotal;
  const statedGross = parseFloat(invoiceData.grossTotal) || calculatedGross;

  const discrepancy = Math.abs(calculatedGross - statedGross);
  const hasMathDiscrepancy = discrepancy > tolerance;

  // Tax ID check
  const gstin = (invoiceData.gstin || "").trim();
  const hasMissingTaxId = auditRules.requireGstinForItc ? (!gstin || gstin.length < 10 || gstin === "NOT PROVIDED") : false;

  // Duplicate check across existing records
  const isDuplicate = existingInvoices.some(inv => 
    inv.id !== invoiceData.id && 
    (inv.invoiceNo === invoiceData.invoiceNo && inv.vendorName?.toLowerCase() === invoiceData.vendorName?.toLowerCase())
  );

  // TDS Calculations
  const tdsRate = parseFloat(invoiceData.tdsRate) || (invoiceData.tdsSection === "194J" ? 10 : invoiceData.tdsSection === "194C" ? 2 : 0);
  const tdsAmount = (computedSubtotal * tdsRate) / 100;
  const netPayable = statedGross - tdsAmount;

  // Badges & Status
  let badge = "COMPLIANT";
  let badgeColor = "emerald";
  if (hasMathDiscrepancy) {
    badge = "MATH DISCREPANCY";
    badgeColor = "rose";
  } else if (isDuplicate) {
    badge = "DUPLICATE BILL";
    badgeColor = "amber";
  } else if (hasMissingTaxId) {
    badge = "MISSING TAX ID";
    badgeColor = "amber";
  }

  // Generate human-readable audit note
  let auditNotes = "";
  if (hasMathDiscrepancy) {
    auditNotes = `[AUDIT ALERT] Stated Subtotal (${computedSubtotal}) + Tax (${computedTaxTotal}) = ${calculatedGross}, but invoice claims ${statedGross}. Variance: ${discrepancy.toFixed(2)}.`;
  } else if (isDuplicate) {
    auditNotes = `[AUDIT ALERT] Duplicate invoice detected. Invoice #${invoiceData.invoiceNo} from ${invoiceData.vendorName} already processed.`;
  } else if (hasMissingTaxId) {
    auditNotes = `[AUDIT ALERT] Vendor GSTIN / Tax ID missing or invalid. Input Tax Credit (ITC) blocked per Sec 206AB rules.`;
  } else {
    auditNotes = `All CA verification checks passed. Math tolerance 0.00 met. TDS section ${invoiceData.tdsSection || 'N/A'} deducted at ${tdsRate}%.`;
  }

  return {
    ...invoiceData,
    subtotal: computedSubtotal,
    cgst,
    sgst,
    igst,
    taxTotal: computedTaxTotal,
    grossTotal: statedGross,
    calculatedGross,
    discrepancyAmount: discrepancy,
    hasMathDiscrepancy,
    hasMissingTaxId,
    isDuplicate,
    badge,
    badgeColor,
    tdsRate,
    tdsAmount,
    netPayable,
    auditNotes
  };
}

// --- EXPORT HELPERS ---

export function exportInvoicesToJSON(invoices) {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(invoices, null, 2));
  const anchor = document.createElement('a');
  anchor.setAttribute("href", dataStr);
  anchor.setAttribute("download", `TaxPilot_Invoices_Export_${new Date().toISOString().split('T')[0]}.json`);
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
}

export function exportInvoicesToCSV(invoices) {
  const headers = ["Invoice ID", "Invoice No", "Vendor Name", "GSTIN", "Date", "Currency", "Subtotal", "Tax Total", "Gross Total", "TDS Section", "TDS Rate %", "TDS Amount", "Net Payable", "Audit Badge", "Math Discrepancy", "Ledger Head"];
  
  const rows = invoices.map(inv => [
    `"${inv.id || ''}"`,
    `"${inv.invoiceNo || ''}"`,
    `"${(inv.vendorName || '').replace(/"/g, '""')}"`,
    `"${inv.gstin || ''}"`,
    `"${inv.invoiceDate || ''}"`,
    `"${inv.currency || 'INR'}"`,
    inv.subtotal || 0,
    inv.taxTotal || 0,
    inv.grossTotal || 0,
    `"${inv.tdsSection || 'None'}"`,
    inv.tdsRate || 0,
    inv.tdsAmount || 0,
    inv.netPayable || 0,
    `"${inv.badge || ''}"`,
    inv.hasMathDiscrepancy ? "YES" : "NO",
    `"${inv.ledgerCategory || 'General & Administrative'}"`
  ]);

  const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const anchor = document.createElement('a');
  anchor.setAttribute("href", encodeURI(csvContent));
  anchor.setAttribute("download", `TaxPilot_Invoices_Export_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
}
