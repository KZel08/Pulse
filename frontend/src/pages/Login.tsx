import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate, Link } from 'react-router-dom';
import { Bell, Shield, MessageSquare, Ghost, Zap, ChevronLeft, ChevronRight, Lock, Eye, EyeOff, Sparkles, Users, FileText, Star } from 'lucide-react';

// Feature carousel slides — shown on the left panel
const FEATURE_SLIDES = [
  {
    icon: <MessageSquare size={40} className="text-indigo-400" />,
    badge: 'REAL-TIME',
    title: 'Messages that move at the speed of thought',
    desc: 'Instant delivery, read receipts, reactions, replies and file sharing — all in one elegant interface.',
    stat: '< 50ms',
    statLabel: 'average latency',
    accent: 'from-indigo-600/20 to-purple-600/10',
    dots: ['bg-indigo-500', 'bg-purple-400', 'bg-blue-400'],
  },
  {
    icon: <Shield size={40} className="text-emerald-400" />,
    badge: 'AI SAFETY',
    title: 'A 12-node AI grid watches every message',
    desc: 'Toxic content, sentiment spikes, and security threats are flagged before they reach you.',
    stat: '99.7%',
    statLabel: 'threat detection rate',
    accent: 'from-emerald-600/20 to-teal-600/10',
    dots: ['bg-emerald-500', 'bg-teal-400', 'bg-cyan-400'],
  },
  {
    icon: <Ghost size={40} className="text-purple-400" />,
    badge: 'GHOST MODE',
    title: 'Disappear completely when you need to',
    desc: 'One toggle hides your name, avatar, last seen, typing indicator and all metadata.',
    stat: '100%',
    statLabel: 'identity masked',
    accent: 'from-purple-600/20 to-violet-600/10',
    dots: ['bg-purple-500', 'bg-violet-400', 'bg-fuchsia-400'],
  },
  {
    icon: <Zap size={40} className="text-amber-400" />,
    badge: 'PRODUCTIVITY',
    title: 'Keyboard-first power-user features',
    desc: 'Command palette (Ctrl+K), global search, group management, export, starred messages and more.',
    stat: '35+',
    statLabel: 'power features',
    accent: 'from-amber-600/20 to-orange-600/10',
    dots: ['bg-amber-500', 'bg-orange-400', 'bg-yellow-400'],
  },
  {
    icon: <Users size={40} className="text-blue-400" />,
    badge: 'GROUPS',
    title: 'Build communities, not just chats',
    desc: 'Create groups with roles, admin controls, audit logs, mute, pin messages and group themes.',
    stat: 'Unlimited',
    statLabel: 'group members',
    accent: 'from-blue-600/20 to-sky-600/10',
    dots: ['bg-blue-500', 'bg-sky-400', 'bg-cyan-400'],
  },
  {
    icon: <FileText size={40} className="text-rose-400" />,
    badge: 'MEDIA',
    title: 'Share files, images and voice with ease',
    desc: 'Drag-drop uploads, media gallery, link previews, and a searchable message history.',
    stat: 'All types',
    statLabel: 'supported formats',
    accent: 'from-rose-600/20 to-pink-600/10',
    dots: ['bg-rose-500', 'bg-pink-400', 'bg-fuchsia-400'],
  },
];

// Animated background grid pattern
const GridPattern = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute inset-0 opacity-[0.03]"
      style={{
        backgroundImage: `linear-gradient(#6366f1 1px, transparent 1px), linear-gradient(90deg, #6366f1 1px, transparent 1px)`,
        backgroundSize: '48px 48px',
      }}
    />
    <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
    <div className="absolute bottom-0 right-0 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl translate-x-1/4 translate-y-1/4" />
    <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-blue-600/5 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2" />
  </div>
);

// Floating badge component
const FloatingBadge = ({ icon, text, pos }: { icon: React.ReactNode; text: string; pos: string }) => (
  <div className={`absolute ${pos} flex items-center gap-2 bg-[#1a1a1a]/90 backdrop-blur-sm border border-[#2a2a2a] rounded-2xl px-3 py-2 shadow-xl animate-pulse`}
    style={{ animationDuration: '3s' }}>
    {icon}
    <span className="text-white text-[10px] font-semibold whitespace-nowrap">{text}</span>
  </div>
);

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(''); // BONUS: inline error
  const [showNotifBanner, setShowNotifBanner] = useState(false); // C8
  const [showPassword, setShowPassword] = useState(false); // NEW: toggle password visibility
  const [isSubmitting, setIsSubmitting] = useState(false); // NEW: loading state
  const [currentSlide, setCurrentSlide] = useState(0); // NEW: carousel
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('right'); // NEW: animation direction
  const { login, user } = useAuthStore();
  const navigate = useNavigate();

  // Auto-advance carousel
  useEffect(() => {
    const t = setInterval(() => {
      setSlideDirection('right');
      setCurrentSlide(s => (s + 1) % FEATURE_SLIDES.length);
    }, 4500);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (user) navigate('/', { replace: true });
  }, [user, navigate]);

  const handlePrev = () => {
    setSlideDirection('left');
    setCurrentSlide(s => (s - 1 + FEATURE_SLIDES.length) % FEATURE_SLIDES.length);
  };

  const handleNext = () => {
    setSlideDirection('right');
    setCurrentSlide(s => (s + 1) % FEATURE_SLIDES.length);
  };

  // C8: after login check notification permission
  const requestNotifPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission();
    }
    setShowNotifBanner(false);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsSubmitting(true);
    if (username === 'abh' && password === '123') {
      await login('abh@pulse.com', '123');
      // C8: show notification banner if permission not decided
      if ('Notification' in window && Notification.permission === 'default') {
        setShowNotifBanner(true);
      }
      navigate('/', { replace: true });
    } else {
      setLoginError('Invalid credentials. Hint: abh / 123'); // BONUS: no more alert()
      setIsSubmitting(false);
    }
  };

  const slide = FEATURE_SLIDES[currentSlide];

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex overflow-hidden">

      {/* C8: Notification permission banner */}
      {showNotifBanner && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[999] w-full max-w-md">
          <div className="mx-4 bg-[#1e293b] border border-indigo-500/30 rounded-2xl px-5 py-4 shadow-2xl flex items-start gap-3">
            <Bell size={18} className="text-indigo-400 mt-0.5 shrink-0" />
            <div className="flex-1">
              <p className="text-white text-sm font-semibold">Enable notifications</p>
              <p className="text-slate-400 text-xs mt-0.5">Get notified when you receive new messages on Pulse.</p>
            </div>
            <div className="flex gap-2 shrink-0 mt-0.5">
              <button onClick={requestNotifPermission} className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors">Allow</button>
              <button onClick={() => setShowNotifBanner(false)} className="text-xs font-bold text-slate-500 hover:text-slate-300 transition-colors">Later</button>
            </div>
          </div>
        </div>
      )}

      {/* ── LEFT PANEL: Feature Carousel ── */}
      <div className="hidden lg:flex flex-col w-[55%] relative bg-[#080808] overflow-hidden border-r border-[#1a1a1a]">
        <GridPattern />

        {/* Top nav bar */}
        <div className="relative z-10 flex items-center justify-between px-10 pt-8 pb-4">
          <button 
            onClick={() => navigate('/landing')}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Sparkles size={16} className="text-white" />
            </div>
            <span className="text-white font-black text-lg tracking-tighter italic uppercase">PULSE</span>
          </button>
          <div className="flex items-center gap-2 text-[10px] text-[#555] font-medium uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Secure · Encrypted · Live
          </div>
        </div>

        {/* Main carousel content */}
        <div className="relative z-10 flex-1 flex flex-col items-start justify-center px-10 pb-10">

          {/* Big background accent gradient */}
          <div className={`absolute inset-0 bg-gradient-to-br ${slide.accent} transition-all duration-700 pointer-events-none`} />

          {/* Badge */}
          <div className="relative flex items-center gap-2 mb-6">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1a1a1a] border border-[#2a2a2a]">
              <span className="text-[10px] font-black text-[#8e8e93] uppercase tracking-[0.2em]">{slide.badge}</span>
            </div>
          </div>

          {/* Icon */}
          <div className="relative mb-6 w-20 h-20 rounded-[1.5rem] bg-[#111] border border-[#2a2a2a] flex items-center justify-center shadow-2xl">
            {slide.icon}
          </div>

          {/* Headline */}
          <h2 className="relative text-white font-black text-3xl leading-[1.1] tracking-tight mb-4 max-w-sm"
            style={{ letterSpacing: '-0.02em' }}>
            {slide.title}
          </h2>

          {/* Description */}
          <p className="relative text-[#8e8e93] text-sm leading-relaxed max-w-sm mb-8">
            {slide.desc}
          </p>

          {/* Stat */}
          <div className="relative flex items-end gap-3 mb-10">
            <div className="text-white font-black text-4xl tracking-tighter">{slide.stat}</div>
            <div className="text-[#555] text-xs font-medium uppercase tracking-widest mb-1.5">{slide.statLabel}</div>
          </div>

          {/* Carousel controls */}
          <div className="relative flex items-center gap-4">
            <button onClick={handlePrev}
              className="w-9 h-9 rounded-full bg-[#1a1a1a] border border-[#2a2a2a] hover:border-[#3a3a3a] hover:bg-[#222] flex items-center justify-center text-[#8e8e93] hover:text-white transition-all">
              <ChevronLeft size={16} />
            </button>

            {/* Dot indicators */}
            <div className="flex items-center gap-1.5">
              {FEATURE_SLIDES.map((_, i) => (
                <button key={i} onClick={() => setCurrentSlide(i)}
                  className={`rounded-full transition-all duration-300 ${i === currentSlide ? 'w-6 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-[#333] hover:bg-[#555]'}`}
                />
              ))}
            </div>

            <button onClick={handleNext}
              className="w-9 h-9 rounded-full bg-[#1a1a1a] border border-[#2a2a2a] hover:border-[#3a3a3a] hover:bg-[#222] flex items-center justify-center text-[#8e8e93] hover:text-white transition-all">
              <ChevronRight size={16} />
            </button>

            <span className="text-[#555] text-[10px] font-mono ml-2">
              {String(currentSlide + 1).padStart(2, '0')} / {String(FEATURE_SLIDES.length).padStart(2, '0')}
            </span>
          </div>
        </div>

        {/* Floating badges (decorative) */}
        <FloatingBadge icon={<Shield size={12} className="text-emerald-400" />} text="AI Safety Active" pos="top-24 right-8" />
        <FloatingBadge icon={<Lock size={12} className="text-indigo-400" />} text="End-to-end encrypted" pos="top-40 right-16" />
        <FloatingBadge icon={<Star size={12} className="text-amber-400" />} text="35+ power features" pos="bottom-32 right-8" />

        {/* Bottom testimonial strip */}
        <div className="relative z-10 border-t border-[#1a1a1a] px-10 py-5 flex items-center gap-4">
          <div className="flex -space-x-2">
            {['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#06b6d4'].map((c, i) => (
              <div key={i} className="w-7 h-7 rounded-full border-2 border-[#0a0a0a] flex items-center justify-center text-[9px] font-black text-white"
                style={{ background: c, zIndex: 5 - i }}>
                {String.fromCharCode(65 + i)}
              </div>
            ))}
          </div>
          <div>
            <p className="text-white text-xs font-semibold">Join thousands of secure teams</p>
            <p className="text-[#555] text-[10px]">Built for privacy-first communication</p>
          </div>
          <div className="ml-auto flex items-center gap-1">
            {[1,2,3,4,5].map(i => <Star key={i} size={10} className="text-amber-400 fill-amber-400" />)}
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL: Sign In Form ── */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 relative bg-[#0a0a0a]">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-600/5 rounded-full blur-2xl" />
        </div>

        <div className="relative w-full max-w-sm">

          {/* Mobile logo (shown only on small screens when left panel hidden) */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg">
              <Sparkles size={20} className="text-white" />
            </div>
            <span className="text-white font-black text-2xl tracking-tighter italic uppercase">PULSE</span>
          </div>

          {/* Header text */}
          <div className="mb-8">
            <h1 className="text-white font-black text-3xl tracking-tight mb-2" style={{ letterSpacing: '-0.02em' }}>
              Welcome back
            </h1>
            <p className="text-[#555] text-sm">Sign in to continue to Pulse</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSignIn} className="space-y-4">
            {/* Username */}
            <div className="space-y-1.5">
              <label className="text-[#8e8e93] text-[11px] font-semibold uppercase tracking-wider">Username</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  autoComplete="username"
                  onChange={(e) => { setUsername(e.target.value); setLoginError(''); }}
                  className="w-full bg-[#111] border border-[#222] rounded-2xl px-4 py-3.5 text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 placeholder-[#444] transition-all hover:border-[#333]"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[#8e8e93] text-[11px] font-semibold uppercase tracking-wider">Password</label>
                <Link to="/forgot-password" className="text-indigo-400 hover:text-indigo-300 text-[11px] font-medium transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  autoComplete="current-password"
                  onChange={(e) => { setPassword(e.target.value); setLoginError(''); }}
                  className="w-full bg-[#111] border border-[#222] rounded-2xl px-4 py-3.5 text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 placeholder-[#444] transition-all hover:border-[#333] pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#555] hover:text-[#8e8e93] transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* BONUS: inline error instead of alert */}
            {loginError && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl px-4 py-3 font-medium flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
                {loginError}
              </div>
            )}

            {/* Sign in button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-black py-3.5 rounded-2xl shadow-xl shadow-indigo-500/20 transition-all active:scale-[0.98] text-sm tracking-wide mt-2"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Signing in...
                </span>
              ) : 'SIGN IN'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-[#1a1a1a]" />
            <span className="text-[#333] text-[10px] font-medium uppercase tracking-widest">or</span>
            <div className="flex-1 h-px bg-[#1a1a1a]" />
          </div>

          {/* Register link */}
          <p className="text-center text-[#555] text-sm">
            Don't have an account?{' '}
            <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
              Create one free
            </Link>
          </p>

          {/* Security note */}
          <div className="mt-8 flex items-center justify-center gap-2 text-[#333] text-[10px]">
            <Lock size={10} />
            <span>Protected by end-to-end encryption</span>
          </div>

          {/* Feature pills (mobile only) */}
          <div className="lg:hidden mt-8 flex flex-wrap gap-2 justify-center">
            {['AI Safety', 'Ghost Mode', 'Real-time', 'Groups', 'Encrypted'].map(f => (
              <span key={f} className="px-3 py-1 rounded-full bg-[#111] border border-[#222] text-[#555] text-[10px] font-medium">
                {f}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}