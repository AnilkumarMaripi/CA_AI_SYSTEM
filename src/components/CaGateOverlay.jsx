import React, { useState } from 'react';
import { ShieldAlert, Award, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function CaGateOverlay({ onVerifyCa, onGoToLogin }) {
  const [membershipNo, setMembershipNo] = useState('');
  const [error, setError] = useState('');

  const handleVerify = (e) => {
    e.preventDefault();
    if (!membershipNo.trim()) {
      setError('Please enter a valid ICAI Membership Number (e.g. 40291).');
      return;
    }

    const verifiedUser = {
      name: `CA Member (#${membershipNo})`,
      full_name: `CA Member (#${membershipNo})`,
      role: 'Chartered Accountant (FCA)',
      membership: `ICAI Membership #${membershipNo}`,
      email: `ca_${membershipNo}@icai.org`
    };

    onVerifyCa(verifiedUser);
  };

  const handleQuickDemoUnlock = () => {
    const verifiedUser = {
      name: 'CA Rajesh Sharma, FCA',
      full_name: 'CA Rajesh Sharma, FCA',
      role: 'Chartered Accountant (FCA)',
      membership: 'ICAI Membership #40291',
      email: 'admin@taxdesk.in'
    };
    onVerifyCa(verifiedUser);
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="glass-panel p-8 sm:p-10 rounded-3xl max-w-2xl w-full text-center space-y-6 border border-[#E2DAC8] shadow-2xl relative overflow-hidden bg-[#FAF7F2]">
        
        {/* Top Lock Badge */}
        <div className="w-16 h-16 rounded-3xl bg-[#D1FAE5] border border-[#A7F3D0] text-[#064E3B] flex items-center justify-center mx-auto shadow-md">
          <ShieldAlert className="w-8 h-8 text-[#059669]" />
        </div>

        <div className="space-y-2">
          <span className="px-3 py-1 rounded-full bg-[#D1FAE5] text-[#064E3B] text-xs font-bold font-mono border border-[#A7F3D0]">
            🔒 Strictly Restricted to ICAI Chartered Accountants
          </span>
          
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1A1814] font-display">
            Chartered Accountant Verification Required
          </h2>
          
          <p className="text-xs text-slate-600 font-sans max-w-lg mx-auto leading-relaxed">
            Practice management tools, client audit files, statutory returns, and CSV reconciliation are strictly restricted to verified Chartered Accountants (FCA / ACA).
          </p>
        </div>

        {/* Verification Form */}
        <form onSubmit={handleVerify} className="space-y-3 max-w-md mx-auto">
          {error && (
            <div className="p-2.5 bg-rose-50 text-rose-700 text-xs font-mono rounded-xl border border-rose-200">
              {error}
            </div>
          )}

          <div className="relative">
            <Award className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Enter ICAI Membership No (e.g. 40291)"
              value={membershipNo}
              onChange={(e) => setMembershipNo(e.target.value)}
              className="w-full bg-white border border-[#E2DAC8] rounded-xl py-3 pl-10 pr-4 text-xs text-[#1A1814] font-mono outline-none focus:border-[#059669]"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="submit"
              className="book-cta flex-1 py-3 text-xs"
            >
              <span>Verify & Unlock CA Portal</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleQuickDemoUnlock}
              className="btn-black flex-1 py-3 text-xs"
            >
              <span>⚡ Quick CA Demo Access</span>
            </button>
          </div>
        </form>

        <div className="pt-4 border-t border-[#E2DAC8] text-[11px] text-slate-500 font-mono flex items-center justify-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#059669]" />
          <span>Encrypted ICAI Credential Verification Active</span>
        </div>

      </div>
    </div>
  );
}
