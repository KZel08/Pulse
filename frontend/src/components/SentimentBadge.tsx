import React from 'react';
import type { SentimentFull, ToneClass } from '../types';

interface SentimentBadgeProps {
  sentiment?: SentimentFull;
  tone?: ToneClass;
  size?: 'sm' | 'xs'; // default 'xs'
}

const SentimentBadge: React.FC<SentimentBadgeProps> = ({ sentiment, tone, size = 'xs' }) => {
  const sizeClasses = size === 'sm' ? 'text-[10px] px-2 py-1' : 'text-[9px] px-1.5 py-0.5';
  
  const sentimentColorMap: Record<SentimentFull, string> = {
    positive: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
    negative: 'bg-red-500/20 text-red-400 border border-red-500/30',
    neutral: 'bg-slate-500/20 text-slate-400 border border-slate-500/30',
    mixed: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
    sarcastic: 'bg-purple-500/20 text-purple-400 border border-purple-500/30',
    ambiguous: 'bg-slate-600/20 text-slate-500 border border-slate-600/30',
  };

  const toneColorMap: Record<ToneClass, string> = {
    formal: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
    informal: 'bg-teal-500/20 text-teal-400 border border-teal-500/30',
    aggressive: 'bg-orange-500/20 text-orange-400 border border-orange-500/30',
    empathetic: 'bg-pink-500/20 text-pink-400 border border-pink-500/30',
  };

  // Only show if sentiment or tone is explicitly set
  if (!sentiment && !tone) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-1">
      {sentiment && (
        <span className={`rounded-full font-semibold uppercase tracking-wide ${sizeClasses} ${sentimentColorMap[sentiment]}`}>
          {sentiment}
        </span>
      )}
      {tone && (
        <span className={`rounded-full font-semibold uppercase tracking-wide ${sizeClasses} ${toneColorMap[tone]}`}>
          {tone}
        </span>
      )}
    </div>
  );
};

export default SentimentBadge;
