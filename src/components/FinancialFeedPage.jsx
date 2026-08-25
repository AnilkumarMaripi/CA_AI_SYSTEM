import React, { useState } from 'react';
import { Search, Sparkles, Heart, Bookmark, MessageSquare, Share2, ShieldCheck, Send, TrendingUp, Flame, AlertCircle } from 'lucide-react';

export default function FinancialFeedPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [postContent, setPostContent] = useState('');
  const [selectedTag, setSelectedTag] = useState('#GST');
  
  const stories = [
    { id: 1, title: 'GSTR-3B Alert', tag: 'GST', time: 'Today', author: 'ICAI Updates', glow: 'border-indigo-500' },
    { id: 2, title: 'TDS Rates 2026', tag: 'IncomeTax', time: '2h ago', author: 'CA Anil', glow: 'border-emerald-500' },
    { id: 3, title: 'Form 16 Changes', tag: 'Audit', time: '5h ago', author: 'TaxDesk AI', glow: 'border-purple-500' },
    { id: 4, title: 'MSME 45-Day Rule', tag: 'Corporate', time: '1d ago', author: 'CA Priya', glow: 'border-[#6366f1]' },
  ];

  const [posts, setPosts] = useState([
    {
      id: 'p1',
      author: 'CA Rajesh Sharma, FCA',
      handle: '@ca_rajesh',
      role: 'Senior Tax Partner',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80',
      verified: true,
      time: '15 mins ago',
      content: 'CRITICAL GST UPDATE: CBIC releases new clarification on Input Tax Credit (ITC) reversal under Rule 42 & 43 for real estate transactions. Make sure to check Section 16(4) compliance before month-end filing!',
      tags: ['#GST', '#TaxCompliance', '#CBIC'],
      likes: 42,
      isLiked: false,
      bookmarks: 18,
      isBookmarked: false,
      comments: [
        { id: 'c1', author: 'Anil Kumar', text: 'Does this apply retrospectively for FY 2024-25 filings?' },
        { id: 'c2', author: 'CA Rajesh Sharma', text: 'Applicable prospectively from current financial quarter.' }
      ]
    },
    {
      id: 'p2',
      author: 'CA Priya Mehta',
      handle: '@priya_tax',
      role: 'Corporate Audit Specialist',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80',
      verified: true,
      time: '2 hours ago',
      content: 'Here is a quick Excel Formula snippet for automated TDS Deduction under Sec 194Q vs 206C(1H):\n\n=IF(AND(Purchases>5000000, VendorPAN<>""), Purchases*0.001, 0)\n\nBookmark this for your audit team!',
      tags: ['#IncomeTax', '#Audit', '#ExcelFormulas'],
      likes: 89,
      isLiked: true,
      bookmarks: 54,
      isBookmarked: true,
      comments: [
        { id: 'c3', author: 'Vikram V', text: 'Super helpful formula, saved for audit season!' }
      ]
    }
  ]);

  const [suggestedCAs, setSuggestedCAs] = useState([
    { id: 's1', name: 'CA Vikram Verma', handle: '@ca_vikram', spec: 'Corporate Law & Audit', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80', connected: false },
    { id: 's2', name: 'CA Sneha Roy', handle: '@sneha_tax', spec: 'GST Representation', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&q=80', connected: false },
  ]);

  const handleCreatePost = (e) => {
    e.preventDefault();
    if (!postContent.trim()) return;
    const newPostObj = {
      id: 'p_' + Date.now(),
      author: 'CA Practice Member',
      handle: '@ca_member',
      role: 'Practicing Member',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=newpost',
      verified: true,
      time: 'Just now',
      content: postContent,
      tags: [selectedTag, '#TaxInsights'],
      likes: 0,
      isLiked: false,
      bookmarks: 0,
      isBookmarked: false,
      comments: []
    };
    setPosts([newPostObj, ...posts]);
    setPostContent('');
  };

  const toggleLike = (postId) => {
    setPosts(posts.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          likes: p.isLiked ? p.likes - 1 : p.likes + 1,
          isLiked: !p.isLiked
        };
      }
      return p;
    }));
  };

  const toggleBookmark = (postId) => {
    setPosts(posts.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          bookmarks: p.isBookmarked ? p.bookmarks - 1 : p.bookmarks + 1,
          isBookmarked: !p.isBookmarked
        };
      }
      return p;
    }));
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 font-sans">
      
      {/* Header Bar */}
      <div className="glass-panel p-5 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-[#6366f1] flex items-center gap-2 font-display">
            <Sparkles className="w-5 h-5 text-[#6366f1]" />
            CA_AI Insights & Real-Time Financial Feed
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Verified tax updates, statutory compliance alerts, and expert CA discussions.
          </p>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search #GST, #Audit, or CA..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#09090b] border border-[#1f1f23] rounded-xl py-2 pl-9 pr-4 text-xs text-white font-mono outline-none focus:border-[#6366f1]"
          />
        </div>
      </div>

      {/* Insights Stories Bar (Horizontal Scroll) */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono flex items-center gap-1.5 px-1">
          <Flame className="w-3.5 h-3.5 text-amber-500" />
          Daily Tax & Compliance Stories
        </h3>
        <div className="flex space-x-4 overflow-x-auto pb-2 scrollbar-none">
          {stories.map(story => (
            <div key={story.id} className={`glass-panel p-3.5 rounded-2xl min-w-[170px] shrink-0 border-2 ${story.glow} hover:scale-105 transition-transform cursor-pointer space-y-1`}>
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-full bg-[#6366f1]/20 text-[#818cf8] text-[9px] font-bold font-mono">
                  #{story.tag}
                </span>
                <span className="text-[9px] text-slate-500 font-mono">{story.time}</span>
              </div>
              <h4 className="text-xs font-bold text-white line-clamp-1">{story.title}</h4>
              <p className="text-[10px] text-slate-400 font-mono">By {story.author}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Main Feed Grid (Content Stream + Right Sidebar) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Feed Stream */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Post Composer */}
          <div className="glass-panel p-5 rounded-2xl space-y-4">
            <h3 className="text-xs font-bold text-slate-300 font-mono uppercase tracking-wider">
              Share Tax Tip, Regulatory Alert, or Formula
            </h3>
            
            <textarea
              rows="3"
              placeholder="What GST amendment or tax calculation are you working on today?"
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              className="w-full bg-[#09090b] border border-[#1f1f23] rounded-xl p-3 text-xs text-white outline-none focus:border-[#6366f1] font-mono resize-none"
            ></textarea>

            <div className="flex items-center justify-between gap-3 pt-1">
              <div className="flex items-center space-x-2">
                <span className="text-[11px] text-slate-400 font-mono">Tag:</span>
                {['#GST', '#IncomeTax', '#Audit', '#Corporate'].map(tag => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setSelectedTag(tag)}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold transition-all ${selectedTag === tag ? 'bg-[#6366f1] text-white' : 'bg-[#18181c] text-slate-400'}`}
                  >
                    {tag}
                  </button>
                ))}
              </div>

              <button
                onClick={handleCreatePost}
                className="book-cta flex items-center gap-1.5 text-xs py-2 px-4"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Post Insight</span>
              </button>
            </div>
          </div>

          {/* Posts Stream */}
          <div className="space-y-4">
            {posts.map(post => (
              <div key={post.id} className="glass-panel p-5 rounded-2xl space-y-4 hover:border-slate-700 transition-colors">
                
                {/* Author Banner */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img src={post.avatar} alt={post.author} className="w-10 h-10 rounded-full border border-slate-700 object-cover" />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-white">{post.author}</span>
                        {post.verified && <ShieldCheck className="w-4 h-4 text-[#22c55e]" />}
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">{post.role} • {post.time}</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <p className="text-xs text-slate-200 leading-relaxed font-sans whitespace-pre-line">
                  {post.content}
                </p>

                {/* Tax Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {post.tags.map(t => (
                    <span key={t} className="px-2 py-0.5 rounded bg-[#6366f1]/10 text-[#818cf8] text-[10px] font-mono font-bold border border-[#6366f1]/20">
                      {t}
                    </span>
                  ))}
                </div>

                {/* Interaction Footer */}
                <div className="flex items-center justify-between border-t border-[#1f1f23] pt-3 text-xs font-mono text-slate-400">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => toggleLike(post.id)}
                      className={`flex items-center space-x-1.5 ${post.isLiked ? 'text-rose-500 font-bold' : 'hover:text-white'}`}
                    >
                      <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-rose-500' : ''}`} />
                      <span>{post.likes}</span>
                    </button>

                    <button
                      onClick={() => toggleBookmark(post.id)}
                      className={`flex items-center space-x-1.5 ${post.isBookmarked ? 'text-[#6366f1] font-bold' : 'hover:text-white'}`}
                    >
                      <Bookmark className={`w-4 h-4 ${post.isBookmarked ? 'fill-[#6366f1]' : ''}`} />
                      <span>{post.bookmarks}</span>
                    </button>
                  </div>

                  <span className="flex items-center gap-1">
                    <MessageSquare className="w-4 h-4" />
                    <span>{post.comments.length} Comments</span>
                  </span>
                </div>

                {/* Comments Thread */}
                {post.comments.length > 0 && (
                  <div className="bg-[#09090b] p-3 rounded-xl space-y-2 border border-[#1f1f23] text-xs">
                    {post.comments.map(c => (
                      <div key={c.id} className="text-[11px] font-mono">
                        <span className="text-[#818cf8] font-bold">{c.author}: </span>
                        <span className="text-slate-300">{c.text}</span>
                      </div>
                    ))}
                  </div>
                )}

              </div>
            ))}
          </div>

        </div>

        {/* Right Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Suggested CAs */}
          <div className="glass-panel p-5 rounded-2xl space-y-4">
            <h3 className="text-xs font-extrabold text-white uppercase tracking-wider font-mono flex items-center gap-2 border-b border-[#1f1f23] pb-3">
              <TrendingUp className="w-4 h-4 text-[#6366f1]" />
              Suggested CAs for You
            </h3>

            <div className="space-y-3">
              {suggestedCAs.map(ca => (
                <div key={ca.id} className="bg-[#09090b] p-3 rounded-xl border border-[#1f1f23] flex items-center justify-between gap-2">
                  <div className="flex items-center space-x-2.5">
                    <img src={ca.avatar} alt={ca.name} className="w-8 h-8 rounded-full border border-slate-700 shrink-0 object-cover" />
                    <div>
                      <span className="text-xs font-bold text-white block line-clamp-1">{ca.name}</span>
                      <span className="text-[9px] text-slate-400 font-mono block">{ca.spec}</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setSuggestedCAs(suggestedCAs.map(s => s.id === ca.id ? { ...s, connected: !s.connected } : s))}
                    className={`px-2.5 py-1 text-[10px] font-bold font-mono rounded-lg transition-colors shrink-0 ${
                      ca.connected ? 'bg-emerald-500/20 text-[#22c55e] border border-emerald-500/30' : 'bg-[#6366f1] text-white hover:bg-indigo-600'
                    }`}
                  >
                    {ca.connected ? '✓ Connected' : 'Connect +'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Statutory Compliance Ticker */}
          <div className="glass-panel-glow p-5 rounded-2xl space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-[#22c55e]" />
              Compliance Ticker 2026
            </h4>
            <div className="space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
                <span className="text-slate-300">GSTR-3B Monthly</span>
                <span className="text-[#22c55e] font-bold">Due 20th</span>
              </div>
              <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
                <span className="text-slate-300">TDS Deposit 194Q</span>
                <span className="text-amber-400 font-bold">Due 7th</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300">ITR Audit Return</span>
                <span className="text-[#818cf8] font-bold">Oct 31</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
