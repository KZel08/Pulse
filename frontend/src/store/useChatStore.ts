import { create } from 'zustand';

export interface Chat {
  id: string; name: string; type: 'direct' | 'group';
  status?: 'Verified' | 'Flagged'; latency?: number;
  theme?: string;
  description?: string; // F17
  isBlocked?: boolean; // Contact management
  isArchived?: boolean; // Contact management
  isStarred?: boolean; // Contact management
  lastSeen?: string; // Contact management
  onlineStatus?: 'online' | 'offline' | 'away'; // Contact management
}
export interface Reaction { emoji: string; count: number; reactedByMe: boolean; }
export interface Message {
  id: string; senderId: string; senderName: string; content: string;
  timestamp: string; fullTimestamp?: string; type: 'text' | 'file';
  file?: { name: string; size: string };
  isAIValidated: boolean; sentiment?: 'Positive' | 'Neutral' | 'Toxic';
  isDeleted?: boolean; isEdited?: boolean; reactions?: Reaction[]; isPinned?: boolean;
  isStarred?: boolean; replyToId?: string; replyToContent?: string;
  isForwarded?: boolean; mentions?: string[]; dateLabel?: string;
  isFirstUnread?: boolean;
  isScheduled?: boolean; scheduledFor?: string; // C15
}
export interface SafetyLog { id: string; chatId: string; type: 'Validation' | 'Alert' | 'System'; message: string; timestamp: string; }
export interface SafetyNode { id: number; status: 'active' | 'busy' | 'idle'; latency: number; }
export interface Toast { id: string; title: string; message: string; type: 'message' | 'alert' | 'system'; }
export interface GroupMember { userId: string; name: string; role: 'admin' | 'member'; }
export interface AuditEntry { id: string; chatId: string; action: string; by: string; timestamp: string; } // C11

interface ChatState {
  activeChat: Chat | null; chats: Chat[]; messages: Record<string, Message[]>;
  pinnedMessages: Record<string, string[]>;
  starredMessages: Record<string, string[]>;
  mutedChats: string[];
  drafts: Record<string, string>;
  replyTo: Message | null;
  toasts: Toast[];
  notificationsEnabled: boolean;
  soundEnabled: boolean;
  compactMode: boolean;
  aiSafetyEnabled: boolean;
  fontSize: 'small' | 'medium' | 'large';
  lastReadMap: Record<string, string>;
  lastReadMessageId: Record<string, string>; // C2
  availableUsers: { id: string; name: string; email: string; signal: 'Strong' | 'Weak' | 'Dead' }[];
  groupMembers: Record<string, GroupMember[]>;
  searchTerm: string; activeFilter: 'All' | 'Flagged' | 'Verified';
  isConnected: boolean; safetyRating: number; safetyTrend: 'Stable' | 'Improving' | 'Declining';
  safetyLogs: SafetyLog[]; nodes: SafetyNode[];
  auditLog: AuditEntry[]; // C11
  appTheme: 'dark' | 'light' | 'system'; // C16
  alwaysShowTimestamps: boolean; // F19
  typingChats: string[]; // F9/F18 — chatIds where someone is typing
  hasSeenOnboarding: boolean; // F1
  setSearchTerm: (term: string) => void;
  setFilter: (filter: 'All' | 'Flagged' | 'Verified') => void;
  setActiveChat: (chat: Chat) => void;
  setConnectionStatus: (status: boolean) => void;
  setNotificationsEnabled: (val: boolean) => void;
  setSoundEnabled: (val: boolean) => void;
  setCompactMode: (val: boolean) => void;
  setAiSafetyEnabled: (val: boolean) => void;
  setFontSize: (size: 'small' | 'medium' | 'large') => void;
  setReplyTo: (msg: Message | null) => void;
  setDraft: (chatId: string, text: string) => void;
  setTheme: (chatId: string, theme: string) => void;
  setAppTheme: (theme: 'dark' | 'light' | 'system') => void; // C16
  setAlwaysShowTimestamps: (val: boolean) => void; // F19
  setHasSeenOnboarding: (val: boolean) => void; // F1
  setGroupDescription: (chatId: string, desc: string) => void; // F17
  setTypingChat: (chatId: string, isTyping: boolean) => void; // F9
  markAsRead: (chatId: string) => void;
  sendMessage: (chatId: string, content: string, userName: string, file?: File | null) => void;
  editMessage: (chatId: string, messageId: string, newContent: string) => void;
  updateMessageSafety: (chatId: string, messageId: string, sentiment: 'Positive' | 'Neutral' | 'Toxic') => void;
  deleteMessage: (chatId: string, messageId: string) => void;
  bulkDeleteMessages: (chatId: string, messageIds: string[]) => void; // C9
  reportFalsePositive: (chatId: string, messageId: string) => void;
  createGroup: (name: string, participants: string[]) => void;
  addDirectChat: (name: string) => void;
  addReaction: (chatId: string, messageId: string, emoji: string) => void;
  removeReaction: (chatId: string, messageId: string, emoji: string) => void;
  pinMessage: (chatId: string, messageId: string) => void;
  unpinMessage: (chatId: string, messageId: string) => void;
  starMessage: (chatId: string, messageId: string) => void;
  unstarMessage: (chatId: string, messageId: string) => void;
  muteChat: (chatId: string) => void;
  unmuteChat: (chatId: string) => void;
  forwardMessage: (fromChatId: string, toChatId: string, messageId: string, userName: string) => void;
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  promoteMember: (chatId: string, userId: string) => void;
  removeMember: (chatId: string, userId: string) => void;
  leaveGroup: (chatId: string) => void;
  addMemberToGroup: (chatId: string, userId: string) => void;
  prependOlderMessages: (chatId: string, msgs: Message[]) => void;
  addAuditEntry: (chatId: string, action: string, by: string) => void; // C11
  // Contact management functions
  blockContact: (chatId: string) => void;
  unblockContact: (chatId: string) => void;
  archiveChat: (chatId: string) => void;
  unarchiveChat: (chatId: string) => void;
  starContact: (chatId: string) => void;
  unstarContact: (chatId: string) => void;
  deleteChat: (chatId: string) => void;
  setOnlineStatus: (chatId: string, status: 'online' | 'offline' | 'away') => void;
  setLastSeen: (chatId: string, lastSeen: string) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  activeChat: null, isConnected: true, safetyRating: 98.2, safetyTrend: 'Stable',
  searchTerm: '', activeFilter: 'All',
  pinnedMessages: {}, starredMessages: {}, mutedChats: [], drafts: {},
  replyTo: null, toasts: [], notificationsEnabled: true, lastReadMap: {},
  lastReadMessageId: {}, // C2
  soundEnabled: true, compactMode: false, aiSafetyEnabled: true, fontSize: 'medium',
  auditLog: [], // C11
  appTheme: 'dark', // C16
  alwaysShowTimestamps: false, // F19
  typingChats: [], // F9
  hasSeenOnboarding: (() => { try { return localStorage.getItem('pulse_onboarding') === 'done'; } catch { return false; } })(), // F1
  nodes: Array.from({ length: 12 }, (_, i) => ({ id: i, status: 'active', latency: Math.floor(Math.random() * 40) + 10 })),
  safetyLogs: [{ id: 'l1', chatId: '1', type: 'System', message: 'Safety Node Handshake Successful', timestamp: '10:00 AM' }],
  chats: [
    { id: '1', name: 'AI Safety Group', type: 'group', status: 'Verified', latency: 24, theme: 'indigo', description: 'Main AI safety monitoring channel' },
    { id: '2', name: 'John Doe', type: 'direct', status: 'Flagged', latency: 156, theme: 'indigo' }
  ],
  availableUsers: [
    { id: 'u1', name: 'abh', email: 'abh@pulse.com', signal: 'Strong' },
    { id: 'u2', name: 'John Doe', email: 'john@pulse.com', signal: 'Weak' },
    { id: 'u3', name: 'Alice Smith', email: 'alice@pulse.com', signal: 'Strong' },
    { id: 'u4', name: 'Bob Ray', email: 'bob@pulse.com', signal: 'Weak' },
  ],
  groupMembers: {
    '1': [
      { userId: 'u1', name: 'abh', role: 'admin' },
      { userId: 'u2', name: 'John Doe', role: 'member' },
      { userId: 'u3', name: 'Alice Smith', role: 'member' },
    ],
    '2': [],
  },
  messages: {
    '1': [{ id: 'm1', senderId: 'bot', senderName: 'Pulse AI', content: 'Monitoring active. Welcome to AI Safety Group.', timestamp: '10:00 AM', fullTimestamp: new Date().toLocaleString(), type: 'text', isAIValidated: true, sentiment: 'Neutral', reactions: [] }]
  },

  setSearchTerm: (term) => set({ searchTerm: term }),
  setFilter: (filter) => set({ activeFilter: filter }),

  setActiveChat: (chat) => {
    const state = get();
    const currentChatId = state.activeChat?.id;
    if (currentChatId) {
      const msgs = state.messages[currentChatId] || [];
      const lastMsg = msgs[msgs.length - 1];
      if (lastMsg) {
        set((s) => ({ lastReadMessageId: { ...s.lastReadMessageId, [currentChatId]: lastMsg.id } }));
      }
    }
    set({ activeChat: chat });
  },

  setConnectionStatus: (status) => set({ isConnected: status }),
  setNotificationsEnabled: (val) => set({ notificationsEnabled: val }),
  setSoundEnabled: (val) => set({ soundEnabled: val }),
  setCompactMode: (val) => set({ compactMode: val }),
  setAiSafetyEnabled: (val) => set({ aiSafetyEnabled: val }),
  setFontSize: (size) => set({ fontSize: size }),
  setReplyTo: (msg) => set({ replyTo: msg }),
  setDraft: (chatId, text) => set((state) => ({ drafts: { ...state.drafts, [chatId]: text } })),
  setTheme: (chatId, theme) => set((state) => ({ chats: state.chats.map(c => c.id === chatId ? { ...c, theme } : c) })),
  setAppTheme: (theme) => set({ appTheme: theme }), // C16
  setAlwaysShowTimestamps: (val) => set({ alwaysShowTimestamps: val }), // F19
  setHasSeenOnboarding: (val) => { // F1
    try { localStorage.setItem('pulse_onboarding', val ? 'done' : ''); } catch {}
    set({ hasSeenOnboarding: val });
  },
  setGroupDescription: (chatId, desc) => set((state) => ({ // F17
    chats: state.chats.map(c => c.id === chatId ? { ...c, description: desc } : c)
  })),
  setTypingChat: (chatId, isTyping) => set((state) => ({ // F9
    typingChats: isTyping
      ? [...state.typingChats.filter(id => id !== chatId), chatId]
      : state.typingChats.filter(id => id !== chatId)
  })),
  markAsRead: (chatId) => set((state) => ({ lastReadMap: { ...state.lastReadMap, [chatId]: Date.now().toString() } })),

  prependOlderMessages: (chatId, msgs) => set((state) => ({
    messages: { ...state.messages, [chatId]: [...msgs, ...(state.messages[chatId] || [])] }
  })),

  sendMessage: (chatId, content, userName, file) => {
    const messageId = Date.now().toString();
    const now = new Date();
    const { replyTo } = get();
    const mentions = (content.match(/@(\w+)/g) || []).map(m => m.slice(1));
    const newMessage: Message = {
      id: messageId, senderId: 'me', senderName: userName, content,
      type: file ? 'file' : 'text',
      file: file ? { name: file.name, size: (file.size / 1024).toFixed(1) + ' KB' } : undefined,
      timestamp: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      fullTimestamp: now.toLocaleString(),
      isAIValidated: false, reactions: [],
      replyToId: replyTo?.id, replyToContent: replyTo?.content,
      mentions: mentions.length > 0 ? mentions : undefined,
    };
    set((state) => ({
      messages: { ...state.messages, [chatId]: [...(state.messages[chatId] || []), newMessage] },
      safetyLogs: [{ id: `log-${Date.now()}`, chatId, type: 'Validation', message: `Neural Handshake: ${userName}`, timestamp: newMessage.timestamp }, ...state.safetyLogs],
      nodes: state.nodes.map(n => Math.random() > 0.4 ? { ...n, status: 'busy' } : n),
      replyTo: null,
      drafts: { ...state.drafts, [chatId]: '' },
    }));
    setTimeout(() => {
      const sentiment = content.toLowerCase().includes('fuck') || content.toLowerCase().includes('shit') ? 'Toxic' : 'Positive';
      get().updateMessageSafety(chatId, messageId, sentiment);
      if (sentiment === 'Toxic' && get().notificationsEnabled) {
        get().addToast({ title: '⚠️ Toxic Content', message: 'A message was flagged by AI safety.', type: 'alert' });
      }
    }, 2000);
  },

  editMessage: (chatId, messageId, newContent) => set((state) => ({
    messages: { ...state.messages, [chatId]: (state.messages[chatId] || []).map(m => m.id === messageId ? { ...m, content: newContent, isEdited: true } : m) }
  })),

  updateMessageSafety: (chatId, messageId, sentiment) => set((state) => ({
    messages: { ...state.messages, [chatId]: (state.messages[chatId] || []).map(m => m.id === messageId ? { ...m, isAIValidated: true, sentiment } : m) },
    safetyRating: sentiment === 'Toxic' ? Math.max(0, state.safetyRating - 5) : Math.min(100, state.safetyRating + 0.5),
    safetyTrend: sentiment === 'Toxic' ? 'Declining' : 'Improving',
    nodes: state.nodes.map(n => ({ ...n, status: 'active' }))
  })),

  deleteMessage: (chatId, messageId) => set((state) => ({
    messages: { ...state.messages, [chatId]: (state.messages[chatId] || []).map(m => m.id === messageId ? { ...m, isDeleted: true, content: 'Message deleted' } : m) }
  })),

  bulkDeleteMessages: (chatId, messageIds) => set((state) => ({ // C9
    messages: { ...state.messages, [chatId]: (state.messages[chatId] || []).map(m => messageIds.includes(m.id) ? { ...m, isDeleted: true, content: 'Message deleted' } : m) }
  })),

  reportFalsePositive: (chatId, messageId) => set((state) => ({
    safetyLogs: [{ id: Date.now().toString(), chatId, type: 'System', message: `Safety override reported`, timestamp: new Date().toLocaleTimeString() }, ...state.safetyLogs]
  })),

  createGroup: (name, participants) => set((state) => {
    const newId = Date.now().toString();
    const newGroup: Chat = { id: newId, name, type: 'group', status: 'Verified', theme: 'indigo' };
    const participantMembers: GroupMember[] = participants.map(uid => {
      const found = state.availableUsers.find(u => u.id === uid);
      return { userId: uid, name: found?.name || uid, role: 'member' as const };
    });
    const rawUser = localStorage.getItem('pulse_user');
    const currentUser = rawUser ? JSON.parse(rawUser) : null;
    const creatorMember: GroupMember = { userId: currentUser?.id || 'me', name: currentUser?.name || 'You', role: 'admin' as const };
    return {
      chats: [...state.chats, newGroup],
      activeChat: newGroup,
      groupMembers: { ...state.groupMembers, [newId]: [creatorMember, ...participantMembers] },
    };
  }),

  addDirectChat: (name) => set((state) => {
    const existing = state.chats.find(c => c.name === name && c.type === 'direct');
    if (existing) return { activeChat: existing };
    const newChat: Chat = { id: Date.now().toString(), name, type: 'direct', status: 'Verified', latency: Math.floor(Math.random() * 80) + 10, theme: 'indigo' };
    return { chats: [...state.chats, newChat], activeChat: newChat };
  }),

  addReaction: (chatId, messageId, emoji) => set((state) => ({
    messages: { ...state.messages, [chatId]: (state.messages[chatId] || []).map(m => {
      if (m.id !== messageId) return m;
      const existing = (m.reactions || []).find(r => r.emoji === emoji);
      if (existing) return { ...m, reactions: (m.reactions || []).map(r => r.emoji === emoji ? { ...r, count: r.count + 1, reactedByMe: true } : r) };
      return { ...m, reactions: [...(m.reactions || []), { emoji, count: 1, reactedByMe: true }] };
    })}
  })),

  removeReaction: (chatId, messageId, emoji) => set((state) => ({
    messages: { ...state.messages, [chatId]: (state.messages[chatId] || []).map(m => {
      if (m.id !== messageId) return m;
      return { ...m, reactions: (m.reactions || []).map(r => r.emoji === emoji ? { ...r, count: r.count - 1, reactedByMe: false } : r).filter(r => r.count > 0) };
    })}
  })),

  pinMessage: (chatId, messageId) => set((state) => ({
    pinnedMessages: { ...state.pinnedMessages, [chatId]: [...(state.pinnedMessages[chatId] || []), messageId] },
    messages: { ...state.messages, [chatId]: (state.messages[chatId] || []).map(m => m.id === messageId ? { ...m, isPinned: true } : m) }
  })),

  unpinMessage: (chatId, messageId) => set((state) => ({
    pinnedMessages: { ...state.pinnedMessages, [chatId]: (state.pinnedMessages[chatId] || []).filter(id => id !== messageId) },
    messages: { ...state.messages, [chatId]: (state.messages[chatId] || []).map(m => m.id === messageId ? { ...m, isPinned: false } : m) }
  })),

  starMessage: (chatId, messageId) => set((state) => ({
    starredMessages: { ...state.starredMessages, [chatId]: [...(state.starredMessages[chatId] || []), messageId] },
    messages: { ...state.messages, [chatId]: (state.messages[chatId] || []).map(m => m.id === messageId ? { ...m, isStarred: true } : m) }
  })),

  unstarMessage: (chatId, messageId) => set((state) => ({
    starredMessages: { ...state.starredMessages, [chatId]: (state.starredMessages[chatId] || []).filter(id => id !== messageId) },
    messages: { ...state.messages, [chatId]: (state.messages[chatId] || []).map(m => m.id === messageId ? { ...m, isStarred: false } : m) }
  })),

  muteChat: (chatId) => set((state) => ({ mutedChats: [...state.mutedChats, chatId] })),
  unmuteChat: (chatId) => set((state) => ({ mutedChats: state.mutedChats.filter(id => id !== chatId) })),

  forwardMessage: (fromChatId, toChatId, messageId, userName) => {
    const msg = get().messages[fromChatId]?.find(m => m.id === messageId);
    if (!msg) return;
    const now = new Date();
    const forwarded: Message = {
      id: Date.now().toString(), senderId: 'me', senderName: userName,
      content: msg.content, type: msg.type, file: msg.file,
      timestamp: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      fullTimestamp: now.toLocaleString(),
      isAIValidated: false, reactions: [], isForwarded: true,
    };
    set((state) => ({ messages: { ...state.messages, [toChatId]: [...(state.messages[toChatId] || []), forwarded] } }));
    get().addToast({ title: '↪ Forwarded', message: `Message forwarded.`, type: 'system' });
  },

  addToast: (toast) => {
    const id = Date.now().toString();
    set((state) => ({ toasts: [...state.toasts, { ...toast, id }] }));
    setTimeout(() => get().removeToast(id), 3500);
  },

  removeToast: (id) => set((state) => ({ toasts: state.toasts.filter(t => t.id !== id) })),

  promoteMember: (chatId, userId) => set((state) => ({
    groupMembers: { ...state.groupMembers, [chatId]: (state.groupMembers[chatId] || []).map(m => m.userId === userId ? { ...m, role: 'admin' } : m) },
  })),

  removeMember: (chatId, userId) => set((state) => ({
    groupMembers: { ...state.groupMembers, [chatId]: (state.groupMembers[chatId] || []).filter(m => m.userId !== userId) },
  })),

  leaveGroup: (chatId) => set((state) => ({
    chats: state.chats.filter(c => c.id !== chatId),
    activeChat: state.activeChat?.id === chatId ? null : state.activeChat,
    groupMembers: { ...state.groupMembers, [chatId]: [] },
  })),

  addMemberToGroup: (chatId, userId) => set((state) => {
    const user = state.availableUsers.find(u => u.id === userId);
    if (!user) return state;
    const already = (state.groupMembers[chatId] || []).find(m => m.userId === userId);
    if (already) return state;
    return { groupMembers: { ...state.groupMembers, [chatId]: [...(state.groupMembers[chatId] || []), { userId, name: user.name, role: 'member' as const }] } };
  }),

  addAuditEntry: (chatId, action, by) => set((state) => ({ // C11
    auditLog: [{ id: Date.now().toString(), chatId, action, by, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }, ...state.auditLog]
  })),

  // Contact management implementations
  blockContact: (chatId) => set((state) => ({
    chats: state.chats.map(c => c.id === chatId ? { ...c, isBlocked: true } : c),
    activeChat: state.activeChat?.id === chatId ? null : state.activeChat
  })),

  unblockContact: (chatId) => set((state) => ({
    chats: state.chats.map(c => c.id === chatId ? { ...c, isBlocked: false } : c)
  })),

  archiveChat: (chatId) => set((state) => ({
    chats: state.chats.map(c => c.id === chatId ? { ...c, isArchived: true } : c),
    activeChat: state.activeChat?.id === chatId ? null : state.activeChat
  })),

  unarchiveChat: (chatId) => set((state) => ({
    chats: state.chats.map(c => c.id === chatId ? { ...c, isArchived: false } : c)
  })),

  starContact: (chatId) => set((state) => ({
    chats: state.chats.map(c => c.id === chatId ? { ...c, isStarred: true } : c)
  })),

  unstarContact: (chatId) => set((state) => ({
    chats: state.chats.map(c => c.id === chatId ? { ...c, isStarred: false } : c)
  })),

  deleteChat: (chatId) => set((state) => ({
    chats: state.chats.filter(c => c.id !== chatId),
    activeChat: state.activeChat?.id === chatId ? null : state.activeChat,
    messages: { ...state.messages, [chatId]: [] },
    pinnedMessages: { ...state.pinnedMessages, [chatId]: [] },
    starredMessages: { ...state.starredMessages, [chatId]: [] }
  })),

  setOnlineStatus: (chatId, status) => set((state) => ({
    chats: state.chats.map(c => c.id === chatId ? { ...c, onlineStatus: status } : c)
  })),

  setLastSeen: (chatId, lastSeen) => set((state) => ({
    chats: state.chats.map(c => c.id === chatId ? { ...c, lastSeen } : c)
  })),
}));