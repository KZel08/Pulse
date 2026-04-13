import { Ghost, LogOut, Settings, ChevronLeft, ChevronRight, Edit2, Command } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useChatStore } from '../store/useChatStore';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import Avatar from './Avatar';
import AppLogo from './AppLogo';

type PresenceStatus = 'Available' | 'Away' | 'Busy' | 'Do Not Disturb';

const PRESENCE_OPTIONS: { label: PresenceStatus; color: string; dot: string }[] = [
  { label: 'Available',      color: 'text-emerald-400', dot: 'bg-emerald-400' },
  { label: 'Away',           color: 'text-amber-400',   dot: 'bg-amber-400'   },
  { label: 'Busy',           color: 'text-orange-400',  dot: 'bg-orange-400'  },
  { label: 'Do Not Disturb', color: 'text-red-400',     dot: 'bg-red-400'     },
];

interface HeaderProps {
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;
}

export default function Header({ sidebarCollapsed, onToggleSidebar }: HeaderProps) {
  const { user, isGhostMode, toggleGhostMode, logout } = useAuthStore();
  const { messages } = useChatStore();
  const navigate = useNavigate();
  const [editingStatus, setEditingStatus] = useState(false);
  const [statusDraft, setStatusDraft] = useState('Available');
  const [presence, setPresence] = useState<PresenceStatus>('Available');
  const [showPresencePicker, setShowPresencePicker] = useState(false);
  const presenceRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => { logout(); navigate('/login', { replace: true }); };

  const totalUnread = Object.values(messages).reduce((acc, msgs) =>
    acc + msgs.filter(m => m.senderId !== 'me' && !m.isDeleted && !m.isAIValidated).length, 0
  );

  useEffect(() => {
    document.title = totalUnread > 0 ? `(${totalUnread}) Pulse` : 'Pulse';
    // F11: dynamic favicon with unread count
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 32; canvas.height = 32;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#6366f1';
        ctx.beginPath(); ctx.arc(16, 16, 14, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 14px Inter, sans-serif';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(totalUnread > 9 ? '9+' : totalUnread > 0 ? String(totalUnread) : 'P', 16, 17);
        const link = document.querySelector<HTMLLinkElement>("link[rel*='icon']") || document.createElement('link');
        link.rel = 'icon'; link.href = canvas.toDataURL();
        document.head.appendChild(link);
      }
    } catch {}
  }, [totalUnread]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (presenceRef.current && !presenceRef.current.contains(e.target as Node)) {
        setShowPresencePicker(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const currentPresence = PRESENCE_OPTIONS.find(p => p.label === presence) || PRESENCE_OPTIONS[0];

  return (
    <header className="h-14 border-b border-[#2a2a2a] flex items-center justify-between px-4 bg-[#1a1a1a] flex-shrink-0">
      <div className="flex items-center gap-3">
        <button onClick={onToggleSidebar}
          className="p-1.5 rounded-lg text-[#8e8e93] hover:text-white hover:bg-[#2a2a2a] transition-all"
          title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {sidebarCollapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
        </button>
        <AppLogo size="sm" showEditButton={true} />
        <span className="text-white font-semibold text-sm tracking-tight">
          {isGhostMode ? 'Ghost Mode' : 'Pulse'}
        </span>
        {isGhostMode && (
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-[#2a2a2a] border border-[#3a3a3a]">
            <Ghost size={12} className="text-[#8e8e93]" />
            <span className="text-[#8e8e93] text-[10px] font-medium uppercase tracking-wider">Ghost</span>
          </div>
        )}
        {totalUnread > 0 && (
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#2a2a2a] text-white border border-[#3a3a3a]">
            {totalUnread} new
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        {/* F15: Ctrl+K hint */}
        <button
          onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, bubbles: true }))}
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-[#2a2a2a] text-[#555] hover:text-[#8e8e93] hover:bg-[#2a2a2a] transition-all"
          title="Command palette (Ctrl+K)"
        >
          <Command size={12} />
          <span className="text-[9px] font-mono">K</span>
        </button>

        <button onClick={toggleGhostMode}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-sm font-medium transition-all ${
            isGhostMode ? 'bg-[#2a2a2a] border-[#3a3a3a] text-white' : 'bg-transparent border-[#2a2a2a] text-[#8e8e93] hover:text-white hover:border-[#3a3a3a]'
          }`}
        >
          <Ghost size={14} />
          <span className="text-xs">{isGhostMode ? 'Ghost ON' : 'Ghost OFF'}</span>
        </button>

        <button onClick={() => navigate('/settings')}
          className="p-2 rounded-xl text-[#8e8e93] hover:text-white hover:bg-[#2a2a2a] transition-all border border-transparent hover:border-[#2a2a2a]"
          title="Settings"
        >
          <Settings size={16} />
        </button>

        {/* C10: Presence picker */}
        {!isGhostMode && (
          <div className="relative" ref={presenceRef}>
            <button onClick={() => setShowPresencePicker(p => !p)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-[#2a2a2a] hover:border-[#3a3a3a] hover:bg-[#2a2a2a] transition-all"
              title="Set presence status"
            >
              <span className={`w-2 h-2 rounded-full ${currentPresence.dot} flex-shrink-0`} />
              <span className={`text-[10px] font-medium hidden sm:block ${currentPresence.color}`}>
                {presence === 'Do Not Disturb' ? 'DND' : presence}
              </span>
            </button>
            {showPresencePicker && (
              <div className="absolute right-0 top-10 z-[300] bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl shadow-2xl overflow-hidden w-44">
                <p className="text-[#555] text-[9px] font-semibold uppercase tracking-widest px-4 pt-3 pb-1">Set Status</p>
                {PRESENCE_OPTIONS.map((opt) => (
                  <button key={opt.label} onClick={() => { setPresence(opt.label); setShowPresencePicker(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-xs hover:bg-white/5 transition-colors ${presence === opt.label ? 'bg-white/5' : ''}`}
                  >
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${opt.dot}`} />
                    <span className={opt.color}>{opt.label}</span>
                    {presence === opt.label && <span className="ml-auto text-emerald-400 text-[10px]">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <button onClick={() => navigate('/profile')}
          className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl hover:bg-[#2a2a2a] transition-all border border-transparent hover:border-[#2a2a2a] group"
        >
          <div className="relative">
            <Avatar size="sm" />
            {!isGhostMode && (
              <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-[#1a1a1a] ${currentPresence.dot}`} />
            )}
          </div>
          <div className="text-left">
            <p className="text-white text-xs font-medium leading-none mb-0.5">
              {isGhostMode ? 'Anonymous' : user?.name || 'User'}
            </p>
            {editingStatus && !isGhostMode ? (
              <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                <input
                  value={statusDraft}
                  onChange={e => setStatusDraft(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' || e.key === 'Escape') setEditingStatus(false); }}
                  className="bg-[#2a2a2a] text-white text-[10px] px-1.5 py-0.5 rounded outline-none w-20 border border-[#3a3a3a]"
                  autoFocus
                />
                <button onClick={() => setEditingStatus(false)} className="text-emerald-400 text-[10px]">✓</button>
              </div>
            ) : (
              <div className="flex items-center gap-1" onClick={e => { e.stopPropagation(); if (!isGhostMode) setEditingStatus(true); }}>
                <p className="text-[#8e8e93] text-[10px] leading-none">{isGhostMode ? 'Identity masked' : statusDraft}</p>
                {!isGhostMode && <Edit2 size={7} className="text-[#555] group-hover:text-[#8e8e93] transition-colors" />}
              </div>
            )}
          </div>
        </button>

        <button onClick={handleLogout}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[#8e8e93] hover:text-white hover:bg-[#2a2a2a] transition-all text-xs border border-transparent hover:border-[#2a2a2a]"
        >
          <LogOut size={14} />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
}