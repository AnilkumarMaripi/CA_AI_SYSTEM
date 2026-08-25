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
      <div className="glass-panel p-5 sm:p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 font-mono">Document Checklist · Token Portal</div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Statutory <span className="text-emerald-600 font-extrabold">Document Collection</span>
          </h2>
          <p className="text-xs text-slate-600 mt-1 font-medium max-w-xl">
            Request documents from clients with zero-login token upload links for WhatsApp/Email sharing.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 min-h-[42px]"
        >
          <Plus className="w-4 h-4" />
          <span>Request Document from Client</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-panel p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search document name, client..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 font-medium min-h-[38px]"
          />
        </div>

        <div className="flex items-center space-x-1 font-semibold text-xs overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
          {['ALL', 'Requested', 'Uploaded', 'Verified', 'Rejected'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-1.5 rounded-xl transition-all whitespace-nowrap min-h-[34px] border ${
                statusFilter === st 
                  ? 'bg-emerald-600 text-white font-bold border-emerald-600 shadow-sm' 
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200 border-slate-200'
              }`}
            >
              {st}
            </button>
          ))}

        </div>
      </div>

      {/* Document List Table */}
      <div className="glass-panel rounded-2xl overflow-hidden shadow-sm">
        <div className="table-responsive-container">
          <table className="w-full text-left text-xs font-sans min-w-[700px]">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 uppercase tracking-wider text-[10px] font-bold">
                <th className="py-3.5 px-4">Document Title / Type</th>
                <th className="py-3.5 px-3">Client Entity</th>
                <th className="py-3.5 px-3">Status</th>
                <th className="py-3.5 px-3">Client Upload Link (No Login)</th>
                <th className="py-3.5 px-4 text-right">Verification Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDocs.map(doc => {
                const clientObj = clients.find(c => c.id === doc.client_id);
                const clientName = clientObj ? clientObj.name : 'Client';

                return (
                  <tr key={doc.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 block">{doc.doc_name}</div>
                      <span className="text-[10px] text-slate-500 font-mono">Type: {doc.doc_type || 'General'}</span>
                    </td>

                    <td className="py-3.5 px-3 font-semibold text-slate-800">{clientName}</td>

                    <td className="py-3.5 px-3 font-mono">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        doc.status === 'Uploaded' ? 'bg-cyan-50 text-cyan-700 border-cyan-200' :
                        doc.status === 'Verified' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        doc.status === 'Rejected' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                        'bg-amber-50 text-amber-700 border-amber-200'
                      }`}>
                        {doc.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-3">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleCopyLink(doc.token)}
                          className="px-3 py-1 bg-slate-900 text-white hover:bg-slate-800 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 font-mono min-h-[30px]"
                        >
                          {copiedToken === doc.token ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          {copiedToken === doc.token ? 'Link Copied!' : 'Copy Token Link'}
                        </button>
                        <a
                          href={`/#/public/upload/${doc.token}`}
                          target="_blank"
                          rel="noreferrer"
                          title="Open Client Portal Preview"
                          className="p-1 text-slate-400 hover:text-emerald-600"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <CustomSelect
                        value={doc.status}
                        onChange={(val) => onUpdateDocStatus(doc.id, val)}
                        variant="cream"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/40 backdrop-blur-md">
          <div className="bg-white border border-slate-200 w-full max-w-[95vw] sm:max-w-xl rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6 font-sans">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <h3 className="text-base font-extrabold text-slate-900">Request Document from Client</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700 p-1">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitRequest} className="space-y-5 text-sm">
              <div>
                <label className="text-slate-700 font-bold block mb-2 text-xs uppercase tracking-wider">Select Client *</label>
                <CustomSelect
                  value={formData.client_id}
                  onChange={(val) => setFormData({ ...formData, client_id: val })}
                  placeholder="-- Choose Client --"
                  variant="cream"
                  options={clients.map(c => ({ value: c.id, label: `${c.name} (${c.pan})` }))}
                />
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-2 text-xs uppercase tracking-wider">Document Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. August 2026 Purchase Register & GSTR-2B"
                  value={formData.doc_name}
                  onChange={(e) => setFormData({ ...formData, doc_name: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-xl p-3 text-sm text-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-2 text-xs uppercase tracking-wider">Document Category</label>
                <CustomSelect
                  value={formData.doc_type}
                  onChange={(val) => setFormData({ ...formData, doc_type: val })}
                  variant="cream"
                  options={[
                    { value: 'Sales Register', label: 'Sales Register' },
                    { value: 'Purchase Register', label: 'Purchase Register' },
                    { value: 'Bank Statement', label: 'Bank Statement' },
                    { value: 'Form 26AS / AIS', label: 'Form 26AS / AIS' },
                    { value: 'Financial Statements', label: 'Financial Statements' }
                  ]}
                />
              </div>

              <div className="pt-5 border-t border-slate-200 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all"
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
