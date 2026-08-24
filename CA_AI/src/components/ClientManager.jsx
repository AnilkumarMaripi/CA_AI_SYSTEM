import React, { useState } from 'react';
import { Users, Plus, Search, Filter, Building2, UserCheck, ShieldCheck, Edit2, Trash2, Eye, Mail, Phone, ExternalLink, X } from 'lucide-react';

import CustomSelect from './CustomSelect';

export default function ClientManager({ clients = [], onCreateClient, onUpdateClient, onDeleteClient, onOpenClientDashboard }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [entityFilter, setEntityFilter] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    pan: '',
    gstin: '',
    entity_type: 'Company',
    filing_frequency: 'Monthly',
    is_audit_required: true,
    contact_person: '',
    email: '',
    phone: ''
  });

  const handleOpenCreate = () => {
    setEditingClient(null);
    setFormData({
      name: '',
      pan: '',
      gstin: '',
      entity_type: 'Company',
      filing_frequency: 'Monthly',
      is_audit_required: true,
      contact_person: '',
      email: '',
      phone: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (client) => {
    setEditingClient(client);
    setFormData({
      name: client.name || '',
      pan: client.pan || '',
      gstin: client.gstin || '',
      entity_type: client.entity_type || 'Company',
      filing_frequency: client.filing_frequency || 'Monthly',
      is_audit_required: client.is_audit_required ?? false,
      contact_person: client.contact_person || '',
      email: client.email || '',
      phone: client.phone || ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.pan || !formData.email) {
      alert("Please fill in Client Name, PAN, and Email.");
      return;
    }

    if (editingClient) {
      onUpdateClient(editingClient.id, formData);
    } else {
      onCreateClient(formData);
    }
    setIsModalOpen(false);
  };

  const filteredClients = clients.filter(c => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      (c.name || '').toLowerCase().includes(query) ||
      (c.pan || '').toLowerCase().includes(query) ||
      (c.gstin || '').toLowerCase().includes(query) ||
      (c.contact_person || '').toLowerCase().includes(query);

    if (!matchesSearch) return false;
    if (entityFilter !== 'ALL' && c.entity_type !== entityFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6 max-w-full">
      
      {/* Top Header & Action Controls */}
      <div className="glass-panel p-4 sm:p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-400 shrink-0" />
            Client Directory & Entity Management
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage practice clients, entity classifications, GSTIN/PAN records, and statutory compliance status.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="w-full sm:w-auto px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-extrabold text-xs rounded-xl hover:opacity-95 transition-all shadow-lg flex items-center justify-center gap-1.5 min-h-[42px]"
        >
          <Plus className="w-4 h-4" /> Add New Practice Client
        </button>
      </div>

      {/* Search & Category Filter Toolbar */}
      <div className="glass-panel p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-3">
        
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search client name, PAN, GSTIN, contact..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-medium min-h-[38px]"
          />
        </div>

        <div className="flex items-center space-x-1 font-semibold text-xs overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
          {[
            { id: 'ALL', label: 'All Entities', count: clients.length },
            { id: 'Company', label: 'Companies', count: clients.filter(c => c.entity_type === 'Company').length },
            { id: 'LLP', label: 'LLPs', count: clients.filter(c => c.entity_type === 'LLP').length },
            { id: 'Firm', label: 'Partnership Firms', count: clients.filter(c => c.entity_type === 'Firm').length },
            { id: 'Individual', label: 'Individuals', count: clients.filter(c => c.entity_type === 'Individual').length },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setEntityFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 min-h-[36px] ${
                entityFilter === tab.id
                  ? 'bg-slate-800 text-emerald-400 font-bold border border-emerald-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>{tab.label}</span>
              <span className="px-1.5 py-0.2 text-[10px] rounded bg-slate-950 text-slate-400 font-mono">
                {tab.count}
              </span>
            </button>
          ))}
        </div>

      </div>

      {/* Data-Dense Client Table */}
      <div className="glass-panel rounded-2xl overflow-hidden">
        <div className="table-responsive-container">
          <table className="w-full text-left text-xs font-mono min-w-[700px]">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950 text-slate-400 uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Client / Entity Name</th>
                <th className="py-3 px-3">Entity Type</th>
                <th className="py-3 px-3">PAN</th>
                <th className="py-3 px-3">GSTIN</th>
                <th className="py-3 px-3">Audit Case</th>
                <th className="py-3 px-3">Contact Person</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filteredClients.map(client => (
                <tr key={client.id} className="hover:bg-slate-900/60 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-8 h-8 rounded-lg bg-slate-800 text-emerald-400 font-bold flex items-center justify-center text-xs shrink-0 font-mono border border-slate-700">
                        {client.name.charAt(0)}
                      </div>
                      <div>
                        <span className="font-bold text-white block hover:text-emerald-400 transition-colors cursor-pointer" onClick={() => onOpenClientDashboard(client)}>
                          {client.name}
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono">{client.email}</span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border font-mono ${
                      client.entity_type === 'Company' ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' :
                      client.entity_type === 'LLP' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30' :
                      client.entity_type === 'Firm' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
                      'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    }`}>
                      {client.entity_type}
                    </span>
                  </td>

                  <td className="py-3 px-3 font-mono font-bold text-slate-200">{client.pan}</td>
                  
                  <td className="py-3 px-3 font-mono text-xs">
                    {client.gstin ? (
                      <span className="text-emerald-400 font-bold">{client.gstin}</span>
                    ) : (
                      <span className="text-slate-500 text-[10px]">Unregistered</span>
                    )}
                  </td>

                  <td className="py-3 px-3">
                    {client.is_audit_required ? (
                      <span className="px-2 py-0.5 bg-rose-500/10 text-rose-400 border border-rose-500/30 rounded text-[10px] font-bold">
                        Tax Audit Required
                      </span>
                    ) : (
                      <span className="text-slate-500 text-[10px]">Non-Audit</span>
                    )}
                  </td>

                  <td className="py-3 px-3 text-xs text-slate-300">
                    <div className="font-semibold">{client.contact_person || 'N/A'}</div>
                    <div className="text-[10px] text-slate-500 font-mono">{client.phone || ''}</div>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end space-x-1">
                      <button
                        onClick={() => onOpenClientDashboard(client)}
                        title="View 360° Client Dashboard"
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded-lg text-[11px] font-bold transition-colors flex items-center gap-1 min-h-[30px]"
                      >
                        <Eye className="w-3.5 h-3.5" /> 360° View
                      </button>
                      <button
                        onClick={() => handleOpenEdit(client)}
                        title="Edit Client"
                        className="p-1.5 text-slate-400 hover:text-white transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete client ${client.name}?`)) {
                            onDeleteClient(client.id);
                          }
                        }}
                        title="Delete Client"
                        className="p-1.5 text-slate-400 hover:text-rose-400 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Client Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-[95vw] sm:max-w-3xl rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col">
            
            <div className="p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between shrink-0">
              <h3 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-2.5">
                <Building2 className="w-5 h-5 text-emerald-400 shrink-0" />
                {editingClient ? `Edit Client: ${editingClient.name}` : 'Register New Practice Client'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white p-1.5 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6 text-sm font-sans overflow-y-auto flex-1">
              <div>
                <label className="text-slate-300 font-bold block mb-2 text-xs uppercase tracking-wider">Entity / Client Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Acme Technologies Private Limited"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white font-semibold focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="text-slate-300 font-bold block mb-2 text-xs uppercase tracking-wider">PAN Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. AAACT1234F"
                    value={formData.pan}
                    onChange={(e) => setFormData({ ...formData, pan: e.target.value.toUpperCase() })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-emerald-400 font-mono font-bold focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-2 text-xs uppercase tracking-wider">GSTIN Number</label>
                  <input
                    type="text"
                    placeholder="e.g. 27AAACT1234F1Z5"
                    value={formData.gstin}
                    onChange={(e) => setFormData({ ...formData, gstin: e.target.value.toUpperCase() })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-emerald-400 font-mono font-bold focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                <div>
                  <label className="text-slate-300 font-bold block mb-2 text-xs uppercase tracking-wider">Entity Type</label>
                  <CustomSelect
                    value={formData.entity_type}
                    onChange={(val) => setFormData({ ...formData, entity_type: val })}
                    options={[
                      { value: 'Company', label: 'Company' },
                      { value: 'LLP', label: 'LLP' },
                      { value: 'Firm', label: 'Partnership Firm' },
                      { value: 'Individual', label: 'Individual / Proprietor' }
                    ]}
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-2 text-xs uppercase tracking-wider">GST Filing Frequency</label>
                  <CustomSelect
                    value={formData.filing_frequency}
                    onChange={(val) => setFormData({ ...formData, filing_frequency: val })}
                    options={[
                      { value: 'Monthly', label: 'Monthly' },
                      { value: 'Quarterly', label: 'Quarterly (QRMP)' }
                    ]}
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-2 text-xs uppercase tracking-wider">Tax Audit Case?</label>
                  <CustomSelect
                    value={formData.is_audit_required ? "YES" : "NO"}
                    onChange={(val) => setFormData({ ...formData, is_audit_required: val === "YES" })}
                    options={[
                      { value: 'YES', label: 'Yes (Audit Case)' },
                      { value: 'NO', label: 'No (Non-Audit)' }
                    ]}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                <div>
                  <label className="text-slate-300 font-bold block mb-2 text-xs uppercase tracking-wider">Contact Person</label>
                  <input
                    type="text"
                    placeholder="e.g. Rohan Gupta"
                    value={formData.contact_person}
                    onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-2 text-xs uppercase tracking-wider">Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="client@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-2 text-xs uppercase tracking-wider">Phone Number</label>
                  <input
                    type="text"
                    placeholder="+91 98200 00000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-slate-800/80 flex items-center justify-end space-x-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-yellow px-6 py-2.5 text-xs font-extrabold"
                >
                  {editingClient ? 'Save Client Updates' : 'Create Client Record'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
