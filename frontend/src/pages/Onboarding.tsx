import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, MessageSquare, Ghost, Zap, ChevronRight, ChevronLeft, Check, Lock, Users, Star, Sparkles, Bell, Search, Keyboard } from 'lucide-react';
import { useChatStore } from '../store/useChatStore';

const SLIDES = [
  {
    id: 'welcome',
    badge: 'WELCOME',
    icon: <Sparkles size={40} className="text-indigo-400" />,
    iconBg: 'bg-indigo-500/10 border-indigo-500/20',
    accentColor: 'text-indigo-400',
    glowColor: 'bg-indigo-600/10',
    title: 'Welcome to Pulse',
    subtitle: 'Your privacy-first communication hub',
    desc: 'Pulse combines real-time messaging, AI safety monitoring, and complete identity control in one elegant platform. Let\'s take a quick tour.',
    features: ['End-to-end encrypted', 'AI-powered safety', '35+ features'],
    featureIcons: [<Lock size={12} />, <Shield size={12} />, <Zap size={12} />],
    preview: null,
  },
  {
    id: 'realtime',
    badge: 'MESSAGING',
    icon: <MessageSquare size={40} className="text-blue-400" />,
    iconBg: 'bg-blue-500/10 border-blue-500/20',
    accentColor: 'text-blue-400',
    glowColor: 'bg-blue-600/10',
    title: 'Real-Time Secure Chat',
    subtitle: 'Delivered in under 50ms',
    desc: 'Send messages, files, and reactions instantly. Reply to threads, forward messages, pin important content and export full chat history.',
    features: ['Reactions + skin tones', 'File sharing', 'Message pinning', 'Chat export'],
    featureIcons: [<Star size={12} />, <MessageSquare size={12} />, <Bell size={12} />, <Check size={12} />],
    preview: (
      <div className="flex flex-col gap-2 p-3 bg-[#0d0d0d] rounded-2xl border border-[#1a1a1a]">
        <div className="flex items-end gap-2">
          <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-[9px] font-black text-blue-400">A</div>
          <div className="bg-[#1a1a1a] rounded-2xl rounded-bl-sm px-3 py-2 text-xs text-[#ccc]">Hey! How are you? 👋</div>
        </div>
        <div className="flex items-end gap-2 flex-row-reverse">
          <div className="bg-indigo-600 rounded-2xl rounded-br-sm px-3 py-2 text-xs text-white">Doing great! Working on Pulse 🚀</div>
        </div>
        <div className="flex items-end gap-2">
          <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-[9px] font-black text-blue-400">A</div>
          <div className="bg-[#1a1a1a] rounded-2xl rounded-bl-sm px-3 py-2 text-xs text-[#ccc]">Love it! 🔥 <span className="text-[10px] bg-[#2a2a2a] rounded-full px-1.5">👍 2</span></div>
        </div>
      </div>
    ),
  },
  {
    id: 'safety',
    badge: 'AI SAFETY',
    icon: <Shield size={40} className="text-emerald-400" />,
    iconBg: 'bg-emerald-500/10 border-emerald-500/20',
    accentColor: 'text-emerald-400',
    glowColor: 'bg-emerald-600/10',
    title: 'AI Safety Built-In',
    subtitle: '12-node validation grid',
    desc: 'Our AI safety grid monitors every message for toxic content, sentiment shifts and security threats in real time.',
    features: ['12 safety nodes', 'Sentiment analysis', 'Threat detection', 'Safety logs'],
    featureIcons: [<Shield size={12} />, <Zap size={12} />, <Bell size={12} />, <Check size={12} />],
    preview: (
      <div className="p-3 bg-[#0d0d0d] rounded-2xl border border-[#1a1a1a] space-y-2">
        {[
          { label: 'Node 01', status: 'active', color: 'bg-emerald-500', lat: '12ms' },
          { label: 'Node 02', status: 'active', color: 'bg-emerald-500', lat: '8ms' },
          { label: 'Node 03', status: 'busy', color: 'bg-amber-500', lat: '45ms' },
        ].map((n, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full ${n.color} animate-pulse`} />
            <span className="text-[#555] text-[10px] font-mono flex-1">{n.label}</span>
            <span className="text-emerald-400 text-[10px] font-mono">{n.lat}</span>
          </div>
        ))}
        <div className="border-t border-[#1a1a1a] pt-2 flex items-center justify-between">
          <span className="text-[#555] text-[10px]">Safety Rating</span>
          <span className="text-emerald-400 text-[10px] font-black">99.7%</span>
        </div>
      </div>
    ),
  },
  {
    id: 'ghost',
    badge: 'PRIVACY',
    icon: <Ghost size={40} className="text-purple-400" />,
    iconBg: 'bg-purple-500/10 border-purple-500/20',
    accentColor: 'text-purple-400',
    glowColor: 'bg-purple-600/10',
    title: 'Ghost Mode',
    subtitle: 'Zero-trace identity masking',
    desc: 'Toggle Ghost Mode to mask your identity completely. Your name, avatar, last seen, typing indicator and all metadata are hidden.',
    features: ['Name masked → Anonymous', 'Avatar hidden', 'Typing indicator off', 'Last seen hidden'],
    featureIcons: [<Ghost size={12} />, <Ghost size={12} />, <Ghost size={12} />, <Ghost size={12} />],
    preview: (
      <div className="p-3 bg-[#0d0d0d] rounded-2xl border border-[#1a1a1a]">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[#555] text-[10px] uppercase tracking-widest font-semibold">Ghost Mode</span>
          <div className="w-9 h-5 rounded-full bg-purple-600 relative flex-shrink-0">
            <div className="absolute right-0.5 top-0.5 w-4 h-4 rounded-full bg-white" />
          </div>
        </div>
        <div className="flex items-center gap-2 bg-[#1a1a1a] rounded-xl p-2">
          <div className="w-7 h-7 rounded-full bg-[#2a2a2a] flex items-center justify-center">
            <Ghost size={14} className="text-purple-400" />
          </div>
          <div>
            <p className="text-white text-[11px] font-semibold">Anonymous</p>
            <p className="text-purple-400 text-[9px]">Identity masked</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'groups',
    badge: 'GROUPS',
    icon: <Users size={40} className="text-amber-400" />,
    iconBg: 'bg-amber-500/10 border-amber-500/20',
    accentColor: 'text-amber-400',
    glowColor: 'bg-amber-600/10',
    title: 'Groups & Communities',
    subtitle: 'With admin controls',
    desc: 'Create groups, assign roles, manage members, pin messages, export history and monitor safety with dedicated AI insights.',
    features: ['Admin + member roles', 'Audit log', 'Group themes', 'Bulk member control'],
    featureIcons: [<Users size={12} />, <Check size={12} />, <Star size={12} />, <Zap size={12} />],
    preview: (
      <div className="p-3 bg-[#0d0d0d] rounded-2xl border border-[#1a1a1a] space-y-2">
        {[
          { name: 'AI Safety Group', type: 'Group', count: 3, color: 'bg-amber-500' },
          { name: 'John Doe', type: 'Direct', count: 1, color: 'bg-blue-500' },
          { name: 'Alice Smith', type: 'Direct', count: 0, color: 'bg-emerald-500' },
        ].map((c, i) => (
          <div key={i} className={`flex items-center gap-2 p-2 rounded-xl ${i === 0 ? 'bg-[#1a1a1a]' : ''}`}>
            <div className={`w-7 h-7 rounded-xl ${c.color} flex items-center justify-center text-white text-[10px] font-black`}>
              {c.name[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-[11px] font-semibold truncate">{c.name}</p>
              <p className="text-[#555] text-[9px]">{c.type}</p>
            </div>
            {c.count > 0 && (
              <div className="w-4 h-4 rounded-full bg-indigo-600 flex items-center justify-center text-white text-[8px] font-black">{c.count}</div>
            )}
          </div>
        ))}
      </div>
    ),
  },
  {
    id: 'power',
    badge: 'POWER TOOLS',
    icon: <Keyboard size={40} className="text-rose-400" />,
    iconBg: 'bg-rose-500/10 border-rose-500/20',
    accentColor: 'text-rose-400',
    glowColor: 'bg-rose-600/10',
    title: 'Keyboard-First Power Features',
    subtitle: 'Built for speed',
    desc: 'Command palette (Ctrl+K), global search (/), shortcuts for every action, dark/light/system theme, font size controls and more.',
    features: ['Ctrl+K command palette', 'Global search', 'Chat themes', 'Export history'],
    featureIcons: [<Keyboard size={12} />, <Search size={12} />, <Star size={12} />, <Check size={12} />],
    preview: (
      <div className="p-3 bg-[#0d0d0d] rounded-2xl border border-[#1a1a1a]">
        <div className="flex items-center gap-2 border border-[#2a2a2a] rounded-xl px-3 py-2 mb-2">
          <Search size={12} className="text-[#555]" />
          <span className="text-[#555] text-[11px] flex-1">Search messages...</span>
          <span className="text-[#333] text-[9px] font-mono bg-[#1a1a1a] px-1.5 py-0.5 rounded">/</span>
        </div>
        <div className="flex items-center gap-2 border border-[#2a2a2a] rounded-xl px-3 py-2">
          <span className="text-[#555] text-[11px] flex-1">Command palette</span>
          <span className="text-[#333] text-[9px] font-mono bg-[#1a1a1a] px-1.5 py-0.5 rounded">Ctrl+K</span>
        </div>
      </div>
    ),
  },
  {
    id: 'ready',
    badge: 'ALL SET',
    icon: <Zap size={40} className="text-indigo-400" />,
    iconBg: 'bg-indigo-500/10 border-indigo-500/20',
    accentColor: 'text-indigo-400',
    glowColor: 'bg-indigo-600/10',
    title: "You're ready to go!",
    subtitle: 'Start exploring Pulse',
    desc: 'Everything is set up and ready. Open a chat, try Ghost Mode, create a group, or press Ctrl+K to see all available commands.',
    features: ['Open a chat to start', 'Try Ghost Mode', 'Create a group', 'Press Ctrl+K'],
    featureIcons: [<MessageSquare size={12} />, <Ghost size={12} />, <Users size={12} />, <Keyboard size={12} />],
    preview: null,
  },
];

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const [animating, setAnimating] = useState(false);
  const { setHasSeenOnboarding } = useChatStore();
  const navigate = useNavigate();

  const finish = () => {
    setHasSeenOnboarding(true);
    navigate('/', { replace: true });
  };

  const goTo = useCallback((next: number) => {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => {
      setStep(next);
      setAnimating(false);
    }, 200);
  }, [animating]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'Enter') {
        if (step < SLIDES.length - 1) goTo(step + 1);
        else finish();
      }
      if (e.key === 'ArrowLeft' && step > 0) goTo(step - 1);
      if (e.key === 'Escape') finish();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [step, goTo]); // eslint-disable-line react-hooks/exhaustive-deps

  const isLast = step === SLIDES.length - 1;
  const slide = SLIDES[step];

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background glow */}
      <div className={`absolute inset-0 pointer-events-none transition-all duration-700`}>
        <div className={`absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] ${slide.glowColor} rounded-full blur-[120px] transition-all duration-700`} />
      </div>
      {/* Subtle grid */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{ backgroundImage: `linear-gradient(#6366f1 1px, transparent 1px), linear-gradient(90deg, #6366f1 1px, transparent 1px)`, backgroundSize: '48px 48px' }}
      />

      <div className="relative w-full max-w-lg">

        {/* Top bar */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-indigo-600 flex items-center justify-center">
              <Sparkles size={14} className="text-white" />
            </div>
            <span className="text-white font-black text-base tracking-tighter italic uppercase">PULSE</span>
          </div>
          <button onClick={finish} className="text-[#555] hover:text-[#8e8e93] text-xs transition-colors font-medium px-3 py-1.5 rounded-xl hover:bg-[#111]">
            Skip tour
          </button>
        </div>

        {/* Progress bar */}
        <div className="flex gap-1.5 mb-8">
          {SLIDES.map((_, i) => (
            <button key={i} onClick={() => goTo(i)}
              className="flex-1 h-1 rounded-full overflow-hidden bg-[#1a1a1a] hover:bg-[#222] transition-colors">
              <div
                className={`h-full rounded-full transition-all duration-500 ${i < step ? 'bg-indigo-500/60' : i === step ? 'bg-indigo-500' : 'bg-transparent'}`}
                style={{ width: i === step ? '100%' : i < step ? '100%' : '0%' }}
              />
            </button>
          ))}
        </div>

        {/* Main card */}
        <div className={`bg-[#0f0f0f] border border-[#1a1a1a] rounded-[2rem] overflow-hidden shadow-2xl transition-all duration-200 ${animating ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}>

          {/* Card header */}
          <div className="px-8 pt-8 pb-6 border-b border-[#1a1a1a]">
            <div className="flex items-start gap-5">
              {/* Icon */}
              <div className={`w-16 h-16 rounded-2xl border flex items-center justify-center flex-shrink-0 ${slide.iconBg}`}>
                {slide.icon}
              </div>
              {/* Text */}
              <div className="flex-1 min-w-0">
                <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-[#1a1a1a] border border-[#222] mb-2">
                  <span className="text-[9px] font-black text-[#555] uppercase tracking-[0.25em]">{slide.badge}</span>
                </div>
                <h2 className="text-white font-black text-xl leading-tight tracking-tight mb-1">{slide.title}</h2>
                <p className={`text-xs font-semibold ${slide.accentColor}`}>{slide.subtitle}</p>
              </div>
            </div>
          </div>

          {/* Card body */}
          <div className="px-8 py-6">
            <p className="text-[#8e8e93] text-sm leading-relaxed mb-6">{slide.desc}</p>

            {/* Preview (if any) */}
            {slide.preview && (
              <div className="mb-6">
                {slide.preview}
              </div>
            )}

            {/* Features */}
            <div className="grid grid-cols-2 gap-2">
              {slide.features.map((f, i) => (
                <div key={i} className="flex items-center gap-2 p-2.5 bg-[#111] rounded-xl border border-[#1a1a1a] hover:border-[#2a2a2a] transition-colors">
                  <span className={`${slide.accentColor} flex-shrink-0`}>{slide.featureIcons[i]}</span>
                  <span className="text-[#8e8e93] text-[11px] leading-tight">{f}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6 px-1">
          <button
            onClick={() => goTo(step - 1)}
            disabled={step === 0}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[#555] hover:text-[#8e8e93] hover:bg-[#111] disabled:opacity-20 transition-all text-sm font-medium"
          >
            <ChevronLeft size={16} /> Back
          </button>

          {/* Step counter */}
          <span className="text-[#333] text-[10px] font-mono">
            {String(step + 1).padStart(2, '0')} / {String(SLIDES.length).padStart(2, '0')}
          </span>

          <button
            onClick={isLast ? finish : () => goTo(step + 1)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm transition-all active:scale-[0.97] shadow-lg shadow-indigo-500/20"
          >
            {isLast ? 'Get Started' : 'Next'} <ChevronRight size={16} />
          </button>
        </div>

        {/* Keyboard hint */}
        <p className="text-center text-[#333] text-[10px] mt-4">
          Use <kbd className="bg-[#111] border border-[#222] rounded px-1 py-0.5 font-mono text-[9px] text-[#555]">←→</kbd> arrow keys or{' '}
          <kbd className="bg-[#111] border border-[#222] rounded px-1 py-0.5 font-mono text-[9px] text-[#555]">Esc</kbd> to skip
        </p>
      </div>
    </div>
  );
}