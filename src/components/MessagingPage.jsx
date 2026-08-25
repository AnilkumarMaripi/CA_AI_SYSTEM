import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, Paperclip, ShieldCheck, Circle, Search, PhoneCall, Video } from 'lucide-react';

export default function MessagingPage() {
  const [conversations, setConversations] = useState([
    {
      id: 'conv1',
      partnerName: 'CA Rajesh Sharma, FCA',
      handle: '@ca_rajesh',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80',
      isOnline: true,
      unread: 2,
      lastMessage: 'I checked your Form 26AS. You can claim TDS credit under Sec 194J.',
      lastTime: '10:42 AM',
      messages: [
        { id: 'm1', sender: 'partner', text: 'Hello! Have you uploaded the GSTR-1 sales register for Q3?', time: '10:30 AM' },
        { id: 'm2', sender: 'user', text: 'Yes CA Rajesh, uploaded via the Document Portal.', time: '10:35 AM' },
        { id: 'm3', sender: 'partner', text: 'I checked your Form 26AS. You can claim TDS credit under Sec 194J.', time: '10:42 AM' }
      ]
    },
    {
      id: 'conv2',
      partnerName: 'CA Priya Mehta',
      handle: '@priya_tax',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80',
      isOnline: false,
      unread: 0,
      lastMessage: 'Audit report draft is ready for partner sign-off.',
      lastTime: 'Yesterday',
      messages: [
        { id: 'm4', sender: 'partner', text: 'Audit report draft is ready for partner sign-off.', time: 'Yesterday' }
      ]
    }
  ]);

  const [activeConvId, setActiveConvId] = useState('conv1');
  const [inputMsg, setInputMsg] = useState('');
  const chatBottomRef = useRef(null);

  const activeConv = conversations.find(c => c.id === activeConvId);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConv?.messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMsg.trim() || !activeConv) return;

    const newMsgObj = {
      id: 'm_' + Date.now(),
      sender: 'user',
      text: inputMsg,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setConversations(conversations.map(c => {
      if (c.id === activeConvId) {
        return {
          ...c,
          lastMessage: inputMsg,
          lastTime: 'Just now',
          messages: [...c.messages, newMsgObj]
        };
      }
      return c;
    }));

    setInputMsg('');
  };

  return (
    <div className="max-w-6xl mx-auto h-[78vh] font-sans">
      <div className="glass-panel h-full rounded-3xl overflow-hidden border border-[#1f1f23] grid grid-cols-1 md:grid-cols-12 shadow-2xl">
        
        {/* Left Conversations Sidebar */}
        <div className="md:col-span-4 bg-[#121215] border-r border-[#1f1f23] flex flex-col h-full">
          <div className="p-4 border-b border-[#1f1f23] space-y-3">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#6366f1]" />
              CA Consultations & Messages
            </h2>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full bg-[#09090b] border border-[#1f1f23] rounded-xl py-1.5 pl-8 pr-3 text-xs text-white outline-none font-mono focus:border-[#6366f1]"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-[#1f1f23]">
            {conversations.map(conv => {
              const isActive = conv.id === activeConvId;
              return (
                <div
                  key={conv.id}
                  onClick={() => {
                    setActiveConvId(conv.id);
                    setConversations(conversations.map(c => c.id === conv.id ? { ...c, unread: 0 } : c));
                  }}
                  className={`p-3.5 flex items-center space-x-3 cursor-pointer transition-colors ${
                    isActive ? 'bg-[#6366f1]/15 border-l-4 border-l-[#6366f1]' : 'hover:bg-[#18181c]'
                  }`}
                >
                  <div className="relative shrink-0">
                    <img src={conv.avatar} alt={conv.partnerName} className="w-10 h-10 rounded-full border border-slate-700 object-cover" />
                    <span className={`w-3 h-3 rounded-full absolute bottom-0 right-0 border-2 border-[#121215] ${conv.isOnline ? 'bg-[#22c55e]' : 'bg-slate-500'}`}></span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white line-clamp-1">{conv.partnerName}</span>
                      <span className="text-[9px] text-slate-400 font-mono">{conv.lastTime}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 font-mono line-clamp-1 mt-0.5">{conv.lastMessage}</p>
                  </div>

                  {conv.unread > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full bg-[#6366f1] text-white text-[9px] font-bold font-mono shrink-0">
                      {conv.unread}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Active Chat Window */}
        <div className="md:col-span-8 flex flex-col h-full bg-[#09090b]/90">
          {activeConv ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-[#1f1f23] bg-[#121215] flex items-center justify-between shrink-0">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <img src={activeConv.avatar} alt={activeConv.partnerName} className="w-10 h-10 rounded-full border border-slate-700 object-cover" />
                    <span className={`w-2.5 h-2.5 rounded-full absolute bottom-0 right-0 ${activeConv.isOnline ? 'bg-[#22c55e]' : 'bg-slate-500'}`}></span>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-xs sm:text-sm font-bold text-white">{activeConv.partnerName}</h3>
                      <ShieldCheck className="w-4 h-4 text-[#22c55e]" />
                    </div>
                    <p className="text-[10px] text-slate-400 font-mono">
                      {activeConv.isOnline ? '🟢 Online • Direct ICAI Member Line' : '⚪ Offline'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 text-slate-400">
                  <button className="p-2 hover:text-white hover:bg-white/5 rounded-lg transition-colors"><PhoneCall className="w-4 h-4" /></button>
                  <button className="p-2 hover:text-white hover:bg-white/5 rounded-lg transition-colors"><Video className="w-4 h-4" /></button>
                </div>
              </div>

              {/* Chat Bubbles Log */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3">
                {activeConv.messages.map(msg => {
                  const isMe = msg.sender === 'user';
                  return (
                    <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[75%] p-3 rounded-2xl text-xs ${
                        isMe
                          ? 'bg-[#6366f1] text-white rounded-br-none'
                          : 'bg-[#18181c] text-slate-200 border border-[#1f1f23] rounded-bl-none'
                      }`}>
                        <p className="font-sans leading-relaxed">{msg.text}</p>
                        <span className={`text-[9px] font-mono block mt-1 text-right ${isMe ? 'text-indigo-200' : 'text-slate-500'}`}>
                          {msg.time}
                        </span>
                      </div>
                    </div>
                  );
                })}
                <div ref={chatBottomRef} />
              </div>

              {/* Input Form */}
              <form onSubmit={handleSendMessage} className="p-3 border-t border-[#1f1f23] bg-[#121215] flex items-center space-x-2 shrink-0">
                <button
                  type="button"
                  className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                  title="Attach Form 16 / Invoice Document"
                >
                  <Paperclip className="w-4 h-4" />
                </button>

                <input
                  type="text"
                  placeholder="Type message or paste tax calculation..."
                  value={inputMsg}
                  onChange={(e) => setInputMsg(e.target.value)}
                  className="flex-1 bg-[#09090b] border border-[#1f1f23] rounded-xl py-2.5 px-3.5 text-xs text-white outline-none font-mono focus:border-[#6366f1]"
                />

                <button
                  type="submit"
                  className="p-2.5 bg-[#6366f1] hover:bg-indigo-600 text-white rounded-xl shadow-md transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-500 font-mono text-xs">
              Select a conversation to start direct CA messaging.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
