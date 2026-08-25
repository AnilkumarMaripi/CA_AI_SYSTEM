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
          <h2 className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-600 shrink-0" />
            Client Directory & Entity Management
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Manage practice clients, entity classifications, GSTIN/PAN records, and statutory compliance status.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="w-full sm:w-auto px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 min-h-[42px]"
        >
          <Plus className="w-4 h-4" /> Add New Practice Client
        </button>
      </div>

      {/* Search & Category Filter Toolbar */}
      <div className="glass-panel p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-3">
        
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search client name, PAN, GSTIN, contact..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 font-medium min-h-[38px]"
          />
        </div>

        <div className="flex items-center space-x-1.5 font-semibold text-xs overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
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
              className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap shrink-0 min-h-[36px] border ${
                entityFilter === tab.id
                  ? 'bg-emerald-600 text-white font-bold border-emerald-600 shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900 border-slate-200'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`px-2 py-0.5 text-[10px] rounded-full font-mono font-bold ${
                entityFilter === tab.id ? 'bg-emerald-800 text-white' : 'bg-white text-slate-700 border border-slate-200'
              }`}>
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
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 uppercase tracking-wider text-[10px] font-bold">
                <th className="py-3 px-4">Client / Entity Name</th>
                <th className="py-3 px-3">Entity Type</th>
                <th className="py-3 px-3">PAN</th>
                <th className="py-3 px-3">GSTIN</th>
                <th className="py-3 px-3">Audit Case</th>
                <th className="py-3 px-3">Contact Person</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {filteredClients.map(client => (
                <tr key={client.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 font-bold flex items-center justify-center text-xs shrink-0 font-mono border border-emerald-200">
                        {client.name.charAt(0)}
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 block hover:text-emerald-600 transition-colors cursor-pointer" onClick={() => onOpenClientDashboard(client)}>
                          {client.name}
                        </span>
                        <span className="text-[11px] text-slate-500 font-mono">{client.email}</span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border font-mono ${
                      client.entity_type === 'Company' ? 'bg-cyan-50 text-cyan-700 border-cyan-200' :
                      client.entity_type === 'LLP' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                      client.entity_type === 'Firm' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                      'bg-emerald-50 text-emerald-700 border-emerald-200'
                    }`}>
                      {client.entity_type}
                    </span>
                  </td>

                  <td className="py-3 px-3 font-mono font-bold text-slate-800">{client.pan}</td>
                  
                  <td className="py-3 px-3 font-mono text-xs">
                    {client.gstin ? (
                      <span className="text-emerald-700 font-bold">{client.gstin}</span>
                    ) : (
                      <span className="text-slate-400 text-[10px]">Unregistered</span>
                    )}
                  </td>

                  <td className="py-3 px-3">
                    {client.is_audit_required ? (
                      <span className="px-2.5 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-full text-[10px] font-bold">
                        Tax Audit Required
                      </span>
                    ) : (
                      <span className="text-slate-400 text-[10px]">Non-Audit</span>
                    )}
                  </td>

                  <td className="py-3 px-3 text-xs text-slate-700">
                    <div className="font-semibold text-slate-900">{client.contact_person || 'N/A'}</div>
                    <div className="text-[10px] text-slate-500 font-mono">{client.phone || ''}</div>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end space-x-1">
                      <button
                        onClick={() => onOpenClientDashboard(client)}
                        title="View 360° Client Dashboard"
                        className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-[11px] font-bold transition-colors flex items-center gap-1 min-h-[30px]"
                      >
                        <Eye className="w-3.5 h-3.5" /> 360° View
                      </button>
                      <button
                        onClick={() => handleOpenEdit(client)}
                        title="Edit Client"
                        className="p-1.5 text-slate-500 hover:text-slate-900 transition-colors"
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
                        className="p-1.5 text-slate-500 hover:text-rose-600 transition-colors"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/40 backdrop-blur-md overflow-y-auto">
          <div className="bg-white border border-slate-200 w-full max-w-[95vw] sm:max-w-3xl rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col">
            
            <div className="p-5 sm:p-6 border-b border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
              <h3 className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center gap-2.5">
                <Building2 className="w-5 h-5 text-emerald-600 shrink-0" />
                {editingClient ? `Edit Client: ${editingClient.name}` : 'Register New Practice Client'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6 text-sm font-sans overflow-y-auto flex-1">
              <div>
                <label className="text-slate-700 font-bold block mb-2 text-xs uppercase tracking-wider">Entity / Client Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Acme Technologies Private Limited"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-xl p-3 text-sm text-slate-900 font-semibold focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="text-slate-700 font-bold block mb-2 text-xs uppercase tracking-wider">PAN Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. AAACT1234F"
                    value={formData.pan}
                    onChange={(e) => setFormData({ ...formData, pan: e.target.value.toUpperCase() })}
                    className="w-full bg-white border border-slate-300 rounded-xl p-3 text-sm text-emerald-700 font-mono font-bold focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-slate-700 font-bold block mb-2 text-xs uppercase tracking-wider">GSTIN Number</label>
                  <input
                    type="text"
                    placeholder="e.g. 27AAACT1234F1Z5"
                    value={formData.gstin}
                    onChange={(e) => setFormData({ ...formData, gstin: e.target.value.toUpperCase() })}
                    className="w-full bg-white border border-slate-300 rounded-xl p-3 text-sm text-emerald-700 font-mono font-bold focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                <div>
                  <label className="text-slate-700 font-bold block mb-2 text-xs uppercase tracking-wider">Entity Type</label>
                  <CustomSelect
                    value={formData.entity_type}
                    onChange={(val) => setFormData({ ...formData, entity_type: val })}
                    variant="cream"
                    options={[
                      { value: 'Company', label: 'Company' },
                      { value: 'LLP', label: 'LLP' },
                      { value: 'Firm', label: 'Partnership Firm' },
                      { value: 'Individual', label: 'Individual / Proprietor' }
                    ]}
                  />
                </div>

                <div>
                  <label className="text-slate-700 font-bold block mb-2 text-xs uppercase tracking-wider">GST Filing Frequency</label>
                  <CustomSelect
                    value={formData.filing_frequency}
                    onChange={(val) => setFormData({ ...formData, filing_frequency: val })}
                    variant="cream"
                    options={[
                      { value: 'Monthly', label: 'Monthly' },
                      { value: 'Quarterly', label: 'Quarterly (QRMP)' }
                    ]}
                  />
                </div>

                <div>
                  <label className="text-slate-700 font-bold block mb-2 text-xs uppercase tracking-wider">Tax Audit Case?</label>
                  <CustomSelect
                    value={formData.is_audit_required ? "YES" : "NO"}
                    onChange={(val) => setFormData({ ...formData, is_audit_required: val === "YES" })}
                    variant="cream"
                    options={[
                      { value: 'YES', label: 'Yes (Audit Case)' },
                      { value: 'NO', label: 'No (Non-Audit)' }
                    ]}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                <div>
                  <label className="text-slate-700 font-bold block mb-2 text-xs uppercase tracking-wider">Contact Person</label>
                  <input
                    type="text"
                    placeholder="e.g. Rohan Gupta"
                    value={formData.contact_person}
                    onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl p-3 text-sm text-slate-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-slate-700 font-bold block mb-2 text-xs uppercase tracking-wider">Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="client@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl p-3 text-sm text-slate-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-slate-700 font-bold block mb-2 text-xs uppercase tracking-wider">Phone Number</label>
                  <input
                    type="text"
                    placeholder="+91 98200 00000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl p-3 text-sm text-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-slate-200 flex items-center justify-end space-x-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold rounded-xl shadow-md transition-all"
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
