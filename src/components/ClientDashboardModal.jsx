import React, { useEffect, useState } from 'react';
import { X, Building2, Calendar, FileText, CheckCircle2, AlertTriangle, Clock, ShieldCheck, Mail, Phone, ExternalLink } from 'lucide-react';
import { clientsApi } from '../services/api';

export default function ClientDashboardModal({ client, onClose }) {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (client) {
      setLoading(true);
      clientsApi.getDashboard(client.id)
        .then(data => {
          setDashboardData(data);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [client]);

  if (!client) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/40 backdrop-blur-md overflow-y-auto">
      <div className="bg-white border border-slate-200 w-full max-w-[95vw] sm:max-w-4xl rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col space-y-0 font-sans">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-50 text-emerald-700 font-bold flex items-center justify-center text-base sm:text-lg font-mono border border-emerald-200 shrink-0">
              {client.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xs sm:text-base font-extrabold text-slate-900 line-clamp-1">{client.name}</h3>
                <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-mono border border-slate-200 hidden sm:inline-block">
                  {client.entity_type}
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-slate-500 font-mono">
                PAN: <strong className="text-slate-800">{client.pan}</strong> | GSTIN: <strong className="text-emerald-700">{client.gstin || "Unregistered"}</strong>
              </p>
            </div>
          </div>

          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1">
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Modal Content Body */}
        <div className="p-4 sm:p-6 space-y-6 text-xs font-sans overflow-y-auto flex-1">
          
          {loading ? (
            <div className="p-8 text-center text-slate-500 font-mono">Loading 360° Client Analytics...</div>
          ) : (
            <>
              {/* Stat Metric Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-slate-50 border border-slate-200 p-3 sm:p-4 rounded-xl">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Pending Filings</span>
                  <span className="text-lg sm:text-xl font-bold font-mono text-cyan-700">{dashboardData?.pending_tasks || 0}</span>
                </div>

                <div className="bg-rose-50 border border-rose-200 p-3 sm:p-4 rounded-xl">
                  <span className="text-[10px] text-rose-700 font-bold uppercase tracking-wider block">Overdue Filings</span>
                  <span className="text-lg sm:text-xl font-bold font-mono text-rose-700">{dashboardData?.overdue_tasks || 0}</span>
                </div>

                <div className="bg-emerald-50 border border-emerald-200 p-3 sm:p-4 rounded-xl">
                  <span className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider block">Filed Returns</span>
                  <span className="text-lg sm:text-xl font-bold font-mono text-emerald-700">{dashboardData?.filed_tasks || 0}</span>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-3 sm:p-4 rounded-xl">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Uploaded Docs</span>
                  <span className="text-lg sm:text-xl font-bold font-mono text-slate-900">
                    {dashboardData?.document_status?.uploaded_verified || 0} / {(dashboardData?.document_status?.requested || 0) + (dashboardData?.document_status?.uploaded_verified || 0)}
                  </span>
                </div>
              </div>

              {/* Client Information Summary */}
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Entity & Contact Profile</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Contact Person</span>
                    <span className="text-slate-900 font-semibold">{client.contact_person || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Email Address</span>
                    <span className="text-emerald-700 font-semibold break-all">{client.email}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Phone Number</span>
                    <span className="text-slate-700 font-semibold">{client.phone || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Statutory Compliance Deadlines List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-emerald-600 shrink-0" />
                    Automated Compliance Deadlines
                  </h4>
                  <span className="text-[11px] text-slate-500 font-mono">
                    Total: {dashboardData?.total_compliance_tasks || 0}
                  </span>
                </div>

                <div className="space-y-2">
                  {(dashboardData?.recent_tasks || []).map(task => (
                    <div key={task.id} className="bg-white border border-slate-200 p-3 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:border-slate-300 transition-colors">
                      <div className="flex items-start sm:items-center space-x-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono shrink-0 ${
                          task.category === 'GST' ? 'bg-cyan-50 text-cyan-700 border border-cyan-200' :
                          task.category === 'TDS' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                          task.category === 'ITR' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                          'bg-indigo-50 text-indigo-700 border border-indigo-200'
                        }`}>
                          {task.category}
                        </span>

                        <div>
                          <span className="font-bold text-slate-900 block">{task.title}</span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            Rule: {task.recurring_rule || 'Statutory'} | Due: <strong className="text-slate-800">{new Date(task.due_date).toLocaleDateString()}</strong>
                          </span>
                        </div>
                      </div>

                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border font-mono self-start sm:self-auto ${
                        task.status === 'Filed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        task.urgency === 'OVERDUE' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                        task.urgency === 'DUE_SOON' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                        'bg-slate-100 text-slate-700 border-slate-200'
                      }`}>
                        {task.status === 'Filed' ? '✓ FILED' : task.urgency === 'OVERDUE' ? '✕ OVERDUE' : task.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </>
          )}

        </div>
      </div>
    </div>
  );
}
