import { useState } from 'react';
import { Edit2 } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

interface AppLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showEditButton?: boolean;
  className?: string;
}

const LOGO_OPTIONS = ['⚡', '🚀', '🎯', '🔥', '💎', '🌟', '🎨', '💬', '🔮', '🛡️', '✦', '◈'];

export default function AppLogo({ size = 'md', showEditButton = false, className = '' }: AppLogoProps) {
  const { appLogo, updateAppLogo } = useAuthStore();
  const [showLogoPicker, setShowLogoPicker] = useState(false);

  const sizeClass = size === 'sm' ? 'text-base' : size === 'lg' ? 'text-2xl' : 'text-lg';

  return (
    <div className={`relative inline-flex items-center gap-1.5 ${className}`}>
      <span
        className={`${sizeClass} leading-none cursor-default select-none`}
        onClick={() => showEditButton && setShowLogoPicker(v => !v)}
      >
        {appLogo}
      </span>

      {showEditButton && (
        <>
          <button
            onClick={() => setShowLogoPicker(v => !v)}
            className="p-1 rounded-lg hover:bg-[#2a2a2a] transition-colors"
            title="Edit logo"
          >
            <Edit2 size={11} className="text-[#8e8e93]" />
          </button>

          {showLogoPicker && (
            <div className="absolute top-full mt-2 left-0 bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-4 shadow-2xl z-50 min-w-[160px]">
              <p className="text-[#8e8e93] text-[10px] font-medium uppercase tracking-widest mb-3">Choose Logo</p>
              <div className="grid grid-cols-4 gap-2">
                {LOGO_OPTIONS.map((logo) => (
                  <button
                    key={logo}
                    onClick={() => { updateAppLogo(logo); setShowLogoPicker(false); }}
                    className={`w-8 h-8 rounded-xl flex items-center justify-center text-base transition-all hover:scale-110 border ${
                      appLogo === logo
                        ? 'border-white bg-white/10'
                        : 'border-[#2a2a2a] hover:border-[#444] hover:bg-[#2a2a2a]'
                    }`}
                  >
                    {logo}
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}