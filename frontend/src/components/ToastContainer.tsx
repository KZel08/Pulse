import { X, MessageCircle, AlertTriangle, Shield } from 'lucide-react';
import { useChatStore } from '../store/useChatStore';

export default function ToastContainer() {
  const { toasts, removeToast } = useChatStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-2xl border shadow-2xl min-w-[260px] max-w-xs ${
            toast.type === 'alert'
              ? 'bg-[#1a1a1a] border-red-500/20'
              : 'bg-[#1a1a1a] border-[#2a2a2a]'
          }`}
          style={{ animation: 'slideInRight 0.2s ease-out' }}
        >
          <div className="mt-0.5 shrink-0">
            {toast.type === 'alert' && <AlertTriangle size={14} className="text-red-400" />}
            {toast.type === 'system' && <Shield size={14} className="text-[#8e8e93]" />}
            {toast.type === 'message' && <MessageCircle size={14} className="text-[#8e8e93]" />}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-medium leading-none mb-1 truncate">{toast.title}</p>
            <p className="text-[#8e8e93] text-[11px] leading-snug">{toast.message}</p>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="shrink-0 p-0.5 rounded-lg hover:bg-[#2a2a2a] transition-colors text-[#555] hover:text-white"
          >
            <X size={12} />
          </button>
        </div>
      ))}
    </div>
  );
}