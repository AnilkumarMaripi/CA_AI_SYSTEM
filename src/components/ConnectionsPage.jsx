import React, { useState } from 'react';
import { Search, UserCheck, UserPlus, ShieldCheck, MapPin, Award, Filter, Check, X } from 'lucide-react';

export default function ConnectionsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpec, setSelectedSpec] = useState('ALL');

  const [pendingRequests, setPendingRequests] = useState([
    { id: 'pr1', name: 'Sneha Roy', handle: '@sneha_compliance', spec: 'GST Specialist', location: 'Mumbai', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&q=80' },
    { id: 'pr2', name: 'Rohan Deshmukh', handle: '@rohan_ca', spec: 'Income Tax & Transfer Pricing', location: 'Pune', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80' },
  ]);

  const [caDirectory, setCaDirectory] = useState([
    { id: 'ca1', name: 'CA Rajesh Sharma, FCA', handle: '@ca_rajesh', title: 'Senior Managing Partner', membership: 'ICAI Membership #40291', spec: 'GST & Customs', location: 'Delhi NCR', rating: '4.9 ⭐', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80', isConnected: true },
    { id: 'ca2', name: 'CA Priya Mehta, ACA', handle: '@priya_tax', title: 'Corporate Audit Lead', membership: 'ICAI Membership #58210', spec: 'Corporate Audit', location: 'Bengaluru', rating: '4.95 ⭐', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80', isConnected: true },
    { id: 'ca3', name: 'CA Vikram Verma, FCA', handle: '@ca_vikram', title: 'Statutory Auditor', membership: 'ICAI Membership #31049', spec: 'Statutory Audit', location: 'Chennai', rating: '4.88 ⭐', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80', isConnected: false },
    { id: 'ca4', name: 'CA Ananya Sen', handle: '@ananya_sen', title: 'International Tax Consultant', membership: 'ICAI Membership #61942', spec: 'Income Tax', location: 'Kolkata', rating: '4.92 ⭐', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&q=80', isConnected: false },
  ]);

  const handleAccept = (id) => {
    const accepted = pendingRequests.find(r => r.id === id);
    if (accepted) {
      setCaDirectory([
        ...caDirectory,
        {
          id: 'ca_' + Date.now(),
          name: accepted.name,
          handle: accepted.handle,
          title: 'Practicing Member',
          membership: 'ICAI Membership Verified',
          spec: accepted.spec,
          location: accepted.location,
          rating: '5.0 ⭐',
          avatar: accepted.avatar,
          isConnected: true
        }
      ]);
      setPendingRequests(pendingRequests.filter(r => r.id !== id));
    }
  };

  const handleReject = (id) => {
    setPendingRequests(pendingRequests.filter(r => r.id !== id));
  };

  const toggleConnection = (id) => {
    setCaDirectory(caDirectory.map(ca => ca.id === id ? { ...ca, isConnected: !ca.isConnected } : ca));
  };

  const filteredCAs = caDirectory.filter(ca => {
    const matchesSearch = ca.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          ca.handle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          ca.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          ca.spec.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpec = selectedSpec === 'ALL' || ca.spec.toLowerCase().includes(selectedSpec.toLowerCase());
    return matchesSearch && matchesSpec;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6 font-sans">
      
      {/* Header Banner */}
      <div className="glass-panel p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2 font-display">
            <UserCheck className="w-5 h-5 text-[#6366f1]" />
            CA Connections & Expert Network Directory
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Connect with verified ICAI Chartered Accountants, Tax Consultants, and Audit Specialists.
          </p>
        </div>

        {/* Live Search Bar */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by Name, @ca_handle, GST, Audit..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#09090b] border border-[#1f1f23] rounded-xl py-2 pl-9 pr-4 text-xs text-white font-mono outline-none focus:border-[#6366f1]"
          />
        </div>
      </div>

      {/* Pending Consultation / Connection Requests */}
      {pendingRequests.length > 0 && (
        <div className="glass-panel-glow p-5 rounded-2xl space-y-3">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center justify-between">
            <span className="flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-[#818cf8]" />
              Pending Consultation & Connection Requests
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-[#6366f1] text-white text-[10px] font-mono font-bold">
              {pendingRequests.length} New
            </span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {pendingRequests.map(req => (
              <div key={req.id} className="bg-[#09090b]/80 p-3.5 rounded-xl border border-[#1f1f23] flex items-center justify-between gap-3">
                <div className="flex items-center space-x-3">
                  <img src={req.avatar} alt={req.name} className="w-10 h-10 rounded-full border border-slate-700 object-cover shrink-0" />
                  <div>
                    <span className="text-xs font-bold text-white block">{req.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{req.handle} • {req.spec}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    onClick={() => handleAccept(req.id)}
                    className="p-1.5 bg-[#22c55e] text-white rounded-lg hover:bg-emerald-600 transition-colors"
                    title="Confirm Request"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleReject(req.id)}
                    className="p-1.5 bg-[#18181c] text-slate-400 rounded-lg hover:bg-rose-950 hover:text-rose-400 transition-colors"
                    title="Deny Request"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Category Specialization Filter Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none font-mono text-xs">
        <span className="text-slate-500 font-bold flex items-center gap-1 shrink-0"><Filter className="w-3.5 h-3.5" /> Filter:</span>
        {['ALL', 'GST', 'Income Tax', 'Audit', 'Corporate'].map(spec => (
          <button
            key={spec}
            onClick={() => setSelectedSpec(spec)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 ${
              selectedSpec === spec ? 'bg-[#6366f1] text-white shadow-lg' : 'bg-[#121215] text-slate-400 border border-[#1f1f23] hover:text-white'
            }`}
          >
            {spec}
          </button>
        ))}
      </div>

      {/* Discover CA Network Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        {filteredCAs.map(ca => (
          <div key={ca.id} className="glass-panel p-5 rounded-2xl space-y-4 hover:border-slate-700 transition-colors">
            
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <img src={ca.avatar} alt={ca.name} className="w-12 h-12 rounded-2xl border border-slate-700 object-cover shrink-0" />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm font-bold text-white">{ca.name}</h3>
                    <ShieldCheck className="w-4 h-4 text-[#22c55e] shrink-0" />
                  </div>
                  <p className="text-[11px] text-slate-400 font-mono">{ca.title}</p>
                  <p className="text-[10px] text-[#818cf8] font-mono flex items-center gap-1 mt-0.5">
                    <Award className="w-3 h-3" /> {ca.membership}
                  </p>
                </div>
              </div>

              <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold font-mono border border-amber-500/20 shrink-0">
                {ca.rating}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs font-mono border-t border-[#1f1f23] pt-3">
              <div className="flex items-center gap-1 text-slate-400">
                <MapPin className="w-3.5 h-3.5 text-[#6366f1]" />
                <span>{ca.location}</span>
              </div>

              <span className="px-2.5 py-0.5 rounded-full bg-[#6366f1]/10 text-[#818cf8] text-[10px] font-bold border border-[#6366f1]/30">
                #{ca.spec}
              </span>
            </div>

            <button
              onClick={() => toggleConnection(ca.id)}
              className={`w-full py-2.5 rounded-xl font-bold font-mono text-xs transition-all flex items-center justify-center space-x-1.5 ${
                ca.isConnected
                  ? 'bg-[#18181c] text-emerald-400 border border-emerald-500/30'
                  : 'bg-gradient-to-r from-[#6366f1] to-[#4f46e5] text-white hover:brightness-110 shadow-md'
              }`}
            >
              <span>{ca.isConnected ? '✓ Connected' : 'Connect +'}</span>
            </button>

          </div>
        ))}
      </div>

    </div>
  );
}
