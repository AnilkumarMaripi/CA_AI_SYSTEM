import React, { useState } from 'react';
import { Calendar, Filter, Search, ShieldAlert, CheckCircle2, Clock, AlertTriangle, RefreshCw, Send, Layers } from 'lucide-react';
import CustomSelect from './CustomSelect';

export default function ComplianceCalendar({ tasks = [], onUpdateTaskStatus, onGenerateAllDeadlines }) {
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [urgencyFilter, setUrgencyFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateClick = async () => {
    setIsGenerating(true);
    await onGenerateAllDeadlines();
    setIsGenerating(false);
  };

  const filteredTasks = tasks.filter(t => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = 
      (t.title || '').toLowerCase().includes(q) ||
      (t.client_name || '').toLowerCase().includes(q) ||
      (t.recurring_rule || '').toLowerCase().includes(q);

    if (!matchesSearch) return false;
    if (categoryFilter !== 'ALL' && t.category !== categoryFilter) return false;
    if (urgencyFilter !== 'ALL' && t.urgency !== urgencyFilter && !(urgencyFilter === 'FILED' && t.status === 'Filed')) return false;

    return true;
  });

  const overdueCount = tasks.filter(t => t.urgency === 'OVERDUE' && t.status !== 'Filed').length;
  const dueSoonCount = tasks.filter(t => t.urgency === 'DUE_SOON' && t.status !== 'Filed').length;

  return (
    <div className="space-y-6 max-w-full">
      
      {/* Header Banner & Auto-Engine Trigger */}
      <div className="glass-panel p-4 sm:p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-400 shrink-0" />
              Compliance Calendar & Statutory Recurring Engine
            </h2>
            {overdueCount > 0 && (
              <span className="px-2.5 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[10px] font-bold font-mono animate-pulse">
                {overdueCount} OVERDUE
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Automated recurring deadline generation engine (GST, TDS, ITR, ROC) with statutory urgency tracking.
          </p>
        </div>

        <button
          onClick={handleGenerateClick}
          disabled={isGenerating}
          className="w-full sm:w-auto px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-extrabold text-xs rounded-xl hover:opacity-95 transition-all shadow-md flex items-center justify-center gap-1.5 min-h-[42px]"
        >
          <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
          <span>{isGenerating ? 'Generating Deadlines...' : 'Run Auto Deadline Generator'}</span>
        </button>
      </div>

      {/* Metric Urgency Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total Deadlines</span>
          <span className="text-xl font-extrabold font-mono text-white">{tasks.length}</span>
        </div>

        <div className="bg-rose-500/10 border border-rose-500/30 p-4 rounded-2xl">
          <span className="text-[10px] text-rose-400 font-bold uppercase tracking-wider block flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" /> Overdue
          </span>
          <span className="text-xl font-extrabold font-mono text-rose-400">{overdueCount}</span>
        </div>

        <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-2xl">
          <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> Due ≤ 3 Days
          </span>
          <span className="text-xl font-extrabold font-mono text-amber-400">{dueSoonCount}</span>
        </div>

        <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-2xl">
          <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Filed Returns
          </span>
          <span className="text-xl font-extrabold font-mono text-emerald-400">{tasks.filter(t => t.status === 'Filed').length}</span>
        </div>
      </div>

      {/* Search & Category Filter Controls */}
      <div className="glass-panel p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-3">
        
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search task, client, GSTR-1, TDS..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-medium min-h-[38px]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto text-xs font-semibold">
          {/* Category Filter Pills */}
          <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800 overflow-x-auto max-w-full">
            {['ALL', 'GST', 'TDS', 'ITR', 'ROC'].map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1 rounded-lg transition-all min-h-[30px] border ${
                  categoryFilter === cat 
                    ? 'bg-emerald-500/20 text-emerald-300 font-bold border-emerald-500/40 shadow-sm' 
                    : 'text-slate-400 hover:text-emerald-300 hover:bg-emerald-500/12 hover:border-emerald-500/30 border-transparent'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Urgency Filter Pills */}
          <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800 overflow-x-auto max-w-full">
            {['ALL', 'OVERDUE', 'DUE_SOON', 'UPCOMING', 'FILED'].map(urg => (
              <button
                key={urg}
                onClick={() => setUrgencyFilter(urg)}
                className={`px-3 py-1 rounded-lg transition-all min-h-[30px] border ${
                  urgencyFilter === urg 
                    ? 'bg-emerald-500/20 text-emerald-300 font-bold border-emerald-500/40 shadow-sm' 
                    : 'text-slate-400 hover:text-emerald-300 hover:bg-emerald-500/12 hover:border-emerald-500/30 border-transparent'
                }`}
              >
                {urg.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Compliance Task Table View */}
      <div className="glass-panel rounded-2xl overflow-hidden">
        <div className="table-responsive-container">
          <table className="w-full text-left text-xs font-mono min-w-[700px]">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950 text-slate-400 uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Compliance Task Title</th>
                <th className="py-3 px-3">Client Entity</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Due Date</th>
                <th className="py-3 px-3">Urgency Status</th>
                <th className="py-3 px-3">Assigned Staff</th>
                <th className="py-3 px-4 text-right">Filing Status Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filteredTasks.map(task => {
                const isOverdue = task.urgency === 'OVERDUE' && task.status !== 'Filed';
                const isDueSoon = task.urgency === 'DUE_SOON' && task.status !== 'Filed';

                return (
                  <tr key={task.id} className={`hover:bg-slate-900/60 transition-colors ${
                    isOverdue ? 'bg-rose-500/5' : isDueSoon ? 'bg-amber-500/5' : ''
                  }`}>
                    
                    <td className="py-3 px-4">
                      <div className="font-bold text-white block">{task.title}</div>
                      <span className="text-[10px] text-slate-500 font-mono">Rule: {task.recurring_rule || 'Statutory'}</span>
                    </td>

                    <td className="py-3 px-3 font-semibold text-slate-200">
                      {task.client_name || 'Practice Client'}
                    </td>

                    <td className="py-3 px-3 font-mono">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                        task.category === 'GST' ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' :
                        task.category === 'TDS' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
                        task.category === 'ITR' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                        'bg-indigo-500/10 text-indigo-400 border-indigo-500/30'
                      }`}>
                        {task.category}
                      </span>
                    </td>

                    <td className="py-3 px-3 font-mono text-xs font-bold text-white">
                      {new Date(task.due_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>

                    <td className="py-3 px-3">
                      {task.status === 'Filed' ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono">
                          ✓ FILED
                        </span>
                      ) : isOverdue ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30 font-mono flex items-center gap-1 w-max">
                          <AlertTriangle className="w-3 h-3" /> OVERDUE
                        </span>
                      ) : isDueSoon ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 font-mono flex items-center gap-1 w-max">
                          <Clock className="w-3 h-3" /> DUE ≤ 3 DAYS
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                          UPCOMING
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-3 text-xs text-slate-300 font-mono">
                      {task.assigned_user_names && task.assigned_user_names.length > 0 ? (
                        <span className="text-emerald-400 font-semibold">{task.assigned_user_names.join(', ')}</span>
                      ) : (
                        <span className="text-slate-500 text-[10px]">Unassigned</span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <CustomSelect
                        value={task.status}
                        onChange={(val) => onUpdateTaskStatus(task.id, val)}
                        variant="pill"
                        className="w-36 ml-auto"
                        options={[
                          { value: 'Pending', label: 'Pending' },
                          { value: 'In Progress', label: 'In Progress' },
                          { value: 'Filed', label: 'Filed (Completed)' }
                        ]}
                      />
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
