import React, { useState } from 'react';
import { GitCompare, Upload, Download, CheckCircle2, AlertTriangle, FileSpreadsheet, RefreshCw, Sliders, Layers } from 'lucide-react';
import { reconciliationApi } from '../services/api';

export default function ReconciliationTool() {
  const [fileA, setFileA] = useState(null);
  const [fileB, setFileB] = useState(null);
  const [toleranceAmount, setToleranceAmount] = useState(1.0);
  const [toleranceDays, setToleranceDays] = useState(3);
  const [isMatching, setIsMatching] = useState(false);
  const [matchResult, setMatchResult] = useState(null);
  const [activeBucket, setActiveBucket] = useState('matched'); // matched | unmatched_a | unmatched_b

  const handleRunReconciliation = async (e) => {
    if (e) e.preventDefault();
    if (!fileA || !fileB) {
      alert("Please select both File A (e.g. Purchase Register) and File B (e.g. GSTR-2B download).");
      return;
    }

    setIsMatching(true);
    try {
      const formData = new FormData();
      formData.append('file_a', fileA);
      formData.append('file_b', fileB);
      formData.append('tolerance_amount', toleranceAmount);
      formData.append('tolerance_days', toleranceDays);

      const res = await reconciliationApi.runMatch(formData);
      setMatchResult(res.result);
      setIsMatching(false);
    } catch (err) {
      setIsMatching(false);
      alert(err.message || "Reconciliation failed.");
    }
  };

  const handleDownloadExcel = async () => {
    if (!fileA || !fileB) return;
    try {
      const formData = new FormData();
      formData.append('file_a', fileA);
      formData.append('file_b', fileB);
      formData.append('tolerance_amount', toleranceAmount);
      formData.append('tolerance_days', toleranceDays);

      const blob = await reconciliationApi.downloadExcel(formData);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = "Reconciliation_Report_TaxDesk.xlsx";
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      alert("Excel download failed.");
    }
  };

  const loadDemoCSVFiles = () => {
    const csvContentA = `Invoice_No,Vendor_Name,Date,Amount
INV-2026-001,Acme Tech,2026-08-10,25000.00
INV-2026-002,Global Logistics,2026-08-12,14500.50
INV-2026-003,Starlight Media,2026-08-15,8200.00
INV-2026-004,Delta Hardware,2026-08-18,65000.00`;

    const csvContentB = `Invoice_No,Vendor_Name,Date,Amount
INV-2026-001,Acme Tech,2026-08-10,25000.00
INV-2026-002,Global Logistics,2026-08-13,14500.00
INV-2026-099,Apex Software,2026-08-16,32000.00`;

    const file1 = new File([csvContentA], "Purchase_Register_Aug2026.csv", { type: "text/csv" });
    const file2 = new File([csvContentB], "GSTR_2B_Download_Aug2026.csv", { type: "text/csv" });

    setFileA(file1);
    setFileB(file2);
  };

  return (
    <div className="space-y-6 font-sans max-w-full">
      
      {/* Header Banner */}
      <div className="glass-panel p-4 sm:p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center gap-2">
            <GitCompare className="w-5 h-5 text-emerald-600 shrink-0" />
            CSV Reconciliation & 3-Bucket Data Matcher
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Compare Purchase Register vs GSTR-2B or Bank Statement vs Ledger with configurable amount & date tolerance.
          </p>
        </div>

        <button
          onClick={loadDemoCSVFiles}
          className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-emerald-700 border border-slate-300 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 min-h-[40px]"
        >
          <FileSpreadsheet className="w-4 h-4" /> Load Demo CSV Test Pair
        </button>
      </div>

      {/* File Selection & Tolerance Setup Card */}
      <div className="glass-panel p-5 sm:p-6 rounded-2xl space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* File A Box */}
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              File A: Primary Register (e.g. Purchase Book)
            </label>
            <input
              type="file"
              accept=".csv"
              onChange={(e) => e.target.files && setFileA(e.target.files[0])}
              className="text-xs text-slate-600 w-full file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-emerald-600 file:text-white cursor-pointer"
            />
            {fileA && <div className="text-[11px] text-emerald-700 font-mono font-bold break-all">Loaded: {fileA.name}</div>}
          </div>

          {/* File B Box */}
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              File B: Counterparty File (e.g. GSTR-2B)
            </label>
            <input
              type="file"
              accept=".csv"
              onChange={(e) => e.target.files && setFileB(e.target.files[0])}
              className="text-xs text-slate-600 w-full file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-cyan-600 file:text-white cursor-pointer"
            />
            {fileB && <div className="text-[11px] text-cyan-700 font-mono font-bold break-all">Loaded: {fileB.name}</div>}
          </div>

        </div>

        {/* Tolerance Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-slate-200 items-center">
          <div>
            <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
              Amount Tolerance: <strong className="text-emerald-700 font-mono">± ₹{toleranceAmount}</strong>
            </label>
            <input
              type="range"
              min="0"
              max="10"
              step="0.5"
              value={toleranceAmount}
              onChange={(e) => setToleranceAmount(parseFloat(e.target.value))}
              className="w-full accent-emerald-600 mt-1 cursor-pointer"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
              Date Window Tolerance: <strong className="text-cyan-700 font-mono">± {toleranceDays} Days</strong>
            </label>
            <input
              type="range"
              min="0"
              max="7"
              step="1"
              value={toleranceDays}
              onChange={(e) => setToleranceDays(parseInt(e.target.value))}
              className="w-full accent-cyan-600 mt-1 cursor-pointer"
            />
          </div>

          <button
            onClick={handleRunReconciliation}
            disabled={isMatching || !fileA || !fileB}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 min-h-[44px]"
          >
            <GitCompare className={`w-4 h-4 ${isMatching ? 'animate-spin' : ''}`} />
            <span>{isMatching ? 'Matching Rows...' : 'Execute 3-Bucket Match'}</span>
          </button>
        </div>
      </div>

      {/* Matching Results & 3 Buckets */}
      {matchResult && (
        <div className="glass-panel p-5 sm:p-6 rounded-2xl space-y-5 animate-fadeIn">
          
          {/* Summary Metric Cards */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full md:w-auto">
              
              <button
                onClick={() => setActiveBucket('matched')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  activeBucket === 'matched' ? 'bg-emerald-50 border-emerald-300 text-emerald-800' : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                <span className="text-[10px] font-bold uppercase tracking-wider block">Bucket 1: Matched</span>
                <span className="text-lg sm:text-xl font-bold font-mono text-slate-900">{matchResult.matched_count}</span>
              </button>

              <button
                onClick={() => setActiveBucket('unmatched_a')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  activeBucket === 'unmatched_a' ? 'bg-rose-50 border-rose-300 text-rose-800' : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                <span className="text-[10px] font-bold uppercase tracking-wider block">Bucket 2: Unmatched A</span>
                <span className="text-lg sm:text-xl font-bold font-mono text-slate-900">{matchResult.unmatched_a_count}</span>
              </button>

              <button
                onClick={() => setActiveBucket('unmatched_b')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  activeBucket === 'unmatched_b' ? 'bg-amber-50 border-amber-300 text-amber-800' : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                <span className="text-[10px] font-bold uppercase tracking-wider block">Bucket 3: Unmatched B</span>
                <span className="text-lg sm:text-xl font-bold font-mono text-slate-900">{matchResult.unmatched_b_count}</span>
              </button>

            </div>

            {/* Excel Download Button */}
            <button
              onClick={handleDownloadExcel}
              className="w-full md:w-auto px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 min-h-[42px]"
            >
              <Download className="w-4 h-4" /> Download 3-Tab Excel Report
            </button>
          </div>

          {/* Bucket Display Table */}
          <div className="table-responsive-container">
            {activeBucket === 'matched' && (
              <table className="w-full text-left text-xs font-mono min-w-[650px]">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-600 uppercase tracking-wider text-[10px] font-bold">
                    <th className="py-2.5 px-3">File A Record</th>
                    <th className="py-2.5 px-3">File B Match</th>
                    <th className="py-2.5 px-3 text-right">File A Amount</th>
                    <th className="py-2.5 px-3 text-right">File B Amount</th>
                    <th className="py-2.5 px-3 text-right">Variance</th>
                    <th className="py-2.5 px-3 text-right">Match Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-sans">
                  {matchResult.matched.map((m, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="py-3 px-3 font-semibold text-slate-900">
                        {m.file_a_row.Invoice_No || m.file_a_row.Vendor_Name || 'Record A'}
                      </td>
                      <td className="py-3 px-3 text-cyan-700 font-semibold">
                        {m.file_b_row.Invoice_No || m.file_b_row.Vendor_Name || 'Record B'}
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-slate-800">₹{(m.amount_a||0).toLocaleString()}</td>
                      <td className="py-3 px-3 text-right font-mono text-slate-800">₹{(m.amount_b||0).toLocaleString()}</td>
                      <td className="py-3 px-3 text-right font-mono text-amber-700 font-bold">₹{m.amount_diff}</td>
                      <td className="py-3 px-3 text-right">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono">
                          {m.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeBucket === 'unmatched_a' && (
              <div className="space-y-2 p-4">
                <span className="text-xs font-bold text-rose-700 block font-mono mb-2">Rows present in File A but MISSING in File B:</span>
                <pre className="bg-slate-50 border border-slate-200 p-4 rounded-xl text-xs font-mono text-rose-800 max-h-60 overflow-y-auto">
                  {JSON.stringify(matchResult.unmatched_a, null, 2)}
                </pre>
              </div>
            )}

            {activeBucket === 'unmatched_b' && (
              <div className="space-y-2 p-4">
                <span className="text-xs font-bold text-amber-700 block font-mono mb-2">Rows present in File B but MISSING in File A:</span>
                <pre className="bg-slate-50 border border-slate-200 p-4 rounded-xl text-xs font-mono text-amber-800 max-h-60 overflow-y-auto">
                  {JSON.stringify(matchResult.unmatched_b, null, 2)}
                </pre>
              </div>
            )}

          </div>

        </div>
      )}

    </div>
  );
}
