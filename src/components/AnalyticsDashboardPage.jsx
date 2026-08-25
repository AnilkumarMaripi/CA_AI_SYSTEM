import React, { useState } from 'react';
import { BarChart3, Zap, Eye, Star, FolderCheck, ShieldCheck, Lock, ArrowUpRight } from 'lucide-react';

export default function AnalyticsDashboardPage() {
  const [isCaAccount, setIsCaAccount] = useState(true);

  const metrics = [
    { label: 'Client Reach / Impressions', value: '24,850', change: '+18.4%', icon: Zap, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
    { label: 'Profile Views', value: '3,420', change: '+12.1%', icon: Eye, color: 'text-[#818cf8]', bg: 'bg-[#6366f1]/10 border-[#6366f1]/20' },
    { label: 'Ratings & Stars', value: '4.95 / 5.0', change: '48 Reviews', icon: Star, color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20' },
    { label: 'Consultations Completed', value: '142', change: '+24 This Month', icon: FolderCheck, color: 'text-[#22c55e]', bg: 'bg-emerald-500/10 border-emerald-500/20' }
  ];

  const taxInterests = [
    { tag: '#GST Compliance & ITC Claims', percent: 45, count: '1,120 Queries', color: 'bg-[#6366f1]' },
    { tag: '#IncomeTax & Form 16 Deductions', percent: 30, count: '748 Queries', color: 'bg-emerald-500' },
    { tag: '#Audit & Company Law Filings', percent: 25, count: '620 Queries', color: 'bg-amber-500' }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6 font-sans">
      
      {/* Header Banner */}
      <div className="glass-panel p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2 font-display">
            <BarChart3 className="w-5 h-5 text-[#6366f1]" />
            CA Practice Analytics & Client Reach Dashboard
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Real-time practice performance metrics, consultation reach, and audience tax interest distribution.
          </p>
        </div>

        <button
          onClick={() => setIsCaAccount(!isCaAccount)}
          className="btn-black py-1.5 px-3 text-xs font-mono shrink-0 self-start sm:self-auto"
        >
          Toggle Gate: {isCaAccount ? 'Verified CA View' : 'Client Gate View'}
        </button>
      </div>

      {/* Account Lock Gate Banner for non-CA accounts */}
      {!isCaAccount && (
        <div className="glass-panel-alert p-6 rounded-3xl space-y-3 relative overflow-hidden border border-rose-500/30">
          <div className="flex items-start space-x-3">
            <div className="p-3 rounded-2xl bg-rose-500/20 text-rose-400 shrink-0">
              <Lock className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">CA Practice Analytics Gate</h3>
              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                Full analytics, client reach metrics, and query distribution reports are reserved for verified ICAI Chartered Accountants and Tax Consultants.
              </p>
              <div className="pt-2">
                <button className="book-cta text-xs py-2 px-4 bg-gradient-to-r from-rose-500 to-rose-600 border-rose-500">
                  <span>Verify ICAI Membership Credentials</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4 Executive Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, idx) => {
          const IconComp = m.icon;
          return (
            <div key={idx} className={`glass-panel p-5 rounded-2xl space-y-3 border ${m.bg}`}>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">{m.label}</span>
                <IconComp className={`w-4 h-4 ${m.color}`} />
              </div>

              <div>
                <span className="text-2xl sm:text-3xl font-extrabold font-mono text-white block">{m.value}</span>
                <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1 mt-0.5">
                  <span className="text-[#22c55e] font-bold">{m.change}</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Audience Tax Interest Distribution */}
      <div className="glass-panel p-6 rounded-3xl space-y-6">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center justify-between border-b border-[#1f1f23] pb-3">
          <span>Audience Tax Interest & Query Breakdown</span>
          <span className="text-xs text-[#818cf8]">2,488 Total Inquiries</span>
        </h3>

        <div className="space-y-4">
          {taxInterests.map((item, idx) => (
            <div key={idx} className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-white font-bold">{item.tag}</span>
                <span className="text-slate-400">{item.count} ({item.percent}%)</span>
              </div>

              <div className="w-full h-3 bg-[#09090b] rounded-full overflow-hidden border border-[#1f1f23] p-0.5">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${item.color}`}
                  style={{ width: `${item.percent}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
