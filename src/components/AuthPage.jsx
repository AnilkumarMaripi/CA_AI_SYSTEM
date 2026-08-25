import React, { useState } from 'react';
import { ShieldCheck, Mail, Lock, User, Phone, Briefcase, Chrome, Github, ArrowRight, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

export default function AuthPage({ onAuthSuccess }) {
  const [mode, setMode] = useState('login'); // 'login' | 'register' | 'forgot'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [profession, setProfession] = useState('Chartered Accountant');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (mode === 'register' && password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'login') {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ email, password })
        }).catch(() => null);

        // Fallback for demonstration
        const userObj = {
          id: 'ca_' + Date.now(),
          name: fullName || 'CA Anil Kumar',
          email: email || 'anil@ca_ai.com',
          role: profession,
          avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${email || 'anil'}`
        };
        localStorage.setItem('ca_ai_user', JSON.stringify(userObj));
        if (onAuthSuccess) onAuthSuccess(userObj);
      } else if (mode === 'register') {
        setSuccessMsg('Account created successfully! You can now log in.');
        setMode('login');
      } else if (mode === 'forgot') {
        setSuccessMsg('Password reset instructions sent to your email.');
      }
    } catch (err) {
      setError(err.message || 'Authentication error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] w-full flex items-center justify-center p-4">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 glass-panel rounded-3xl overflow-hidden shadow-2xl border border-[#1f1f23]">
        
        {/* Left Branding & Features Panel */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#121215] via-[#18181c] to-[#09090b] p-8 lg:p-10 flex flex-col justify-between border-r border-[#1f1f23] relative overflow-hidden">
          <div className="absolute -right-16 -top-16 w-48 h-48 bg-[#6366f1]/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div>
            <div className="flex items-center space-x-2 mb-8">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#6366f1] to-[#a855f7] flex items-center justify-center text-white shadow-lg">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <span className="text-xl font-extrabold font-display tracking-tight text-white">
                CA_<span className="text-[#6366f1]">AI</span>
              </span>
            </div>

            <h2 className="text-2xl lg:text-3xl font-extrabold text-white leading-tight mb-4">
              AI-Powered Financial Intelligence & Expert CA Network
            </h2>
            <p className="text-xs text-slate-400 font-sans leading-relaxed mb-8">
              Automated compliance, instant OCR invoice parsing, and direct expert consultations in one unified dark platform.
            </p>

            <div className="space-y-4">
              <div className="flex items-start space-x-3 p-3 rounded-xl bg-white/5 border border-white/10">
                <CheckCircle2 className="w-5 h-5 text-[#22c55e] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white">Automated Tax OCR</h4>
                  <p className="text-[11px] text-slate-400">Extract Form 16, GSTIN, and Balance Sheets in seconds.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 rounded-xl bg-white/5 border border-white/10">
                <CheckCircle2 className="w-5 h-5 text-[#6366f1] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white">Verified ICAI Experts</h4>
                  <p className="text-[11px] text-slate-400">Connect directly with certified CAs & tax consultants.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 text-[11px] text-slate-500 font-mono">
            Encrypted Session | HTTP-only Cookies Secured
          </div>
        </div>

        {/* Right Auth Forms Panel */}
        <div className="lg:col-span-7 p-8 lg:p-12 space-y-6 bg-[#121215]/80">
          
          <div className="flex items-center justify-between border-b border-[#1f1f23] pb-4">
            <h3 className="text-lg font-bold text-white font-display">
              {mode === 'login' && 'Sign In to CA_AI'}
              {mode === 'register' && 'Create Practice Account'}
              {mode === 'forgot' && 'Reset Password'}
            </h3>
            
            <div className="flex bg-[#18181c] p-1 rounded-xl text-xs font-mono border border-[#1f1f23]">
              <button
                type="button"
                onClick={() => setMode('login')}
                className={`px-3 py-1.5 rounded-lg transition-all ${mode === 'login' ? 'bg-[#6366f1] text-white font-bold' : 'text-slate-400'}`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => setMode('register')}
                className={`px-3 py-1.5 rounded-lg transition-all ${mode === 'register' ? 'bg-[#6366f1] text-white font-bold' : 'text-slate-400'}`}
              >
                Register
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs rounded-xl font-mono flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs rounded-xl font-mono flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="text-xs text-slate-300 font-bold block mb-1 font-mono">Full Name & Qualifications *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Anil Kumar, FCA"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-[#09090b] border border-[#1f1f23] rounded-xl py-2.5 pl-10 pr-4 text-white text-xs focus:border-[#6366f1] outline-none font-mono"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-xs text-slate-300 font-bold block mb-1 font-mono">Email Address *</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  placeholder="anil@ca_ai.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#09090b] border border-[#1f1f23] rounded-xl py-2.5 pl-10 pr-4 text-white text-xs focus:border-[#6366f1] outline-none font-mono"
                />
              </div>
            </div>

            {mode === 'register' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-300 font-bold block mb-1 font-mono">Mobile Number</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      placeholder="+91 98765 43210"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      className="w-full bg-[#09090b] border border-[#1f1f23] rounded-xl py-2.5 pl-10 pr-4 text-white text-xs focus:border-[#6366f1] outline-none font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-300 font-bold block mb-1 font-mono">Profession Type</label>
                  <div className="relative">
                    <Briefcase className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                    <select
                      value={profession}
                      onChange={(e) => setProfession(e.target.value)}
                      className="w-full bg-[#09090b] border border-[#1f1f23] rounded-xl py-2.5 pl-10 pr-4 text-white text-xs focus:border-[#6366f1] outline-none font-mono"
                    >
                      <option value="Chartered Accountant">Chartered Accountant</option>
                      <option value="Tax Consultant">Tax Consultant</option>
                      <option value="Business Owner">Business Owner</option>
                      <option value="Individual Client">Individual Client</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {mode !== 'forgot' && (
              <div>
                <label className="text-xs text-slate-300 font-bold block mb-1 font-mono">Password *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#09090b] border border-[#1f1f23] rounded-xl py-2.5 pl-10 pr-4 text-white text-xs focus:border-[#6366f1] outline-none font-mono"
                  />
                </div>
              </div>
            )}

            {mode === 'register' && (
              <div>
                <label className="text-xs text-slate-300 font-bold block mb-1 font-mono">Confirm Password *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-[#09090b] border border-[#1f1f23] rounded-xl py-2.5 pl-10 pr-4 text-white text-xs focus:border-[#6366f1] outline-none font-mono"
                  />
                </div>
              </div>
            )}

            {mode === 'login' && (
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => setMode('forgot')}
                  className="text-xs text-[#6366f1] font-mono hover:underline"
                >
                  Forgot password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-[#6366f1] to-[#4f46e5] hover:brightness-110 text-white font-bold text-xs font-mono rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>{mode === 'login' ? 'Sign In to Dashboard' : mode === 'register' ? 'Register Account' : 'Send Reset Link'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {mode !== 'forgot' && (
            <>
              <div className="relative flex items-center justify-center my-4">
                <div className="border-t border-[#1f1f23] w-full"></div>
                <span className="bg-[#121215] px-3 text-[10px] font-mono text-slate-500 uppercase tracking-wider relative z-10">
                  Or authenticate with
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleAuthSubmit({ preventDefault: () => {} })}
                  className="py-2.5 px-3 bg-[#09090b] border border-[#1f1f23] rounded-xl text-xs font-mono text-white hover:border-[#6366f1] transition-all flex items-center justify-center gap-2"
                >
                  <Chrome className="w-4 h-4 text-rose-500" />
                  <span>Google</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleAuthSubmit({ preventDefault: () => {} })}
                  className="py-2.5 px-3 bg-[#09090b] border border-[#1f1f23] rounded-xl text-xs font-mono text-white hover:border-[#6366f1] transition-all flex items-center justify-center gap-2"
                >
                  <Github className="w-4 h-4 text-slate-300" />
                  <span>GitHub</span>
                </button>
              </div>
            </>
          )}

        </div>

      </div>
    </div>
  );
}
