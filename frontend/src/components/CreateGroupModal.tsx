import { useState } from 'react';
import { X, Check, Search } from 'lucide-react';
import { useChatStore } from '../store/useChatStore';
import { useAuthStore } from '../store/useAuthStore';

export default function CreateGroupModal({ onClose }: { onClose: () => void }) {
  const { availableUsers, createGroup } = useChatStore();
  const { isGhostMode } = useAuthStore();
  const [groupName, setGroupName] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState('');

  const toggleUser = (id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(u => u !== id) : [...prev, id]);
  };

  const filteredUsers = availableUsers.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase())
  );

  const getSignalLabel = (signal: string) => {
    if (signal === 'Strong') return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    if (signal === 'Weak') return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    return 'bg-red-500/10 text-red-400 border-red-500/20';
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black/70 backdrop-blur-md flex items-center justify-center p-6">
      <div className={`w-full max-w-md rounded-[3rem] border shadow-2xl overflow-hidden ${
        isGhostMode ? 'bg-[#1c1c1e] border-[#38383a]' : 'bg-[#1e293b] border-slate-800'
      }`}>
        <div className="p-8 border-b border-slate-800/50 flex justify-between items-center">
          <div>
            <h2 className="text-white font-black text-xl">Create Group</h2>
            <p className="text-slate-500 text-xs mt-1">{selected.length} member{selected.length !== 1 ? 's' : ''} selected</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-500 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-8 space-y-6">
          <input
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder={isGhostMode ? 'Ghost Channel Name...' : 'Group Title'}
            className={`w-full border rounded-2xl px-5 py-4 text-white outline-none focus:ring-2 ${
              isGhostMode
                ? 'bg-[#2c2c2e] border-[#38383a] focus:ring-[#007aff]/50 placeholder-[#8e8e93]'
                : 'bg-[#0f172a] border-slate-800 focus:ring-indigo-500/50 placeholder-slate-600'
            }`}
          />

          <div className={`flex items-center gap-3 border rounded-2xl px-4 py-3 ${
            isGhostMode ? 'bg-[#2c2c2e] border-[#38383a]' : 'bg-[#0f172a] border-slate-800'
          }`}>
            <Search size={18} className="text-slate-600" />
            <input
              type="text"
              placeholder="Search contacts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent border-none focus:ring-0 text-sm text-white w-full outline-none placeholder-slate-600"
            />
          </div>

          <div className="max-h-56 overflow-y-auto space-y-2 custom-scrollbar">
            {filteredUsers.length === 0 && (
              <p className="text-slate-600 text-xs text-center py-6 font-bold uppercase tracking-widest">No contacts found</p>
            )}
            {filteredUsers.map(user => (
              <div
                key={user.id}
                onClick={() => toggleUser(user.id)}
                className={`p-4 rounded-2xl cursor-pointer flex items-center justify-between border transition-all ${
                  selected.includes(user.id)
                    ? (isGhostMode ? 'bg-[#007aff]/10 border-[#007aff]' : 'bg-indigo-600/10 border-indigo-500')
                    : 'border-transparent text-slate-400 hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm text-white ${
                    selected.includes(user.id)
                      ? (isGhostMode ? 'bg-[#007aff]' : 'bg-indigo-600')
                      : 'bg-slate-800'
                  }`}>
                    {user.name[0].toUpperCase()}
                  </div>
                  <div>
                    <span className="text-sm font-bold text-white block">{user.name}</span>
                    <span className="text-[9px] text-slate-500">{user.email}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[8px] font-black px-2 py-0.5 rounded-full border uppercase ${getSignalLabel(user.signal)}`}>
                    {user.signal}
                  </span>
                  {selected.includes(user.id) && (
                    <Check size={16} className={isGhostMode ? 'text-[#007aff]' : 'text-indigo-400'} />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-8 pt-0">
          <button
            onClick={() => { createGroup(groupName, selected); onClose(); }}
            disabled={!groupName.trim() || selected.length === 0}
            className={`w-full disabled:opacity-20 text-white font-black py-5 rounded-2xl transition-all active:scale-95 ${
              isGhostMode ? 'bg-[#007aff] hover:bg-[#0056b3]' : 'bg-indigo-600 hover:bg-indigo-500'
            }`}
          >
            {isGhostMode ? 'LAUNCH GHOST CHANNEL' : 'LAUNCH GROUP'}
          </button>
        </div>
      </div>
    </div>
  );
}
