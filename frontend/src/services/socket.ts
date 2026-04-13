import { io, Socket } from 'socket.io-client';
import type {
  Message,
  WsSendMessagePayload,
  WsTypingPayload,
  WsJoinPayload,
  WsUserStatusPayload,
  WsTypingStatusPayload,
} from '../types';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

class SocketService {
  private socket: Socket | null = null;

  connect(token: string) {
    if (this.socket?.connected) return;

    this.socket = io(SOCKET_URL, {
      auth: { token: `Bearer ${token}` },
      transports: ['websocket'],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.socket.on('connect', () => console.log('[Socket] Connected:', this.socket?.id));
    this.socket.on('disconnect', (reason) => console.log('[Socket] Disconnected:', reason));
  }

  disconnect() {
    this.socket?.disconnect();
    this.socket = null;
  }

  joinConversation(conversationId: string) {
    this.socket?.emit('join_conversation', { conversationId } as WsJoinPayload);
  }

  sendMessage(payload: WsSendMessagePayload) {
    this.socket?.emit('send_message', payload);
  }

  // --- New Security Listeners ---
  onSafetyUpdate(callback: (nodes: any[]) => void) {
    this.socket?.on('safety_node_update', callback);
  }

  onSentimentChange(callback: (payload: { sentiment: string }) => void) {
    this.socket?.on('sentiment_update', callback);
  }

  onNewMessage(callback: (message: Message) => void) {
    this.socket?.on('new_message', callback);
  }

  offAll() {
    this.socket?.removeAllListeners();
  }

  isConnected() {
    return this.socket?.connected ?? false;
  }
}

export const socketService = new SocketService();