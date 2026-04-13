import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-6">
      <div className="text-center space-y-6">
        <div className="text-[120px] font-black text-[#1a1a1a] leading-none select-none italic">404</div>
        <div>
          <h2 className="text-white font-black text-2xl tracking-tight mb-2">Page not found</h2>
          <p className="text-slate-500 text-sm">The page you're looking for doesn't exist or was moved.</p>
        </div>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl border border-slate-700 text-slate-300 hover:text-white hover:border-slate-500 transition-all text-sm font-medium"
          >
            <ArrowLeft size={15} /> Go back
          </button>
          <button
            onClick={() => navigate('/', { replace: true })}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white transition-all text-sm font-bold active:scale-95"
          >
            <Home size={15} /> Back to Pulse
          </button>
        </div>
      </div>
    </div>
  );
}