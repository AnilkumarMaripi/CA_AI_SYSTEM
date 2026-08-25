import React, { useState } from 'react';
import { ShieldCheck, Edit3, Globe, MapPin, Award, Users, BookOpen, MessageSquare, Camera, X, Check } from 'lucide-react';

export default function ProfilePage({ user }) {
  const [profile, setProfile] = useState({
    name: user?.name || 'CA Anil Kumar, FCA',
    handle: '@ca_anil',
    title: 'Senior Partner — Corporate Tax & Audit',
    membership: 'ICAI Fellow Membership #40291',
    location: 'Bengaluru / Remote',
    website: 'https://taxdesk.in',
    bio: 'Practicing Chartered Accountant with 10+ years specializing in Corporate Tax, GST Appeals, and AI-assisted financial auditing.',
    avatar: user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&q=80',
    stats: {
      postsCount: 24,
      connectionsCount: 340,
      clientsServed: 120
    }
  });

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editName, setEditName] = useState(profile.name);
  const [editHandle, setEditHandle] = useState(profile.handle);
  const [editBio, setEditBio] = useState(profile.bio);
  const [editTitle, setEditTitle] = useState(profile.title);
  const [editWebsite, setEditWebsite] = useState(profile.website);

  const articles = [
    {
      id: 'art1',
      title: 'Complete Guide to Input Tax Credit Reversal under Rule 42 & 43',
      date: 'Feb 18, 2026',
      readTime: '6 min read',
      tag: '#GST',
      snippet: 'Understanding the mathematical formula for common credit apportionment between taxable and exempt outward supplies...'
    },
    {
      id: 'art2',
      title: 'TDS Deduction under Sec 194Q vs TCS under Sec 206C(1H)',
      date: 'Feb 10, 2026',
      readTime: '4 min read',
      tag: '#IncomeTax',
      snippet: 'Key threshold rules of ₹50 Lakhs purchase turnover and priority rules between buyer TDS vs seller TCS...'
    }
  ];

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setProfile({
      ...profile,
      name: editName,
      handle: editHandle,
      bio: editBio,
      title: editTitle,
      website: editWebsite
    });
    setIsEditModalOpen(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-sans">
      
      {/* Hero Profile Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-6 relative overflow-hidden">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img src={profile.avatar} alt={profile.name} className="w-20 h-20 rounded-2xl border-2 border-[#6366f1] object-cover shadow-xl" />
              <span className="p-1 rounded-full bg-[#22c55e] text-white absolute -bottom-1 -right-1 shadow-md">
                <ShieldCheck className="w-4 h-4" />
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-extrabold text-white">{profile.name}</h1>
                <span className="px-2 py-0.5 rounded-full bg-[#6366f1]/20 text-[#818cf8] text-[10px] font-mono font-bold border border-[#6366f1]/30">
                  {profile.handle}
                </span>
              </div>
              
              <p className="text-xs text-slate-300 font-mono mt-0.5">{profile.title}</p>
              <p className="text-[10px] text-[#22c55e] font-mono flex items-center gap-1 mt-0.5">
                <Award className="w-3.5 h-3.5" /> {profile.membership}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsEditModalOpen(true)}
            className="book-cta text-xs py-2 px-4 flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Profile</span>
          </button>
        </div>

        {/* Bio & Details */}
        <div className="space-y-2 text-xs">
          <p className="text-slate-200 leading-relaxed font-sans max-w-2xl">{profile.bio}</p>
          
          <div className="flex flex-wrap items-center gap-4 text-slate-400 font-mono text-[11px] pt-1">
            <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-[#6366f1]" /> {profile.location}</span>
            <a href={profile.website} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-[#818cf8] hover:underline">
              <Globe className="w-3.5 h-3.5" /> {profile.website}
            </a>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 border-t border-[#1f1f23] pt-4 text-center font-mono">
          <div className="bg-[#09090b] p-3 rounded-xl border border-[#1f1f23]">
            <span className="text-[10px] text-slate-400 block uppercase">Published Insights</span>
            <span className="text-base sm:text-lg font-bold text-white">{profile.stats.postsCount}</span>
          </div>

          <div className="bg-[#09090b] p-3 rounded-xl border border-[#1f1f23]">
            <span className="text-[10px] text-slate-400 block uppercase">Connections</span>
            <span className="text-base sm:text-lg font-bold text-[#818cf8]">{profile.stats.connectionsCount}</span>
          </div>

          <div className="bg-[#09090b] p-3 rounded-xl border border-[#1f1f23]">
            <span className="text-[10px] text-slate-400 block uppercase">Clients Served</span>
            <span className="text-base sm:text-lg font-bold text-[#22c55e]">{profile.stats.clientsServed}</span>
          </div>
        </div>

      </div>

      {/* Published Tax Guides & Articles Stream */}
      <div className="glass-panel p-5 sm:p-6 rounded-3xl space-y-4">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2 border-b border-[#1f1f23] pb-3">
          <BookOpen className="w-4 h-4 text-[#6366f1]" />
          Published Tax Guides & Practice Articles
        </h3>

        <div className="space-y-3">
          {articles.map(art => (
            <div key={art.id} className="bg-[#09090b] p-4 rounded-2xl border border-[#1f1f23] space-y-2 hover:border-slate-700 transition-colors">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-full bg-[#6366f1]/10 text-[#818cf8] text-[10px] font-mono font-bold border border-[#6366f1]/30">
                  {art.tag}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">{art.date} • {art.readTime}</span>
              </div>

              <h4 className="text-sm font-bold text-white">{art.title}</h4>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">{art.snippet}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#09090b]/80 backdrop-blur-md">
          <div className="glass-panel p-6 rounded-3xl max-w-md w-full space-y-4 shadow-2xl border border-[#1f1f23] font-sans">
            
            <div className="flex items-center justify-between border-b border-[#1f1f23] pb-3">
              <h3 className="text-sm font-bold text-white font-display">Edit Profile & Credentials</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3 text-xs font-mono">
              <div>
                <label className="text-slate-300 font-bold block mb-1">Display Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-[#09090b] border border-[#1f1f23] rounded-xl p-2.5 text-white outline-none focus:border-[#6366f1]"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Handle</label>
                <input
                  type="text"
                  value={editHandle}
                  onChange={(e) => setEditHandle(e.target.value)}
                  className="w-full bg-[#09090b] border border-[#1f1f23] rounded-xl p-2.5 text-white outline-none focus:border-[#6366f1]"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Specialization Title</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full bg-[#09090b] border border-[#1f1f23] rounded-xl p-2.5 text-white outline-none focus:border-[#6366f1]"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Firm Website</label>
                <input
                  type="text"
                  value={editWebsite}
                  onChange={(e) => setEditWebsite(e.target.value)}
                  className="w-full bg-[#09090b] border border-[#1f1f23] rounded-xl p-2.5 text-white outline-none focus:border-[#6366f1]"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Bio (Max 150 chars)</label>
                <textarea
                  rows="3"
                  maxLength={150}
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  className="w-full bg-[#09090b] border border-[#1f1f23] rounded-xl p-2.5 text-white outline-none focus:border-[#6366f1] resize-none"
                ></textarea>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 book-cta py-2.5 text-xs"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 btn-black py-2.5 text-xs"
                >
                  Cancel
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
