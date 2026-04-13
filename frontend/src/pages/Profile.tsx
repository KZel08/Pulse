import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Mail, User, Clock, Edit2, Check, X, MessageSquare, Hash } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useChatStore } from '../store/useChatStore';
import Avatar from '../components/Avatar';

export default function Profile() {
  const { user, isGhostMode, updateName } = useAuthStore();
  const { messages, chats } = useChatStore();
  const navigate = useNavigate();
  const [editingName, setEditingName] = useState(false);
  const [draftName, setDraftName] = useState(user?.name || '');

  const totalMessages = Object.values(messages).reduce(
    (acc, msgs) => acc + msgs.filter(m => m.senderId === 'me').length, 0
  );
  const totalChats = chats.length;

  const handleSaveName = () => {
    if (draftName.trim()) {
      updateName(draftName.trim());
    }
    setEditingName(false);
  };

  const handleCancelEdit = () => {
    setDraftName(user?.name || '');
    setEditingName(false);
  };

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <div className="h-16 border-b border-gray-800 flex items-center px-6 gap-4">
        <button onClick={() => navigate('/app')} className="p-2 rounded-xl bg-gray-900 hover:bg-gray-800 text-gray-400 hover:text-white transition-all">
          <ArrowLeft size={18} />
        </button>
        <h1 className="text-white font-bold text-lg tracking-tight uppercase clean-heading">Profile</h1>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-6">

          {/* Avatar card */}
          <div className="bg-gray-900/50 rounded-[2.5rem] border border-gray-800 p-10 flex flex-col items-center gap-4">
            <Avatar size="xl" showUploadButton={true} />
            <div className="text-center w-full">
              {editingName && !isGhostMode ? (
                <div className="flex items-center gap-2 justify-center">
                  <input
                    value={draftName}
                    onChange={(e) => setDraftName(e.target.value)}
                    className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-center font-black text-lg outline-none focus:ring-2 focus:ring-indigo-500 w-40"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveName();
                      if (e.key === 'Escape') handleCancelEdit();
                    }}
                  />
                  <button onClick={handleSaveName} className="p-2 rounded-xl bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/40 transition-all">
                    <Check size={16} />
                  </button>
                  <button onClick={handleCancelEdit} className="p-2 rounded-xl bg-red-600/20 text-red-400 hover:bg-red-600/40 transition-all">
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <h2 className="text-white font-black text-2xl tracking-tight">
                    {isGhostMode ? 'Anonymous' : user?.name || 'User'}
                  </h2>
                  {!isGhostMode && (
                    <button
                      onClick={() => { setDraftName(user?.name || ''); setEditingName(true); }}
                      className="p-1.5 rounded-lg text-slate-600 hover:text-slate-400 transition-colors"
                    >
                      <Edit2 size={14} />
                    </button>
                  )}
                </div>
              )}
              <div className="flex items-center justify-center gap-2 mt-1">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-emerald-400 text-xs font-black uppercase tracking-widest">Online</span>
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#1e293b]/50 rounded-[2rem] border border-slate-800 p-5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 flex items-center justify-center">
                <MessageSquare size={18} className="text-indigo-400" />
              </div>
              <div>
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Messages Sent</p>
                <p className="text-white font-black text-xl">{totalMessages}</p>
              </div>
            </div>
            <div className="bg-[#1e293b]/50 rounded-[2rem] border border-slate-800 p-5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 flex items-center justify-center">
                <Hash size={18} className="text-indigo-400" />
              </div>
              <div>
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Active Chats</p>
                <p className="text-white font-black text-xl">{totalChats}</p>
              </div>
            </div>
          </div>

          {/* Info card */}
          <div className="bg-[#1e293b]/50 rounded-[2.5rem] border border-slate-800 p-8 space-y-5">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 flex items-center justify-center">
                <User size={18} className="text-indigo-400" />
              </div>
              <div className="flex-1">
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Display Name</p>
                <p className="text-white font-bold">{isGhostMode ? 'Anonymous' : user?.name || '—'}</p>
              </div>
              {!isGhostMode && (
                <button
                  onClick={() => { setDraftName(user?.name || ''); setEditingName(true); }}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-500 hover:text-white transition-all"
                >
                  <Edit2 size={14} />
                </button>
              )}
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 flex items-center justify-center">
                <Mail size={18} className="text-indigo-400" />
              </div>
              <div>
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Email</p>
                <p className="text-white font-bold">{isGhostMode ? 'hidden@ghost.mode' : user?.email || '—'}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 flex items-center justify-center">
                <Shield size={18} className="text-indigo-400" />
              </div>
              <div>
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Mode</p>
                <p className={`font-bold ${isGhostMode ? 'text-[#007aff]' : 'text-emerald-400'}`}>
                  {isGhostMode ? 'Ghost Mode Active' : 'Standard Mode'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 flex items-center justify-center">
                <Clock size={18} className="text-indigo-400" />
              </div>
              <div>
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">User ID</p>
                <p className="text-slate-400 font-mono text-xs">{user?.id || '—'}</p>
              </div>
            </div>
          </div>

          <button onClick={() => navigate('/app')} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-5 rounded-2xl shadow-xl transition-all active:scale-95">
            BACK TO PULSE
          </button>
        </div>
      </div>
    </div>
  );
}