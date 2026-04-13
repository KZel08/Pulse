import React, { useEffect, useState, useCallback } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Onboarding from './pages/Onboarding';   // F1
import NotFound from './pages/NotFound';        // F2
import ForgotPassword from './pages/ForgotPassword'; // F8
import EnhancedLogin from './components/EnhancedLogin';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import SafetySidebar from './components/SafetySidebar';
import ChatInfoSidebar from './components/ChatInfoSidebar';
import ToastContainer from './components/ToastContainer';
import { useAuthStore } from './store/useAuthStore';
import { useChatStore } from './store/useChatStore';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const user = useAuthStore((state) => state.user);
  return user ? <>{children}</> : <Navigate to="/login" replace />;
};

// E12: Command palette item type
interface PaletteItem {
  label: string;
  shortcut?: string;
  action: () => void;
  category: string;
}

function App() {
  const { hydrateFromStorage } = useAuthStore();
  const { appTheme, hasSeenOnboarding, chats, setActiveChat, setHasSeenOnboarding } = useChatStore();
  const [showChatInfo, setShowChatInfo] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isBooting, setIsBooting] = useState(true); // F3: splash
  const [showPalette, setShowPalette] = useState(false); // E12
  const [paletteQuery, setPaletteQuery] = useState('');

  useEffect(() => {
    hydrateFromStorage();
    // NEW: sync onboarding flag from localStorage on app boot
    // This ensures the store reflects the cleared flag after logout
    try {
      const seen = localStorage.getItem('pulse_onboarding') === 'done';
      setHasSeenOnboarding(seen);
    } catch {}
    // F3: splash for 900ms
    const t = setTimeout(() => setIsBooting(false), 900);
    return () => clearTimeout(t);
  }, [hydrateFromStorage, setHasSeenOnboarding]);

  // C16: apply app theme class to <html> — fires immediately on change
  useEffect(() => {
    const root = document.documentElement;
    if (appTheme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else if (appTheme === 'light') {
      root.classList.add('light');
      root.classList.remove('dark');
    } else {
      // system
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.toggle('dark', prefersDark);
      root.classList.toggle('light', !prefersDark);
    }
  }, [appTheme]);

  // E12: Cmd+K / Ctrl+K opens palette
  const handleGlobalKey = useCallback((e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      setShowPalette(p => !p);
      setPaletteQuery('');
    }
    if (e.key === 'Escape') setShowPalette(false);
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleGlobalKey);
    return () => window.removeEventListener('keydown', handleGlobalKey);
  }, [handleGlobalKey]);

  // E12: palette items
  const paletteItems: PaletteItem[] = [
    { label: 'Open global search', shortcut: '/', action: () => { setShowPalette(false); window.dispatchEvent(new KeyboardEvent('keydown', { key: '/' })); }, category: 'Navigation' },
    { label: 'New Direct Message', shortcut: 'Ctrl+D', action: () => { setShowPalette(false); window.dispatchEvent(new KeyboardEvent('keydown', { key: 'd', ctrlKey: true })); }, category: 'Navigation' },
    { label: 'New Group', shortcut: 'Ctrl+G', action: () => { setShowPalette(false); window.dispatchEvent(new KeyboardEvent('keydown', { key: 'g', ctrlKey: true })); }, category: 'Navigation' },
    { label: 'Go to Profile', action: () => { setShowPalette(false); window.location.href = '/profile'; }, category: 'Navigation' },
    { label: 'Go to Settings', action: () => { setShowPalette(false); window.location.href = '/settings'; }, category: 'Navigation' },
    ...chats.map(c => ({ label: `Open: ${c.name}`, action: () => { setActiveChat(c); setShowPalette(false); }, category: 'Chats' })),
  ];

  const filteredItems = paletteQuery.trim()
    ? paletteItems.filter(i => i.label.toLowerCase().includes(paletteQuery.toLowerCase()))
    : paletteItems;

  // F3: splash screen
  if (isBooting) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center gap-4 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[100px]" />
        </div>
        {/* Grid */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none"
          style={{ backgroundImage: `linear-gradient(#6366f1 1px, transparent 1px), linear-gradient(90deg, #6366f1 1px, transparent 1px)`, backgroundSize: '48px 48px' }}
        />
        <div className="relative flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-2xl shadow-indigo-500/40">
            <span className="text-white font-black text-xl">P</span>
          </div>
          <div className="text-white font-black text-5xl italic tracking-tighter select-none" style={{ letterSpacing: '-0.03em' }}>
            PULSE
          </div>
        </div>
        <div className="relative flex items-center gap-1.5 mt-4">
          <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
        <p className="relative text-[#333] text-[10px] uppercase tracking-[0.3em] mt-2 font-medium">Secure · Real-Time · AI-Powered</p>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <ToastContainer />

      {/* E12: Command Palette */}
      {showPalette && (
        <div className="fixed inset-0 z-[900] bg-black/80 backdrop-blur-md flex items-start justify-center pt-24 px-4" onClick={() => setShowPalette(false)}>
          <div className="w-full max-w-lg bg-[#0f0f0f] border border-[#1a1a1a] rounded-2xl shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-3 px-4 py-3 border-b border-[#1a1a1a]">
              <span className="text-[#555] text-sm">⌘</span>
              <input
                autoFocus
                value={paletteQuery}
                onChange={e => setPaletteQuery(e.target.value)}
                placeholder="Type a command or search chats..."
                className="flex-1 bg-transparent text-white outline-none text-sm placeholder-[#333]"
              />
              <kbd className="text-[9px] text-[#333] bg-[#111] px-2 py-1 rounded-lg font-mono border border-[#1a1a1a]">Esc</kbd>
            </div>
            <div className="max-h-80 overflow-y-auto custom-scrollbar">
              {filteredItems.length === 0 && (
                <p className="text-[#333] text-xs text-center py-8">No commands found</p>
              )}
              {['Navigation', 'Chats'].map(cat => {
                const items = filteredItems.filter(i => i.category === cat);
                if (items.length === 0) return null;
                return (
                  <div key={cat}>
                    <p className="text-[9px] text-[#333] font-semibold uppercase tracking-widest px-4 pt-3 pb-1">{cat}</p>
                    {items.map((item, i) => (
                      <button key={i} onClick={item.action}
                        className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-[#111] transition-colors text-left group"
                      >
                        <span className="text-sm text-[#8e8e93] group-hover:text-white transition-colors">{item.label}</span>
                        {item.shortcut && (
                          <kbd className="text-[9px] text-[#333] bg-[#111] px-2 py-1 rounded-lg font-mono border border-[#1a1a1a]">{item.shortcut}</kbd>
                        )}
                      </button>
                    ))}
                  </div>
                );
              })}
            </div>
            <div className="px-4 py-2.5 border-t border-[#1a1a1a] flex gap-4">
              <span className="text-[9px] text-[#333]"><kbd className="bg-[#111] px-1 rounded text-[#444] border border-[#1a1a1a]">↑↓</kbd> navigate</span>
              <span className="text-[9px] text-[#333]"><kbd className="bg-[#111] px-1 rounded text-[#444] border border-[#1a1a1a]">↵</kbd> select</span>
              <span className="text-[9px] text-[#333]"><kbd className="bg-[#111] px-1 rounded text-[#444] border border-[#1a1a1a]">Esc</kbd> close</span>
              <span className="text-[9px] text-[#333] ml-auto">Ctrl+K to toggle</span>
            </div>
          </div>
        </div>
      )}

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/landing" element={<EnhancedLogin />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />  {/* F8 */}
        <Route path="/onboarding" element={<Onboarding />} />  {/* F1 */}
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
        <Route path="/onboarding" element={<PrivateRoute><Navigate to="/app" replace /></PrivateRoute>} />
        <Route path="/app" element={
          <PrivateRoute>
            <div className="flex h-screen w-full bg-[#0f172a] overflow-hidden font-sans flex-col">
              <Header sidebarCollapsed={sidebarCollapsed} onToggleSidebar={() => setSidebarCollapsed(p => !p)} />
              <div className="flex flex-1 overflow-hidden">
                <Sidebar collapsed={sidebarCollapsed} />
                <ChatWindow onToggleChatInfo={() => setShowChatInfo(p => !p)} />
                {showChatInfo
                  ? <ChatInfoSidebar onClose={() => setShowChatInfo(false)} />
                  : <SafetySidebar />
                }
              </div>
            </div>
          </PrivateRoute>
        } />
        <Route path="/" element={<EnhancedLogin />} />
        <Route path="*" element={<NotFound />} /> {/* F2 */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;