import React, { useState, useRef } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { Upload } from 'lucide-react';

interface AvatarProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showUploadButton?: boolean;
  className?: string;
}

const DEFAULT_AVATARS = [
  { id: 'a1', bg: '#6366f1' },
  { id: 'a2', bg: '#8b5cf6' },
  { id: 'a3', bg: '#ec4899' },
  { id: 'a4', bg: '#14b8a6' },
  { id: 'a5', bg: '#f59e0b' },
  { id: 'a6', bg: '#10b981' },
  { id: 'a7', bg: '#3b82f6' },
  { id: 'a8', bg: '#ef4444' },
];

const sizeClasses = {
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-xl',
};

export default function Avatar({ size = 'md', showUploadButton = false, className = '' }: AvatarProps) {
  const { user, avatar, updateAvatar } = useAuthStore();
  const [showPicker, setShowPicker] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null); // F7

  const initials = user?.name?.[0]?.toUpperCase() || 'U';
  const bgColor = avatar || '#6366f1';
  const isImageUrl = avatar.startsWith('data:') || avatar.startsWith('http');

  // F7: handle real file upload → convert to base64
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      updateAvatar(base64);
      setShowPicker(false);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className={`relative inline-block flex-shrink-0 ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileUpload}
      />

      {/* Avatar display */}
      <div
        className={`${sizeClasses[size]} rounded-full overflow-hidden flex items-center justify-center border-2 border-[#2a2a2a]`}
        style={{ backgroundColor: isImageUrl ? undefined : bgColor }}
      >
        {isImageUrl ? (
          <img src={avatar} alt={user?.name || 'User'} className="w-full h-full object-cover" />
        ) : (
          <span className="text-white font-bold select-none leading-none">{initials}</span>
        )}
      </div>

      {/* Edit trigger */}
      {showUploadButton && (
        <>
          <button
            onClick={() => setShowPicker(v => !v)}
            className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-[#2a2a2a] border border-[#3a3a3a] rounded-full flex items-center justify-center hover:bg-[#333] transition-colors z-10"
            title="Change avatar"
          >
            <span className="text-[#8e8e93] text-[9px] leading-none">✎</span>
          </button>

          {showPicker && (
            <div
              className="absolute top-full mt-3 left-1/2 -translate-x-1/2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-4 shadow-2xl z-50"
              style={{ minWidth: 180 }}
            >
              <p className="text-[#8e8e93] text-[10px] font-medium uppercase tracking-widest mb-3 text-center">
                Choose Avatar
              </p>
              <div className="grid grid-cols-4 gap-2 justify-items-center mb-3">
                {DEFAULT_AVATARS.map((av) => (
                  <button
                    key={av.id}
                    onClick={() => { updateAvatar(av.bg); setShowPicker(false); }}
                    className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all hover:scale-110 active:scale-95 ${
                      avatar === av.bg ? 'border-white' : 'border-transparent hover:border-[#444]'
                    }`}
                    style={{ backgroundColor: av.bg }}
                  >
                    <span className="text-white text-xs font-bold leading-none">{initials}</span>
                  </button>
                ))}
              </div>

              {/* F7: Upload photo button */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-xl border border-[#2a2a2a] hover:bg-[#2a2a2a] text-[#8e8e93] hover:text-white transition-colors text-[10px] font-medium uppercase tracking-widest"
              >
                <Upload size={11} /> Upload Photo
              </button>

              {avatar && (
                <button
                  onClick={() => { updateAvatar(''); setShowPicker(false); }}
                  className="w-full mt-2 text-[10px] text-[#555] hover:text-white transition-colors text-center uppercase tracking-widest"
                >
                  Reset
                </button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}