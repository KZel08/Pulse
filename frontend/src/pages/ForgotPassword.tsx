import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Mail, CheckCircle2 } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) setSent(true);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4">
      <div className="bg-[#1e293b]/50 p-10 rounded-[2.5rem] border border-slate-800 w-full max-w-md backdrop-blur-2xl shadow-2xl">

        <button onClick={() => navigate('/login')} className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors mb-8 text-sm">
          <ArrowLeft size={16} /> Back to login
        </button>

        <h1 className="text-3xl font-black text-white mb-2 tracking-tighter">Forgot Password</h1>
        <p className="text-slate-400 text-sm mb-8">Enter your email and we'll send a reset link.</p>

        {!sent ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="email" placeholder="Your email address" value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-[#0f172a] border border-slate-800 rounded-2xl pl-11 pr-5 py-4 text-white outline-none focus:ring-2 focus:ring-indigo-500 placeholder-slate-500"
              />
            </div>
            <button type="submit" disabled={!email.trim()}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-black py-4 rounded-2xl transition-all active:scale-95"
            >
              SEND RESET LINK
            </button>
          </form>
        ) : (
          <div className="flex flex-col items-center gap-4 py-6">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <CheckCircle2 size={32} className="text-emerald-400" />
            </div>
            <p className="text-white font-semibold text-center">Check your inbox</p>
            <p className="text-slate-400 text-sm text-center">
              We sent a reset link to <span className="text-indigo-400">{email}</span>.<br />
              (This is a demo — no real email is sent.)
            </p>
            <Link to="/login" className="mt-2 text-indigo-400 hover:text-indigo-300 text-sm font-bold transition-colors">
              Back to Sign In
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}