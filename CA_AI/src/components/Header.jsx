import React from 'react';
import { ShieldCheck, Scale, Cpu, AlertTriangle, FileText, CheckCircle2, DollarSign, Calculator } from 'lucide-react';

export default function Header({ 
  currency, 
  setCurrency, 
  auditedCount, 
  discrepanciesCount, 
  itcTotal, 
  activeTab, 
  setActiveTab 
}) {
  const currencySymbol = currency === 'INR' ? '₹' : currency === 'USD' ? '$' : '€';

  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Identity */}
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-600 to-cyan-500 p-0.5 shadow-lg shadow-emerald-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Scale className="w-6 h-6 text-emerald-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                  TaxPilot <span className="text-emerald-400 font-extrabold">AI</span>
                </h1>
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> CA Verified Engine
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                Autonomous Chartered Accountant & AI Finance Controller
              </p>
            </div>
          </div>

          {/* Nav Tabs */}
          <nav className="hidden md:flex space-x-1 bg-slate-900/90 p-1.5 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('auditor')}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-2 ${
                activeTab === 'auditor'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-900/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <FileText className="w-4 h-4" />
              Invoice & Audit Engine
            </button>
            <button
              onClick={() => setActiveTab('controller')}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-2 ${
                activeTab === 'controller'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-900/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Calculator className="w-4 h-4" />
              Financial Reports & P&L
            </button>
            <button
              onClick={() => setActiveTab('rules')}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-2 ${
                activeTab === 'rules'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-900/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Cpu className="w-4 h-4" />
              Audit Rules & Tax Heads
            </button>
          </nav>

          {/* Quick Controls & Status */}
          <div className="flex items-center space-x-3">
            {/* Zero Math Error Badge */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-slate-300 font-mono">Arithmetic Tolerance: 0.00</span>
            </div>

            {/* Currency Selector */}
            <div className="bg-slate-900 p-1 rounded-lg border border-slate-800 flex items-center text-xs">
              {['INR', 'USD', 'EUR'].map((c) => (
                <button
                  key={c}
                  onClick={() => setCurrency(c)}
                  className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${
                    currency === c
                      ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {c === 'INR' ? '₹ INR' : c === 'USD' ? '$ USD' : '€ EUR'}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Mobile Navigation Tabs */}
        <div className="md:hidden flex space-x-1 pb-3 overflow-x-auto">
          <button
            onClick={() => setActiveTab('auditor')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 ${
              activeTab === 'auditor' ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-slate-400'
            }`}
          >
            <FileText className="w-3.5 h-3.5" /> Auditor
          </button>
          <button
            onClick={() => setActiveTab('controller')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 ${
              activeTab === 'controller' ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-slate-400'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" /> P&L / Reports
          </button>
          <button
            onClick={() => setActiveTab('rules')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 ${
              activeTab === 'rules' ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-slate-400'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" /> Rules
          </button>
        </div>

      </div>
    </header>
  );
}
