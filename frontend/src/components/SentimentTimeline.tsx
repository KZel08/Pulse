import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useChatStore } from '../store/useChatStore';
import type { SentimentFull } from '../types';

const SentimentTimeline: React.FC = () => {
  const { activeChat, messages } = useChatStore();

  const chartData = useMemo(() => {
    if (!activeChat || !messages[activeChat.id]) {
      return [];
    }

    const chatMessages = messages[activeChat.id] || [];
    const nonDeletedMessages = chatMessages.filter(msg => !msg.isDeleted);

    // Group messages by date for last 7 days
    const dateGroups: Record<string, Record<SentimentFull, number>> = {};
    
    nonDeletedMessages.forEach(msg => {
      const date = new Date(msg.fullTimestamp || msg.timestamp);
      const dateStr = date.toLocaleDateString();
      
      if (!dateGroups[dateStr]) {
        dateGroups[dateStr] = {
          positive: 0,
          negative: 0,
          neutral: 0,
          mixed: 0,
          sarcastic: 0,
          ambiguous: 0,
        };
      }

      const sentiment = msg.sentimentFull || (() => {
        // Map legacy sentiment
        switch (msg.sentiment) {
          case 'Positive': return 'positive' as SentimentFull;
          case 'Toxic': return 'negative' as SentimentFull;
          case 'Neutral': return 'neutral' as SentimentFull;
          default: return 'neutral' as SentimentFull;
        }
      })();

      dateGroups[dateStr][sentiment]++;
    });

    // Convert to array and sort by date
    return Object.entries(dateGroups)
      .map(([date, sentiments]) => ({
        date,
        ...sentiments
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-7); // Last 7 days
  }, [activeChat, messages]);

  if (chartData.length < 2) {
    return (
      <div className="p-3 rounded-xl bg-[#111] border border-[#2a2a2a]">
        <p className="text-[10px] text-[#555] font-semibold uppercase tracking-widest mb-3">Sentiment Over Time</p>
        <p className="text-xs text-[#555]">Insufficient data for timeline</p>
      </div>
    );
  }

  return (
    <div className="p-3 rounded-xl bg-[#111] border border-[#2a2a2a]">
      <p className="text-[10px] text-[#555] font-semibold uppercase tracking-widest mb-3">Sentiment Over Time</p>
      <ResponsiveContainer width="100%" height={100}>
        <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 9, fill: '#555' }} 
          />
          <YAxis 
            tick={{ fontSize: 9, fill: '#555' }} 
            allowDecimals={false} 
          />
          <Tooltip
            contentStyle={{ 
              background: '#111', 
              border: '1px solid #2a2a2a', 
              borderRadius: 8, 
              fontSize: 10 
            }}
            labelStyle={{ color: '#8e8e93' }}
          />
          <Bar 
            dataKey="positive" 
            stackId="a" 
            fill="#10b981" 
            radius={[0,0,0,0]} 
          />
          <Bar 
            dataKey="negative" 
            stackId="a" 
            fill="#ef4444" 
          />
          <Bar 
            dataKey="neutral" 
            stackId="a" 
            fill="#475569" 
          />
          <Bar 
            dataKey="mixed" 
            stackId="a" 
            fill="#f59e0b" 
            radius={[2,2,0,0]} 
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SentimentTimeline;
