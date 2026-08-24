import React, { useState, useRef } from 'react';
import { 
  FileSearch, Sparkles, CheckCircle2, AlertTriangle, Play, Upload, Download, 
  Plus, Search, Filter, Trash2, Edit3, RefreshCw, FileText, FileSpreadsheet, ShieldAlert
} from 'lucide-react';
import { exportInvoicesToCSV, exportInvoicesToJSON } from '../utils/storage';

export default function InvoiceParser({ 
  invoices = [], 
  selectedInvoice, 
  onSelectInvoice, 
  isAnalyzing, 
  onRunAnalysis, 
  currency,
  onCreateInvoice,
  onEditInvoice,
  onDeleteInvoice,
  onImportInvoices,
  onClearInvoices,
  onLoadSampleData
}) {
  const [inputText, setInputText] = useState(selectedInvoice ? selectedInvoice.rawText || '' : '');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL'); // ALL | COMPLIANT | MATH_DISCREPANCY | MISSING_TAX_ID | DUPLICATE
  const fileInputRef = useRef(null);

  const handleSelectSample = (sample) => {
    onSelectInvoice(sample);
    setInputText(sample.rawText || '');
  };

  const handleRunCustomAudit = () => {
    const text = inputText;
    if (!text.trim()) return;

    // Advanced heuristic text extraction
    const gstinMatch = text.match(/(?:GSTIN|TAX ID|EIN|PAN)[:\s]*([A-Z0-9]{10,15})/i);
    const gstin = gstinMatch ? gstinMatch[1].toUpperCase() : "";
    
    const invMatch = text.match(/(?:INVOICE|INV|VOUCHER)[:#\s]*([A-Z0-9-]+)/i);
    const invoiceNo = invMatch ? invMatch[1] : `INV-${Math.floor(1000 + Math.random() * 9000)}`;
    
    const totalMatch = text.match(/(?:TOTAL|GROSS|AMOUNT PAYABLE)[:\s]*[₹$€]?\s*([\d,]+\.?\d*)/i);
    const subtotalMatch = text.match(/(?:SUBTOTAL|NET AMOUNT)[:\s]*[₹$€]?\s*([\d,]+\.?\d*)/i);
    const taxMatch = text.match(/(?:TAX|GST|VAT)[:\s]*[₹$€]?\s*([\d,]+\.?\d*)/i);

    const subtotalVal = subtotalMatch ? parseFloat(subtotalMatch[1].replace(/,/g, '')) : 5000;
    const taxVal = taxMatch ? parseFloat(taxMatch[1].replace(/,/g, '')) : (subtotalVal * 0.18);
    const grossVal = totalMatch ? parseFloat(totalMatch[1].replace(/,/g, '')) : (subtotalVal + taxVal);

    const vendorMatch = text.match(/Vendor[:\s]*(.+)/i);
    const vendorName = vendorMatch ? vendorMatch[1].trim() : "Custom Extracted Vendor";

    const parsedInvoice = {
      id: `INV-RAW-${Date.now()}`,
      name: `${vendorName} (Parsed Document)`,
      vendorName: vendorName,
      gstin: gstin,
      pan: gstin.length >= 12 ? gstin.substring(2, 12) : "UNKNOWN",
      invoiceNo: invoiceNo,
      invoiceDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      currency: currency,
      rawText: text,
      lineItems: [
        { description: "Parsed Line Item 1", qty: 1, rate: subtotalVal, amount: subtotalVal, ledgerHead: "General & Administrative" }
      ],
      subtotal: subtotalVal,
      cgst: taxVal / 2,
      sgst: taxVal / 2,
      igst: 0,
      taxTotal: taxVal,
      grossTotal: grossVal,
      tdsSection: subtotalVal > 30000 ? "194C" : "None",
      tdsRate: subtotalVal > 30000 ? 2 : 0,
      tdsAmount: subtotalVal > 30000 ? subtotalVal * 0.02 : 0,
      netPayable: grossVal - (subtotalVal > 30000 ? subtotalVal * 0.02 : 0),
      ledgerCategory: "General & Administrative"
    };

    onRunAnalysis(parsedInvoice);
  };

  // Filtered invoices
  const filteredInvoices = invoices.filter(inv => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      (inv.vendorName || '').toLowerCase().includes(query) ||
      (inv.invoiceNo || '').toLowerCase().includes(query) ||
      (inv.gstin || '').toLowerCase().includes(query) ||
      (inv.ledgerCategory || '').toLowerCase().includes(query);

    if (!matchesSearch) return false;

    if (statusFilter === 'ALL') return true;
    if (statusFilter === 'COMPLIANT') return !inv.hasMathDiscrepancy && !inv.hasMissingTaxId && !inv.isDuplicate;
    if (statusFilter === 'MATH_DISCREPANCY') return inv.hasMathDiscrepancy;
    if (statusFilter === 'MISSING_TAX_ID') return inv.hasMissingTaxId;
    if (statusFilter === 'DUPLICATE') return inv.isDuplicate;

    return true;
  });

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const content = evt.target.result;
      try {
        if (file.name.endsWith('.json')) {
          const parsed = JSON.parse(content);
          if (Array.isArray(parsed)) {
            onImportInvoices(parsed);
          } else {
            onImportInvoices([parsed]);
          }
        } else if (file.name.endsWith('.csv')) {
          const lines = content.split('\n').filter(l => l.trim());
          const newInvs = [];
          for (let i = 1; i < lines.length; i++) {
            const cols = lines[i].split(',').map(c => c.replace(/^"|"$/g, '').trim());
            if (cols.length >= 5) {
              newInvs.push({
                id: `INV-CSV-${Date.now()}-${i}`,
                invoiceNo: cols[1] || `CSV-${i}`,
                vendorName: cols[2] || 'Imported Vendor',
                gstin: cols[3] || '',
                invoiceDate: cols[4] || new Date().toISOString().split('T')[0],
                currency: cols[5] || currency,
                subtotal: parseFloat(cols[6]) || 1000,
                taxTotal: parseFloat(cols[7]) || 180,
                grossTotal: parseFloat(cols[8]) || 1180,
                tdsSection: cols[9] || 'None',
                tdsRate: parseFloat(cols[10]) || 0,
                tdsAmount: parseFloat(cols[11]) || 0,
                netPayable: parseFloat(cols[12]) || 1180,
                ledgerCategory: cols[15] || 'General & Administrative',
                lineItems: [{ description: 'Imported CSV Line Item', qty: 1, rate: parseFloat(cols[6]) || 1000, amount: parseFloat(cols[6]) || 1000 }]
              });
            }
          }
          if (newInvs.length > 0) onImportInvoices(newInvs);
        }
      } catch (err) {
        alert("Failed to parse file. Please check JSON/CSV format.");
      }
    };
    reader.readAsText(file);
  };

  const getSymbol = (c) => c === 'INR' ? '₹' : c === 'USD' ? '$' : '€';

  return (
    <div className="space-y-6">
      
      {/* Top CRUD Toolbar: Search, Filters, Create, Import, Export */}
      <div className="glass-panel p-5 rounded-2xl space-y-4">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-base font-extrabold text-white flex items-center gap-2">
              <FileSearch className="w-5 h-5 text-emerald-400" />
              Invoice Ledger & Autonomous Audit Hub
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Add invoices, paste OCR text, or import CSV files. Financial reports calculate purely from your entries.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={onCreateInvoice}
              className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs rounded-xl hover:opacity-95 transition-all shadow-md shadow-emerald-900/30 flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Create New Invoice
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-cyan-400 border border-slate-800 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <Upload className="w-3.5 h-3.5" /> Import File
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".csv,.json"
              className="hidden"
            />

            {invoices.length > 0 && (
              <>
                <button
                  onClick={() => exportInvoicesToCSV(invoices)}
                  className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" /> Export CSV
                </button>

                <button
                  onClick={() => exportInvoicesToJSON(invoices)}
                  className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5 text-cyan-400" /> JSON
                </button>

                <button
                  onClick={onClearInvoices}
                  title="Clear all invoices from database"
                  className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-rose-400 border border-slate-800 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Clear All
                </button>
              </>
            )}

            {onLoadSampleData && (
              <button
                onClick={onLoadSampleData}
                title="Load preset demo invoice dataset"
                className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-slate-800 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Demo Data
              </button>
            )}
          </div>
        </div>

        {/* Search & Filter Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* Search Box */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search vendor, GSTIN, invoice #..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-medium"
            />
          </div>

          {/* Audit Status Filter Pills */}
          <div className="flex items-center space-x-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 text-xs font-semibold">
            {[
              { id: 'ALL', label: 'All Invoices', count: invoices.length },
              { id: 'COMPLIANT', label: 'Compliant', count: invoices.filter(i => !i.hasMathDiscrepancy && !i.hasMissingTaxId && !i.isDuplicate).length },
              { id: 'MATH_DISCREPANCY', label: 'Math Error', count: invoices.filter(i => i.hasMathDiscrepancy).length },
              { id: 'MISSING_TAX_ID', label: 'Missing Tax ID', count: invoices.filter(i => i.hasMissingTaxId).length },
              { id: 'DUPLICATE', label: 'Duplicates', count: invoices.filter(i => i.isDuplicate).length }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  statusFilter === tab.id
                    ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <span>{tab.label}</span>
                <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-slate-950 text-slate-300 font-mono">
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

        </div>

      </div>

      {/* Invoice Records List / Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-400 px-1 font-mono">
          <span>Showing {filteredInvoices.length} of {invoices.length} Registered Records</span>
          {invoices.length > 0 && <span>Click record to load into 4-Section CA Inspector below</span>}
        </div>

        {invoices.length === 0 ? (
          <div className="glass-panel p-8 rounded-2xl text-center space-y-3 border border-slate-800/80">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 text-slate-500 flex items-center justify-center mx-auto border border-slate-800">
              <FileText className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-white">No Invoices Added Yet</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Add your real invoices using "+ Create New Invoice", paste OCR text into the buffer below, or import a CSV/JSON file.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
              <button
                onClick={onCreateInvoice}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md"
              >
                + Create New Invoice
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-cyan-400 border border-slate-800 text-xs font-semibold rounded-xl"
              >
                Import File (CSV/JSON)
              </button>
              {onLoadSampleData && (
                <button
                  onClick={onLoadSampleData}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-slate-800 text-xs font-semibold rounded-xl"
                >
                  Load Demo Data
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {filteredInvoices.map((inv) => {
              const isSelected = selectedInvoice && selectedInvoice.id === inv.id;
              return (
                <div
                  key={inv.id}
                  onClick={() => handleSelectSample(inv)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between group ${
                    isSelected
                      ? 'bg-emerald-950/40 border-emerald-500 shadow-lg shadow-emerald-950/50 ring-1 ring-emerald-500/30'
                      : 'bg-slate-900/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-2">
                      <span className={`px-2 py-0.5 text-[10px] font-extrabold rounded-full border ${
                        inv.badgeColor === 'emerald' || inv.badge === 'COMPLIANT'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : inv.badgeColor === 'rose' || inv.hasMathDiscrepancy
                          ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                      }`}>
                        {inv.badge || (inv.hasMathDiscrepancy ? 'MATH ERROR' : 'AUDITED')}
                      </span>

                      <div className="flex items-center space-x-1 opacity-80 group-hover:opacity-100" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => onEditInvoice(inv)}
                          title="Edit Invoice"
                          className="p-1 text-slate-400 hover:text-emerald-400 transition-colors"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to delete invoice ${inv.invoiceNo}?`)) {
                              onDeleteInvoice(inv.id);
                            }
                          }}
                          title="Delete Invoice"
                          className="p-1 text-slate-400 hover:text-rose-400 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <h4 className="text-xs font-bold text-slate-100 line-clamp-1 group-hover:text-emerald-400 transition-colors">
                      {inv.vendorName}
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-1 font-mono">
                      Inv #: {inv.invoiceNo}
                    </p>
                    <p className="text-[10px] text-slate-500 font-mono">
                      GSTIN: {inv.gstin || 'MISSING'}
                    </p>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
                    <span className="font-extrabold text-emerald-400">
                      {getSymbol(inv.currency)}{inv.grossTotal?.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-slate-400">{inv.invoiceDate}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Raw Text Input Buffer & Custom OCR Parse */}
      <div className="glass-panel p-5 rounded-2xl space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-white flex items-center gap-2 uppercase tracking-wider">
              <FileSearch className="w-4 h-4 text-emerald-400" />
              Raw Document / OCR Text Input Buffer
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Paste raw unstructured text or vendor invoice email to parse into structured ledger records.
            </p>
          </div>

          <button
            onClick={() => setInputText('')}
            className="text-xs text-slate-400 hover:text-emerald-400 transition-colors"
          >
            Clear Buffer
          </button>
        </div>

        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          rows={5}
          className="w-full bg-slate-950/90 border border-slate-800 rounded-xl p-3.5 font-mono text-xs text-emerald-300 focus:outline-none focus:border-emerald-500 transition-all resize-y"
          placeholder="Paste raw invoice text snippet here (e.g. INVOICE #: TS-991, Vendor: TechCorp, Subtotal: ₹50,000, Tax: ₹9,000, Total: ₹59,000)..."
        />

        <div className="flex items-center justify-between">
          <span className="text-[11px] text-slate-500 font-mono">
            CA Rules Engine: Active (HSN 9983, Sec 194C/J TDS, Arithmetic Tolerance 0.00)
          </span>

          <button
            onClick={handleRunCustomAudit}
            disabled={isAnalyzing || !inputText.trim()}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-slate-950 font-bold text-xs uppercase tracking-wider hover:opacity-95 transition-all shadow-md shadow-emerald-500/20 flex items-center gap-2 disabled:opacity-50"
          >
            {isAnalyzing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-slate-950" />}
            Execute CA Audit on Buffer
          </button>
        </div>
      </div>

    </div>
  );
}
