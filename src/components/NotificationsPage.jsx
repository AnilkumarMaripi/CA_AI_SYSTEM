import React, { useState } from 'react';
import { Bell, UserPlus, AlertCircle, CheckCircle2, MessageSquare, Check, X, Trash2 } from 'lucide-react';

export default function NotificationsPage() {
  const [requests, setRequests] = useState([
    { id: 'nr1', name: 'CA Rohan Deshmukh', handle: '@rohan_ca', time: '10 mins ago', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80', spec: 'Income Tax Consultant' },
    { id: 'nr2', name: 'Sneha Roy', handle: '@sneha_tax', time: '1 hour ago', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&q=80', spec: 'GST Practitioner' }
  ]);

  const [alerts, setAlerts] = useState([
    { id: 'al1', title: 'GSTR-3B Filing Deadline', desc: 'Filing deadline for February GSTR-3B is approaching on 20th.', type: 'COMPLIANCE', time: '2 hours ago', icon: AlertCircle, color: 'text-amber-400' },
    { id: 'al2', title: 'Post Starred', desc: 'CA Priya Mehta starred your post "#GST Input Tax Credit Rule 42 Clarification".', type: 'INTERACTION', time: '4 hours ago', icon: CheckCircle2, color: 'text-[#6366f1]' },
    { id: 'al3', title: 'System Compliance Verification', desc: 'Your ICAI Membership record was re-verified for AY 2026-27.', type: 'SYSTEM', time: '1 day ago', icon: CheckCircle2, color: 'text-[#22c55e]' }
  ]);

  const handleAcceptRequest = (id) => {
    setRequests(requests.filter(r => r.id !== id));
  };

  const handleDenyRequest = (id) => {
    setRequests(requests.filter(r => r.id !== id));
  };

  const clearAllAlerts = () => {
    setAlerts([]);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-sans">
      
      {/* Header Banner */}
      <div className="glass-panel p-5 rounded-2xl flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2 font-display">
            <Bell className="w-5 h-5 text-[#6366f1]" />
            Notifications & Statutory Compliance Alerts
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Real-time consultation requests, regulatory updates, and platform activity.
          </p>
        </div>

        {alerts.length > 0 && (
          <button
            onClick={clearAllAlerts}
            className="btn-black py-1.5 px-3 text-xs flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Mark All Read</span>
          </button>
        )}
      </div>

      {/* Section 1: Follow & Consultation Requests */}
      {requests.length > 0 && (
        <div className="glass-panel p-5 rounded-2xl space-y-3 border-l-4 border-l-[#6366f1]">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center justify-between">
            <span className="flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-[#818cf8]" />
              Follow & Consultation Requests
            </span>
            <span className="px-2 py-0.5 rounded-full bg-[#6366f1] text-white text-[10px] font-mono font-bold">
              {requests.length} Pending
            </span>
          </h3>

          <div className="space-y-2">
            {requests.map(req => (
              <div key={req.id} className="bg-[#09090b] p-3.5 rounded-xl border border-[#1f1f23] flex items-center justify-between gap-3">
                <div className="flex items-center space-x-3">
                  <img src={req.avatar} alt={req.name} className="w-10 h-10 rounded-full border border-slate-700 object-cover shrink-0" />
                  <div>
                    <span className="text-xs font-bold text-white block">{req.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{req.handle} • {req.spec} • {req.time}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    onClick={() => handleAcceptRequest(req.id)}
                    className="px-3 py-1.5 bg-[#6366f1] hover:bg-indigo-600 text-white rounded-lg text-xs font-bold font-mono transition-colors flex items-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Accept</span>
                  </button>

                  <button
                    onClick={() => handleDenyRequest(req.id)}
                    className="px-3 py-1.5 bg-[#18181c] text-slate-400 hover:text-white rounded-lg text-xs font-bold font-mono transition-colors flex items-center gap-1"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Deny</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Section 2: Regulatory & Tax Alerts */}
      <div className="glass-panel p-5 rounded-2xl space-y-3">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center justify-between border-b border-[#1f1f23] pb-3">
          <span>Regulatory & System Alerts</span>
          <span className="text-[10px] text-slate-400 font-mono">{alerts.length} Alerts</span>
        </h3>

        {alerts.length === 0 ? (
          <div className="p-8 text-center text-slate-500 font-mono text-xs">
            ✓ All notifications and regulatory alerts are up to date.
          </div>
        ) : (
          <div className="space-y-3">
            {alerts.map(al => {
              const IconComponent = al.icon;
              return (
                <div key={al.id} className="bg-[#09090b] p-4 rounded-xl border border-[#1f1f23] flex items-start space-x-3 hover:border-slate-700 transition-colors">
                  <div className={`p-2 rounded-xl bg-white/5 ${al.color} shrink-0 mt-0.5`}>
                    <IconComponent className="w-4 h-4" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-white">{al.title}</h4>
                      <span className="text-[10px] text-slate-500 font-mono">{al.time}</span>
                    </div>
                    <p className="text-xs text-slate-300 font-sans mt-0.5 leading-relaxed">{al.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
