import React, { useState, useEffect } from 'react';
import { Cpu, ShieldCheck, Settings2, Sliders, CheckCircle2, AlertTriangle, Plus, Trash2, Edit2, Save, X } from 'lucide-react';

export default function LedgerRulesConfig({ 
  ledgerHeads = [], 
  auditRules = {}, 
  onSaveRules, 
  onAddLedgerHead, 
  onUpdateLedgerHead, 
  onDeleteLedgerHead,
  currency = 'INR'
}) {
  const [mathTolerance, setMathTolerance] = useState(auditRules.mathTolerance || "0.00");
  const [duplicateLookbackDays, setDuplicateLookbackDays] = useState(auditRules.duplicateLookbackDays || "90");
  const [requireGstinForItc, setRequireGstinForItc] = useState(auditRules.requireGstinForItc ?? true);

  const [newHeadName, setNewHeadName] = useState("");
  const [newHeadCode, setNewHeadCode] = useState("");
  const [newHeadHsn, setNewHeadHsn] = useState("998313");
  const [newHeadTds, setNewHeadTds] = useState("194C (2%)");

  const [editingHeadId, setEditingHeadId] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  useEffect(() => {
    setMathTolerance(auditRules.mathTolerance || "0.00");
    setDuplicateLookbackDays(auditRules.duplicateLookbackDays || "90");
    setRequireGstinForItc(auditRules.requireGstinForItc ?? true);
  }, [auditRules]);

  const handleSaveThresholds = (e) => {
    e.preventDefault();
    onSaveRules({
      mathTolerance,
      duplicateLookbackDays,
      requireGstinForItc
    });
  };

  const handleCreateHead = (e) => {
    e.preventDefault();
    if (!newHeadName || !newHeadCode) return;
    onAddLedgerHead({
      id: Date.now(),
      name: newHeadName,
      code: newHeadCode,
      hsnCode: newHeadHsn,
      defaultTds: newHeadTds
    });
    setNewHeadName("");
    setNewHeadCode("");
    setNewHeadHsn("998313");
  };

  const startEditHead = (head) => {
    setEditingHeadId(head.id);
    setEditFormData({ ...head });
  };

  const saveEditHead = () => {
    onUpdateLedgerHead(editingHeadId, editFormData);
    setEditingHeadId(null);
  };

  const symbol = currency === 'INR' ? '₹' : currency === 'USD' ? '$' : '€';

  return (
    <div className="space-y-6">
      
      {/* Page Title */}
      <div className="glass-panel p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Cpu className="w-5 h-5 text-emerald-400" />
            TaxPilot CA Rules Engine & General Ledger Configurator
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Configure arithmetic error tolerances, GSTIN validation rules, TDS section defaults, and persistent General Ledger heads.
          </p>
        </div>
        
        <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-3.5 py-2 rounded-xl text-xs font-semibold">
          <ShieldCheck className="w-4 h-4" /> Rules Engine: ACTIVE & PERSISTED
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Fraud Detection Thresholds */}
        <div className="glass-panel p-6 rounded-2xl space-y-5">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Sliders className="w-4 h-4 text-amber-400" />
            Autonomous Fraud & Audit Thresholds
          </h3>

          <form onSubmit={handleSaveThresholds} className="space-y-4 text-xs">
            <div>
              <label className="text-slate-300 font-bold block mb-1">
                Arithmetic Error Tolerance ({symbol})
              </label>
              <input
                type="text"
                value={mathTolerance}
                onChange={(e) => setMathTolerance(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-emerald-400 font-mono font-bold focus:outline-none focus:border-emerald-500"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                TaxPilot AI flags any subtotal + tax variance greater than this value as <strong className="text-rose-400">[AUDIT ALERT]</strong>.
              </p>
            </div>

            <div>
              <label className="text-slate-300 font-bold block mb-1">
                Duplicate Invoice Lookback Window (Days)
              </label>
              <input
                type="number"
                value={duplicateLookbackDays}
                onChange={(e) => setDuplicateLookbackDays(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-cyan-400 font-mono font-bold focus:outline-none focus:border-cyan-500"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Scans previous voucher postings within this day window for identical invoice numbers or totals.
              </p>
            </div>

            <div className="pt-2 border-t border-slate-800/80">
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={requireGstinForItc}
                  onChange={(e) => setRequireGstinForItc(e.target.checked)}
                  className="mt-0.5 rounded bg-slate-950 border-slate-800 text-emerald-500 focus:ring-emerald-500"
                />
                <div>
                  <span className="text-slate-200 font-bold block">Strict GSTIN / Tax ID Enforcement</span>
                  <span className="text-[11px] text-slate-400">
                    Automatically block Input Tax Credit (ITC) claiming if vendor Tax ID checksum fails.
                  </span>
                </div>
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 text-slate-950 font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-amber-900/30"
            >
              Update Fraud Rules
            </button>
          </form>
        </div>

        {/* Right Column: Ledger Heads Table (2 Cols) */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-white flex items-center gap-2">
              <Settings2 className="w-4 h-4 text-cyan-400" />
              General Ledger Heads & Default Tax Mapping
            </h3>
            <span className="text-xs text-slate-400 font-mono">{ledgerHeads.length} Heads Registered</span>
          </div>

          {/* Add New Ledger Head Form */}
          <form onSubmit={handleCreateHead} className="grid grid-cols-1 sm:grid-cols-4 gap-2 bg-slate-900/80 p-3 rounded-xl border border-slate-800">
            <input
              type="text"
              placeholder="Ledger Head Name"
              value={newHeadName}
              onChange={(e) => setNewHeadName(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
            <input
              type="text"
              placeholder="Code (EXP-6010)"
              value={newHeadCode}
              onChange={(e) => setNewHeadCode(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
            <select
              value={newHeadTds}
              onChange={(e) => setNewHeadTds(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-300 focus:outline-none"
            >
              <option value="194J (10%)">194J (10%)</option>
              <option value="194C (2%)">194C (2%)</option>
              <option value="194I (10%)">194I (10%)</option>
              <option value="None (0%)">None (0%)</option>
            </select>

            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs rounded-lg p-2 flex items-center justify-center gap-1 transition-all"
            >
              <Plus className="w-4 h-4" /> Add Head
            </button>
          </form>

          {/* Ledger Heads Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                  <th className="py-2.5 px-3">Code</th>
                  <th className="py-2.5 px-3">Ledger Head Name</th>
                  <th className="py-2.5 px-3">HSN/SAC</th>
                  <th className="py-2.5 px-3">Default TDS</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {ledgerHeads.map((head) => {
                  const isEditing = editingHeadId === head.id;
                  return (
                    <tr key={head.id} className="hover:bg-slate-900/40">
                      {isEditing ? (
                        <>
                          <td className="py-2 px-2">
                            <input
                              type="text"
                              value={editFormData.code}
                              onChange={(e) => setEditFormData({ ...editFormData, code: e.target.value })}
                              className="w-full bg-slate-950 border border-slate-700 rounded p-1 text-emerald-400 font-bold"
                            />
                          </td>
                          <td className="py-2 px-2">
                            <input
                              type="text"
                              value={editFormData.name}
                              onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                              className="w-full bg-slate-950 border border-slate-700 rounded p-1 text-white"
                            />
                          </td>
                          <td className="py-2 px-2">
                            <input
                              type="text"
                              value={editFormData.hsnCode}
                              onChange={(e) => setEditFormData({ ...editFormData, hsnCode: e.target.value })}
                              className="w-full bg-slate-950 border border-slate-700 rounded p-1 text-slate-300"
                            />
                          </td>
                          <td className="py-2 px-2">
                            <input
                              type="text"
                              value={editFormData.defaultTds}
                              onChange={(e) => setEditFormData({ ...editFormData, defaultTds: e.target.value })}
                              className="w-full bg-slate-950 border border-slate-700 rounded p-1 text-slate-300"
                            />
                          </td>
                          <td className="py-2 px-2 text-right">
                            <button onClick={saveEditHead} className="text-emerald-400 hover:text-emerald-300 p-1 mr-1">
                              <Save className="w-4 h-4" />
                            </button>
                            <button onClick={() => setEditingHeadId(null)} className="text-slate-500 hover:text-slate-400 p-1">
                              <X className="w-4 h-4" />
                            </button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="py-3 px-3 text-emerald-400 font-bold">{head.code}</td>
                          <td className="py-3 px-3 text-white font-sans font-medium">{head.name}</td>
                          <td className="py-3 px-3 text-slate-400">{head.hsnCode || '998313'}</td>
                          <td className="py-3 px-3 text-slate-300">{head.defaultTds || '194C (2%)'}</td>
                          <td className="py-3 px-3 text-right">
                            <button
                              onClick={() => startEditHead(head)}
                              className="text-slate-400 hover:text-emerald-400 transition-colors p-1 mr-1"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm(`Delete ledger head ${head.name}?`)) {
                                  onDeleteLedgerHead(head.id);
                                }
                              }}
                              className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
}
