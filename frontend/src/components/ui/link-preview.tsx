import React, { useState, useEffect } from 'react';
import { ExternalLink, Globe, FileText, Image, Video, Music, Archive, Code, Calendar, User, Building, Shield, Clock } from 'lucide-react';

interface LinkPreviewProps {
  url: string;
  className?: string;
}

interface PreviewData {
  title?: string;
  description?: string;
  image?: string;
  siteName?: string;
  author?: string;
  publishedTime?: string;
  type?: 'article' | 'website' | 'image' | 'video' | 'audio' | 'document' | 'code' | 'archive';
  favicon?: string;
}

const URL_REGEX = /(https?:\/\/[^\s]+)/g;

function getDomainFromUrl(url: string): string {
  try {
    const domain = new URL(url).hostname;
    return domain.replace('www.', '');
  } catch {
    return '';
  }
}

function getFileType(url: string): PreviewData['type'] {
  const lowerUrl = url.toLowerCase();
  if (lowerUrl.match(/\.(jpg|jpeg|png|gif|webp|bmp|svg)$/)) return 'image';
  if (lowerUrl.match(/\.(mp4|webm|ogg|avi|mov)$/)) return 'video';
  if (lowerUrl.match(/\.(mp3|wav|ogg|flac|aac)$/)) return 'audio';
  if (lowerUrl.match(/\.(pdf|doc|docx|txt|rtf)$/)) return 'document';
  if (lowerUrl.match(/\.(zip|rar|tar|gz|7z)$/)) return 'archive';
  if (lowerUrl.match(/\.(js|ts|jsx|tsx|html|css|json|xml|py|java|cpp|c|go|rs|php)$/)) return 'code';
  return 'website';
}

function getIconForType(type?: PreviewData['type']) {
  switch (type) {
    case 'image': return <Image size={14} />;
    case 'video': return <Video size={14} />;
    case 'audio': return <Music size={14} />;
    case 'document': return <FileText size={14} />;
    case 'archive': return <Archive size={14} />;
    case 'code': return <Code size={14} />;
    default: return <Globe size={14} />;
  }
}

export function extractUrls(text: string): string[] {
  const matches = text.match(URL_REGEX);
  return matches || [];
}

export function LinkPreview({ url, className = '' }: LinkPreviewProps) {
  const [preview, setPreview] = useState<PreviewData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchPreview = async () => {
      setLoading(true);
      setError(false);
      
      try {
        // Simulate API call for link preview
        // In a real app, you would call your backend API or a service like OpenGraph
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const domain = getDomainFromUrl(url);
        const fileType = getFileType(url);
        
        // Generate mock preview data based on URL patterns
        const mockPreview: PreviewData = {
          title: `${domain.charAt(0).toUpperCase() + domain.slice(1)} - ${fileType === 'website' ? 'Website' : (fileType?.charAt(0)?.toUpperCase() || 'File') + (fileType?.slice(1) || '')}`,
          description: `Content from ${domain}. This is a preview of the shared link.`,
          siteName: domain,
          type: fileType || 'website',
          image: fileType === 'image' ? url : undefined,
        };

        // Special handling for common domains
        if (domain.includes('github')) {
          mockPreview.title = 'GitHub Repository';
          mockPreview.description = 'Code repository on GitHub';
          mockPreview.siteName = 'GitHub';
          mockPreview.type = 'code';
        } else if (domain.includes('youtube') || domain.includes('youtu.be')) {
          mockPreview.title = 'YouTube Video';
          mockPreview.description = 'Video content on YouTube';
          mockPreview.siteName = 'YouTube';
          mockPreview.type = 'video';
        } else if (domain.includes('twitter') || domain.includes('x.com')) {
          mockPreview.title = 'Twitter/X Post';
          mockPreview.description = 'Social media post on X';
          mockPreview.siteName = 'X';
        } else if (domain.includes('linkedin')) {
          mockPreview.title = 'LinkedIn Post';
          mockPreview.description = 'Professional content on LinkedIn';
          mockPreview.siteName = 'LinkedIn';
        } else if (domain.includes('medium')) {
          mockPreview.title = 'Medium Article';
          mockPreview.description = 'Article on Medium';
          mockPreview.siteName = 'Medium';
          mockPreview.type = 'article';
        }

        setPreview(mockPreview);
      } catch (err) {
        console.error('Failed to fetch preview:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (url) {
      fetchPreview();
    }
  }, [url]);

  if (loading) {
    return (
      <div className={`p-3 rounded-xl bg-[#0f172a] border border-slate-900 animate-pulse ${className}`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center">
            <div className="w-4 h-4 bg-slate-700 rounded animate-pulse" />
          </div>
          <div className="flex-1">
            <div className="h-4 bg-slate-800 rounded w-3/4 mb-2 animate-pulse" />
            <div className="h-3 bg-slate-800 rounded w-1/2 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-3 rounded-xl bg-[#0f172a] border border-slate-900 ${className}`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center">
            <ExternalLink size={14} className="text-slate-500" />
          </div>
          <div className="flex-1">
            <a 
              href={url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs text-indigo-400 hover:text-indigo-300 truncate block"
            >
              {url}
            </a>
            <p className="text-[8px] text-slate-600">Preview unavailable</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <a 
      href={url} 
      target="_blank" 
      rel="noopener noreferrer"
      className={`block p-3 rounded-xl bg-[#0f172a] border border-slate-900 hover:border-slate-700 transition-all hover:bg-[#1e293b] group ${className}`}
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0 group-hover:bg-slate-700 transition-colors">
          {getIconForType(preview?.type)}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-xs font-bold text-white truncate group-hover:text-indigo-400 transition-colors">
              {preview?.title || getDomainFromUrl(url)}
            </h4>
            <ExternalLink size={10} className="text-slate-500 group-hover:text-indigo-400 transition-colors flex-shrink-0" />
          </div>
          
          {preview?.description && (
            <p className="text-[10px] text-slate-400 line-clamp-2 mb-1">
              {preview.description}
            </p>
          )}
          
          <div className="flex items-center gap-2">
            {preview?.siteName && (
              <span className="text-[8px] text-slate-600 font-medium uppercase tracking-wider">
                {preview.siteName}
              </span>
            )}
            {preview?.publishedTime && (
              <span className="text-[8px] text-slate-600 flex items-center gap-1">
                <Clock size={8} />
                {preview.publishedTime}
              </span>
            )}
          </div>
        </div>
      </div>
      
      {preview?.image && preview.type === 'image' && (
        <div className="mt-2 rounded-lg overflow-hidden">
          <img 
            src={preview.image} 
            alt={preview.title}
            className="w-full h-20 object-cover"
            loading="lazy"
          />
        </div>
      )}
    </a>
  );
}
