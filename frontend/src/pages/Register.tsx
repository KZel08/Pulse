import React, { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, MessageSquare, Ghost, Zap, ChevronLeft, ChevronRight, Lock, Eye, EyeOff, Sparkles, Check, Users, Star } from 'lucide-react';

function getPasswordStrength(pw: string): { label: string; color: string; bg: string; width: string; score: number } {
  if (pw.length === 0) return { label: '', color: 'text-transparent', bg: 'bg-transparent', width: '0%', score: 0 };
  if (pw.length < 6) return { label: 'Too short', color: 'text-red-400', bg: 'bg-red-500', width: '20%', score: 1 };
  if (pw.length < 8) return { label: 'Weak', color: 'text-red-400', bg: 'bg-red-400', width: '35%', score: 2 };
  if (pw.length < 10 && !/[^a-zA-Z0-9]/.test(pw)) return { label: 'Fair', color: 'text-amber-400', bg: 'bg-amber-400', width: '55%', score: 3 };
  if (pw.length >= 10 && /[^a-zA-Z0-9]/.test(pw)) return { label: 'Strong', color: 'text-emerald-400', bg: 'bg-emerald-500', width: '100%', score: 5 };
  return { label: 'Good', color: 'text-indigo-400', bg: 'bg-indigo-400', width: '75%', score: 4 };
}

const BENEFITS = [
  { icon: <MessageSquare size={14} className="text-indigo-400" />, text: 'Real-time encrypted messaging' },
  { icon: <Shield size={14} className="text-emerald-400" />, text: 'AI safety monitoring built-in' },
  { icon: <Ghost size={14} className="text-purple-400" />, text: 'Ghost Mode for full anonymity' },
  { icon: <Zap size={14} className="text-amber-400" />, text: '35+ productivity features' },
  { icon: <Users size={14} className="text-blue-400" />, text: 'Groups with admin controls' },
  { icon: <Lock size={14} className="text-rose-400" />, text: 'Zero data collection promise' },
];

const GridPattern = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute inset-0 opacity-[0.03]"
      style={{
        backgroundImage: `linear-gradient(#6366f1 1px, transparent 1px), linear-gradient(90deg, #6366f1 1px, transparent 1px)`,
        backgroundSize: '48px 48px',
      }}
    />
    <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
    <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl -translate-x-1/4 translate-y-1/4" />
  </div>
);

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const { register, user, isLoading, error, clearError } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate('/', { replace: true });
  }, [user, navigate]);

  useEffect(() => {
    if (error) clearError();
  }, [name, email, password, confirmPassword]); // eslint-disable-line react-hooks/exhaustive-deps

  const validate = (): boolean => {
    const errors: Record<string, string> = {};
    if (name.trim().length < 2) errors.name = 'Name must be at least 2 characters.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) errors.email = 'Enter a valid email address.';
    if (password.length < 6) errors.password = 'Password must be at least 6 characters.';
    if (confirmPassword !== password) errors.confirmPassword = 'Passwords do not match.';
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await register(email.trim(), password, name.trim());
      navigate('/', { replace: true });
    } catch {
      // error shown via store
    }
  };

  const strength = getPasswordStrength(password);

  const inputClass = useCallback((field: string) =>
    `w-full bg-[#111] border rounded-2xl px-4 py-3.5 text-white text-sm outline-none transition-all placeholder-[#444] hover:border-[#333] ${
      fieldErrors[field]
        ? 'border-red-500/40 focus:ring-2 focus:ring-red-500/20'
        : focusedField === field
          ? 'border-indigo-500/50 ring-2 ring-indigo-500/20'
          : 'border-[#222] focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/40'
    }`,
  [fieldErrors, focusedField]);

  const formComplete = name.trim().length >= 2 && email.trim().length > 0 && password.length >= 6 && confirmPassword === password;

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex overflow-hidden">

      {/* ── LEFT PANEL: Benefits ── */}
      <div className="hidden lg:flex flex-col w-[50%] relative bg-[#080808] overflow-hidden border-r border-[#1a1a1a]">
        <GridPattern />

        {/* Top nav */}
        <div className="relative z-10 flex items-center justify-between px-10 pt-8 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Sparkles size={16} className="text-white" />
            </div>
            <span className="text-white font-black text-lg tracking-tighter italic uppercase">PULSE</span>
          </div>
          <Link to="/login" className="text-[#555] text-xs hover:text-[#8e8e93] transition-colors font-medium">
            Already have an account →
          </Link>
        </div>

        {/* Hero text */}
        <div className="relative z-10 flex-1 flex flex-col justify-center px-10 pb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1a1a1a] border border-[#2a2a2a] mb-6 w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-black text-[#8e8e93] uppercase tracking-[0.2em]">Free forever · No credit card</span>
          </div>

          <h2 className="text-white font-black text-4xl leading-[1.05] tracking-tighter mb-4">
            Everything you need<br />
            <span className="text-indigo-400">in one secure place</span>
          </h2>

          <p className="text-[#555] text-sm leading-relaxed mb-10 max-w-sm">
            Join the next generation of secure communication. Create your account and get access to all features instantly.
          </p>

          {/* Benefits list */}
          <div className="space-y-3 mb-10">
            {BENEFITS.map((b, i) => (
              <div key={i} className="flex items-center gap-3 group">
                <div className="w-8 h-8 rounded-xl bg-[#111] border border-[#1a1a1a] flex items-center justify-center flex-shrink-0 group-hover:border-[#2a2a2a] transition-colors">
                  {b.icon}
                </div>
                <span className="text-[#8e8e93] text-sm">{b.text}</span>
                <Check size={12} className="text-emerald-500 ml-auto opacity-60" />
              </div>
            ))}
          </div>

          {/* Social proof */}
          <div className="flex items-center gap-4 pt-8 border-t border-[#1a1a1a]">
            <div className="flex -space-x-2">
              {['#6366f1', '#10b981', '#f59e0b', '#ec4899'].map((c, i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-[#0a0a0a] flex items-center justify-center text-[10px] font-black text-white"
                  style={{ background: c }}>
                  {String.fromCharCode(65 + i)}
                </div>
              ))}
            </div>
            <div>
              <div className="flex items-center gap-1 mb-0.5">
                {[1,2,3,4,5].map(i => <Star key={i} size={10} className="text-amber-400 fill-amber-400" />)}
              </div>
              <p className="text-[#555] text-[10px]">Loved by privacy-first teams</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL: Register Form ── */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 relative bg-[#0a0a0a] overflow-y-auto">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-600/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-48 h-48 bg-purple-600/5 rounded-full blur-2xl" />
        </div>

        <div className="relative w-full max-w-sm">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg">
              <Sparkles size={20} className="text-white" />
            </div>
            <span className="text-white font-black text-2xl tracking-tighter italic uppercase">PULSE</span>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-white font-black text-3xl tracking-tight mb-2" style={{ letterSpacing: '-0.02em' }}>
              Create account
            </h1>
            <p className="text-[#555] text-sm">Free forever. No credit card required.</p>
          </div>

          {/* Progress indicator */}
          <div className="flex items-center gap-2 mb-6">
            <div className="flex-1 h-1 rounded-full bg-[#1a1a1a] overflow-hidden">
              <div
                className="h-full rounded-full bg-indigo-500 transition-all duration-500"
                style={{ width: formComplete ? '100%' : `${[name.trim().length >= 2, email.length > 0, password.length >= 6, confirmPassword === password && confirmPassword.length > 0].filter(Boolean).length * 25}%` }}
              />
            </div>
            <span className="text-[#555] text-[10px] font-medium whitespace-nowrap">
              {formComplete ? '✓ Ready' : 'Fill form'}
            </span>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">

            {/* Name */}
            <div className="space-y-1.5">
              <label className="text-[#8e8e93] text-[11px] font-semibold uppercase tracking-wider">Full Name</label>
              <div className="relative">
                <input
                  type="text" placeholder="Your full name" value={name}
                  onChange={e => setName(e.target.value)}
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField(null)}
                  className={inputClass('name')}
                />
                {name.trim().length >= 2 && (
                  <Check size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-400" />
                )}
              </div>
              {fieldErrors.name && <p className="text-red-400 text-[11px] font-semibold ml-1">{fieldErrors.name}</p>}
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-[#8e8e93] text-[11px] font-semibold uppercase tracking-wider">Email</label>
              <div className="relative">
                <input
                  type="email" placeholder="your@email.com" value={email}
                  onChange={e => setEmail(e.target.value)}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  className={inputClass('email')}
                />
                {/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) && (
                  <Check size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-400" />
                )}
              </div>
              {fieldErrors.email && <p className="text-red-400 text-[11px] font-semibold ml-1">{fieldErrors.email}</p>}
            </div>

            {/* Password + strength bar */}
            <div className="space-y-1.5">
              <label className="text-[#8e8e93] text-[11px] font-semibold uppercase tracking-wider">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'} placeholder="At least 6 characters" value={password}
                  onChange={e => setPassword(e.target.value)}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  className={`${inputClass('password')} pr-12`}
                />
                <button type="button" onClick={() => setShowPassword(v => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#555] hover:text-[#8e8e93] transition-colors">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {password.length > 0 && (
                <div className="space-y-1.5 px-1">
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map(i => (
                      <div key={i} className={`flex-1 h-1 rounded-full transition-all duration-300 ${i <= strength.score ? strength.bg : 'bg-[#1a1a1a]'}`} />
                    ))}
                  </div>
                  <p className={`text-[10px] font-black uppercase tracking-widest ${strength.color}`}>{strength.label}</p>
                </div>
              )}
              {fieldErrors.password && <p className="text-red-400 text-[11px] font-semibold ml-1">{fieldErrors.password}</p>}
            </div>

            {/* Confirm password */}
            <div className="space-y-1.5">
              <label className="text-[#8e8e93] text-[11px] font-semibold uppercase tracking-wider">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'} placeholder="Repeat password" value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  onFocus={() => setFocusedField('confirm')}
                  onBlur={() => setFocusedField(null)}
                  className={`${inputClass('confirmPassword')} pr-12`}
                />
                <button type="button" onClick={() => setShowConfirm(v => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#555] hover:text-[#8e8e93] transition-colors">
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {fieldErrors.confirmPassword && <p className="text-red-400 text-[11px] font-semibold ml-1">{fieldErrors.confirmPassword}</p>}
              {confirmPassword.length > 0 && !fieldErrors.confirmPassword && confirmPassword === password && (
                <p className="text-emerald-400 text-[10px] font-black uppercase tracking-widest ml-1 flex items-center gap-1">
                  <Check size={10} /> Passwords match
                </p>
              )}
            </div>

            {/* Server error */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl px-4 py-3 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-black py-3.5 rounded-2xl shadow-xl shadow-indigo-500/20 transition-all active:scale-[0.98] text-sm tracking-wide mt-2"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Creating account...
                </span>
              ) : 'CREATE FREE ACCOUNT'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-[#1a1a1a]" />
            <span className="text-[#333] text-[10px] font-medium uppercase tracking-widest">or</span>
            <div className="flex-1 h-px bg-[#1a1a1a]" />
          </div>

          <p className="text-center text-[#555] text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">Sign in</Link>
          </p>

          <div className="mt-6 flex items-center justify-center gap-2 text-[#333] text-[10px]">
            <Lock size={10} />
            <span>Your data is encrypted and never sold</span>
          </div>
        </div>
      </div>
    </div>
  );
}