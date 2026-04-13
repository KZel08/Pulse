// ─── Auth ─────────────────────────────────────────────────────────────────────
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  lastSeen?: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

// ─── Conversations ─────────────────────────────────────────────────────────────
export type ConversationType = 'direct' | 'group';
export type MemberRole = 'admin' | 'member';

export interface Conversation {
  id: string;
  type: ConversationType;
  name?: string;
  userAId?: string;
  userBId?: string;
  createdAt: string;
  members?: ConversationMember[];
  lastMessage?: Message;
}

export interface ConversationMember {
  id: string;
  conversationId: string;
  userId: string;
  role: MemberRole;
  joinedAt: string;
  user?: User;
}

// ─── Messages ──────────────────────────────────────────────────────────────────
export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content?: string;
  fileUrl?: string;
  fileName?: string;
  isRead: boolean;
  createdAt: string;
  sender?: User;
  senderName?: string;
  replyToContent?: string;
  replyToName?: string;
  replyToSender?: string;
}

// ─── WebSocket Payloads ────────────────────────────────────────────────────────
export interface WsSendMessagePayload {
  conversationId: string;
  content: string;
}

export interface WsTypingPayload {
  conversationId: string;
}

export interface WsJoinPayload {
  conversationId: string;
}

export interface WsUserStatusPayload {
  userId: string;
}

export interface WsTypingStatusPayload {
  conversationId: string;
  userId: string;
  userName: string;
}