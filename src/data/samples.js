export const SAMPLE_INVOICES = [
  {
    id: "INV-2026-001",
    name: "Enterprise Tech & Cloud Maintenance (Compliant)",
    badge: "COMPLIANT",
    badgeColor: "emerald",
    vendorName: "TechSolutions Private Limited",
    gstin: "27AAACT1234F1Z5",
    pan: "AAACT1234F",
    invoiceNo: "TS-2026-9811",
    invoiceDate: "2026-08-15",
    dueDate: "2026-09-14",
    currency: "INR",
    rawText: `INVOICE: TS-2026-9811
Date: 15-Aug-2026 | Due: 14-Sep-2026
Vendor: TechSolutions Private Limited
GSTIN: 27AAACT1234F1Z5 | PAN: AAACT1234F
Billed To: Personal Project Inc. (GSTIN: 27AAACP9999K1Z2)

LINE ITEMS:
1. Enterprise Cloud Server Infrastructure & Maintenance (Q3 2026) - ₹4,000,000.00
2. Dedicated AI Pipeline Engineering Support (120 hrs) - ₹800,000.00

SUBTOTAL: ₹4,800,000.00
CGST @ 9%: ₹432,000.00
SGST @ 9%: ₹432,000.00
TOTAL TAX (18%): ₹864,000.00
GROSS TOTAL: ₹5,664,000.00

TDS APPLICABLE: Section 194J (Professional & Technical Services) @ 10% on Subtotal: ₹480,000.00
NET PAYABLE AMOUNT: ₹5,184,000.00`,
    lineItems: [
      { description: "Enterprise Cloud Server Infrastructure & Maintenance (Q3 2026)", qty: 1, rate: 4000000, amount: 4000000, ledgerHead: "Software & Cloud Infrastructure" },
      { description: "Dedicated AI Pipeline Engineering Support (120 hrs)", qty: 120, rate: 6666.67, amount: 800000, ledgerHead: "Professional Services & Engineering" }
    ],
    subtotal: 4800000,
    cgst: 432000,
    sgst: 432000,
    igst: 0,
    taxTotal: 864000,
    grossTotal: 5664000,
    tdsSection: "194J",
    tdsRate: 10,
    tdsAmount: 480000,
    netPayable: 5184000,
    ledgerCategory: "Software & Cloud Infrastructure",
    isDuplicate: false,
    hasMathDiscrepancy: false,
    hasMissingTaxId: false,
    auditNotes: "All mathematical verification checks passed. Tax rates (CGST 9% + SGST 9%) match HSN 998313. TDS under Sec 194J correctly calculated at 10% on subtotal."
  },
  {
    id: "INV-2026-002",
    name: "Office Furniture & Supplies ([AUDIT ALERT] Math Mismatch)",
    badge: "MATH DISCREPANCY",
    badgeColor: "rose",
    vendorName: "QuickPrint & Office Furnishings",
    gstin: "",
    pan: "UNKNOWN",
    invoiceNo: "QP-8821-2026",
    invoiceDate: "2026-08-20",
    dueDate: "2026-08-25",
    currency: "USD",
    rawText: `INVOICE NO: QP-8821-2026
Date: 20-Aug-2026
Vendor: QuickPrint & Office Furnishings
GSTIN/Tax ID: NOT PROVIDED (MISSING)

ITEMS:
1. Executive Ergonomic Mesh Chairs x 10 - $2,500.00
2. Premium Paper Reams x 50 - $250.00

Stated Subtotal: $2,750.00
Stated Sales Tax (18%): $500.00
STATED GRAND TOTAL: $3,500.00

PAYMENT DUE UPON RECEIPT`,
    lineItems: [
      { description: "Executive Ergonomic Mesh Chairs", qty: 10, rate: 250, amount: 2500, ledgerHead: "Capital Expenditure - Office Equipment" },
      { description: "Premium Paper Reams", qty: 50, rate: 5, amount: 250, ledgerHead: "General & Administrative" }
    ],
    subtotal: 2750,
    cgst: 0,
    sgst: 0,
    igst: 500, // Stated tax
    taxTotal: 500,
    grossTotal: 3500, // Discrepancy! 2750 + 500 = 3250 != 3500 ($250 overstated by vendor!)
    calculatedGross: 3250,
    discrepancyAmount: 250,
    tdsSection: "None",
    tdsRate: 0,
    tdsAmount: 0,
    netPayable: 3500,
    ledgerCategory: "Capital Expenditure & Administrative",
    isDuplicate: false,
    hasMathDiscrepancy: true,
    hasMissingTaxId: true,
    auditNotes: "[AUDIT ALERT] CRITICAL DISCREPANCY: Subtotal ($2,750.00) + Stated Tax ($500.00) equals $3,250.00, but invoice claims Total of $3,500.00 (Unexplained +$250.00 overcharge!). Vendor Tax ID is also missing."
  },
  {
    id: "INV-2026-003",
    name: "Global Marketing Campaign ([AUDIT ALERT] Duplicate Bill)",
    badge: "DUPLICATE BILL",
    badgeColor: "amber",
    vendorName: "Global Reach Marketing Partners LLC",
    gstin: "9926USA10022391",
    pan: "APGPM9921K",
    invoiceNo: "GMP-2026-8899",
    invoiceDate: "2026-08-22",
    dueDate: "2026-09-22",
    currency: "USD",
    rawText: `INVOICE #: GMP-2026-8899
Vendor: Global Reach Marketing Partners LLC
Tax ID / EIN: 9926USA10022391
Invoice Date: 22-Aug-2026

DESCRIPTION:
Global Performance Ad Campaign Management & Influencer Outreach - Q3 Retainer

Subtotal: $15,000.00
Tax (GST/VAT @ 10%): $1,500.00
Total Amount Payable: $16,500.00

NOTE: Please remit wire to Chase Manhattan Bank.`,
    lineItems: [
      { description: "Global Performance Ad Campaign Management & Influencer Outreach", qty: 1, rate: 15000, amount: 15000, ledgerHead: "Sales & Marketing Expenses" }
    ],
    subtotal: 15000,
    cgst: 0,
    sgst: 0,
    igst: 1500,
    taxTotal: 1500,
    grossTotal: 16500,
    tdsSection: "194C",
    tdsRate: 2,
    tdsAmount: 300,
    netPayable: 16200,
    ledgerCategory: "Sales & Marketing",
    isDuplicate: true,
    hasMathDiscrepancy: false,
    hasMissingTaxId: false,
    auditNotes: "[AUDIT ALERT] DUPLICATE BILLING SUSPECTED: Invoice number GMP-2026-8899 matches voucher #VOUCH-8891 paid on 2026-07-28 for identical line item ($16,500.00). Hold payment for controller verification."
  },
  {
    id: "INV-2026-004",
    name: "AWS Cloud Services (RCM Cross-Border IGST)",
    badge: "COMPLIANT (RCM)",
    badgeColor: "cyan",
    vendorName: "Amazon Web Services Inc. (USA)",
    gstin: "9917USA29003OSG",
    pan: "FOREIGN_ENT",
    invoiceNo: "AWS-US-9912048",
    invoiceDate: "2026-08-01",
    dueDate: "2026-08-31",
    currency: "USD",
    rawText: `AMAZON WEB SERVICES INC. INVOICE
Invoice ID: AWS-US-9912048
Account ID: 9012-3341-1109
Billing Period: July 2026

SERVICES:
1. Amazon EC2 & GPU Compute Clusters - $3,200.00
2. Amazon S3 Storage & Data Egress - $1,050.00

SUBTOTAL: $4,250.00
US State Tax: $0.00
TOTAL AMOUNT: $4,250.00

REVERSE CHARGE MECHANISM (RCM):
Applicable under IGST @ 18% for Import of Services: $765.00
Recipient liable to deposit RCM IGST & claim Input Tax Credit (ITC).`,
    lineItems: [
      { description: "Amazon EC2 & GPU Compute Clusters", qty: 1, rate: 3200, amount: 3200, ledgerHead: "Software & Cloud Infrastructure" },
      { description: "Amazon S3 Storage & Data Egress", qty: 1, rate: 1050, amount: 1050, ledgerHead: "Software & Cloud Infrastructure" }
    ],
    subtotal: 4250,
    cgst: 0,
    sgst: 0,
    igst: 765, // RCM IGST
    taxTotal: 765,
    grossTotal: 4250,
    tdsSection: "194J",
    tdsRate: 2, // 2% for foreign software/cloud hosting where applicable
    tdsAmount: 85,
    netPayable: 4165,
    ledgerCategory: "Software & Cloud Infrastructure",
    isDuplicate: false,
    hasMathDiscrepancy: false,
    hasMissingTaxId: false,
    auditNotes: "Cross-border Cloud Hosting invoice. Tax is payable under Reverse Charge Mechanism (RCM) IGST 18% ($765.00). 100% eligible for Input Tax Credit (ITC) upon payment."
  }
];

export const INITIAL_PANDL = {
  revenue: 12500000,
  cogs: 3200000,
  operatingExpenses: [
    { head: "Software & Cloud Infrastructure", amount: 2850000, percentage: 30.6 },
    { head: "General & Administrative", amount: 1450000, percentage: 15.6 },
    { head: "Sales & Marketing", amount: 2100000, percentage: 22.5 },
    { head: "Professional & Legal Fees", amount: 1800000, percentage: 19.3 },
    { head: "Travel & Entertainment", amount: 1120000, percentage: 12.0 }
  ],
  taxCreditAccumulated: 1628000, // ITC
  tdsPayableQueue: 865000
};
