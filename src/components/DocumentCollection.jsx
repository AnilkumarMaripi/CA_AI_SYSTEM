import React, { useState } from 'react';
import { FolderCheck, Plus, Copy, Check, ExternalLink, FileText, UploadCloud, ShieldCheck, XCircle, Search, Filter } from 'lucide-react';
import CustomSelect from './CustomSelect';

export default function DocumentCollection({ documents = [], clients = [], onRequestDocument, onUpdateDocStatus }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [copiedToken, setCopiedToken] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    client_id: '',
    doc_name: '',
    doc_type: 'Sales Register'
  });

  const handleCopyLink = (token) => {
    const publicUrl = `${window.location.origin}/#/public/upload/${token}`;
    navigator.clipboard.writeText(publicUrl);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 2500);
  };

  const handleSubmitRequest = (e) => {
    e.preventDefault();
    if (!formData.client_id || !formData.doc_name) {
      alert("Please select a client and enter document name.");
      return;
    }
    onRequestDocument(formData);
    setIsModalOpen(false);
    setFormData({ client_id: '', doc_name: '', doc_type: 'Sales Register' });
  };

  const filteredDocs = documents.filter(d => {
    const q = searchQuery.toLowerCase();
    const clientObj = clients.find(c => c.id === d.client_id);
    const clientName = clientObj ? clientObj.name.toLowerCase() : '';

    const matchesSearch = 
      (d.doc_name || '').toLowerCase().includes(q) ||
      (d.doc_type || '').toLowerCase().includes(q) ||
      clientName.includes(q);

    if (!matchesSearch) return false;
    if (statusFilter !== 'ALL' && d.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6 max-w-full">
      
      {/* Header Banner */}
      <div className="glass-panel p-5 sm:p-6 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="eyebrow">Document Checklist · Token Portal</div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#141416] tracking-tight">
            Statutory <span className="gradient-text-orange font-extrabold">Document Collection</span>
          </h2>
          <p className="text-xs text-[#8b847a] mt-1 font-medium max-w-xl">
            Request documents from clients with zero-login token upload links for WhatsApp/Email sharing.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="nav-cta"
        >
          <Plus className="w-4 h-4" />
          <span>Request Document from Client</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-panel p-4 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#8b847a] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search document name, client..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#f5efe2] border border-[#dad2bf] rounded-full pl-9 pr-4 py-2 text-xs text-[#141416] placeholder-[#8b847a] focus:outline-none focus:border-[#d9351f] font-medium min-h-[38px]"
          />
        </div>

        <div className="flex items-center space-x-1 font-semibold text-xs overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
          {['ALL', 'Requested', 'Uploaded', 'Verified', 'Rejected'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-1.5 rounded-full transition-all whitespace-nowrap min-h-[34px] border ${
                statusFilter === st 
                  ? 'bg-emerald-500/20 text-emerald-300 font-bold border-emerald-500/40 shadow-sm' 
                  : 'text-slate-400 hover:text-emerald-300 hover:bg-emerald-500/12 hover:border-emerald-500/30 border-transparent'
              }`}
            >
              {st}
            </button>
          ))}

        </div>
      </div>

      {/* Document List Table */}
      <div className="glass-panel rounded-3xl overflow-hidden shadow-sm">
        <div className="table-responsive-container">
          <table className="w-full text-left text-xs font-sans min-w-[700px]">
            <thead>
              <tr className="border-b border-[#dad2bf] bg-[#ede6d6]/70 text-[#8b847a] uppercase tracking-wider text-[10px] font-bold">
                <th className="py-3.5 px-4">Document Title / Type</th>
                <th className="py-3.5 px-3">Client Entity</th>
                <th className="py-3.5 px-3">Status</th>
                <th className="py-3.5 px-3">Client Upload Link (No Login)</th>
                <th className="py-3.5 px-4 text-right">Verification Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#dad2bf]/60">
              {filteredDocs.map(doc => {
                const clientObj = clients.find(c => c.id === doc.client_id);
                const clientName = clientObj ? clientObj.name : 'Client';

                return (
                  <tr key={doc.id} className="hover:bg-[#ede6d6]/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[#141416] block">{doc.doc_name}</div>
                      <span className="text-[10px] text-[#8b847a] font-mono">Type: {doc.doc_type || 'General'}</span>
                    </td>

                    <td className="py-3.5 px-3 font-semibold text-[#2b2b30]">{clientName}</td>

                    <td className="py-3.5 px-3 font-mono">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        doc.status === 'Uploaded' ? 'bg-[#e85a2b]/10 text-[#d9351f] border-[#e85a2b]/30' :
                        doc.status === 'Verified' ? 'bg-emerald-500/10 text-emerald-700 border-emerald-500/30' :
                        doc.status === 'Rejected' ? 'bg-[#d9351f]/10 text-[#d9351f] border-[#d9351f]/30' :
                        'bg-amber-500/10 text-amber-700 border-amber-500/30'
                      }`}>
                        {doc.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-3">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleCopyLink(doc.token)}
                          className="px-3 py-1 bg-[#141416] text-[#fafaf7] hover:bg-[#2b2b30] rounded-full text-[11px] font-bold transition-all flex items-center gap-1 font-mono min-h-[30px]"
                        >
                          {copiedToken === doc.token ? <Check className="w-3.5 h-3.5 text-[#fdc68a]" /> : <Copy className="w-3.5 h-3.5" />}
                          {copiedToken === doc.token ? 'Link Copied!' : 'Copy Token Link'}
                        </button>
                        <a
                          href={`/#/public/upload/${doc.token}`}
                          target="_blank"
                          rel="noreferrer"
                          title="Open Client Portal Preview"
                          className="p-1 text-[#8b847a] hover:text-[#d9351f]"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <CustomSelect
                        value={doc.status}
                        onChange={(val) => onUpdateDocStatus(doc.id, val)}
                        variant="pill"
                        className="w-40 ml-auto"
                        options={[
                          { value: 'Requested', label: 'Requested' },
                          { value: 'Uploaded', label: 'Uploaded' },
                          { value: 'Verified', label: 'Verified (Approved)' },
                          { value: 'Rejected', label: 'Rejected' }
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

      {/* Modal: Request New Document */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-[95vw] sm:max-w-xl rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6 font-sans">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-base font-extrabold text-white">Request Document from Client</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white p-1">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitRequest} className="space-y-5 text-sm">
              <div>
                <label className="text-slate-300 font-bold block mb-2 text-xs uppercase tracking-wider">Select Client *</label>
                <CustomSelect
                  value={formData.client_id}
                  onChange={(val) => setFormData({ ...formData, client_id: val })}
                  placeholder="-- Choose Client --"
                  options={clients.map(c => ({ value: c.id, label: `${c.name} (${c.pan})` }))}
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-2 text-xs uppercase tracking-wider">Document Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. August 2026 Purchase Register & GSTR-2B"
                  value={formData.doc_name}
                  onChange={(e) => setFormData({ ...formData, doc_name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-2 text-xs uppercase tracking-wider">Document Category</label>
                <CustomSelect
                  value={formData.doc_type}
                  onChange={(val) => setFormData({ ...formData, doc_type: val })}
                  options={[
                    { value: 'Sales Register', label: 'Sales Register' },
                    { value: 'Purchase Register', label: 'Purchase Register' },
                    { value: 'Bank Statement', label: 'Bank Statement' },
                    { value: 'Form 26AS / AIS', label: 'Form 26AS / AIS' },
                    { value: 'Financial Statements', label: 'Financial Statements' }
                  ]}
                />
              </div>

              <div className="pt-5 border-t border-slate-800 flex items-center justify-end space-x-3">
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
                  Generate Upload Token
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
