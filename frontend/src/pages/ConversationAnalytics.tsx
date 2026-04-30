import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  BarChart, 
  PieChart, 
  Pie, 
  Cell, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts';
import { useChatStore } from '../store/useChatStore';
import { useAuthStore } from '../store/useAuthStore';
import { ArrowLeft } from 'lucide-react';
import type { SentimentFull, ConversationStats } from '../types';

const ConversationAnalytics: React.FC = () => {
  const { chatId } = useParams<{ chatId: string }>();
  const { messages, chats } = useChatStore();
  const { user } = useAuthStore();

  const analytics = useMemo((): ConversationStats | null => {
    if (!chatId || !messages[chatId]) return null;

    const chatMessages = messages[chatId] || [];
    const nonDeletedMessages = chatMessages.filter(msg => !msg.isDeleted);

    // Total messages
    const totalMessages = nonDeletedMessages.length;

    // Top senders
    const senderCounts: Record<string, number> = {};
    nonDeletedMessages.forEach(msg => {
      senderCounts[msg.senderName] = (senderCounts[msg.senderName] || 0) + 1;
    });
    const topSenders = Object.entries(senderCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));

    // Sentiment breakdown
    const sentimentCounts: Record<SentimentFull, number> = {
      positive: 0,
      negative: 0,
      neutral: 0,
      mixed: 0,
      sarcastic: 0,
      ambiguous: 0,
    };

    nonDeletedMessages.forEach(msg => {
      const sentiment = msg.sentimentFull || (() => {
        switch (msg.sentiment) {
          case 'Positive': return 'positive' as SentimentFull;
          case 'Toxic': return 'negative' as SentimentFull;
          case 'Neutral': return 'neutral' as SentimentFull;
          default: return 'neutral' as SentimentFull;
        }
      })();
      sentimentCounts[sentiment]++;
    });

    // Peak hour
    const hourCounts: Record<number, number> = {};
    nonDeletedMessages.forEach(msg => {
      const hour = new Date(msg.fullTimestamp || msg.timestamp).getHours();
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    });
    const peakHour = Object.entries(hourCounts)
      .sort(([, a], [, b]) => b - a)[0]?.[0] as number || 0;

    // Messages over time (last 7 days)
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const messagesOverTime: { date: string; count: number }[] = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toLocaleDateString();
      const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const dayEnd = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
      
      const dayMessages = nonDeletedMessages.filter(msg => {
        const msgDate = new Date(msg.fullTimestamp || msg.timestamp);
        return msgDate >= dayStart && msgDate < dayEnd;
      });
      
      messagesOverTime.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        count: dayMessages.length,
      });
    }

    return {
      chatId,
      totalMessages,
      topSenders,
      sentimentBreakdown: sentimentCounts,
      peakHour,
      messagesOverTime,
    };
  }, [chatId, messages]);

  const chat = chats.find(c => c.id === chatId);

  const sentimentColors = {
    positive: '#10b981',
    negative: '#ef4444',
    neutral: '#475569',
    mixed: '#f59e0b',
    sarcastic: '#8b5cf6',
    ambiguous: '#64748b',
  };

  const getHealthLabel = (positiveCount: number, total: number) => {
    const percentage = total > 0 ? (positiveCount / total) * 100 : 0;
    if (percentage >= 70) return { label: 'Mostly Positive', color: 'text-emerald-400' };
    if (percentage >= 40) return { label: 'Mixed Signals', color: 'text-amber-400' };
    return { label: 'High Toxicity', color: 'text-red-400' };
  };

  if (!analytics || !chat) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white p-6">
        <p className="text-center text-[#555]">Chat not found</p>
      </div>
    );
  }

  const healthScore = Math.round((analytics.sentimentBreakdown.positive / analytics.totalMessages) * 100);
  const health = getHealthLabel(analytics.sentimentBreakdown.positive, analytics.totalMessages);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6">
      {/* Back link */}
      <Link to="/app" className="flex items-center gap-2 text-indigo-400 text-sm mb-6">
        <ArrowLeft size={16} />
        Back to chat
      </Link>

      {/* Chat name */}
      <h1 className="text-2xl font-bold mb-8">{chat.name} Analytics</h1>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-[#111] border border-[#2a2a2a] rounded-xl p-4">
          <p className="text-[10px] text-[#555] uppercase tracking-widest mb-1">Total Messages</p>
          <p className="text-2xl font-black">{analytics.totalMessages}</p>
        </div>
        <div className="bg-[#111] border border-[#2a2a2a] rounded-xl p-4">
          <p className="text-[10px] text-[#555] uppercase tracking-widest mb-1">Active Members</p>
          <p className="text-2xl font-black">{analytics.topSenders.length}</p>
        </div>
        <div className="bg-[#111] border border-[#2a2a2a] rounded-xl p-4">
          <p className="text-[10px] text-[#555] uppercase tracking-widest mb-1">Peak Hour</p>
          <p className="text-2xl font-black">{analytics.peakHour}:00</p>
        </div>
        <div className="bg-[#111] border border-[#2a2a2a] rounded-xl p-4">
          <p className="text-[10px] text-[#555] uppercase tracking-widest mb-1">Health Score</p>
          <p className={`text-4xl font-black ${health.color}`}>{healthScore}%</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Messages over time */}
        <div className="bg-[#111] border border-[#2a2a2a] rounded-xl p-4">
          <h3 className="text-lg font-semibold mb-4">Messages Over Time</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={analytics.messagesOverTime}>
              <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#555' }} />
              <YAxis tick={{ fontSize: 12, fill: '#555' }} />
              <Tooltip
                contentStyle={{ 
                  background: '#111', 
                  border: '1px solid #2a2a2a', 
                  borderRadius: 8, 
                  fontSize: 12 
                }}
                labelStyle={{ color: '#8e8e93' }}
              />
              <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Sentiment breakdown */}
        <div className="bg-[#111] border border-[#2a2a2a] rounded-xl p-4">
          <h3 className="text-lg font-semibold mb-4">Sentiment Breakdown</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={Object.entries(analytics.sentimentBreakdown).map(([name, value]) => ({
                  name,
                  value,
                }))}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {Object.entries(analytics.sentimentBreakdown).map(([name]) => (
                  <Cell key={name} fill={sentimentColors[name as SentimentFull]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ 
                  background: '#111', 
                  border: '1px solid #2a2a2a', 
                  borderRadius: 8, 
                  fontSize: 12 
                }}
                labelStyle={{ color: '#8e8e93' }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top senders table */}
      <div className="bg-[#111] border border-[#2a2a2a] rounded-xl p-4">
        <h3 className="text-lg font-semibold mb-4">Top Senders</h3>
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left text-[#555] font-medium pb-2">Rank</th>
              <th className="text-left text-[#555] font-medium pb-2">Name</th>
              <th className="text-left text-[#555] font-medium pb-2">Messages</th>
              <th className="text-left text-[#555] font-medium pb-2">Percentage</th>
            </tr>
          </thead>
          <tbody>
            {analytics.topSenders.map((sender, index) => (
              <tr key={sender.name} className="border-t border-[#1a1a1a]">
                <td className="py-2 text-[#8e8e93]">{index + 1}</td>
                <td className="py-2 text-[#8e8e93]">{sender.name}</td>
                <td className="py-2 text-[#8e8e93]">{sender.count}</td>
                <td className="py-2">
                  <div className="flex items-center gap-2">
                    <div 
                      className="h-2 rounded-full bg-indigo-500"
                      style={{ width: `${(sender.count / analytics.totalMessages) * 100}%` }}
                    />
                    <span className="text-[#8e8e93] text-sm">
                      {Math.round((sender.count / analytics.totalMessages) * 100)}%
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ConversationAnalytics;
