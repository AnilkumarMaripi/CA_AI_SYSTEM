import React, { useState } from 'react';
import { Sparkles, Users, MessageSquare, Camera, Bell, UserCheck, BarChart3, ShieldCheck, Lock, Menu, X } from 'lucide-react';

export default function Navbar({ activeModule, setActiveModule, currentUser, onOpenAuthModal }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'feed', label: 'Feed & Insights', icon: Sparkles },
    { id: 'connections', label: 'CA Network', icon: Users },
    { id: 'messages', label: 'Messaging', icon: MessageSquare },
    { id: 'ai-assistant', label: 'AI OCR Scanner', icon: Camera },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'profile', label: 'Profile', icon: UserCheck },
    { id: 'dashboard', label: 'Analytics', icon: BarChart3 },
    { id: 'login', label: 'Auth Portal', icon: ShieldCheck },
  ];

  const handleSelectModule = (id) => {
    setActiveModule(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="w-full py-4 px-4 sm:px-8 flex justify-center sticky top-0 z-50">
      <div className="nav-pill max-w-full overflow-x-auto scrollbar-none flex items-center justify-between shadow-2xl">
        
        {/* Brand Logo */}
        <div 
          className="logo flex items-center gap-2 cursor-pointer select-none shrink-0" 
          onClick={() => handleSelectModule('feed')}
        >
          <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-[#6366f1] to-[#a855f7] flex items-center justify-center text-white font-extrabold text-xs shadow-md">
            ⚡
          </div>
          <span className="font-bold text-[17px] text-white tracking-tight font-display">
            CA_<span className="text-[#6366f1]">AI</span>
          </span>
        </div>

        {/* Desktop Nav Items */}
        <div className="hidden lg:flex items-center space-x-1">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeModule === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectModule(item.id)}
                className={`nav-link flex items-center gap-1.5 ${isActive ? 'active' : ''}`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right CTA / Auth Status */}
        <div className="flex items-center gap-2 shrink-0">
          {currentUser ? (
            <div className="flex items-center gap-2 bg-[#121215] border border-[#1f1f23] px-3 py-1.5 rounded-full text-xs text-white shadow-sm">
              <UserCheck className="w-4 h-4 text-[#22c55e]" />
              <div className="hidden sm:block text-left leading-tight">
                <span className="font-bold block text-[11px] text-white">{currentUser.name || currentUser.full_name}</span>
                <span className="text-[9px] uppercase tracking-wider text-[#818cf8] font-mono">{currentUser.role || 'Member'}</span>
              </div>
            </div>
          ) : (
            <button
              onClick={() => handleSelectModule('login')}
              className="book-cta flex items-center gap-1.5 text-xs py-1.5 px-3.5"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-300 hover:text-white bg-[#121215] border border-[#1f1f23] rounded-full flex items-center justify-center w-9 h-9"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>

      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-20 left-4 right-4 bg-[#121215] border border-[#1f1f23] rounded-2xl p-4 shadow-2xl space-y-2 z-50">
          <div className="grid grid-cols-2 gap-2 text-xs font-medium">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeModule === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectModule(item.id)}
                  className={`p-3 rounded-xl border flex items-center gap-2 transition-all text-left ${
                    isActive
                      ? 'bg-[#6366f1]/20 border-[#6366f1] text-white font-bold'
                      : 'bg-[#09090b] border-[#1f1f23] text-slate-300 hover:bg-[#18181c]'
                  }`}
                >
                  <Icon className="w-4 h-4 text-[#6366f1] shrink-0" />
                  <span className="line-clamp-1">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}

