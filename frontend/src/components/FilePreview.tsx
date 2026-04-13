import { useState, useEffect } from 'react';
import { X, Send, FileText, Music, Video, Archive, Image } from 'lucide-react';

interface FilePreviewProps {
  file: File;
  onClose: () => void;
  onSend: (caption: string) => void;
}

const getFileIcon = (type: string, name: string) => {
  if (type.startsWith('image/')) return <Image size={60} className="text-indigo-400" />;
  if (type.startsWith('video/')) return <Video size={60} className="text-[#007aff]" />;
  if (type.startsWith('audio/')) return <Music size={60} className="text-pink-400" />;
  if (name.endsWith('.zip') || name.endsWith('.rar')) return <Archive size={60} className="text-amber-400" />;
  return <FileText size={60} className="text-indigo-500" />;
};

const getFileSizeLabel = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export default function FilePreview({ file, onClose, onSend }: FilePreviewProps) {
  const [caption, setCaption] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [file]);

  const isImage = file.type.startsWith('image/');

  return (
    <div className="fixed inset-0 z-[100] bg-[#0f172a]/95 backdrop-blur-xl flex flex-col items-center justify-center p-6">
      <button onClick={onClose} className="absolute top-8 right-8 p-3 text-slate-500 hover:text-white transition-colors">
        <X size={28} />
      </button>

      <div className="w-full max-w-lg flex flex-col items-center gap-6">
        <p className="text-slate-500 text-xs font-black uppercase tracking-widest">Preview</p>

        {/* Image preview or file icon */}
        {isImage && previewUrl ? (
          <div className="w-full max-h-80 rounded-[2rem] overflow-hidden border border-slate-800">
            <img src={previewUrl} alt="preview" className="w-full h-full object-contain bg-slate-900" />
          </div>
        ) : (
          <div className="w-48 h-48 bg-indigo-600/10 border-2 border-dashed border-indigo-500/30 rounded-[3rem] flex flex-col items-center justify-center gap-3">
            {getFileIcon(file.type, file.name)}
            <p className="text-white font-bold text-sm px-4 truncate w-full text-center">{file.name}</p>
          </div>
        )}

        {/* File info */}
        <div className="flex items-center gap-4 text-center">
          <div>
            <p className="text-white font-bold text-sm truncate max-w-xs">{file.name}</p>
            <p className="text-slate-500 text-xs mt-0.5">{getFileSizeLabel(file.size)} · {file.type || 'Unknown type'}</p>
          </div>
        </div>

        {/* Caption input */}
        <div className="w-full bg-[#1e293b] border border-slate-800 rounded-[2.5rem] p-3 flex items-center gap-4">
          <input
            autoFocus
            type="text"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') onSend(caption); }}
            placeholder="Add a caption..."
            className="flex-1 bg-transparent border-none focus:ring-0 text-white px-6 outline-none placeholder-slate-500"
          />
          <button
            onClick={() => onSend(caption)}
            className="bg-indigo-600 hover:bg-indigo-500 p-5 rounded-2xl text-white transition-all active:scale-90"
          >
            <Send size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}