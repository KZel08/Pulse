import api from './axios';
import type { Conversation, Message } from '../types';

export const chatApi = {
  // GET /chat/conversations
  getConversations: async (): Promise<Conversation[]> => {
    const res = await api.get<Conversation[]>('/chat/conversations');
    return res.data;
  },

  // POST /chat/groups
  createGroup: async (name: string, memberIds: string[]): Promise<Conversation> => {
    const res = await api.post<Conversation>('/chat/groups', { name, memberIds });
    return res.data;
  },

  // GET /chat/conversations/:id/messages
  getMessages: async (conversationId: string): Promise<Message[]> => {
    const res = await api.get<Message[]>(`/chat/conversations/${conversationId}/messages`);
    return res.data;
  },

  // POST /chat/conversations/:id/upload
  uploadFile: async (conversationId: string, file: File): Promise<Message> => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await api.post<Message>(
      `/chat/conversations/${conversationId}/upload`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return res.data;
  },

  // GET /chat/files/:fileName
  getSignedUrl: async (fileName: string): Promise<string> => {
    const res = await api.get<{ url: string }>(`/chat/files/${fileName}`);
    return res.data.url;
  },

  // GET /users (to populate CreateGroupModal)
  getUsers: async (): Promise<{ id: string; name: string; email: string }[]> => {
    const res = await api.get('/users');
    return res.data;
  },
};
