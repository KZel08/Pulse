import { create } from 'zustand';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  isGhostMode: boolean;
  avatar: string;
  appLogo: string;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  hydrateFromStorage: () => void;
  toggleGhostMode: () => void;
  updateName: (name: string) => void;
  updateAvatar: (avatar: string) => void; // F7: now supports base64 data URLs too
  updateAppLogo: (logo: string) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isLoading: false,
  error: null,
  isGhostMode: false,
  avatar: '',
  appLogo: '✏️',

  hydrateFromStorage: () => {
    const token = localStorage.getItem('pulse_token');
    const raw = localStorage.getItem('pulse_user');
    const avatar = localStorage.getItem('pulse_avatar') || '';
    const appLogo = localStorage.getItem('pulse_applogo') || '✏️';
    if (token && raw) {
      try {
        const user = JSON.parse(raw) as User;
        set({ user, token, avatar, appLogo });
      } catch {
        localStorage.removeItem('pulse_token');
        localStorage.removeItem('pulse_user');
      }
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    await new Promise((r) => setTimeout(r, 400));
    const user: User = {
      id: 'user-' + email.replace(/[^a-z0-9]/gi, ''),
      name: email.split('@')[0],
      email,
    };
    const token = 'mock-token-' + Date.now();
    localStorage.setItem('pulse_token', token);
    localStorage.setItem('pulse_user', JSON.stringify(user));
    // NEW: reset onboarding flag so the tour shows again after every login
    try { localStorage.removeItem('pulse_onboarding'); } catch {}
    set({ user, token, isLoading: false, error: null });
  },

  register: async (email, password, name) => {
    set({ isLoading: true, error: null });
    await new Promise((r) => setTimeout(r, 400));
    const user: User = {
      id: 'user-' + Date.now(),
      name: name || email.split('@')[0],
      email,
    };
    const token = 'mock-token-' + Date.now();
    localStorage.setItem('pulse_token', token);
    localStorage.setItem('pulse_user', JSON.stringify(user));
    // NEW: reset onboarding flag so the tour shows after register too
    try { localStorage.removeItem('pulse_onboarding'); } catch {}
    set({ user, token, isLoading: false, error: null });
  },

  logout: () => {
    localStorage.removeItem('pulse_token');
    localStorage.removeItem('pulse_user');
    // NEW: reset onboarding on logout so it shows again on next login
    try { localStorage.removeItem('pulse_onboarding'); } catch {}
    set({ user: null, token: null, isGhostMode: false });
  },

  clearError: () => set({ error: null }),

  toggleGhostMode: () => {
    const { isGhostMode } = get();
    set({ isGhostMode: !isGhostMode });
  },

  updateName: (name: string) => {
    const { user } = get();
    if (!user) return;
    const updated = { ...user, name };
    localStorage.setItem('pulse_user', JSON.stringify(updated));
    set({ user: updated });
  },

  // F7: accepts hex color OR base64 data URL
  updateAvatar: (avatar: string) => {
    localStorage.setItem('pulse_avatar', avatar);
    set({ avatar });
  },

  updateAppLogo: (logo: string) => {
    localStorage.setItem('pulse_applogo', logo);
    set({ appLogo: logo });
  },
}));