import { useState, useEffect } from 'react';
import { Shield, Activity, Cpu, TrendingUp, TrendingDown, Minus, AlertTriangle, CheckCircle2, Zap, Wifi, WifiOff, Clock, Brain, X } from 'lucide-react';
import { useChatStore } from '../store/useChatStore';
import { useAuthStore } from '../store/useAuthStore';

const SMART_REPLIES = ["Sounds good!", "I'll check and get back.", "Let's discuss later.", "Got it, thanks!", "Can you elaborate?"];

export default function SafetySidebar() {
  const { nodes, safetyRating, safetyTrend, activeChat, safetyLogs, sendMessage, messages } = useChatStore();
  const { isGhostMode, user } = useAuthStore();
  const [showLogs, setShowLogs] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [selectedNode, setSelectedNode] = useState<number | null>(null); // F16
  const [showSummary, setShowSummary] = useState(true); // C12

  const currentLogs = safetyLogs.filter(log => log.chatId === activeChat?.id).slice(0, 8);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const goOnline = () => setIsOnline(true);
    const goOffline = () => setIsOnline(false);
    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);
    return () => { window.removeEventListener('online', goOnline); window.removeEventListener('offline', goOffline); };
  }, []);

  const handleSmartReply = (reply: string) => {
    if (!activeChat || !user) return;
    sendMessage(activeChat.id, reply, isGhostMode ? 'Anonymous' : (user.name || 'User'));
  };

  // C12: compute AI summary from last 10 messages
  const getAISummary = () => {
    if (!activeChat) return null;
    const msgs = (messages[activeChat.id] || []).filter(m => !m.isDeleted).slice(-10);
    if (msgs.length === 0) return null;
    const positive = msgs.filter(m => m.sentiment === 'Positive').length;
    const toxic = msgs.filter(m => m.sentiment === 'Toxic').length;
    const neutral = msgs.filter(m => m.sentiment === 'Neutral').length;
    const total = msgs.length;
    const dominant = positive >= neutral && positive >= toxic ? 'Mostly positive' : toxic > 0 ? 'Some toxic content detected' : 'Mostly neutral';
    return { positive, toxic, neutral, total, dominant };
  };

  const summary = getAISummary();
  const timeStr = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const dateStr = currentTime.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });

  // F16: selected node detail
  const selectedNodeData = selectedNode !== null ? nodes[selectedNode] : null;

  return (
    <aside className="w-80 border-l border-[#2a2a2a] flex flex-col gap-0 overflow-y-auto custom-scrollbar bg-[#1a1a1a] flex-shrink-0">

      {/* F16: Node detail modal */}
      {selectedNodeData && (
        <div className="fixed inset-0 z-[500] bg-black/70 backdrop-blur-md flex items-center justify-center p-6">
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-6 w-full max-w-xs shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold text-sm">Node #{selectedNode} Detail</h3>
              <button onClick={() => setSelectedNode(null)} className="text-[#8e8e93] hover:text-white">
                <X size={16} />
              </button>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-[#8e8e93] text-xs uppercase tracking-widest">Status</span>
                <span className={`text-xs font-bold ${selectedNodeData.status === 'busy' ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {selectedNodeData.status.toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8e8e93] text-xs uppercase tracking-widest">Latency</span>
                <span className="text-white text-xs font-bold">{selectedNodeData.latency}ms</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8e8e93] text-xs uppercase tracking-widest">Node ID</span>
                <span className="text-indigo-400 text-xs font-mono">SAF-{String(selectedNode).padStart(3, '0')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8e8e93] text-xs uppercase tracking-widest">Role</span>
                <span className="text-white text-xs">Content Validator</span>
              </div>
              <div className="h-1.5 w-full bg-[#2a2a2a] rounded-full overflow-hidden mt-2">
                <div className={`h-full rounded-full ${selectedNodeData.status === 'busy' ? 'bg-amber-400' : 'bg-emerald-400'}`}
                  style={{ width: selectedNodeData.status === 'busy' ? '75%' : '30%' }}
                />
              </div>
              <p className="text-[#555] text-[9px] text-center">Load: {selectedNodeData.status === 'busy' ? '75%' : '30%'}</p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#2a2a2a]">
        <div className="flex items-center gap-2">
          <Shield size={14} className="text-[#8e8e93]" />
          <span className="text-white text-xs font-semibold uppercase tracking-widest">AI Insights</span>
        </div>
        <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full border text-[9px] font-medium uppercase tracking-wide ${
          isOnline ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'
        }`}>
          {isOnline ? <Wifi size={9} /> : <WifiOff size={9} />}
          {isOnline ? 'Online' : 'Offline'}
        </div>
      </div>

      <div className="flex flex-col gap-3 p-4">

        {/* System clock */}
        <div className="bg-[#212121] border border-[#2a2a2a] rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock size={11} className="text-[#8e8e93]" />
            <span className="text-[#8e8e93] text-[10px] font-medium uppercase tracking-widest">System Time</span>
          </div>
          <p className="text-white font-mono font-semibold text-xl tracking-wider">{timeStr}</p>
          <p className="text-[#8e8e93] text-xs mt-0.5">{dateStr}</p>
        </div>

        {/* Safety rating */}
        <div className="bg-[#212121] border border-[#2a2a2a] rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[#8e8e93] text-[10px] font-medium uppercase tracking-widest">Safety Rating</span>
            <span className={`font-semibold text-sm ${safetyRating > 90 ? 'text-emerald-400' : safetyRating > 70 ? 'text-amber-400' : 'text-red-400'}`}>
              {safetyRating.toFixed(1)}%
            </span>
          </div>
          <div className="h-1.5 w-full bg-[#2a2a2a] rounded-full overflow-hidden">
            <div className={`h-full rounded-full transition-all duration-700 ${safetyRating > 90 ? 'bg-emerald-500' : safetyRating > 70 ? 'bg-amber-500' : 'bg-red-500'}`}
              style={{ width: `${safetyRating}%` }}
            />
          </div>
          <div className="flex items-center justify-between pt-1">
            <span className="text-[#8e8e93] text-[10px] font-medium uppercase tracking-widest">Sentiment</span>
            <div className="flex items-center gap-1.5">
              {safetyTrend === 'Improving' && <TrendingUp size={13} className="text-emerald-400" />}
              {safetyTrend === 'Declining' && <TrendingDown size={13} className="text-red-400" />}
              {safetyTrend === 'Stable' && <Minus size={13} className="text-[#8e8e93]" />}
              <span className={`text-xs font-medium ${safetyTrend === 'Improving' ? 'text-emerald-400' : safetyTrend === 'Declining' ? 'text-red-400' : 'text-[#8e8e93]'}`}>
                {safetyTrend}
              </span>
            </div>
          </div>
        </div>

        {/* Safety nodes — F16: click each node for detail */}
        <div className="bg-[#212121] border border-[#2a2a2a] rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cpu size={11} className="text-[#8e8e93]" />
              <span className="text-[#8e8e93] text-[10px] font-medium uppercase tracking-widest">Safety Nodes</span>
            </div>
            <span className="text-[10px] text-emerald-400 font-medium uppercase tracking-wider">Scanning</span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {nodes.map((node) => (
              <button key={node.id} onClick={() => setSelectedNode(node.id)}
                className="flex flex-col items-center gap-1 group"
                title={`Node ${node.id} — ${node.latency}ms — Click for details`}
              >
                <div className={`w-full h-8 rounded-xl flex items-center justify-center transition-all duration-500 group-hover:ring-1 group-hover:ring-indigo-500/40 ${
                  node.status === 'busy' ? 'bg-amber-500/20' : 'bg-[#2a2a2a]'
                }`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${node.status === 'busy' ? 'bg-amber-400' : 'bg-emerald-400/60'}`} />
                </div>
                <span className="text-[7px] text-[#555] font-medium uppercase">{node.latency}ms</span>
              </button>
            ))}
          </div>
        </div>

        {/* C12: AI Summary card */}
        {activeChat && summary && (
          <div className="bg-[#212121] border border-[#2a2a2a] rounded-2xl p-4 space-y-3">
            <button onClick={() => setShowSummary(p => !p)} className="w-full flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Brain size={11} className="text-[#8e8e93]" />
                <span className="text-[#8e8e93] text-[10px] font-medium uppercase tracking-widest">AI Summary</span>
              </div>
              <span className="text-[9px] text-[#555] uppercase tracking-widest">{showSummary ? 'Hide' : 'Show'}</span>
            </button>
            {showSummary && (
              <div className="space-y-2">
                <p className="text-white text-xs font-medium">Last {summary.total} messages:</p>
                <p className={`text-xs ${summary.toxic > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>{summary.dominant}</p>
                <div className="flex gap-2 flex-wrap">
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                    ✓ {summary.positive} positive
                  </span>
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-slate-500/10 border border-slate-500/20 text-slate-400">
                    — {summary.neutral} neutral
                  </span>
                  {summary.toxic > 0 && (
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400">
                      ⚠ {summary.toxic} flagged
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Smart replies */}
        {activeChat && (
          <div className="bg-[#212121] border border-[#2a2a2a] rounded-2xl p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Zap size={11} className="text-[#8e8e93]" />
              <span className="text-[#8e8e93] text-[10px] font-medium uppercase tracking-widest">Smart Replies</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {SMART_REPLIES.map((reply) => (
                <button key={reply} onClick={() => handleSmartReply(reply)}
                  className="text-xs px-3 py-1.5 rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] text-[#8e8e93] hover:text-white hover:border-[#3a3a3a] hover:bg-[#2a2a2a] transition-all active:scale-95 font-medium"
                >
                  {reply}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Safety logs */}
        {activeChat && (
          <div className="bg-[#212121] border border-[#2a2a2a] rounded-2xl p-4 space-y-3">
            <button onClick={() => setShowLogs(p => !p)} className="w-full flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity size={11} className="text-[#8e8e93]" />
                <span className="text-[#8e8e93] text-[10px] font-medium uppercase tracking-widest">Safety Logs</span>
              </div>
              <span className="text-[9px] text-[#555] font-medium uppercase tracking-widest">
                {showLogs ? 'Hide' : `Show ${currentLogs.length}`}
              </span>
            </button>
            {showLogs && (
              <div className="space-y-1.5 max-h-48 overflow-y-auto custom-scrollbar">
                {currentLogs.length === 0 ? (
                  <p className="text-[#555] text-xs text-center py-4">No logs for this chat</p>
                ) : (
                  currentLogs.map((log) => (
                    <div key={log.id} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a]">
                      {log.type === 'Alert' && <AlertTriangle size={11} className="text-red-400 mt-0.5 shrink-0" />}
                      {log.type === 'Validation' && <CheckCircle2 size={11} className="text-emerald-400 mt-0.5 shrink-0" />}
                      {log.type === 'System' && <Shield size={11} className="text-[#8e8e93] mt-0.5 shrink-0" />}
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] text-[#8e8e93] truncate">{log.message}</p>
                        <p className="text-[8px] text-[#555] uppercase font-medium mt-0.5">{log.timestamp}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}