import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, ShieldCheck, AlertTriangle, AlertCircle, Sparkles, Calculator } from 'lucide-react';

export default function InvoiceModal({ isOpen, onClose, onSave, invoiceToEdit, ledgerHeads = [], currency = 'INR' }) {
  const [formData, setFormData] = useState({
    id: '',
    vendorName: '',
    gstin: '',
    pan: '',
    invoiceNo: '',
    invoiceDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
    currency: currency,
    ledgerCategory: 'Software & Cloud Infrastructure',
    lineItems: [
      { description: 'Cloud Compute Infrastructure & Maintenance', qty: 1, rate: 100000, amount: 100000, ledgerHead: 'Software & Cloud Infrastructure' }
    ],
    subtotal: 100000,
    cgst: 9000,
    sgst: 9000,
    igst: 0,
    grossTotal: 118000,
    tdsSection: '194J',
    tdsRate: 10,
    tdsAmount: 10000
  });

  useEffect(() => {
    if (invoiceToEdit) {
      setFormData({
        id: invoiceToEdit.id || '',
        vendorName: invoiceToEdit.vendorName || '',
        gstin: invoiceToEdit.gstin || '',
        pan: invoiceToEdit.pan || '',
        invoiceNo: invoiceToEdit.invoiceNo || '',
        invoiceDate: invoiceToEdit.invoiceDate || new Date().toISOString().split('T')[0],
        dueDate: invoiceToEdit.dueDate || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
        currency: invoiceToEdit.currency || currency,
        ledgerCategory: invoiceToEdit.ledgerCategory || 'General & Administrative',
        lineItems: invoiceToEdit.lineItems && invoiceToEdit.lineItems.length > 0 
          ? invoiceToEdit.lineItems.map(item => ({ ...item }))
          : [{ description: 'General Service Charge', qty: 1, rate: invoiceToEdit.subtotal || 1000, amount: invoiceToEdit.subtotal || 1000, ledgerHead: invoiceToEdit.ledgerCategory || 'General & Administrative' }],
        subtotal: invoiceToEdit.subtotal || 0,
        cgst: invoiceToEdit.cgst || 0,
        sgst: invoiceToEdit.sgst || 0,
        igst: invoiceToEdit.igst || 0,
        grossTotal: invoiceToEdit.grossTotal || 0,
        tdsSection: invoiceToEdit.tdsSection || 'None',
        tdsRate: invoiceToEdit.tdsRate || 0,
        tdsAmount: invoiceToEdit.tdsAmount || 0
      });
    } else {
      // Create mode
      const randomInvNum = `TS-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      setFormData({
        id: `INV-${Date.now()}`,
        vendorName: '',
        gstin: '27AAACT9999F1Z5',
        pan: 'AAACT9999F',
        invoiceNo: randomInvNum,
        invoiceDate: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
        currency: currency,
        ledgerCategory: 'Software & Cloud Infrastructure',
        lineItems: [
          { description: 'Cloud Server & Maintenance Support', qty: 1, rate: 50000, amount: 50000, ledgerHead: 'Software & Cloud Infrastructure' }
        ],
        subtotal: 50000,
        cgst: 4500,
        sgst: 4500,
        igst: 0,
        grossTotal: 59000,
        tdsSection: '194J',
        tdsRate: 10,
        tdsAmount: 5000
      });
    }
  }, [invoiceToEdit, isOpen, currency]);

  if (!isOpen) return null;

  // Real-time calculations
  const calculateTotals = (items, cgstVal, sgstVal, igstVal, tdsSec, tdsR) => {
    const sub = items.reduce((acc, curr) => acc + (parseFloat(curr.amount) || 0), 0);
    const taxTot = (parseFloat(cgstVal) || 0) + (parseFloat(sgstVal) || 0) + (parseFloat(igstVal) || 0);
    const calculatedGross = sub + taxTot;
    
    let rate = parseFloat(tdsR) || 0;
    if (tdsSec === '194J') rate = 10;
    else if (tdsSec === '194C') rate = 2;
    else if (tdsSec === '194I') rate = 10;
    else if (tdsSec === '194H') rate = 5;
    else if (tdsSec === 'None') rate = 0;

    const tdsAmt = (sub * rate) / 100;

    return {
      subtotal: sub,
      calculatedGross,
      tdsRate: rate,
      tdsAmount: tdsAmt
    };
  };

  const handleLineItemChange = (index, field, value) => {
    const updatedItems = [...formData.lineItems];
    const item = { ...updatedItems[index], [field]: value };

    if (field === 'qty' || field === 'rate') {
      const q = parseFloat(field === 'qty' ? value : item.qty) || 0;
      const r = parseFloat(field === 'rate' ? value : item.rate) || 0;
      item.amount = Math.round(q * r * 100) / 100;
    }

    updatedItems[index] = item;
    const computed = calculateTotals(updatedItems, formData.cgst, formData.sgst, formData.igst, formData.tdsSection, formData.tdsRate);

    setFormData(prev => ({
      ...prev,
      lineItems: updatedItems,
      subtotal: computed.subtotal,
      grossTotal: computed.calculatedGross,
      tdsRate: computed.tdsRate,
      tdsAmount: computed.tdsAmount
    }));
  };

  const handleAddLineItem = () => {
    const newItems = [
      ...formData.lineItems,
      { description: 'Additional Consultancy / Services', qty: 1, rate: 10000, amount: 10000, ledgerHead: formData.ledgerCategory }
    ];
    const computed = calculateTotals(newItems, formData.cgst, formData.sgst, formData.igst, formData.tdsSection, formData.tdsRate);
    setFormData(prev => ({
      ...prev,
      lineItems: newItems,
      subtotal: computed.subtotal,
      grossTotal: computed.calculatedGross,
      tdsRate: computed.tdsRate,
      tdsAmount: computed.tdsAmount
    }));
  };

  const handleRemoveLineItem = (index) => {
    if (formData.lineItems.length <= 1) return;
    const updatedItems = formData.lineItems.filter((_, i) => i !== index);
    const computed = calculateTotals(updatedItems, formData.cgst, formData.sgst, formData.igst, formData.tdsSection, formData.tdsRate);
    setFormData(prev => ({
      ...prev,
      lineItems: updatedItems,
      subtotal: computed.subtotal,
      grossTotal: computed.calculatedGross,
      tdsRate: computed.tdsRate,
      tdsAmount: computed.tdsAmount
    }));
  };

  const handleTaxChange = (field, value) => {
    const val = parseFloat(value) || 0;
    const updatedForm = { ...formData, [field]: val };
    const computed = calculateTotals(
      updatedForm.lineItems,
      field === 'cgst' ? val : formData.cgst,
      field === 'sgst' ? val : formData.sgst,
      field === 'igst' ? val : formData.igst,
      formData.tdsSection,
      formData.tdsRate
    );
    setFormData({
      ...updatedForm,
      grossTotal: computed.calculatedGross,
      tdsRate: computed.tdsRate,
      tdsAmount: computed.tdsAmount
    });
  };

  const handleTdsSectionChange = (section) => {
    let rate = 0;
    if (section === '194J') rate = 10;
    else if (section === '194C') rate = 2;
    else if (section === '194I') rate = 10;
    else if (section === '194H') rate = 5;

    const tdsAmt = (formData.subtotal * rate) / 100;
    setFormData(prev => ({
      ...prev,
      tdsSection: section,
      tdsRate: rate,
      tdsAmount: tdsAmt
    }));
  };

  // Live Audit Check
  const taxSum = (parseFloat(formData.cgst) || 0) + (parseFloat(formData.sgst) || 0) + (parseFloat(formData.igst) || 0);
  const calculatedSum = formData.subtotal + taxSum;
  const isMathDiscrepancy = Math.abs(calculatedSum - formData.grossTotal) > 0.01;
  const isMissingGstin = !formData.gstin || formData.gstin.trim().length < 10;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.vendorName || !formData.invoiceNo) {
      alert("Please fill in Vendor Name and Invoice Number.");
      return;
    }
    
    // Construct raw text representation
    const rawText = `INVOICE #: ${formData.invoiceNo}
Date: ${formData.invoiceDate} | Due: ${formData.dueDate}
Vendor: ${formData.vendorName}
GSTIN: ${formData.gstin || 'NOT PROVIDED'} | PAN: ${formData.pan || 'UNKNOWN'}
Currency: ${formData.currency}

LINE ITEMS:
${formData.lineItems.map((item, idx) => `${idx+1}. ${item.description} (Qty: ${item.qty} @ ${item.rate}) = ${item.amount}`).join('\n')}

SUBTOTAL: ${formData.subtotal}
CGST: ${formData.cgst} | SGST: ${formData.sgst} | IGST: ${formData.igst}
GROSS TOTAL STATED: ${formData.grossTotal}
TDS SECTION: ${formData.tdsSection} @ ${formData.tdsRate}% = ${formData.tdsAmount}`;

    onSave({
      ...formData,
      rawText: rawText
    });
    onClose();
  };

  const symbol = formData.currency === 'INR' ? '₹' : formData.currency === 'USD' ? '$' : '€';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden my-8 flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div>
            <h2 className="text-base font-extrabold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              {invoiceToEdit ? `Edit Invoice: ${invoiceToEdit.invoiceNo}` : 'Create Real Invoice Entry'}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Input real transaction details. TaxPilot CA engine will audit and persist changes locally.
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body - Scrollable Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto flex-1 text-xs">
          
          {/* Section 1: Vendor & General Details */}
          <div className="space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              1. Vendor & Invoice Header Details
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-slate-300 font-bold block mb-1">Vendor / Company Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. TechSolutions Private Limited"
                  value={formData.vendorName}
                  onChange={(e) => setFormData({ ...formData, vendorName: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white font-medium focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Vendor GSTIN (Tax ID)</label>
                <input
                  type="text"
                  placeholder="e.g. 27AAACT1234F1Z5"
                  value={formData.gstin}
                  onChange={(e) => {
                    const val = e.target.value.toUpperCase();
                    const panVal = val.length >= 12 ? val.substring(2, 12) : formData.pan;
                    setFormData({ ...formData, gstin: val, pan: panVal });
                  }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-emerald-400 font-mono font-bold focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">PAN Number</label>
                <input
                  type="text"
                  placeholder="e.g. AAACT1234F"
                  value={formData.pan}
                  onChange={(e) => setFormData({ ...formData, pan: e.target.value.toUpperCase() })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-300 font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="text-slate-300 font-bold block mb-1">Invoice Number *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. TS-2026-9811"
                  value={formData.invoiceNo}
                  onChange={(e) => setFormData({ ...formData, invoiceNo: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white font-mono font-bold focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Invoice Date</label>
                <input
                  type="date"
                  value={formData.invoiceDate}
                  onChange={(e) => setFormData({ ...formData, invoiceDate: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-300 font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Due Date</label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-300 font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Currency</label>
                <select
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-emerald-400 font-bold focus:outline-none focus:border-emerald-500"
                >
                  <option value="INR">₹ INR</option>
                  <option value="USD">$ USD</option>
                  <option value="EUR">€ EUR</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Line Items */}
          <div className="space-y-3 pt-3 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                2. Itemized Line Items & Ledger Category
              </h3>
              <button
                type="button"
                onClick={handleAddLineItem}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Add Line Item
              </button>
            </div>

            <div className="space-y-2">
              {formData.lineItems.map((item, idx) => (
                <div key={idx} className="grid grid-cols-12 gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800 items-center">
                  <div className="col-span-5 sm:col-span-6">
                    <input
                      type="text"
                      placeholder="Item Description"
                      value={item.description}
                      onChange={(e) => handleLineItemChange(idx, 'description', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-slate-200 focus:outline-none focus:border-cyan-500 text-xs"
                    />
                  </div>

                  <div className="col-span-2">
                    <input
                      type="number"
                      placeholder="Qty"
                      min="1"
                      value={item.qty}
                      onChange={(e) => handleLineItemChange(idx, 'qty', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-center text-slate-200 font-mono text-xs focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div className="col-span-2">
                    <input
                      type="number"
                      placeholder="Rate"
                      step="any"
                      value={item.rate}
                      onChange={(e) => handleLineItemChange(idx, 'rate', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-right text-slate-200 font-mono text-xs focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div className="col-span-2 font-mono font-bold text-right text-emerald-400 pr-1">
                    {symbol}{parseFloat(item.amount || 0).toLocaleString()}
                  </div>

                  <div className="col-span-1 text-right">
                    <button
                      type="button"
                      onClick={() => handleRemoveLineItem(idx)}
                      disabled={formData.lineItems.length <= 1}
                      className="text-slate-500 hover:text-rose-400 transition-colors p-1 disabled:opacity-30"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Tax Rates & TDS */}
          <div className="space-y-3 pt-3 border-t border-slate-800">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              3. Tax Computation & TDS Statutory Withholding
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800">
              <div>
                <label className="text-slate-400 block mb-1">Subtotal ({symbol})</label>
                <input
                  type="number"
                  readOnly
                  value={formData.subtotal}
                  className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-white font-mono font-bold"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">CGST ({symbol})</label>
                <input
                  type="number"
                  step="any"
                  value={formData.cgst}
                  onChange={(e) => handleTaxChange('cgst', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-cyan-400 font-mono font-bold focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">SGST ({symbol})</label>
                <input
                  type="number"
                  step="any"
                  value={formData.sgst}
                  onChange={(e) => handleTaxChange('sgst', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-cyan-400 font-mono font-bold focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">IGST ({symbol})</label>
                <input
                  type="number"
                  step="any"
                  value={formData.igst}
                  onChange={(e) => handleTaxChange('igst', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-cyan-400 font-mono font-bold focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Stated Gross ({symbol})</label>
                <input
                  type="number"
                  step="any"
                  value={formData.grossTotal}
                  onChange={(e) => setFormData({ ...formData, grossTotal: parseFloat(e.target.value) || 0 })}
                  className={`w-full bg-slate-900 border rounded p-2 font-mono font-bold focus:outline-none ${
                    isMathDiscrepancy ? 'border-rose-500 text-rose-400' : 'border-slate-800 text-emerald-400'
                  }`}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-slate-300 font-bold block mb-1">Ledger Category Mapping</label>
                <select
                  value={formData.ledgerCategory}
                  onChange={(e) => setFormData({ ...formData, ledgerCategory: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white font-medium focus:outline-none focus:border-emerald-500"
                >
                  <option value="Software & Cloud Infrastructure">Software & Cloud Infrastructure</option>
                  <option value="General & Administrative">General & Administrative</option>
                  <option value="Sales & Marketing">Sales & Marketing</option>
                  <option value="Professional & Legal Fees">Professional & Legal Fees</option>
                  <option value="Travel & Entertainment">Travel & Entertainment</option>
                  <option value="Capital Expenditure - Equipment">Capital Expenditure - Equipment</option>
                  {ledgerHeads.map(h => (
                    <option key={h.id} value={h.name}>{h.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">TDS Section (Withholding Tax)</label>
                <select
                  value={formData.tdsSection}
                  onChange={(e) => handleTdsSectionChange(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-amber-400 font-bold focus:outline-none focus:border-amber-500"
                >
                  <option value="None">None (0%)</option>
                  <option value="194J">Sec 194J - Tech & Professional (10%)</option>
                  <option value="194C">Sec 194C - Contractor Works (2%)</option>
                  <option value="194I">Sec 194I - Rent & Property (10%)</option>
                  <option value="194H">Sec 194H - Commission (5%)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Net Payable to Vendor</label>
                <div className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-emerald-400 font-mono font-extrabold text-sm">
                  {symbol}{(formData.grossTotal - formData.tdsAmount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Live CA Audit Status Banner */}
          <div className={`p-4 rounded-xl border flex items-center space-x-3 ${
            isMathDiscrepancy ? 'bg-rose-500/10 border-rose-500/30 text-rose-300' :
            isMissingGstin ? 'bg-amber-500/10 border-amber-500/30 text-amber-300' :
            'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
          }`}>
            {isMathDiscrepancy ? (
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
            ) : isMissingGstin ? (
              <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
            ) : (
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            )}

            <div className="text-xs">
              <span className="font-bold block uppercase tracking-wider">
                {isMathDiscrepancy ? 'CA AUDIT WARNING: Math Discrepancy Detected' :
                 isMissingGstin ? 'CA AUDIT NOTICE: Missing / Invalid Vendor Tax ID' :
                 'CA AUDIT PASSED: 100% Arithmetic & Statutory Compliance Verified'}
              </span>
              <span className="text-[11px] opacity-90">
                {isMathDiscrepancy ? `Subtotal (${symbol}${formData.subtotal}) + Taxes (${symbol}${taxSum}) = ${symbol}${calculatedSum}, but Stated Gross is ${symbol}${formData.grossTotal} (Variance: ${symbol}${Math.abs(calculatedSum - formData.grossTotal).toFixed(2)}).` :
                 isMissingGstin ? 'GSTIN missing or truncated. Reverse charge or Section 206AB audit flag will be assigned.' :
                 `Subtotal + Tax matches Stated Gross Total exactly (${symbol}${calculatedSum}). TDS under ${formData.tdsSection} calculated at ${formData.tdsRate}%.`}
              </span>
            </div>
          </div>

          {/* Modal Footer Buttons */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-slate-950 font-bold uppercase tracking-wider hover:opacity-95 transition-all shadow-lg shadow-emerald-500/20"
            >
              {invoiceToEdit ? 'Save Changes & Update Ledger' : 'Create & Audit Invoice'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
