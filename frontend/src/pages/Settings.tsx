import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, Shield, Eye, Moon, Trash2, Keyboard, Type, Clock, Sun, Monitor, Sparkles, Ghost, Volume2, VolumeX, AlignJustify, User, ChevronRight, Info } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useChatStore } from '../store/useChatStore';

const SHORTCUTS = [
  { keys: '/', description: 'Open global message search', category: 'Navigation' },
  { keys: 'Ctrl + G', description: 'Create new group', category: 'Navigation' },
  { keys: 'Ctrl + D', description: 'New direct message', category: 'Navigation' },
  { keys: 'Ctrl + K', description: 'Command palette', category: 'Navigation' },
  { keys: 'Esc', description: 'Close modals / cancel reply', category: 'General' },
  { keys: 'Enter', description: 'Send message / save edit', category: 'General' },
  { keys: 'Right-click', description: 'Message context menu', category: 'Messages' },
  { keys: '↑', description: 'Edit last sent message', category: 'Messages' },
];

const VERSION = '2.4.0';
const BUILD = 'pulse-' + new Date().getFullYear();

export default function Settings() {
  const { isGhostMode, toggleGhostMode, logout, user } = useAuthStore();
  const {
    notificationsEnabled, setNotificationsEnabled,
    soundEnabled, setSoundEnabled,
    compactMode, setCompactMode,
    aiSafetyEnabled, setAiSafetyEnabled,
    fontSize, setFontSize,
    appTheme, setAppTheme,         // C16
    alwaysShowTimestamps, setAlwaysShowTimestamps, // F19
  } = useChatStore();
  const navigate = useNavigate();

  // C16: Apply theme instantly when changed (no re-render wait)
  const handleThemeChange = (t: 'dark' | 'light' | 'system') => {
    setAppTheme(t);
    const root = document.documentElement;
    if (t === 'dark') {
      root.classList.add('dark'); root.classList.remove('light');
    } else if (t === 'light') {
      root.classList.add('light'); root.classList.remove('dark');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.toggle('dark', prefersDark);
      root.classList.toggle('light', !prefersDark);
    }
  };

  // Keep theme in sync if it was set externally
  useEffect(() => {
    handleThemeChange(appTheme);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const Toggle = ({ value, onChange, disabled }: { value: boolean; onChange: () => void; disabled?: boolean }) => (
    <button onClick={onChange} disabled={disabled}
      className={`w-11 h-6 rounded-full transition-all duration-300 relative flex-shrink-0 ${value ? 'bg-indigo-600 shadow-lg shadow-indigo-500/30' : 'bg-[#222]'} ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-300 ${value ? 'left-6' : 'left-1'}`} />
    </button>
  );

  const Section = ({ icon, title, children, accent = false }: { icon: React.ReactNode; title: string; children: React.ReactNode; accent?: boolean }) => (
    <div className={`rounded-[1.75rem] border p-6 space-y-5 ${accent ? 'bg-red-500/5 border-red-500/20' : 'bg-[#0f0f0f] border-[#1a1a1a]'}`}>
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${accent ? 'bg-red-500/10' : 'bg-[#1a1a1a]'}`}>
          {icon}
        </div>
        <h2 className={`font-black text-sm uppercase tracking-[0.15em] ${accent ? 'text-red-400' : 'text-[#8e8e93]'}`}>{title}</h2>
      </div>
      {children}
    </div>
  );

  const SettingRow = ({ label, desc, control, badge }: { label: string; desc?: string; control: React.ReactNode; badge?: string }) => (
    <div className="flex items-center justify-between gap-4 py-1">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-white text-sm font-medium">{label}</span>
          {badge && (
            <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-400 border border-indigo-500/20">
              {badge}
            </span>
          )}
        </div>
        {desc && <p className="text-[#555] text-xs mt-0.5 leading-snug">{desc}</p>}
      </div>
      {control}
    </div>
  );

  const FONT_LABELS = { small: { label: 'S', sub: '12px' }, medium: { label: 'M', sub: '14px' }, large: { label: 'L', sub: '16px' } };
  const THEME_OPTIONS = [
    { id: 'dark' as const, label: 'Dark', icon: <Moon size={14} /> },
    { id: 'light' as const, label: 'Light', icon: <Sun size={14} /> },
    { id: 'system' as const, label: 'System', icon: <Monitor size={14} /> },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      {/* Subtle background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-indigo-600/5 rounded-full blur-[100px]" />
      </div>

      {/* Header */}
      <div className="sticky top-0 z-10 bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-[#1a1a1a] flex items-center gap-3 px-5 h-14 flex-shrink-0">
        <button onClick={() => navigate('/app')}
          className="p-2 rounded-xl bg-[#111] hover:bg-[#1a1a1a] text-[#8e8e93] hover:text-white transition-all border border-[#1a1a1a] hover:border-[#2a2a2a]"
        >
          <ArrowLeft size={16} />
        </button>
        <div className="flex items-center gap-2">
          <h1 className="text-white font-black text-base tracking-tight uppercase italic">Settings</h1>
          <span className="text-[#333] text-[10px] font-mono">v{VERSION}</span>
        </div>
        {/* User pill */}
        <div className="ml-auto flex items-center gap-2 bg-[#111] border border-[#1a1a1a] rounded-full px-3 py-1.5">
          <div className="w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center text-[9px] font-black text-white">
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <span className="text-[#8e8e93] text-[11px] font-medium">{user?.name || 'User'}</span>
        </div>
      </div>

      <div className="relative flex-1 flex items-start justify-center px-4 py-6">
        <div className="w-full max-w-md space-y-3">

          {/* ── Profile quick access ── */}
          <button onClick={() => navigate('/profile')}
            className="w-full flex items-center justify-between p-4 bg-[#0f0f0f] border border-[#1a1a1a] rounded-[1.75rem] hover:border-[#2a2a2a] hover:bg-[#111] transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 border border-indigo-500/20 flex items-center justify-center">
                <User size={18} className="text-indigo-400" />
              </div>
              <div className="text-left">
                <p className="text-white text-sm font-semibold">{user?.name || 'Your Profile'}</p>
                <p className="text-[#555] text-xs">{user?.email || 'Edit name, avatar & status'}</p>
              </div>
            </div>
            <ChevronRight size={16} className="text-[#555] group-hover:text-[#8e8e93] transition-colors" />
          </button>

          {/* ── Notifications ── */}
          <Section icon={<Bell size={15} className="text-indigo-400" />} title="Notifications">
            <SettingRow
              label="Push Notifications"
              desc="In-app toasts for new messages and alerts"
              badge="Live"
              control={<Toggle value={notificationsEnabled} onChange={() => setNotificationsEnabled(!notificationsEnabled)} />}
            />
            <div className="h-px bg-[#1a1a1a]" />
            <SettingRow
              label="Sound Effects"
              desc="Audio feedback on send, receive, and events"
              control={
                <div className="flex items-center gap-2">
                  {soundEnabled ? <Volume2 size={14} className="text-indigo-400" /> : <VolumeX size={14} className="text-[#555]" />}
                  <Toggle value={soundEnabled} onChange={() => setSoundEnabled(!soundEnabled)} />
                </div>
              }
            />
          </Section>

          {/* ── Privacy ── */}
          <Section icon={<Eye size={15} className="text-purple-400" />} title="Privacy">
            <SettingRow
              label="Ghost Mode"
              desc="Hide your name, avatar, last seen and typing status"
              badge={isGhostMode ? 'Active' : undefined}
              control={<Toggle value={isGhostMode} onChange={toggleGhostMode} />}
            />
            {isGhostMode && (
              <div className="flex items-start gap-2 p-3 bg-purple-500/5 border border-purple-500/20 rounded-xl">
                <Ghost size={12} className="text-purple-400 mt-0.5 flex-shrink-0" />
                <p className="text-purple-300 text-[11px] leading-relaxed">Ghost Mode is active. Your identity is completely hidden from all participants.</p>
              </div>
            )}
          </Section>

          {/* ── AI Safety ── */}
          <Section icon={<Shield size={15} className="text-emerald-400" />} title="AI Safety">
            <SettingRow
              label="Content Monitoring"
              desc="Real-time AI validation on all messages"
              badge="12 Nodes"
              control={<Toggle value={aiSafetyEnabled} onChange={() => setAiSafetyEnabled(!aiSafetyEnabled)} />}
            />
            {!aiSafetyEnabled && (
              <div className="flex items-start gap-2 p-3 bg-amber-500/5 border border-amber-500/20 rounded-xl">
                <Info size={12} className="text-amber-400 mt-0.5 flex-shrink-0" />
                <p className="text-amber-300 text-[11px] leading-relaxed">AI safety monitoring is disabled. Messages will not be validated for harmful content.</p>
              </div>
            )}
          </Section>

          {/* ── Display ── */}
          <Section icon={<Moon size={15} className="text-indigo-400" />} title="Display">

            {/* App Theme — instant apply */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-white text-sm font-medium">App Theme</span>
                <span className="text-[#555] text-[10px] font-mono capitalize">{appTheme}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {THEME_OPTIONS.map(t => (
                  <button key={t.id} onClick={() => handleThemeChange(t.id)}
                    className={`flex flex-col items-center gap-2 py-3 px-2 rounded-2xl border text-xs font-semibold transition-all ${
                      appTheme === t.id
                        ? 'bg-indigo-600/20 border-indigo-500/50 text-indigo-400 shadow-lg shadow-indigo-500/10'
                        : 'bg-[#111] border-[#1a1a1a] text-[#555] hover:text-[#8e8e93] hover:border-[#2a2a2a]'
                    }`}
                  >
                    {t.icon}
                    <span className="text-[10px] font-black uppercase tracking-widest">{t.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="h-px bg-[#1a1a1a]" />

            {/* Font size */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Type size={13} className="text-[#555]" />
                  <span className="text-white text-sm font-medium">Message Font Size</span>
                </div>
                <span className="text-[#555] text-[10px] font-mono">{FONT_LABELS[fontSize].sub}</span>
              </div>
              <div className="flex gap-2">
                {(['small', 'medium', 'large'] as const).map(size => (
                  <button key={size} onClick={() => setFontSize(size)}
                    className={`flex-1 flex flex-col items-center gap-1.5 py-3 rounded-2xl border text-xs font-bold transition-all ${
                      fontSize === size
                        ? 'bg-indigo-600/20 border-indigo-500/50 text-indigo-400'
                        : 'bg-[#111] border-[#1a1a1a] text-[#555] hover:text-[#8e8e93] hover:border-[#2a2a2a]'
                    }`}
                  >
                    <span className="font-black text-sm">{FONT_LABELS[size].label}</span>
                    <span className="text-[9px] font-mono opacity-70">{FONT_LABELS[size].sub}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="h-px bg-[#1a1a1a]" />

            <SettingRow
              label="Compact Mode"
              desc="Reduce padding for denser message layout"
              control={
                <div className="flex items-center gap-2">
                  <AlignJustify size={14} className={compactMode ? 'text-indigo-400' : 'text-[#555]'} />
                  <Toggle value={compactMode} onChange={() => setCompactMode(!compactMode)} />
                </div>
              }
            />
            <div className="h-px bg-[#1a1a1a]" />

            {/* F19: always show timestamps */}
            <SettingRow
              label="Always Show Timestamps"
              desc="Display time on every individual message"
              control={
                <div className="flex items-center gap-2">
                  <Clock size={14} className={alwaysShowTimestamps ? 'text-indigo-400' : 'text-[#555]'} />
                  <Toggle value={alwaysShowTimestamps} onChange={() => setAlwaysShowTimestamps(!alwaysShowTimestamps)} />
                </div>
              }
            />
          </Section>

          {/* ── Keyboard Shortcuts ── */}
          <Section icon={<Keyboard size={15} className="text-amber-400" />} title="Keyboard Shortcuts">
            {['Navigation', 'General', 'Messages'].map(cat => {
              const items = SHORTCUTS.filter(s => s.category === cat);
              return (
                <div key={cat}>
                  <p className="text-[9px] text-[#333] font-black uppercase tracking-[0.2em] mb-2">{cat}</p>
                  <div className="space-y-1 mb-4 last:mb-0">
                    {items.map((s, i) => (
                      <div key={i} className="flex items-center justify-between py-2 border-b border-[#111] last:border-0">
                        <span className="text-[#8e8e93] text-xs">{s.description}</span>
                        <kbd className="bg-[#111] border border-[#1a1a1a] text-[#555] text-[9px] font-black px-2 py-1 rounded-lg tracking-wide font-mono">
                          {s.keys}
                        </kbd>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </Section>

          {/* ── About ── */}
          <Section icon={<Sparkles size={15} className="text-indigo-400" />} title="About Pulse">
            <div className="space-y-2">
              {[
                { label: 'Version', value: VERSION },
                { label: 'Build', value: BUILD },
                { label: 'Stack', value: 'React 19 + TypeScript' },
                { label: 'UI Library', value: 'Tailwind CSS 4' },
                { label: 'State', value: 'Zustand 5' },
                { label: 'Realtime', value: 'Socket.IO Client' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between py-1.5 border-b border-[#111] last:border-0">
                  <span className="text-[#555] text-xs">{item.label}</span>
                  <span className="text-[#8e8e93] text-xs font-mono">{item.value}</span>
                </div>
              ))}
            </div>
          </Section>

          {/* ── Danger Zone ── */}
          <Section icon={<Trash2 size={15} className="text-red-400" />} title="Danger Zone" accent>
            <p className="text-[#8e8e93] text-xs leading-relaxed">
              Signing out will end your session. Your messages and settings are preserved locally.
            </p>
            <button onClick={() => { logout(); navigate('/login', { replace: true }); }}
              className="w-full py-3 rounded-2xl bg-red-500/10 hover:bg-red-500/20 text-red-400 font-black text-sm uppercase tracking-widest transition-all border border-red-500/20 hover:border-red-500/30 active:scale-[0.98]"
            >
              Sign Out
            </button>
          </Section>

          {/* Back button */}
          <button onClick={() => navigate('/')}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-4 rounded-2xl shadow-xl shadow-indigo-500/20 transition-all active:scale-[0.98] text-sm tracking-wide"
          >
            BACK TO PULSE
          </button>

          {/* Footer */}
          <p className="text-center text-[#222] text-[10px] pb-4">
            Pulse · Built with ❤️ for secure communication
          </p>
        </div>
      </div>
    </div>
  );
}