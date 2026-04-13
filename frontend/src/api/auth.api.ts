import api from './axios';
import type { AuthResponse } from '../types';

export interface RegisterPayload {
  email: string;
  password: string;
  name: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export const authApi = {
  // POST /auth/register
  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    const res = await api.post<AuthResponse>('/auth/register', payload);
    return res.data;
  },

  // POST /auth/login
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const res = await api.post<AuthResponse>('/auth/login', payload);
    return res.data;
  },

  // POST /auth/refresh
  refresh: async (): Promise<AuthResponse> => {
    const res = await api.post<AuthResponse>('/auth/refresh');
    return res.data;
  },
};