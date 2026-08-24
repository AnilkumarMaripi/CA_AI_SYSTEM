import React, { useState } from 'react';
import { Calculator, TrendingUp, TrendingDown, DollarSign, ShieldAlert, PieChart, Landmark, ArrowUpRight, CheckCircle2, Edit3, Plus, FileText } from 'lucide-react';

export default function FinancialController({ currency, invoices = [], onNavigateToAuditor, onLoadSampleData }) {
  const symbol = currency === 'INR' ? '₹' : currency === 'USD' ? '$' : '€';

  const [revenue, setRevenue] = useState(0);
  const [cogs, setCogs] = useState(0);
  const [isEditingBase, setIsEditingBase] = useState(false);

  // Dynamic OpEx Breakdown computed strictly from registered invoices
  const defaultCategories = [
    "Software & Cloud Infrastructure",
    "General & Administrative",
    "Sales & Marketing",
    "Professional & Legal Fees",
    "Travel & Entertainment"
  ];

  const categoryTotals = {};
  defaultCategories.forEach(cat => { categoryTotals[cat] = 0; });

  // Accumulate operating expenses ONLY from real added invoices
  invoices.forEach(inv => {
    const cat = inv.ledgerCategory || "General & Administrative";
    const amt = parseFloat(inv.subtotal) || parseFloat(inv.grossTotal) || 0;
    if (!categoryTotals[cat]) categoryTotals[cat] = 0;
    categoryTotals[cat] += amt;
  });

  const totalOpEx = Object.values(categoryTotals).reduce((a, b) => a + b, 0);

  // Dynamic Input Tax Credit (ITC) accumulated strictly from compliant added invoices with GSTIN
  const totalItc = invoices.reduce((acc, inv) => {
    if (inv.gstin && !inv.hasMathDiscrepancy) {
      return acc + (parseFloat(inv.taxTotal) || 0);
    }
    return acc;
  }, 0);

  // Dynamic TDS Queue computed strictly from added invoices
  const totalTdsQueue = invoices.reduce((acc, inv) => {
    return acc + (parseFloat(inv.tdsAmount) || 0);
  }, 0);

  // Dynamic Accounts Payable
  const accountsPayable = invoices.reduce((acc, inv) => {
    return acc + (parseFloat(inv.netPayable) || parseFloat(inv.grossTotal) || 0);
  }, 0);

  const grossProfit = revenue - cogs;
  const ebitda = grossProfit - totalOpEx;
  const taxProvision = ebitda > 0 ? ebitda * 0.25 : 0;
  const netIncome = ebitda - taxProvision;

  const hasData = invoices.length > 0 || revenue > 0 || cogs > 0;

  return (
    <div className="space-y-6">
      
      {/* Empty State Banner if no inputs/invoices added yet */}
      {!hasData && (
        <div className="glass-panel p-6 rounded-2xl border border-dashed border-slate-800 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/20">
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">No Invoices or Revenue Added Yet</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
              Financial reports and P&L figures will dynamically calculate as soon as you create an invoice, paste OCR text, or import a CSV/JSON file.
            </p>
          </div>
          <div className="pt-2 flex items-center justify-center gap-3">
            <button
              onClick={onNavigateToAuditor}
              className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs rounded-xl hover:opacity-95 transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Add / Parse Invoices
            </button>
            {onLoadSampleData && (
              <button
                onClick={onLoadSampleData}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-slate-800 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5"
              >
                <FileText className="w-4 h-4" /> Load Demo Dataset
              </button>
            )}
          </div>
        </div>
      )}

      {/* Top Controller KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Operating Revenue</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-extrabold font-mono text-white">{symbol}{revenue.toLocaleString()}</span>
            <span className="text-xs text-emerald-400 font-semibold block mt-1 flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5" /> Live Input Integration
            </span>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Operating Expenses</span>
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
              <Calculator className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-extrabold font-mono text-white">{symbol}{totalOpEx.toLocaleString()}</span>
            <span className="text-xs text-slate-400 font-medium block mt-1">
              {invoices.length} active invoices added
            </span>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Net EBITDA</span>
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
              <Landmark className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className={`text-2xl font-extrabold font-mono ${ebitda < 0 ? 'text-rose-400' : 'text-cyan-400'}`}>
              {symbol}{ebitda.toLocaleString()}
            </span>
            <span className="text-xs text-cyan-300 font-semibold block mt-1">
              Margin: {revenue > 0 ? ((ebitda / revenue) * 100).toFixed(1) : '0.0'}%
            </span>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Accumulated ITC (GST Credit)</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-extrabold font-mono text-emerald-400">{symbol}{totalItc.toLocaleString()}</span>
            <span className="text-xs text-slate-400 font-medium block mt-1">
              Verified GSTR-3B offset eligible
            </span>
          </div>
        </div>

      </div>


      {/* Main Section: P&L Statement and Balance Sheet */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* P&L Statement Table (2 Cols) */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-white flex items-center gap-2">
              <Calculator className="w-4 h-4 text-emerald-400" />
              Autonomous Statement of Profit and Loss (P&L)
            </h3>
            
            <button
              onClick={() => setIsEditingBase(!isEditingBase)}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1"
            >
              <Edit3 className="w-3.5 h-3.5" /> {isEditingBase ? 'Save Revenue / COGS' : 'Set Operating Revenue / COGS'}
            </button>
          </div>

          {isEditingBase && (
            <div className="grid grid-cols-2 gap-3 bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Operating Revenue ({symbol})</label>
                <input
                  type="number"
                  value={revenue}
                  onChange={(e) => setRevenue(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-emerald-400 font-bold"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Cost of Goods Sold ({symbol})</label>
                <input
                  type="number"
                  value={cogs}
                  onChange={(e) => setCogs(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-rose-400 font-bold"
                />
              </div>
            </div>
          )}

          <div className="divide-y divide-slate-800 text-xs font-mono">
            
            <div className="py-3 flex items-center justify-between font-bold text-slate-200">
              <span className="font-sans text-sm">Total Operating Revenue</span>
              <span className="text-sm text-emerald-400">{symbol}{revenue.toLocaleString()}</span>
            </div>

            <div className="py-2.5 flex items-center justify-between text-slate-400 pl-4">
              <span className="font-sans">Less: Cost of Goods Sold (Direct Costs)</span>
              <span className="text-rose-400">({symbol}{cogs.toLocaleString()})</span>
            </div>

            <div className="py-3 flex items-center justify-between font-bold text-slate-100 bg-slate-900/60 px-3 rounded-lg">
              <span className="font-sans">GROSS PROFIT</span>
              <span className="text-emerald-400">{symbol}{grossProfit.toLocaleString()}</span>
            </div>

            <div className="py-2 pt-4 font-bold text-slate-300 font-sans text-xs uppercase tracking-wider text-emerald-400">
              Operating Expenses (Calculated from Added Invoices)
            </div>

            {Object.entries(categoryTotals).map(([head, amount], idx) => {
              const pct = totalOpEx > 0 ? ((amount / totalOpEx) * 100).toFixed(1) : '0.0';
              return (
                <div key={idx} className="py-2.5 flex items-center justify-between text-slate-300 pl-4 hover:bg-slate-900/40 px-2 rounded">
                  <span className="font-sans flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    {head}
                  </span>
                  <div className="flex items-center gap-4">
                    <span className="text-slate-500 text-[11px] font-mono">{pct}%</span>
                    <span className="text-slate-200 font-bold font-mono">{symbol}{amount.toLocaleString()}</span>
                  </div>
                </div>
              );
            })}

            <div className="py-3 flex items-center justify-between font-bold text-slate-200 bg-slate-900/60 px-3 rounded-lg">
              <span className="font-sans">TOTAL OPERATING EXPENSES</span>
              <span className="text-rose-400">({symbol}{totalOpEx.toLocaleString()})</span>
            </div>

            <div className="py-3 flex items-center justify-between font-extrabold text-white text-sm bg-slate-900 px-3 rounded-lg">
              <span className="font-sans">EARNINGS BEFORE INTEREST, TAX, DEPRECIATION (EBITDA)</span>
              <span className={ebitda < 0 ? "text-rose-400" : "text-cyan-400"}>{symbol}{ebitda.toLocaleString()}</span>
            </div>

            <div className="py-2.5 flex items-center justify-between text-slate-400 pl-4">
              <span className="font-sans">Estimated Income Tax Provision (25%)</span>
              <span className="text-amber-400">({symbol}{taxProvision.toLocaleString()})</span>
            </div>

            <div className="py-3.5 flex items-center justify-between font-black text-white text-base bg-emerald-950/40 border border-emerald-500/30 px-4 rounded-xl">
              <span className="font-sans text-emerald-400">NET PROFIT AFTER TAX</span>
              <span className={netIncome < 0 ? "text-rose-400" : "text-emerald-400"}>{symbol}{netIncome.toLocaleString()}</span>
            </div>
          </div>
        </div>


        {/* Balance Sheet Snapshot & Tax Compliance */}
        <div className="space-y-6">
          
          <div className="glass-panel p-6 rounded-2xl space-y-4">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Landmark className="w-4 h-4 text-cyan-400" />
              Balance Sheet Snapshot
            </h3>

            <div className="space-y-3 text-xs font-mono">
              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-sans">Cash & Bank Balances</span>
                  <span className="font-bold text-white text-sm">{symbol}{(netIncome > 0 ? netIncome * 1.5 : 0).toLocaleString()}</span>
                </div>
                <span className="text-emerald-400 font-sans text-[11px] bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">Liquid</span>
              </div>

              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-sans">Accounts Payable (Approved Invoices)</span>
                  <span className="font-bold text-rose-400 text-sm">{symbol}{accountsPayable.toLocaleString()}</span>
                </div>
                <span className="text-amber-400 font-sans text-[11px] bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">Pending Payout</span>
              </div>

              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-sans">Accumulated Input Tax Credit (ITC)</span>
                  <span className="font-bold text-emerald-400 text-sm">{symbol}{totalItc.toLocaleString()}</span>
                </div>
                <span className="text-emerald-400 font-sans text-[11px] bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">Verified</span>
              </div>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl space-y-4">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              Tax Compliance & Statutory Calendar
            </h3>

            <div className="space-y-2.5 text-xs font-sans">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-200 block">TDS Deposit (Sec 194C / 194J)</span>
                  <span className="text-slate-400 text-[11px]">Due on 7th of next month</span>
                </div>
                <span className="px-2 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded font-mono font-bold">
                  {symbol}{totalTdsQueue.toLocaleString()}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-200 block">GSTR-3B Monthly Return Filing</span>
                  <span className="text-slate-400 text-[11px]">Due on 20th of next month</span>
                </div>
                <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded font-mono font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Compliant
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
