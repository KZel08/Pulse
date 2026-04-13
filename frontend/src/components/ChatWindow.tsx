import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Send, ShieldCheck, Paperclip, MoreVertical, FileText, AlertTriangle, Loader2, Trash2, Flag, CheckCheck, Check, Pin, PinOff, Ghost, ChevronDown, MessageSquare, Reply, Forward, Copy, Star, StarOff, Volume2, VolumeX, ExternalLink, Edit2, Palette, ChevronUp, Mic, MicOff, X, Download, Code, Users, WifiOff, Clock } from 'lucide-react';
import { useChatStore } from '../store/useChatStore';
import { useAuthStore } from '../store/useAuthStore';
import FilePreview from './FilePreview';

interface ChatWindowProps {
  onToggleChatInfo: () => void;
}

const EMOJIS = ['👍', '❤️', '😂', '😮', '😢', '🔥'];
const QUICK_EMOJIS = ['👍', '❤️', '😂', '🔥', '👏', '🎉'];
const SKIN_TONES = ['', '🏻', '🏼', '🏽', '🏾', '🏿'];
const MAX_CHARS = 500;
const URL_REGEX = /(https?:\/\/[^\s]+)/g;
const MAX_LOAD_MORE = 3;
const CONFETTI_COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#14b8a6', '#f59e0b', '#10b981'];

const THEMES: {
  key: string; label: string;
  windowBg: string; sentBg: string; sentText: string;
  receivedBg: string; receivedText: string; receivedBorder: string;
  inputBarBg: string; inputBarBorder: string; inputText: string; inputPlaceholder: string;
  accent: string; headerBorder: string; headerBg: string;
  separatorText: string; separatorBg: string; separatorLine: string;
  menuBg: string; menuBorder: string; menuText: string;
}[] = [
  {
    key: 'clean-dark', label: 'Dark',
    windowBg: 'bg-[#0f172a]', sentBg: 'bg-[#2a2a2a]', sentText: 'text-white',
    receivedBg: 'bg-[#1e293b]', receivedText: 'text-slate-200', receivedBorder: 'border-slate-800',
    inputBarBg: 'bg-[#1e293b]', inputBarBorder: 'border-slate-800', inputText: 'text-white', inputPlaceholder: 'placeholder-slate-500',
    accent: 'text-indigo-400', headerBorder: 'border-slate-900', headerBg: 'bg-[#1e293b]/10',
    separatorText: 'text-slate-600', separatorBg: 'bg-slate-800/50', separatorLine: 'bg-slate-800',
    menuBg: 'bg-[#0f172a]', menuBorder: 'border-slate-800', menuText: 'text-slate-300',
  },
  {
    key: 'clean-light', label: 'Light',
    windowBg: 'bg-white', sentBg: 'bg-[#1a1a1a]', sentText: 'text-white',
    receivedBg: 'bg-[#f0f0f0]', receivedText: 'text-[#1a1a1a]', receivedBorder: 'border-[#e0e0e0]',
    inputBarBg: 'bg-[#f5f5f5]', inputBarBorder: 'border-[#e0e0e0]', inputText: 'text-[#1a1a1a]', inputPlaceholder: 'placeholder-[#999]',
    accent: 'text-[#6b21a8]', headerBorder: 'border-[#e0e0e0]', headerBg: 'bg-white',
    separatorText: 'text-[#999]', separatorBg: 'bg-[#e0e0e0]/60', separatorLine: 'bg-[#e0e0e0]',
    menuBg: 'bg-white', menuBorder: 'border-[#e0e0e0]', menuText: 'text-[#1a1a1a]',
  },
  {
    key: 'indigo-theme', label: 'Indigo',
    windowBg: 'bg-[#1e1b4b]', sentBg: 'bg-[#4f46e5]', sentText: 'text-white',
    receivedBg: 'bg-[#312e81]', receivedText: 'text-indigo-200', receivedBorder: 'border-indigo-700',
    inputBarBg: 'bg-[#312e81]', inputBarBorder: 'border-indigo-700', inputText: 'text-white', inputPlaceholder: 'placeholder-indigo-400',
    accent: 'text-indigo-300', headerBorder: 'border-indigo-800', headerBg: 'bg-[#4f46e5]/10',
    separatorText: 'text-indigo-400', separatorBg: 'bg-indigo-800/50', separatorLine: 'bg-indigo-800',
    menuBg: 'bg-[#1e1b4b]', menuBorder: 'border-indigo-700', menuText: 'text-indigo-300',
  },
  {
    key: 'teal-theme', label: 'Teal',
    windowBg: 'bg-[#134e4a]', sentBg: 'bg-[#14b8a6]', sentText: 'text-white',
    receivedBg: 'bg-[#115e59]', receivedText: 'text-teal-200', receivedBorder: 'border-teal-700',
    inputBarBg: 'bg-[#115e59]', inputBarBorder: 'border-teal-700', inputText: 'text-white', inputPlaceholder: 'placeholder-teal-400',
    accent: 'text-teal-300', headerBorder: 'border-teal-800', headerBg: 'bg-[#14b8a6]/10',
    separatorText: 'text-teal-400', separatorBg: 'bg-teal-800/50', separatorLine: 'bg-teal-800',
    menuBg: 'bg-[#134e4a]', menuBorder: 'border-teal-700', menuText: 'text-teal-300',
  },
  {
    key: 'rose-theme', label: 'Rose',
    windowBg: 'bg-[#4c0519]', sentBg: 'bg-[#f43f5e]', sentText: 'text-white',
    receivedBg: 'bg-[#881337]', receivedText: 'text-rose-200', receivedBorder: 'border-rose-700',
    inputBarBg: 'bg-[#881337]', inputBarBorder: 'border-rose-700', inputText: 'text-white', inputPlaceholder: 'placeholder-rose-400',
    accent: 'text-rose-300', headerBorder: 'border-rose-800', headerBg: 'bg-[#f43f5e]/10',
    separatorText: 'text-rose-400', separatorBg: 'bg-rose-800/50', separatorLine: 'bg-rose-800',
    menuBg: 'bg-[#4c0519]', menuBorder: 'border-rose-700', menuText: 'text-rose-300',
  },
  {
    key: 'amber-theme', label: 'Amber',
    windowBg: 'bg-[#451a03]', sentBg: 'bg-[#f59e0b]', sentText: 'text-white',
    receivedBg: 'bg-[#78350f]', receivedText: 'text-amber-200', receivedBorder: 'border-amber-700',
    inputBarBg: 'bg-[#78350f]', inputBarBorder: 'border-amber-700', inputText: 'text-white', inputPlaceholder: 'placeholder-amber-400',
    accent: 'text-amber-300', headerBorder: 'border-amber-800', headerBg: 'bg-[#f59e0b]/10',
    separatorText: 'text-amber-400', separatorBg: 'bg-amber-800/50', separatorLine: 'bg-amber-800',
    menuBg: 'bg-[#451a03]', menuBorder: 'border-amber-700', menuText: 'text-amber-300',
  },
  {
    key: 'purple-theme', label: 'Purple',
    windowBg: 'bg-[#3b0764]', sentBg: 'bg-[#9333ea]', sentText: 'text-white',
    receivedBg: 'bg-[#581c87]', receivedText: 'text-purple-200', receivedBorder: 'border-purple-700',
    inputBarBg: 'bg-[#581c87]', inputBarBorder: 'border-purple-700', inputText: 'text-white', inputPlaceholder: 'placeholder-purple-400',
    accent: 'text-purple-300', headerBorder: 'border-purple-800', headerBg: 'bg-[#9333ea]/10',
    separatorText: 'text-purple-400', separatorBg: 'bg-purple-800/50', separatorLine: 'bg-purple-800',
    menuBg: 'bg-[#3b0764]', menuBorder: 'border-purple-700', menuText: 'text-purple-300',
  },
];

function getTheme(themeKey?: string) { return THEMES.find(t => t.key === themeKey) || THEMES[0]; }

function linkify(text: string, accentClass: string) {
  const parts = text.split(URL_REGEX);
  return parts.map((part, i) =>
    URL_REGEX.test(part)
      ? <a key={i} href={part} target="_blank" rel="noopener noreferrer" className={`underline inline-flex items-center gap-1 ${accentClass} hover:opacity-80`}>{part} <ExternalLink size={10} /></a>
      : part
  );
}

function mentionify(text: string) {
  return text.split(/(@\w+)/g).map((part, i) =>
    part.startsWith('@')
      ? <span key={i} className="text-indigo-300 font-bold bg-indigo-600/20 px-1 rounded">{part}</span>
      : part
  );
}

function getDateLabel(fullTimestamp?: string): string {
  if (!fullTimestamp) return '';
  const d = new Date(fullTimestamp);
  const today = new Date(); const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return 'Today';
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return d.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' });
}

function renderWithCodeBlocks(content: string, accentClass: string, onCopyCode: (code: string) => void): React.ReactNode {
  const CODE_BLOCK_RE = /```(\w*)\n?([\s\S]*?)```/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0; let match: RegExpExecArray | null; let key = 0;
  while ((match = CODE_BLOCK_RE.exec(content)) !== null) {
    const before = content.slice(lastIndex, match.index);
    if (before) parts.push(<span key={key++}>{mentionify(before).map((p, i) => typeof p === 'string' ? <React.Fragment key={i}>{linkify(p, accentClass)}</React.Fragment> : p)}</span>);
    const lang = match[1] || ''; const code = match[2].trim();
    parts.push(
      <div key={key++} className="my-2 rounded-xl overflow-hidden border border-[#2a2a2a] bg-[#0d1117] text-left">
        <div className="flex items-center justify-between px-3 py-1.5 bg-[#161b22] border-b border-[#2a2a2a]">
          <div className="flex items-center gap-1.5"><Code size={11} className="text-[#8e8e93]" /><span className="text-[#8e8e93] text-[9px] font-mono uppercase">{lang || 'code'}</span></div>
          <button onClick={() => onCopyCode(code)} className="text-[#8e8e93] hover:text-white text-[9px] font-medium uppercase tracking-widest transition-colors">Copy</button>
        </div>
        <pre className="px-4 py-3 text-[12px] font-mono text-[#e6edf3] overflow-x-auto whitespace-pre leading-relaxed">{code}</pre>
      </div>
    );
    lastIndex = match.index + match[0].length;
  }
  const remaining = content.slice(lastIndex);
  if (remaining) parts.push(<span key={key++}>{mentionify(remaining).map((p, i) => typeof p === 'string' ? <React.Fragment key={i}>{linkify(p, accentClass)}</React.Fragment> : p)}</span>);
  if (parts.length > 0) return <>{parts}</>;
  return <>{mentionify(content).map((p, i) => typeof p === 'string' ? <React.Fragment key={i}>{linkify(p, accentClass)}</React.Fragment> : p)}</>;
}

function isImageFile(name: string): boolean { return /\.(png|jpg|jpeg|gif|webp|bmp|svg)$/i.test(name); }

function generateOlderMessages(chatId: string, count: number, offsetMinutes: number): import('../store/useChatStore').Message[] {
  const senders = [{ id: 'bot', name: 'Pulse AI' }, { id: 'u2', name: 'John Doe' }, { id: 'u3', name: 'Alice Smith' }];
  const contents = ['This channel is being monitored for safety.', 'Hey, how are things going?', 'Did you review the latest report?', 'All nodes are green.', 'Looks good from my end.'];
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(Date.now() - (offsetMinutes + i * 5) * 60 * 1000);
    const sender = senders[i % senders.length];
    return {
      id: `older-${chatId}-${offsetMinutes}-${i}`, senderId: sender.id, senderName: sender.name,
      content: contents[i % contents.length],
      timestamp: d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      fullTimestamp: d.toLocaleString(), type: 'text' as const, isAIValidated: true, sentiment: 'Neutral' as const, reactions: [],
    };
  });
}

export default function ChatWindow({ onToggleChatInfo }: ChatWindowProps) {
  const {
    activeChat, messages, sendMessage, deleteMessage, reportFalsePositive,
    addReaction, removeReaction, pinMessage, unpinMessage, pinnedMessages,
    addToast, starMessage, unstarMessage, muteChat, unmuteChat, mutedChats,
    forwardMessage, replyTo, setReplyTo, drafts, setDraft, editMessage,
    setTheme, markAsRead, prependOlderMessages, compactMode, fontSize,
    groupMembers, lastReadMessageId, bulkDeleteMessages,
    alwaysShowTimestamps, setTypingChat,
  } = useChatStore();
  const { user, isGhostMode } = useAuthStore();

  // ── existing state ──────────────────────────────────────────────────────────
  const [text, setText] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [activeEmojiPicker, setActiveEmojiPicker] = useState<string | null>(null);
  const [otherTyping, setOtherTyping] = useState(false);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [sendAnim, setSendAnim] = useState(false);
  const [hoveredTimestamp, setHoveredTimestamp] = useState<string | null>(null);
  const [showForwardModal, setShowForwardModal] = useState(false);
  const [forwardMsgId, setForwardMsgId] = useState<string | null>(null);
  const [showStarred, setShowStarred] = useState(false);
  const [showMediaGallery, setShowMediaGallery] = useState(false);
  const [editingMsgId, setEditingMsgId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [showThemePicker, setShowThemePicker] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; msgId: string } | null>(null);
  const [newMsgIds, setNewMsgIds] = useState<Set<string>>(new Set());
  const [loadMoreCount, setLoadMoreCount] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [seenByMsgId, setSeenByMsgId] = useState<string | null>(null);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [selectedMsgs, setSelectedMsgs] = useState<Set<string>>(new Set());
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const recordTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── new feature state ───────────────────────────────────────────────────────
  // C6: mention autocomplete
  const [mentionQuery, setMentionQuery] = useState('');
  const [showMentions, setShowMentions] = useState(false);
  const [mentionIndex, setMentionIndex] = useState(0);
  // C13: skin tone picker
  const [skinToneEmoji, setSkinToneEmoji] = useState<string | null>(null);
  const [showSkinTone, setShowSkinTone] = useState(false);
  // C15: scheduled message
  const [showScheduler, setShowScheduler] = useState(false);
  const [scheduleDateTime, setScheduleDateTime] = useState('');
  // F20: confetti
  const [confettiPieces, setConfettiPieces] = useState<{ id: number; x: number; color: string; size: number }[]>([]);
  const hasShownConfetti = useRef<Set<string>>(new Set());
  // E1: chat switch animation key
  const [chatAnimKey, setChatAnimKey] = useState(0);
  // Drag-drop and paste functionality
  const [isDragging, setIsDragging] = useState(false);
  const [dragCounter, setDragCounter] = useState(0);

  // ── refs ────────────────────────────────────────────────────────────────────
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const msgRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // ── effects ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (activeChat) {
      setText(drafts[activeChat.id] || '');
      markAsRead(activeChat.id);
      setLoadMoreCount(0);
      setSelectedMsgs(new Set());
      setIsSelectMode(false);
      setChatAnimKey(k => k + 1); // E1
    }
  }, [activeChat?.id]);

  useEffect(() => { if (activeChat) setDraft(activeChat.id, text); }, [text]);
  useEffect(() => { scrollRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, otherTyping]);

  useEffect(() => {
    if (!activeChat) return;
    const msgs = messages[activeChat.id] || [];
    const latest = msgs[msgs.length - 1];
    if (latest && !newMsgIds.has(latest.id)) {
      setNewMsgIds(prev => new Set([...prev, latest.id]));
      setTimeout(() => setNewMsgIds(prev => { const n = new Set(prev); n.delete(latest.id); return n; }), 600);
      // F20: confetti on first message in a brand new chat
      if (msgs.length === 1 && !hasShownConfetti.current.has(activeChat.id)) {
        hasShownConfetti.current.add(activeChat.id);
        const pieces = Array.from({ length: 18 }, (_, i) => ({
          id: i, x: Math.random() * 100, color: CONFETTI_COLORS[i % CONFETTI_COLORS.length], size: Math.random() * 6 + 4,
        }));
        setConfettiPieces(pieces);
        setTimeout(() => setConfettiPieces([]), 1200);
      }
    }
  }, [messages]);

  useEffect(() => {
    const goOnline = () => setIsOnline(true);
    const goOffline = () => setIsOnline(false);
    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);
    return () => { window.removeEventListener('online', goOnline); window.removeEventListener('offline', goOffline); };
  }, []);

  useEffect(() => () => { if (recordTimerRef.current) clearInterval(recordTimerRef.current); }, []);

  // F10: listen for scroll-to-message events dispatched by Sidebar global search
  useEffect(() => {
    const handler = (e: Event) => {
      const { msgId } = (e as CustomEvent).detail;
      if (msgId) scrollToMessage(msgId);
    };
    window.addEventListener('pulse:scrollToMsg', handler);
    return () => window.removeEventListener('pulse:scrollToMsg', handler);
  }, []);

  // ── handlers ────────────────────────────────────────────────────────────────
  const handleScroll = () => {
    const el = scrollAreaRef.current;
    if (!el) return;
    setShowScrollBtn(el.scrollHeight - el.scrollTop - el.clientHeight > 200);
  };

  const scrollToBottom = () => scrollRef.current?.scrollIntoView({ behavior: 'smooth' });

  const scrollToMessage = useCallback((msgId: string) => {
    const el = msgRefs.current[msgId];
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    el.style.transition = 'box-shadow 0.2s';
    el.style.boxShadow = '0 0 0 2px #6366f1';
    setTimeout(() => { if (el) el.style.boxShadow = ''; }, 1400);
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      setActiveMenu(null); setActiveEmojiPicker(null); setReplyTo(null);
      setShowForwardModal(false); setEditingMsgId(null); setContextMenu(null);
      setShowThemePicker(false); setLightboxSrc(null);
      setIsSelectMode(false); setSelectedMsgs(new Set());
      setShowMentions(false); setShowScheduler(false); setShowSkinTone(false);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleRightClick = (e: React.MouseEvent, msgId: string) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, msgId });
    setActiveMenu(null);
  };

  // C6: @ mention detection
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val.length <= MAX_CHARS) {
      setText(val);
      const atIdx = val.lastIndexOf('@');
      if (atIdx !== -1 && (atIdx === val.length - 1 || !val.slice(atIdx + 1).includes(' '))) {
        setMentionQuery(val.slice(atIdx + 1));
        setShowMentions(true);
        setMentionIndex(0);
      } else {
        setShowMentions(false);
      }
    }
  };

  // C6: insert mention into text
  const insertMention = (name: string) => {
    const atIdx = text.lastIndexOf('@');
    setText(text.slice(0, atIdx) + `@${name} `);
    setShowMentions(false);
    inputRef.current?.focus();
  };

  // C6: group members for autocomplete
  const mentionMembers = activeChat
    ? (groupMembers[activeChat.id] || []).filter(m =>
        m.name.toLowerCase().includes(mentionQuery.toLowerCase()) && m.name !== user?.name
      )
    : [];

  const handleMediaSend = (caption: string) => {
    if (!activeChat || !user || !selectedFile) return;
    sendMessage(activeChat.id, caption, isGhostMode ? 'Anonymous' : (user.name || 'User'), selectedFile);
    setSelectedFile(null);
  };

  const handleSendMessage = () => {
    if (text.trim() && activeChat && user) {
      sendMessage(activeChat.id, text, isGhostMode ? 'Anonymous' : (user.name || 'User'));
      setText('');
      setSendAnim(true);
      setTimeout(() => setSendAnim(false), 300);
      setOtherTyping(true);
      setTypingChat(activeChat.id, true); // F9
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        setOtherTyping(false);
        if (activeChat) setTypingChat(activeChat.id, false);
      }, 2500);
    }
  };

  // C15: send a scheduled message
  const handleScheduleMessage = () => {
    if (!text.trim() || !scheduleDateTime || !activeChat || !user) return;
    const scheduledAt = new Date(scheduleDateTime);
    const delay = scheduledAt.getTime() - Date.now();
    if (delay <= 0) { addToast({ title: '⚠️ Invalid time', message: 'Pick a future time.', type: 'alert' }); return; }
    addToast({ title: '🕐 Scheduled', message: `Sends at ${scheduledAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`, type: 'system' });
    const scheduledText = text;
    const senderName = isGhostMode ? 'Anonymous' : (user.name || 'User');
    setTimeout(() => sendMessage(activeChat.id, scheduledText, senderName), delay);
    setText(''); setShowScheduler(false); setScheduleDateTime('');
  };

  const handleLoadEarlier = () => {
    if (!activeChat || isLoadingMore || loadMoreCount >= MAX_LOAD_MORE) return;
    setIsLoadingMore(true);
    const scrollArea = scrollAreaRef.current;
    const prevScrollHeight = scrollArea?.scrollHeight || 0;
    setTimeout(() => {
      const offsetMinutes = (loadMoreCount + 1) * 30;
      const olderMsgs = generateOlderMessages(activeChat.id, 5, offsetMinutes);
      prependOlderMessages(activeChat.id, olderMsgs);
      setLoadMoreCount(c => c + 1);
      setIsLoadingMore(false);
      requestAnimationFrame(() => { if (scrollArea) scrollArea.scrollTop = scrollArea.scrollHeight - prevScrollHeight; });
    }, 800);
  };

  const handleEmojiClick = (chatId: string, messageId: string, emoji: string, reactedByMe: boolean) => {
    if (reactedByMe) removeReaction(chatId, messageId, emoji);
    else addReaction(chatId, messageId, emoji);
    setActiveEmojiPicker(null);
  };

  const handlePin = (chatId: string, messageId: string, isPinned: boolean) => {
    if (isPinned) { unpinMessage(chatId, messageId); addToast({ title: '📌 Unpinned', message: 'Message unpinned.', type: 'system' }); }
    else { pinMessage(chatId, messageId); addToast({ title: '📌 Pinned', message: 'Message pinned.', type: 'system' }); }
    setActiveMenu(null); setContextMenu(null);
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    addToast({ title: '📋 Copied', message: 'Message copied.', type: 'system' });
    setActiveMenu(null); setContextMenu(null);
  };

  const handleStar = (chatId: string, messageId: string, isStarred: boolean) => {
    if (isStarred) { unstarMessage(chatId, messageId); addToast({ title: '☆ Unstarred', message: 'Removed from starred.', type: 'system' }); }
    else { starMessage(chatId, messageId); addToast({ title: '⭐ Starred', message: 'Message starred.', type: 'system' }); }
    setActiveMenu(null); setContextMenu(null);
  };

  const handleMuteToggle = () => {
    if (!activeChat) return;
    if (mutedChats.includes(activeChat.id)) { unmuteChat(activeChat.id); addToast({ title: '🔔 Unmuted', message: 'Notifications enabled.', type: 'system' }); }
    else { muteChat(activeChat.id); addToast({ title: '🔕 Muted', message: 'Chat muted.', type: 'system' }); }
  };

  const handleReply = (msg: typeof messages[string][0]) => {
    setReplyTo(msg); setActiveMenu(null); setContextMenu(null);
    inputRef.current?.focus();
  };

  const handleEditStart = (msg: typeof messages[string][0]) => {
    setEditingMsgId(msg.id); setEditText(msg.content);
    setActiveMenu(null); setContextMenu(null);
  };

  const handleEditSave = () => {
    if (!activeChat || !editingMsgId || !editText.trim()) return;
    editMessage(activeChat.id, editingMsgId, editText.trim());
    addToast({ title: '✏️ Edited', message: 'Message updated.', type: 'system' });
    setEditingMsgId(null); setEditText('');
  };

  const handleThemeChange = (themeKey: string) => {
    if (!activeChat) return;
    setTheme(activeChat.id, themeKey);
    setShowThemePicker(false);
    const t = THEMES.find(x => x.key === themeKey);
    addToast({ title: '🎨 Theme', message: `${t?.label || themeKey} theme applied.`, type: 'system' });
  };

  const toggleSelectMode = () => { setIsSelectMode(p => !p); setSelectedMsgs(new Set()); };
  const toggleMsgSelect = (msgId: string) => {
    setSelectedMsgs(prev => { const n = new Set(prev); if (n.has(msgId)) n.delete(msgId); else n.add(msgId); return n; });
  };
  const handleBulkDelete = () => {
    if (!activeChat || selectedMsgs.size === 0) return;
    bulkDeleteMessages(activeChat.id, Array.from(selectedMsgs));
    addToast({ title: `🗑️ Deleted ${selectedMsgs.size}`, message: 'Bulk delete done.', type: 'system' });
    setSelectedMsgs(new Set()); setIsSelectMode(false);
  };

  const handleVoiceToggle = () => {
    if (!activeChat || !user) return;
    if (isRecording) {
      if (recordTimerRef.current) clearInterval(recordTimerRef.current);
      const dur = recordSeconds;
      setIsRecording(false); setRecordSeconds(0);
      const label = `Voice message (${Math.floor(dur / 60).toString().padStart(2, '0')}:${(dur % 60).toString().padStart(2, '0')})`;
      sendMessage(activeChat.id, label, isGhostMode ? 'Anonymous' : (user.name || 'User'));
      addToast({ title: '🎤 Voice sent', message: `${dur}s voice message sent.`, type: 'system' });
    } else {
      setIsRecording(true); setRecordSeconds(0);
      recordTimerRef.current = setInterval(() => setRecordSeconds(s => s + 1), 1000);
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    addToast({ title: 'Code copied', message: 'Code block copied.', type: 'system' });
  };

  // Drag-drop handlers
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter(prev => prev + 1);
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter(prev => prev - 1);
    if (dragCounter === 1) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    setDragCounter(0);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      const file = files[0];
      setSelectedFile(file);
      addToast({ title: 'File uploaded', message: `${file.name} ready to send`, type: 'system' });
    }
  };

  // Paste handler for images
  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.indexOf('image') !== -1) {
        e.preventDefault();
        const file = item.getAsFile();
        if (file) {
          setSelectedFile(file);
          addToast({ title: 'Image pasted', message: `${file.name} ready to send`, type: 'system' });
        }
        break;
      }
    }
  };

  // ── derived values ──────────────────────────────────────────────────────────
  const isMuted = activeChat ? mutedChats.includes(activeChat.id) : false;
  const theme = getTheme(activeChat?.theme);
  const canLoadMore = loadMoreCount < MAX_LOAD_MORE;
  const fontSizeClass = fontSize === 'small' ? 'chat-font-small' : fontSize === 'large' ? 'chat-font-large' : 'chat-font-medium';
  const bubblePadding = compactMode ? 'px-3 py-2' : 'px-5 py-3';

  // ── empty / no chat state ───────────────────────────────────────────────────
  if (!activeChat) return (
    <div className={`flex-1 flex flex-col items-center justify-center gap-6 ${isGhostMode ? 'bg-[#1a1a1a]' : 'bg-[#000]'}`}>
      {isGhostMode ? (
        <>
          <Ghost size={64} className="text-[#333]" />
          <p className="text-[#555] font-semibold text-lg uppercase tracking-widest">Ghost Mode Active</p>
          <p className="text-[#444] text-sm">Select a conversation to begin</p>
        </>
      ) : (
        <>
          <div className="text-white font-bold text-8xl italic select-none">PULSE</div>
          <p className="text-[#555] text-sm font-medium uppercase tracking-widest">Select a conversation</p>
          <p className="text-[#333] text-xs">
            Press <kbd className="px-2 py-0.5 bg-[#1a1a1a] rounded text-[#555] font-mono">/</kbd> to search ·{' '}
            <kbd className="px-2 py-0.5 bg-[#1a1a1a] rounded text-[#555] font-mono">Ctrl+D</kbd> new DM ·{' '}
            <kbd className="px-2 py-0.5 bg-[#1a1a1a] rounded text-[#555] font-mono">Ctrl+K</kbd> commands
          </p>
        </>
      )}
    </div>
  );

  // ── per-render derived ──────────────────────────────────────────────────────
  const currentPinned = pinnedMessages[activeChat.id] || [];
  const pinnedMsgs = (messages[activeChat.id] || []).filter(m => currentPinned.includes(m.id) && !m.isDeleted);
  const msgCount = (messages[activeChat.id] || []).filter(m => !m.isDeleted).length;
  const charsLeft = MAX_CHARS - text.length;
  const starredMsgs = (messages[activeChat.id] || []).filter(m => m.isStarred && !m.isDeleted);
  const mediaMsgs = (messages[activeChat.id] || []).filter(m => m.file && !m.isDeleted);
  const allChats = useChatStore.getState().chats;
  const chatMsgs = messages[activeChat.id] || [];
  const chatMembers = groupMembers[activeChat.id] || [];
  const seenByNames = chatMembers.filter(m => m.userId !== 'me' && m.userId !== 'u1').map(m => m.name);

  // C2: first unread message
  const lastReadId = lastReadMessageId[activeChat.id];
  let firstUnreadId: string | null = null;
  if (lastReadId) {
    const lastReadIndex = chatMsgs.findIndex(m => m.id === lastReadId);
    if (lastReadIndex !== -1) {
      const firstUnread = chatMsgs.slice(lastReadIndex + 1).find(m => m.senderId !== 'me' && !m.isDeleted);
      if (firstUnread) firstUnreadId = firstUnread.id;
    }
  }

  type RenderItem = { type: 'date'; label: string } | { type: 'unread-divider' } | { type: 'msg'; msg: typeof chatMsgs[0]; isGrouped: boolean };
  const renderItems: RenderItem[] = [];
  let lastDateLabel = ''; let lastSenderId = ''; let unreadInserted = false;

  chatMsgs.forEach(msg => {
    if (firstUnreadId && msg.id === firstUnreadId && !unreadInserted) {
      renderItems.push({ type: 'unread-divider' }); unreadInserted = true;
    }
    const dateLabel = getDateLabel(msg.fullTimestamp);
    if (dateLabel && dateLabel !== lastDateLabel) { renderItems.push({ type: 'date', label: dateLabel }); lastDateLabel = dateLabel; }
    const isGrouped = msg.senderId === lastSenderId && !msg.replyToContent && !msg.isForwarded;
    renderItems.push({ type: 'msg', msg, isGrouped });
    lastSenderId = msg.senderId;
  });

  const ctxMsg = contextMenu ? chatMsgs.find(m => m.id === contextMenu.msgId) : null;

  // ── render ──────────────────────────────────────────────────────────────────
  return (
    <div
      className={`flex-1 flex flex-col h-full relative transition-colors ${isGhostMode ? 'bg-[#1a1a1a]' : theme.windowBg} ${fontSizeClass}`}
      onClick={() => { setActiveMenu(null); setActiveEmojiPicker(null); setContextMenu(null); setShowThemePicker(false); setShowMentions(false); }}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {selectedFile && <FilePreview file={selectedFile} onClose={() => setSelectedFile(null)} onSend={handleMediaSend} />}

      {/* Drag-drop overlay */}
      {isDragging && (
        <div className="absolute inset-0 z-[300] bg-blue-500/10 backdrop-blur-sm border-2 border-dashed border-blue-400 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-500/20 flex items-center justify-center">
              <Paperclip size={32} className="text-blue-400" />
            </div>
            <p className="text-blue-400 font-semibold text-lg mb-2">Drop file here</p>
            <p className="text-blue-300 text-sm">Release to upload and send</p>
          </div>
        </div>
      )}

      {/* F20: Confetti burst on first message */}
      {confettiPieces.length > 0 && (
        <div className="absolute inset-0 pointer-events-none z-[200] overflow-hidden">
          {confettiPieces.map(p => (
            <div key={p.id} className="confetti-piece absolute rounded-sm"
              style={{ left: `${p.x}%`, top: 0, width: p.size, height: p.size, backgroundColor: p.color, animationDelay: `${p.id * 40}ms` }}
            />
          ))}
        </div>
      )}

      {/* C5: Image lightbox */}
      {lightboxSrc && (
        <div className="fixed inset-0 z-[600] bg-black/92 backdrop-blur-md flex items-center justify-center p-6" onClick={() => setLightboxSrc(null)}>
          <button onClick={() => setLightboxSrc(null)} className="absolute top-5 right-5 p-2 rounded-full bg-[#2a2a2a] text-[#8e8e93] hover:text-white z-10"><X size={18} /></button>
          <img src={lightboxSrc} alt="Preview" className="max-w-full max-h-[85vh] rounded-2xl shadow-2xl object-contain" onClick={e => e.stopPropagation()} />
          <a href={lightboxSrc} download onClick={e => e.stopPropagation()}
            className="absolute bottom-6 right-6 flex items-center gap-2 px-4 py-2 bg-[#2a2a2a] border border-[#3a3a3a] rounded-xl text-white text-xs hover:bg-[#3a3a3a] transition-colors"
          ><Download size={13} /> Download</a>
        </div>
      )}

      {/* C7: Offline banner */}
      {!isOnline && (
        <div className="flex items-center justify-center gap-2 bg-red-950/80 border-b border-red-800/50 px-4 py-2 z-[100]">
          <WifiOff size={13} className="text-red-400" />
          <span className="text-red-300 text-xs font-medium">You're offline — messages won't send</span>
          <button onClick={() => window.location.reload()} className="ml-2 px-3 py-0.5 rounded-lg bg-red-900/60 border border-red-700/50 text-red-300 text-[10px] font-medium hover:bg-red-800/60 transition-colors">Reload</button>
        </div>
      )}

      {/* C9: Multi-select toolbar */}
      {isSelectMode && (
        <div className="flex items-center justify-between px-5 py-2.5 bg-[#1a1a1a] border-b border-[#2a2a2a] z-[100]">
          <div className="flex items-center gap-3">
            <button onClick={toggleSelectMode} className="text-[#8e8e93] hover:text-white"><X size={16} /></button>
            <span className="text-white text-sm font-medium">{selectedMsgs.size} selected</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setSelectedMsgs(new Set(chatMsgs.filter(m => !m.isDeleted).map(m => m.id)))}
              className="text-[#8e8e93] hover:text-white text-xs px-3 py-1.5 rounded-lg hover:bg-[#2a2a2a] transition-colors"
            >All</button>
            <button onClick={handleBulkDelete} disabled={selectedMsgs.size === 0}
              className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-red-900/40 border border-red-700/40 text-red-400 hover:bg-red-900/60 text-xs font-medium transition-colors disabled:opacity-40"
            ><Trash2 size={13} /> Delete {selectedMsgs.size > 0 ? selectedMsgs.size : ''}</button>
          </div>
        </div>
      )}

      {/* Right-click context menu */}
      {contextMenu && ctxMsg && (
        <div onClick={e => e.stopPropagation()}
          className={`fixed z-[500] ${theme.menuBg} border ${theme.menuBorder} rounded-2xl shadow-2xl overflow-hidden w-44`}
          style={{ left: Math.min(contextMenu.x, window.innerWidth - 180), top: Math.min(contextMenu.y, window.innerHeight - 360) }}
        >
          {[
            { label: 'Reply', icon: <Reply size={12} />, action: () => handleReply(ctxMsg), show: true },
            { label: 'Edit', icon: <Edit2 size={12} />, action: () => handleEditStart(ctxMsg), show: ctxMsg.senderId === 'me' && !ctxMsg.isDeleted },
            { label: 'Forward', icon: <Forward size={12} />, action: () => { setForwardMsgId(ctxMsg.id); setShowForwardModal(true); setContextMenu(null); }, show: true },
            { label: 'Copy', icon: <Copy size={12} />, action: () => handleCopy(ctxMsg.content), show: !!ctxMsg.content },
            { label: ctxMsg.isStarred ? 'Unstar' : 'Star', icon: ctxMsg.isStarred ? <StarOff size={12} /> : <Star size={12} />, action: () => handleStar(activeChat.id, ctxMsg.id, !!ctxMsg.isStarred), show: true, color: 'text-amber-400' },
            { label: ctxMsg.isPinned ? 'Unpin' : 'Pin', icon: ctxMsg.isPinned ? <PinOff size={12} /> : <Pin size={12} />, action: () => handlePin(activeChat.id, ctxMsg.id, !!ctxMsg.isPinned), show: true, color: 'text-indigo-400' },
            { label: 'Select', icon: <MessageSquare size={12} />, action: () => { setIsSelectMode(true); toggleMsgSelect(ctxMsg.id); setContextMenu(null); }, show: !ctxMsg.isDeleted },
            { label: 'Delete', icon: <Trash2 size={12} />, action: () => { deleteMessage(activeChat.id, ctxMsg.id); setContextMenu(null); }, show: true, color: 'text-red-400' },
          ].filter(item => item.show).map((item, i) => (
            <button key={i} onClick={item.action}
              className={`w-full px-4 py-2.5 text-[10px] font-black uppercase hover:bg-white/5 flex items-center gap-3 ${i > 0 ? `border-t ${theme.menuBorder}` : ''} ${item.color || theme.menuText}`}
            >{item.icon} {item.label}</button>
          ))}
        </div>
      )}

      {/* Theme picker */}
      {showThemePicker && (
        <div onClick={e => e.stopPropagation()} className="absolute top-28 right-16 z-[200] bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-4 shadow-2xl">
          <p className="text-[#8e8e93] text-[10px] font-medium uppercase tracking-widest mb-3">Chat Theme</p>
          <div className="flex flex-col gap-2 w-40">
            {THEMES.map(t => (
              <button key={t.key} onClick={() => handleThemeChange(t.key)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all ${activeChat.theme === t.key || (!activeChat.theme && t.key === 'clean-dark') ? 'border-white/30 bg-white/10' : 'border-[#2a2a2a] hover:border-[#3a3a3a] hover:bg-[#2a2a2a]'}`}
              >
                <div className={`w-5 h-5 rounded-lg border ${t.key === 'clean-light' ? 'bg-white border-[#ccc]' : 'bg-[#2a2a2a] border-[#444]'}`} />
                <span className="text-white text-xs font-medium">{t.label}</span>
                {(activeChat.theme === t.key || (!activeChat.theme && t.key === 'clean-dark')) && <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 ml-auto" />}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Forward Modal */}
      {showForwardModal && (
        <div className="fixed inset-0 z-[400] bg-black/70 backdrop-blur-md flex items-center justify-center p-6">
          <div className="bg-[#1a1a1a] w-full max-w-sm rounded-2xl border border-[#2a2a2a] shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-[#2a2a2a] flex items-center justify-between">
              <h3 className="text-white font-semibold text-sm">Forward to</h3>
              <button onClick={() => setShowForwardModal(false)} className="text-[#8e8e93] hover:text-white text-sm">✕</button>
            </div>
            <div className="p-3 space-y-1 max-h-64 overflow-y-auto">
              {allChats.filter(c => c.id !== activeChat.id).map(chat => (
                <button key={chat.id}
                  onClick={() => { if (forwardMsgId) forwardMessage(activeChat.id, chat.id, forwardMsgId, isGhostMode ? 'Anonymous' : (user?.name || 'User')); setShowForwardModal(false); setForwardMsgId(null); }}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-[#2a2a2a] transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-[#2a2a2a] flex items-center justify-center font-semibold text-white text-sm border border-[#3a3a3a]">{chat.name[0]}</div>
                  <span className="text-white text-sm">{chat.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Starred Messages */}
      {showStarred && (
        <div className="fixed inset-0 z-[400] bg-black/70 backdrop-blur-md flex items-start justify-center pt-20 p-6">
          <div className="bg-[#1a1a1a] w-full max-w-lg rounded-2xl border border-[#2a2a2a] shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-[#2a2a2a] flex items-center justify-between">
              <div className="flex items-center gap-2"><Star size={15} className="text-amber-400" /><h3 className="text-white font-semibold text-sm">Starred Messages</h3></div>
              <button onClick={() => setShowStarred(false)} className="text-[#8e8e93] hover:text-white">✕</button>
            </div>
            <div className="max-h-80 overflow-y-auto custom-scrollbar">
              {starredMsgs.length === 0 ? <p className="text-[#555] text-xs text-center py-8">No starred messages</p>
                : starredMsgs.map(msg => (
                  <div key={msg.id} className="px-5 py-4 border-b border-[#2a2a2a]">
                    <p className="text-[9px] font-semibold text-[#8e8e93] uppercase mb-1">{msg.senderName} · {msg.timestamp}</p>
                    <p className="text-sm text-white">{msg.content}</p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Media Gallery */}
      {showMediaGallery && (
        <div className="fixed inset-0 z-[400] bg-black/70 backdrop-blur-md flex items-start justify-center pt-20 p-6">
          <div className="bg-[#1a1a1a] w-full max-w-lg rounded-2xl border border-[#2a2a2a] shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-[#2a2a2a] flex items-center justify-between">
              <h3 className="text-white font-semibold text-sm">Media & Files</h3>
              <button onClick={() => setShowMediaGallery(false)} className="text-[#8e8e93] hover:text-white">✕</button>
            </div>
            <div className="p-4 max-h-80 overflow-y-auto custom-scrollbar">
              {mediaMsgs.length === 0 ? <p className="text-[#555] text-xs text-center py-8">No files shared yet</p>
                : <div className="grid grid-cols-2 gap-3">
                    {mediaMsgs.map(msg => (
                      <div key={msg.id} className="p-3 bg-[#2a2a2a] rounded-xl flex items-center gap-2 border border-[#333]">
                        <FileText size={14} className="text-[#8e8e93] shrink-0" />
                        <div className="overflow-hidden">
                          <p className="text-xs font-medium text-white truncate">{msg.file?.name}</p>
                          <p className="text-[8px] text-[#555]">{msg.file?.size}</p>
                        </div>
                      </div>
                    ))}
                  </div>
              }
            </div>
          </div>
        </div>
      )}

      {/* C15: Schedule picker modal */}
      {showScheduler && (
        <div className="fixed inset-0 z-[400] bg-black/70 backdrop-blur-md flex items-center justify-center p-6" onClick={() => setShowScheduler(false)}>
          <div className="bg-[#1a1a1a] w-full max-w-sm rounded-2xl border border-[#2a2a2a] shadow-2xl p-6 space-y-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock size={15} className="text-indigo-400" />
                <h3 className="text-white font-semibold text-sm">Schedule Message</h3>
              </div>
              <button onClick={() => setShowScheduler(false)} className="text-[#8e8e93] hover:text-white"><X size={15} /></button>
            </div>
            <p className="text-[#8e8e93] text-xs">Message: <span className="text-white">{text.slice(0, 60)}{text.length > 60 ? '...' : ''}</span></p>
            <input
              type="datetime-local"
              value={scheduleDateTime}
              onChange={e => setScheduleDateTime(e.target.value)}
              className="w-full bg-[#0f172a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-indigo-500 [color-scheme:dark]"
            />
            <button onClick={handleScheduleMessage} disabled={!scheduleDateTime || !text.trim()}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-bold text-sm transition-all active:scale-95"
            >
              Schedule Send
            </button>
          </div>
        </div>
      )}

      {/* Chat header */}
      <header className={`h-16 border-b flex items-center px-6 justify-between ${isGhostMode ? 'bg-[#1a1a1a] border-[#2a2a2a]' : `${theme.headerBg} ${theme.headerBorder}`}`}>
        <div className="flex items-center gap-4">
          <div className={`w-9 h-9 rounded-full flex items-center justify-center font-semibold text-white text-sm ${isGhostMode ? 'bg-[#2a2a2a]' : (theme.key === 'clean-light' ? 'bg-[#1a1a1a]' : 'bg-[#2a2a2a]')}`}>
            {isGhostMode ? <Ghost size={16} className="text-[#8e8e93]" /> : activeChat.name[0]}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className={`font-semibold text-sm ${isGhostMode || theme.key === 'clean-dark' ? 'text-white' : 'text-[#1a1a1a]'}`}>
                {isGhostMode ? 'Ghost Channel' : activeChat.name}
              </h2>
              {isMuted && <VolumeX size={12} className="text-[#555]" />}
            </div>
            <div className="flex items-center gap-2 text-[10px]">
              <ShieldCheck size={11} className={isGhostMode ? 'text-[#8e8e93]' : theme.accent} />
              <span className={isGhostMode ? 'text-[#8e8e93]' : theme.accent}>
                {otherTyping ? `${activeChat.name} is typing...` : 'AI Safety Live'}
              </span>
              <span className={isGhostMode || theme.key === 'clean-dark' ? 'text-[#555]' : 'text-[#999]'}>· {msgCount} msgs</span>
              {activeChat.type === 'direct' && <span className={isGhostMode || theme.key === 'clean-dark' ? 'text-[#444]' : 'text-[#bbb]'}>· Last seen 2m ago</span>}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={toggleSelectMode} title="Select messages"
            className={`p-2 rounded-xl transition-all hover:bg-black/10 ${isSelectMode ? 'text-indigo-400 bg-indigo-500/10' : (isGhostMode || theme.key === 'clean-dark' ? 'text-[#8e8e93] hover:text-white' : 'text-[#666] hover:text-[#1a1a1a]')}`}
          ><MessageSquare size={16} /></button>
          {[
            { icon: <Star size={16} />, action: () => setShowStarred(true), title: 'Starred messages' },
            { icon: <FileText size={16} />, action: () => setShowMediaGallery(true), title: 'Media & files' },
            { icon: <Palette size={16} />, action: (e: React.MouseEvent) => { e.stopPropagation(); setShowThemePicker(p => !p); }, title: 'Chat theme' },
            { icon: isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />, action: handleMuteToggle, title: isMuted ? 'Unmute' : 'Mute' },
            { icon: <MoreVertical size={16} />, action: onToggleChatInfo, title: 'Chat info' },
          ].map((btn, i) => (
            <button key={i} onClick={btn.action as any} title={btn.title}
              className={`p-2 rounded-xl transition-all hover:bg-black/10 ${isGhostMode || theme.key === 'clean-dark' ? 'text-[#8e8e93] hover:text-white' : 'text-[#666] hover:text-[#1a1a1a]'} ${isMuted && btn.title?.includes('Mute') ? 'text-amber-400' : ''}`}
            >{btn.icon}</button>
          ))}
        </div>
      </header>

      {/* C3: Pinned banner — click to jump */}
      {pinnedMsgs.length > 0 && (
        <button onClick={() => scrollToMessage(pinnedMsgs[pinnedMsgs.length - 1].id)}
          className={`w-full px-5 py-2 border-b flex items-center gap-2 text-left hover:opacity-80 transition-opacity ${isGhostMode || theme.key === 'clean-dark' ? 'bg-[#1a1a1a] border-[#2a2a2a]' : 'bg-[#f8f8f8] border-[#e0e0e0]'}`}
        >
          <Pin size={11} className={theme.accent} />
          <p className={`text-xs truncate flex-1 ${theme.accent}`}>📌 {pinnedMsgs[pinnedMsgs.length - 1].content}</p>
          <span className={`text-[9px] uppercase font-medium ${isGhostMode || theme.key === 'clean-dark' ? 'text-[#555]' : 'text-[#999]'}`}>
            {pinnedMsgs.length} pinned · jump ↑
          </span>
        </button>
      )}

      {/* Message area */}
      <div ref={scrollAreaRef} onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-6 pt-4 pb-4 custom-scrollbar"
        onClick={() => { setActiveMenu(null); setActiveEmojiPicker(null); setContextMenu(null); }}
      >
        {/* Load earlier / C19 beginning */}
        <div className="flex flex-col items-center mb-4">
          {canLoadMore ? (
            <button onClick={handleLoadEarlier} disabled={isLoadingMore}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-[10px] font-medium uppercase tracking-widest transition-all ${
                isLoadingMore ? 'border-[#2a2a2a] text-[#555] cursor-not-allowed'
                  : (theme.key === 'clean-light' && !isGhostMode ? 'border-[#e0e0e0] text-[#666] hover:text-[#1a1a1a] hover:border-[#ccc]'
                    : 'border-[#2a2a2a] text-[#8e8e93] hover:text-white hover:border-[#3a3a3a] hover:bg-white/5')
              }`}
            >
              {isLoadingMore ? <><Loader2 size={11} className="animate-spin" /> Loading...</> : <><ChevronUp size={11} /> Load earlier</>}
            </button>
          ) : (
            <div className="flex flex-col items-center gap-2 py-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-white text-lg ${isGhostMode ? 'bg-[#2a2a2a]' : 'bg-indigo-600/20 border border-indigo-500/20'}`}>
                {isGhostMode ? <Ghost size={20} className="text-[#555]" /> : activeChat.name[0]}
              </div>
              <div className="flex items-center gap-3">
                <div className={`h-px w-12 ${theme.separatorLine}`} />
                <span className={`text-[9px] uppercase tracking-widest ${theme.separatorText}`}>
                  Beginning of your conversation with {isGhostMode ? 'this channel' : activeChat.name}
                </span>
                <div className={`h-px w-12 ${theme.separatorLine}`} />
              </div>
            </div>
          )}
        </div>

        {/* F5: Empty state when chat has no messages */}
        {chatMsgs.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
            <div className={`w-16 h-16 rounded-3xl flex items-center justify-center text-2xl font-bold ${isGhostMode ? 'bg-[#2a2a2a]' : 'bg-indigo-600/10 border border-indigo-500/20'}`}>
              {isGhostMode ? '👻' : activeChat.name[0]}
            </div>
            <div>
              <p className="text-white font-semibold text-sm mb-1">
                {isGhostMode ? 'Ghost Channel Ready' : `Start chatting with ${activeChat.name}`}
              </p>
              <p className={`text-xs ${isGhostMode ? 'text-[#555]' : 'text-slate-500'}`}>
                {activeChat.type === 'group'
                  ? 'Say hello to the group! All messages are AI-monitored.'
                  : `This is the beginning of your direct message with ${activeChat.name}.`}
              </p>
            </div>
            <div className="flex items-center gap-2 text-[9px] text-[#555] uppercase tracking-widest">
              <ShieldCheck size={10} className="text-emerald-500/50" />
              End-to-end encrypted · AI safety active
            </div>
          </div>
        )}

        {/* E1: animate-chat-in wrapper — key changes on chat switch */}
        <div key={chatAnimKey} className={chatMsgs.length > 0 ? 'space-y-1 animate-chat-in' : 'space-y-1'}>
          {renderItems.map((item, idx) => {
            if (item.type === 'date') {
              return (
                <div key={`date-${idx}`} className="flex items-center gap-3 py-4">
                  <div className={`flex-1 h-px ${theme.separatorLine}`} />
                  <span className={`text-[9px] font-medium uppercase tracking-widest px-3 py-1 ${theme.separatorBg} rounded-full ${theme.separatorText}`}>{item.label}</span>
                  <div className={`flex-1 h-px ${theme.separatorLine}`} />
                </div>
              );
            }
            if (item.type === 'unread-divider') {
              return (
                <div key={`unread-${idx}`} className="flex items-center gap-3 py-3">
                  <div className="flex-1 h-px bg-red-500/40" />
                  <span className="text-[9px] font-semibold uppercase tracking-widest px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full text-red-400">New messages</span>
                  <div className="flex-1 h-px bg-red-500/40" />
                </div>
              );
            }

            const { msg, isGrouped } = item;
            const isNew = newMsgIds.has(msg.id);
            const isSelected = selectedMsgs.has(msg.id);
            // E3: stacked read-by avatars on the last sent message
            const isLastSentMsg = msg.senderId === 'me' && !msg.isDeleted &&
              chatMsgs.filter(m => m.senderId === 'me' && !m.isDeleted).slice(-1)[0]?.id === msg.id;

            return (
              <div key={msg.id}
                ref={el => { msgRefs.current[msg.id] = el; }}
                className={`flex ${msg.senderId === 'me' ? 'justify-end' : 'justify-start'} ${isGrouped ? 'mt-0.5' : 'mt-4'} ${isNew ? 'animate-msg-pop' : ''} rounded-xl transition-colors ${isSelected ? 'bg-indigo-500/10' : ''} ${isSelectMode ? 'cursor-pointer px-2 py-0.5' : ''}`}
                onClick={isSelectMode ? () => toggleMsgSelect(msg.id) : undefined}
              >
                {/* C9: checkbox */}
                {isSelectMode && (
                  <div className="flex items-center pr-3 shrink-0">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${isSelected ? 'bg-indigo-500 border-indigo-500' : 'border-[#444]'}`}>
                      {isSelected && <span className="text-white text-[10px] font-bold">✓</span>}
                    </div>
                  </div>
                )}

                <div className={`max-w-[65%] flex flex-col relative group ${msg.senderId === 'me' ? 'items-end' : 'items-start'}`}
                  onContextMenu={e => !msg.isDeleted && !isSelectMode && handleRightClick(e, msg.id)}
                >
                  {!isGrouped && msg.senderId !== 'me' && !msg.isDeleted && (
                    <p className={`text-[9px] font-semibold uppercase tracking-widest mb-1 px-1 ${theme.key === 'clean-light' && !isGhostMode ? 'text-[#666]' : 'text-[#8e8e93]'}`}>
                      {isGhostMode ? 'Anonymous' : msg.senderName}
                    </p>
                  )}

                  {!msg.isAIValidated && !msg.isDeleted && (
                    <div className="flex items-center gap-1 mb-1 px-2 py-0.5 bg-[#2a2a2a] rounded-full">
                      <Loader2 size={10} className="text-indigo-400 animate-spin" />
                      <span className="text-[8px] font-medium text-indigo-400 uppercase tracking-widest">AI Validating...</span>
                    </div>
                  )}

                  {msg.sentiment === 'Toxic' && !msg.isDeleted && (
                    <div className="flex items-center gap-1 mb-1 px-2 py-0.5 bg-red-500/10 border border-red-500/20 rounded-full">
                      <AlertTriangle size={10} className="text-red-500" />
                      <span className="text-[8px] font-medium text-red-500 uppercase tracking-widest">Toxic Flag</span>
                    </div>
                  )}

                  {msg.isPinned && !msg.isDeleted && (
                    <div className="flex items-center gap-1 mb-1 px-2 py-0.5 bg-[#2a2a2a] rounded-full">
                      <Pin size={8} className={theme.accent} />
                      <span className={`text-[8px] font-medium uppercase tracking-widest ${theme.accent}`}>Pinned</span>
                    </div>
                  )}

                  {editingMsgId === msg.id ? (
                    <div className="flex items-center gap-2 w-full">
                      <input value={editText} onChange={e => setEditText(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') handleEditSave(); if (e.key === 'Escape') setEditingMsgId(null); }}
                        className="flex-1 bg-[#2a2a2a] border border-[#3a3a3a] rounded-xl px-4 py-2 text-white text-sm outline-none focus:border-[#555]"
                        autoFocus
                      />
                      <button onClick={handleEditSave} className="text-emerald-400 text-xs font-medium px-2">Save</button>
                      <button onClick={() => setEditingMsgId(null)} className="text-[#555] text-xs px-1">✕</button>
                    </div>
                  ) : (
                    <div className={`${bubblePadding} rounded-2xl text-sm transition-all duration-200 relative ${
                      msg.isDeleted
                        ? (theme.key === 'clean-light' && !isGhostMode ? 'bg-[#f0f0f0] text-[#999] italic border border-[#e0e0e0]' : 'bg-[#1a1a1a] text-[#555] italic border border-[#2a2a2a]')
                        : msg.sentiment === 'Toxic'
                          ? 'bg-red-950/40 border-2 border-red-500/50 text-red-100'
                          : msg.senderId === 'me'
                            ? (isGhostMode ? 'bg-[#2a2a2a] text-white' : `${theme.sentBg} ${theme.sentText}`)
                            : (isGhostMode ? 'bg-[#222] text-white border border-[#2a2a2a]' : `${theme.receivedBg} ${theme.receivedText} border ${theme.receivedBorder}`)
                    } ${!msg.isAIValidated && !msg.isDeleted ? 'opacity-60' : ''} ${msg.isPinned && !msg.isDeleted ? 'ring-1 ring-[#3a3a3a]' : ''}`}>

                      {/* Hover action buttons */}
                      {!msg.isDeleted && !isSelectMode && (
                        <button onClick={e => { e.stopPropagation(); setActiveMenu(activeMenu === msg.id ? null : msg.id); setActiveEmojiPicker(null); }}
                          className="absolute -right-10 top-1/2 -translate-y-1/2 p-2 opacity-0 group-hover:opacity-100 transition-opacity text-[#555] hover:text-white"
                        ><MoreVertical size={15} /></button>
                      )}
                      {!msg.isDeleted && !isSelectMode && (
                        <button onClick={e => { e.stopPropagation(); setActiveEmojiPicker(activeEmojiPicker === msg.id ? null : msg.id); setActiveMenu(null); }}
                          className="absolute -left-10 top-1/2 -translate-y-1/2 p-2 opacity-0 group-hover:opacity-100 transition-opacity text-[#555] hover:text-white text-base"
                        >😊</button>
                      )}

                      {/* C13: Emoji picker with skin tone on right-click */}
                      {activeEmojiPicker === msg.id && (
                        <div onClick={e => e.stopPropagation()} className="absolute -left-2 -top-14 z-[60] flex gap-1 bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl px-3 py-2 shadow-2xl">
                          {EMOJIS.map(emoji => {
                            const existing = (msg.reactions || []).find(r => r.emoji === emoji);
                            return (
                              <div key={emoji} className="relative">
                                <button
                                  onClick={() => handleEmojiClick(activeChat.id, msg.id, emoji, existing?.reactedByMe || false)}
                                  onContextMenu={e => { e.preventDefault(); e.stopPropagation(); setSkinToneEmoji(emoji); setShowSkinTone(true); }}
                                  className={`text-lg hover:scale-125 transition-transform rounded-lg p-1 ${existing?.reactedByMe ? 'bg-[#2a2a2a]' : ''}`}
                                  title="Click to react · Right-click for skin tones"
                                >{emoji}</button>
                                {showSkinTone && skinToneEmoji === emoji && (
                                  <div onClick={e => e.stopPropagation()} className="absolute bottom-9 left-0 z-[70] flex gap-1 bg-[#0f172a] border border-[#2a2a2a] rounded-xl px-2 py-1.5 shadow-2xl">
                                    {SKIN_TONES.map((tone, ti) => (
                                      <button key={ti}
                                        onClick={() => { handleEmojiClick(activeChat.id, msg.id, emoji + tone, existing?.reactedByMe || false); setShowSkinTone(false); setSkinToneEmoji(null); }}
                                        className="text-base hover:scale-125 transition-transform p-0.5 rounded"
                                        title={ti === 0 ? 'Default' : `Skin tone ${ti}`}
                                      >{emoji}{tone}</button>
                                    ))}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* Action dropdown */}
                      {activeMenu === msg.id && (
                        <div onClick={e => e.stopPropagation()} className="absolute right-0 top-12 z-[50] w-44 bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl shadow-2xl overflow-hidden">
                          <button onClick={() => handleReply(msg)} className="w-full px-4 py-2.5 text-[10px] font-medium uppercase text-[#8e8e93] hover:bg-white/5 hover:text-white flex items-center gap-3"><Reply size={13} /> Reply</button>
                          {msg.senderId === 'me' && !msg.isDeleted && <button onClick={() => handleEditStart(msg)} className="w-full px-4 py-2.5 text-[10px] font-medium uppercase text-[#8e8e93] hover:bg-white/5 hover:text-white flex items-center gap-3 border-t border-[#2a2a2a]"><Edit2 size={13} /> Edit</button>}
                          <button onClick={() => { setForwardMsgId(msg.id); setShowForwardModal(true); setActiveMenu(null); }} className="w-full px-4 py-2.5 text-[10px] font-medium uppercase text-[#8e8e93] hover:bg-white/5 hover:text-white flex items-center gap-3 border-t border-[#2a2a2a]"><Forward size={13} /> Forward</button>
                          {!msg.isDeleted && msg.content && <button onClick={() => handleCopy(msg.content)} className="w-full px-4 py-2.5 text-[10px] font-medium uppercase text-[#8e8e93] hover:bg-white/5 hover:text-white flex items-center gap-3 border-t border-[#2a2a2a]"><Copy size={13} /> Copy</button>}
                          <button onClick={() => handleStar(activeChat.id, msg.id, !!msg.isStarred)} className="w-full px-4 py-2.5 text-[10px] font-medium uppercase text-amber-400 hover:bg-amber-500/10 flex items-center gap-3 border-t border-[#2a2a2a]">{msg.isStarred ? <StarOff size={13} /> : <Star size={13} />}{msg.isStarred ? 'Unstar' : 'Star'}</button>
                          <button onClick={() => handlePin(activeChat.id, msg.id, !!msg.isPinned)} className="w-full px-4 py-2.5 text-[10px] font-medium uppercase text-indigo-400 hover:bg-indigo-500/10 flex items-center gap-3 border-t border-[#2a2a2a]">{msg.isPinned ? <PinOff size={13} /> : <Pin size={13} />}{msg.isPinned ? 'Unpin' : 'Pin'}</button>
                          <button onClick={() => { deleteMessage(activeChat.id, msg.id); setActiveMenu(null); }} className="w-full px-4 py-2.5 text-[10px] font-medium uppercase text-red-400 hover:bg-red-500/10 flex items-center gap-3 border-t border-[#2a2a2a]"><Trash2 size={13} /> Delete</button>
                          {msg.sentiment === 'Toxic' && <button onClick={() => { reportFalsePositive(activeChat.id, msg.id); setActiveMenu(null); }} className="w-full px-4 py-2.5 text-[10px] font-medium uppercase text-[#8e8e93] hover:bg-white/5 hover:text-white flex items-center gap-3 border-t border-[#2a2a2a]"><Flag size={13} /> Report Error</button>}
                        </div>
                      )}

                      {/* Forwarded badge */}
                      {msg.isForwarded && (
                        <div className="flex items-center gap-1 mb-2 opacity-50">
                          <Forward size={9} /><span className="text-[9px] font-medium uppercase tracking-widest">Forwarded</span>
                        </div>
                      )}

                      {/* C4: Reply quote — click jumps to original */}
                      {msg.replyToContent && !msg.isDeleted && (
                        <div
                          className={`mb-2 px-3 py-2 rounded-xl border-l-2 text-[11px] opacity-70 cursor-pointer hover:opacity-100 transition-opacity ${msg.senderId === 'me' ? 'border-white/40 bg-white/10' : 'border-[#555] bg-black/10'}`}
                          onClick={e => { e.stopPropagation(); if (msg.replyToId) scrollToMessage(msg.replyToId); }}
                        ><p className="truncate">{msg.replyToContent}</p></div>
                      )}

                      {/* File — C5: image lightbox, C18: download */}
                      {msg.file && (
                        <div className={`mb-2 p-3 bg-black/20 rounded-xl ${isImageFile(msg.file.name) ? 'cursor-pointer hover:bg-black/30 transition-colors' : 'flex items-center gap-3'}`}
                          onClick={isImageFile(msg.file.name) ? e => { e.stopPropagation(); setLightboxSrc(`https://picsum.photos/seed/${msg.id}/800/600`); } : undefined}
                        >
                          {isImageFile(msg.file.name) ? (
                            <img src={`https://picsum.photos/seed/${msg.id}/300/200`} alt={msg.file.name} className="w-full max-w-[220px] rounded-lg object-cover" />
                          ) : (
                            <>
                              <FileText size={15} className="shrink-0" />
                              <span className="text-xs truncate flex-1">{msg.file.name}</span>
                              <button onClick={e => { e.stopPropagation(); addToast({ title: '⬇️ Download', message: `Downloading ${msg.file!.name}`, type: 'system' }); }}
                                className="ml-auto text-[#8e8e93] hover:text-white transition-colors shrink-0" title="Download"
                              ><Download size={13} /></button>
                            </>
                          )}
                        </div>
                      )}

                      {/* C17: message with code block rendering */}
                      <div className="break-words chat-message-text">
                        {msg.isDeleted
                          ? <span className="italic opacity-50">Message deleted</span>
                          : msg.content ? renderWithCodeBlocks(msg.content, theme.accent, handleCopyCode) : null
                        }
                      </div>

                      {msg.isEdited && !msg.isDeleted && <span className="text-[8px] opacity-40 ml-1 italic">(edited)</span>}
                      {msg.isStarred && !msg.isDeleted && <Star size={8} className="absolute top-2 right-2 text-amber-400 fill-amber-400" />}
                    </div>
                  )}

                  {/* Reactions */}
                  {(msg.reactions || []).length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1 px-1">
                      {(msg.reactions || []).map(r => (
                        <button key={r.emoji} onClick={e => { e.stopPropagation(); handleEmojiClick(activeChat.id, msg.id, r.emoji, r.reactedByMe); }}
                          className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border transition-all ${r.reactedByMe ? 'bg-[#2a2a2a] border-[#444]' : 'bg-[#1a1a1a] border-[#2a2a2a] hover:border-[#3a3a3a]'}`}
                        ><span>{r.emoji}</span><span className="text-[10px] font-medium text-[#8e8e93]">{r.count}</span></button>
                      ))}
                    </div>
                  )}

                  {/* E3: Read-by stacked avatars under last sent message */}
                  {isLastSentMsg && seenByNames.length > 0 && msg.isAIValidated && (
                    <div className="flex items-center gap-0.5 mt-1 px-1">
                      {seenByNames.slice(0, 3).map((name, i) => (
                        <div key={i} title={`Seen by ${name}`}
                          className="w-4 h-4 rounded-full bg-indigo-600 border border-[#1a1a1a] flex items-center justify-center text-[7px] font-bold text-white -ml-1 first:ml-0"
                        >{name[0].toUpperCase()}</div>
                      ))}
                      {seenByNames.length > 3 && <span className="text-[8px] text-[#555] ml-1">+{seenByNames.length - 3}</span>}
                    </div>
                  )}

                  {/* Timestamp row — F19: always visible if setting on */}
                  <div className="flex items-center gap-1.5 mt-0.5 px-1 relative"
                    onMouseEnter={() => setHoveredTimestamp(msg.id)}
                    onMouseLeave={() => setHoveredTimestamp(null)}
                  >
                    <span className={`text-[8px] font-medium cursor-default ${theme.key === 'clean-light' && !isGhostMode ? 'text-[#999]' : 'text-[#555]'} ${alwaysShowTimestamps ? 'opacity-100' : ''}`}>
                      {msg.timestamp}
                    </span>
                    {msg.isAIValidated && msg.sentiment !== 'Toxic' && !msg.isDeleted && (
                      <ShieldCheck size={9} className="text-emerald-500/50" />
                    )}
                    {msg.senderId === 'me' && !msg.isDeleted && (
                      <div className="relative"
                        onMouseEnter={() => setSeenByMsgId(msg.id)}
                        onMouseLeave={() => setSeenByMsgId(null)}
                      >
                        {msg.isAIValidated ? <CheckCheck size={11} className={theme.accent} /> : <Check size={11} className="text-[#555]" />}
                        {/* C1: Seen-by tooltip */}
                        {seenByMsgId === msg.id && msg.isAIValidated && seenByNames.length > 0 && (
                          <div className="absolute bottom-6 right-0 z-[40] bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl shadow-2xl px-3 py-2 whitespace-nowrap min-w-[130px]">
                            <div className="flex items-center gap-1.5 mb-1.5">
                              <Users size={9} className="text-[#8e8e93]" />
                              <span className="text-[#8e8e93] text-[9px] font-semibold uppercase tracking-widest">Seen by</span>
                            </div>
                            {seenByNames.map((name, i) => (
                              <div key={i} className="flex items-center gap-2 py-0.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                                <span className="text-white text-[10px]">{name}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                    {hoveredTimestamp === msg.id && msg.fullTimestamp && (
                      <div className="absolute bottom-5 left-0 z-[40] bg-[#1a1a1a] border border-[#2a2a2a] text-[#8e8e93] text-[10px] px-2 py-1 rounded-lg whitespace-nowrap shadow-xl">
                        {msg.fullTimestamp}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Typing indicator */}
          {otherTyping && (
            <div className="flex justify-start mt-4">
              <div className={`px-4 py-3 rounded-2xl flex items-center gap-1.5 ${isGhostMode || theme.key === 'clean-dark' ? 'bg-[#1e293b] border border-[#2a2a2a]' : 'bg-[#f0f0f0] border border-[#e0e0e0]'}`}>
                <span className="w-1.5 h-1.5 rounded-full bg-[#8e8e93] animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-[#8e8e93] animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-[#8e8e93] animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
          <div ref={scrollRef} />
        </div>
      </div>

      {/* Scroll to bottom */}
      {showScrollBtn && (
        <button onClick={scrollToBottom} className="absolute bottom-28 right-6 z-[30] p-2.5 rounded-full shadow-2xl border border-[#2a2a2a] bg-[#1a1a1a] text-[#8e8e93] hover:text-white transition-all hover:scale-110 active:scale-90">
          <ChevronDown size={18} />
        </button>
      )}

      {/* ── Footer ── */}
      <footer className={`px-4 py-3 border-t ${isGhostMode || theme.key === 'clean-dark' ? 'border-[#2a2a2a]' : 'border-[#e0e0e0]'}`}>
        <div className="max-w-5xl mx-auto space-y-2">

          {/* Reply banner */}
          {replyTo && (
            <div className={`flex items-center gap-3 px-3 py-2 rounded-xl border ${isGhostMode || theme.key === 'clean-dark' ? 'bg-[#1a1a1a] border-[#2a2a2a]' : 'bg-[#f5f5f5] border-[#e0e0e0]'}`}>
              <Reply size={11} className="text-[#8e8e93] shrink-0" />
              <p className={`text-xs truncate flex-1 ${theme.key === 'clean-light' && !isGhostMode ? 'text-[#666]' : 'text-[#8e8e93]'}`}>
                Replying to: <span className={theme.key === 'clean-light' && !isGhostMode ? 'text-[#1a1a1a]' : 'text-white'}>{replyTo.content}</span>
              </p>
              <button onClick={() => setReplyTo(null)} className="text-[#555] hover:text-white text-xs">✕</button>
            </div>
          )}

          {/* Quick emoji bar */}
          <div className="flex items-center gap-0.5 px-1">
            {QUICK_EMOJIS.map(emoji => (
              <button key={emoji} onClick={() => setText(t => t + emoji)}
                className="text-base hover:scale-125 transition-transform p-1 rounded-lg hover:bg-black/5"
              >{emoji}</button>
            ))}
            {text.length > 400 && (
              <span className={`text-xs font-medium ml-auto ${charsLeft < 50 ? 'text-red-400' : 'text-[#8e8e93]'}`}>{charsLeft}</span>
            )}
          </div>

          {/* C14: Recording indicator */}
          {isRecording && (
            <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-red-950/40 border border-red-700/40">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse shrink-0" />
              <span className="text-red-400 text-xs font-medium shrink-0">Recording</span>
              <div className="flex items-end gap-0.5 flex-1 h-5">
                {Array.from({ length: 24 }).map((_, i) => (
                  <div key={i} className="w-1 bg-red-500/70 rounded-full animate-pulse flex-shrink-0"
                    style={{ height: `${(Math.sin(i * 0.8) * 0.5 + 0.5) * 14 + 3}px`, animationDelay: `${i * 60}ms` }}
                  />
                ))}
              </div>
              <span className="text-red-300 text-xs font-mono tabular-nums shrink-0">
                {Math.floor(recordSeconds / 60).toString().padStart(2, '0')}:{(recordSeconds % 60).toString().padStart(2, '0')}
              </span>
            </div>
          )}

          {/* C6: Mention autocomplete dropdown */}
          {showMentions && mentionMembers.length > 0 && (
            <div className={`rounded-xl border shadow-2xl overflow-hidden ${theme.menuBg} ${theme.menuBorder}`}>
              <p className="text-[9px] text-[#555] font-semibold uppercase tracking-widest px-3 pt-2 pb-1">Mention</p>
              {mentionMembers.slice(0, 5).map((m, i) => (
                <button key={m.userId}
                  onClick={() => insertMention(m.name)}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-white/5 transition-colors ${i === mentionIndex ? 'bg-white/5' : ''} ${theme.menuText}`}
                >
                  <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-white text-[10px] font-bold">{m.name[0].toUpperCase()}</div>
                  <span className="font-medium">{m.name}</span>
                  <span className={`text-[9px] ml-auto ${m.role === 'admin' ? 'text-amber-400' : 'text-[#555]'}`}>{m.role}</span>
                </button>
              ))}
            </div>
          )}

          {/* Input bar */}
          <form onSubmit={e => { e.preventDefault(); handleSendMessage(); }}
            className={`flex items-center gap-3 rounded-2xl px-3 py-2 border ${isGhostMode || theme.key === 'clean-dark' ? `${theme.inputBarBg} ${theme.inputBarBorder}` : `${theme.inputBarBg} ${theme.inputBarBorder}`}`}
          >
            <input type="file" className="hidden" ref={fileInputRef} onChange={e => setSelectedFile(e.target.files?.[0] || null)} />
            <button type="button" onClick={() => fileInputRef.current?.click()}
              className={`p-1.5 rounded-lg transition-colors ${theme.key === 'clean-light' && !isGhostMode ? 'text-[#666] hover:text-[#1a1a1a] hover:bg-black/5' : 'text-[#555] hover:text-[#8e8e93] hover:bg-white/5'}`}
              title="Attach file"
            ><Paperclip size={18} /></button>

            {/* C14: Mic */}
            <button type="button" onClick={handleVoiceToggle}
              title={isRecording ? 'Stop & send' : 'Voice message'}
              className={`p-1.5 rounded-lg transition-all ${isRecording ? 'text-red-400 bg-red-500/10 animate-pulse' : (theme.key === 'clean-light' && !isGhostMode ? 'text-[#666] hover:text-[#1a1a1a] hover:bg-black/5' : 'text-[#555] hover:text-[#8e8e93] hover:bg-white/5')}`}
            >{isRecording ? <MicOff size={18} /> : <Mic size={18} />}</button>

            {/* C15: Schedule button */}
            <button type="button"
              onClick={() => { if (!text.trim()) { addToast({ title: '⚠️ Empty', message: 'Type a message first.', type: 'alert' }); return; } setShowScheduler(true); }}
              title="Schedule message"
              className={`p-1.5 rounded-lg transition-colors ${theme.key === 'clean-light' && !isGhostMode ? 'text-[#666] hover:text-[#1a1a1a] hover:bg-black/5' : 'text-[#555] hover:text-[#8e8e93] hover:bg-white/5'}`}
            ><Clock size={17} /></button>

            <input
              ref={inputRef} type="text" value={text} onChange={handleTextChange}
              onPaste={handlePaste}
              disabled={isRecording}
              placeholder={
                isRecording ? 'Recording... tap mic to send'
                  : replyTo ? `Reply to ${replyTo.senderName}...`
                  : isGhostMode ? 'Send anonymous message...'
                  : `Message ${activeChat.name}...`
              }
              className={`flex-1 bg-transparent border-none outline-none text-sm ${theme.key === 'clean-light' && !isGhostMode ? 'text-[#1a1a1a] placeholder-[#999]' : 'text-white placeholder-[#555]'} ${isRecording ? 'opacity-40 cursor-not-allowed' : ''}`}
            />
            <button type="submit" disabled={!text.trim() || isRecording}
              className={`p-2 rounded-xl transition-all active:scale-90 disabled:opacity-30 ${sendAnim ? 'scale-125' : 'scale-100'} ${theme.key === 'clean-light' && !isGhostMode ? 'bg-[#1a1a1a] text-white hover:bg-[#2a2a2a]' : 'bg-[#2a2a2a] text-white hover:bg-[#333] border border-[#3a3a3a]'}`}
            ><Send size={16} /></button>
          </form>

          <p className={`text-[9px] text-center font-medium uppercase tracking-widest ${theme.key === 'clean-light' && !isGhostMode ? 'text-[#bbb]' : 'text-[#333]'}`}>
            <kbd className={`px-1 rounded text-[9px] ${theme.key === 'clean-light' && !isGhostMode ? 'bg-[#e0e0e0] text-[#666]' : 'bg-[#1a1a1a] text-[#555]'}`}>Esc</kbd> close ·
            Right-click for options · Mic for voice · <kbd className={`px-1 rounded text-[9px] ${theme.key === 'clean-light' && !isGhostMode ? 'bg-[#e0e0e0] text-[#666]' : 'bg-[#1a1a1a] text-[#555]'}`}>Ctrl+K</kbd> commands
          </p>
        </div>
      </footer>
    </div>
  );
}