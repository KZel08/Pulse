import React from 'react';
import { useChatStore } from '../store/useChatStore';
import type { SentimentFull } from '../types';

const ToneHeatmap: React.FC = () => {
  const { activeChat, messages } = useChatStore();

  if (!activeChat || !messages[activeChat.id]) {
    return (
      <div className="p-3 rounded-xl bg-[#111] border border-[#2a2a2a]">
        <p className="text-[10px] text-[#555] font-semibold uppercase tracking-widest mb-2">Tone Heatmap · Last 30</p>
        <p className="text-xs text-[#555]">No data yet</p>
      </div>
    );
  }

  const chatMessages = messages[activeChat.id] || [];
  const last30Messages = chatMessages
    .filter(msg => !msg.isDeleted)
    .slice(-30);

  const mapLegacySentiment = (sentiment?: string): SentimentFull => {
    switch (sentiment) {
      case 'Positive': return 'positive';
      case 'Toxic': return 'negative';
      case 'Neutral': return 'neutral';
      default: return 'neutral';
    }
  };

  const colorMap: Record<SentimentFull, string> = {
    positive: 'bg-emerald-500',
    negative: 'bg-red-500',
    neutral: 'bg-slate-600',
    mixed: 'bg-amber-500',
    sarcastic: 'bg-purple-500',
    ambiguous: 'bg-slate-700',
  };

  const getColorForSentiment = (sentiment?: SentimentFull): string => {
    return sentiment ? colorMap[sentiment] : 'bg-slate-800';
  };

  return (
    <div className="p-3 rounded-xl bg-[#111] border border-[#2a2a2a]">
      <p className="text-[10px] text-[#555] font-semibold uppercase tracking-widest mb-2">Tone Heatmap · Last 30</p>
      <div className="flex flex-wrap gap-1 overflow-y-auto max-h-24 custom-scrollbar">
        {last30Messages.map((msg) => {
          const sentiment = msg.sentimentFull || mapLegacySentiment(msg.sentiment);
          return (
            <div
              key={msg.id}
              className={`w-2.5 h-2.5 rounded-sm ${getColorForSentiment(sentiment)}`}
              title={`${msg.senderName}: ${sentiment}`}
            />
          );
        })}
      </div>
      <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2">
        {(['positive', 'negative', 'neutral', 'mixed'] as const).map(sentiment => (
          <span key={sentiment} className="flex items-center gap-1 text-[9px] text-[#555]">
            <span className={`w-2 h-2 rounded-sm ${colorMap[sentiment]}`} />
            {sentiment}
          </span>
        ))}
      </div>
    </div>
  );
};

export default ToneHeatmap;
