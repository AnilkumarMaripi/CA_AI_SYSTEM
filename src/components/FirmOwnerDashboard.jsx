import React, { useEffect, useState } from 'react';
import { BarChart3, Users, Calendar, AlertTriangle, CheckCircle2, ShieldCheck, TrendingUp, UserCheck, Building2 } from 'lucide-react';
import { analyticsApi } from '../services/api';

export default function FirmOwnerDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyticsApi.getOverview()
      .then(res => {
        setData(res);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-400 font-mono text-xs">
        Gathering Practice Analytics & Firm Metrics...
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans max-w-full">
      
      {/* Header Banner */}
      <div className="glass-panel p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-600 shrink-0" />
            Executive Firm Owner Analytics & Practice Overview
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Key practice metrics for CA Firm Partners — filing completion rates, staff workload allocation, and overdue risk tracking.
          </p>
        </div>
        <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-bold font-mono self-start sm:self-auto shrink-0">
          Live Partner View
        </span>
      </div>

      {/* 4 Primary Executive Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-1 shadow-sm">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Total Practice Clients</span>
          <span className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-900">{data?.total_clients || 0}</span>
        </div>

        <div className="bg-amber-50 border border-amber-200 p-5 rounded-2xl space-y-1 shadow-sm">
          <span className="text-[10px] text-amber-700 font-bold uppercase tracking-wider block">Deadlines Due This Week</span>
          <span className="text-2xl sm:text-3xl font-extrabold font-mono text-amber-700">{data?.tasks_due_this_week || 0}</span>
        </div>

        <div className="bg-rose-50 border border-rose-200 p-5 rounded-2xl space-y-1 shadow-sm">
          <span className="text-[10px] text-rose-700 font-bold uppercase tracking-wider block flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" /> Overdue Filings
          </span>
          <span className="text-2xl sm:text-3xl font-extrabold font-mono text-rose-700">{data?.overdue_count || 0}</span>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-2xl space-y-1 shadow-sm">
          <span className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider block">Filing Completion Rate</span>
          <span className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-700 flex items-baseline gap-1">
            <span>{data?.completion_rate_percentage || 100}</span>
            <small className="text-sm">%</small>
          </span>
        </div>

      </div>

      {/* Staff Workload Allocation & Client Category Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Staff Workload */}
        <div className="glass-panel p-5 sm:p-6 rounded-2xl space-y-4">
          <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-200 pb-3">
            <UserCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            Staff Workload & Task Allocation
          </h3>

          <div className="space-y-3">
            {(data?.staff_workload || []).map((staff, idx) => (
              <div key={idx} className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 text-xs block">{staff.full_name}</span>
                  <span className="text-[10px] text-slate-500 uppercase font-mono">Role: {staff.role}</span>
                </div>

                <div className="text-right">
                  <span className="text-xs sm:text-sm font-bold font-mono text-emerald-700">{staff.assigned_tasks_count} Tasks</span>
                  <span className="text-[10px] text-slate-500 block">Assigned</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Client Category Distribution */}
        <div className="glass-panel p-5 sm:p-6 rounded-2xl space-y-4">
          <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-200 pb-3">
            <Building2 className="w-4 h-4 text-cyan-600 shrink-0" />
            Client Portfolio by Entity Category
          </h3>

          <div className="grid grid-cols-2 gap-3">
            {Object.entries(data?.client_category_distribution || {}).map(([cat, count]) => (
              <div key={cat} className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">{cat}</span>
                <span className="text-xl font-bold font-mono text-slate-900">{count}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
