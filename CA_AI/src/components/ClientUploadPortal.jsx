import React, { useEffect, useState } from 'react';
import { UploadCloud, CheckCircle2, ShieldCheck, AlertCircle, FileText, Lock, ArrowUpRight } from 'lucide-react';
import { documentsApi } from '../services/api';

export default function ClientUploadPortal({ token }) {
  const [tokenInfo, setTokenInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (token) {
      documentsApi.getPublicTokenInfo(token)
        .then(data => {
          setTokenInfo(data);
          setLoading(false);
        })
        .catch(err => {
          setErrorMsg(err.message || "Invalid or expired upload link.");
          setLoading(false);
        });
    }
  }, [token]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      alert("Please select a file to upload.");
      return;
    }

    setUploading(true);
    try {
      await documentsApi.uploadPublicFile(token, selectedFile);
      setUploading(false);
      setUploadSuccess(true);
    } catch (err) {
      setUploading(false);
      alert(err.message || "File upload failed.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5efe2] flex items-center justify-center p-4 text-[#8b847a] font-mono text-xs">
        Connecting to TaxDesk Client Portal...
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="min-h-screen bg-[#f5efe2] flex items-center justify-center p-4">
        <div className="bg-[#faf5eb] border border-[#d9351f]/40 p-6 rounded-3xl max-w-md w-full text-center space-y-3 shadow-xl">
          <AlertCircle className="w-10 h-10 text-[#d9351f] mx-auto" />
          <h2 className="text-base font-bold text-[#141416]">Upload Link Invalid or Expired</h2>
          <p className="text-xs text-[#8b847a]">{errorMsg}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5efe2] flex flex-col justify-center items-center p-4 sm:p-6 font-sans">
      
      <div className="w-full max-w-lg bg-[#faf5eb] border border-[#dad2bf] rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        
        {/* Brand Header */}
        <div className="flex items-center justify-between border-b border-[#dad2bf] pb-4">
          <div className="flex items-center space-x-2.5">
            <span className="logo-dot"></span>
            <div>
              <h1 className="text-base font-extrabold text-[#141416]">TaxDesk Secure Portal</h1>
              <span className="text-[10px] text-[#8b847a] font-mono">Encrypted Client Document Drop</span>
            </div>
          </div>

          <span className="px-3 py-1 rounded-full bg-[#ede6d6] text-[#d9351f] border border-[#dad2bf] font-mono text-[10px] font-bold">
            No Login Required
          </span>
        </div>

        {/* Client & Requested Document Context Card */}
        <div className="bg-[#f5efe2] border border-[#dad2bf] p-4 rounded-2xl space-y-2 text-xs">
          <span className="text-[10px] text-[#8b847a] font-bold uppercase tracking-wider block">Document Request For</span>
          <h2 className="text-sm font-extrabold text-[#141416]">{tokenInfo.client_name}</h2>
          
          <div className="pt-2 border-t border-[#dad2bf] flex items-center justify-between text-xs font-mono">
            <div>
              <span className="text-[#8b847a] block text-[10px]">Requested Document</span>
              <strong className="text-[#d9351f] font-bold">{tokenInfo.doc_name}</strong>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-[#ede6d6] border border-[#dad2bf] text-[#2b2b30] text-[10px] font-bold">
              {tokenInfo.doc_type || 'Register'}
            </span>
          </div>
        </div>

        {uploadSuccess ? (
          <div className="p-6 bg-[#edfbf4] border border-emerald-500/40 rounded-2xl text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-700 mx-auto" />
            <h3 className="text-base font-bold text-[#141416]">Document Uploaded Successfully!</h3>
            <p className="text-xs text-[#8b847a]">
              Your Chartered Accountant has been notified. You can safely close this page.
            </p>
          </div>
        ) : (
          <form onSubmit={handleUploadSubmit} className="space-y-4">
            
            <div className="border-2 border-dashed border-[#dad2bf] hover:border-[#d9351f] rounded-2xl p-6 text-center space-y-3 transition-colors bg-[#f5efe2]">
              <UploadCloud className="w-10 h-10 text-[#d9351f] mx-auto" />
              
              <div>
                <span className="text-xs font-bold text-[#141416] block">Choose file from phone or computer</span>
                <span className="text-[11px] text-[#8b847a] font-mono mt-1 block">
                  Supports PDF, Excel (.xlsx, .csv), Images (.png, .jpg)
                </span>
              </div>

              <input
                type="file"
                onChange={handleFileChange}
                className="hidden"
                id="mobile-file-input"
              />

              <label
                htmlFor="mobile-file-input"
                className="inline-block px-4 py-2 bg-[#ede6d6] hover:bg-[#dad2bf] text-[#141416] text-xs font-bold rounded-full border border-[#dad2bf] cursor-pointer transition-all min-h-[36px]"
              >
                {selectedFile ? `Selected: ${selectedFile.name}` : 'Browse Files'}
              </label>
            </div>

            <button
              type="submit"
              disabled={uploading || !selectedFile}
              className="nav-cta w-full justify-center min-h-[44px]"
            >
              <span>{uploading ? 'Encrypting & Uploading...' : 'Upload Document to CA Firm'}</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>

          </form>
        )}

      </div>
    </div>
  );
}
