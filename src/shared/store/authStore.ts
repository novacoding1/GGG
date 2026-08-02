import { create } from 'zustand';
import { UserProfile } from '@/entities/user.types';

interface AuthStore {
  user: UserProfile | null;
  isAuthModalOpen: boolean;
  theme: 'dark' | 'light';
  language: 'kk' | 'ru' | 'en';
  
  // Actions
  loginGuest: () => void;
  loginMock: (provider: 'google' | 'github' | 'email', name?: string, email?: string) => void;
  logout: () => void;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  setTheme: (theme: 'dark' | 'light') => void;
  setLanguage: (lang: 'kk' | 'ru' | 'en') => void;
}

export const useAuthStore = create<AuthStore>((set, get) => {
  const initialTheme = (localStorage.getItem('shezhire_theme') as 'dark' | 'light') || 'dark';
  const initialLang = (localStorage.getItem('shezhire_lang') as 'kk' | 'ru' | 'en') || 'kk';

  return {
    user: {
      id: 'guest-user-1',
      email: 'guest@shezhire.kz',
      name: 'Қонақ Пайдаланушы',
      treesCount: 1,
      createdAt: new Date().toISOString(),
      isGuest: true,
      theme: initialTheme,
      language: initialLang,
    },
    isAuthModalOpen: false,
    theme: initialTheme,
    language: initialLang,

    loginGuest: () => {
      set({
        user: {
          id: `guest-${Date.now()}`,
          email: 'guest@shezhire.kz',
          name: 'Қонақ Пайдаланушы',
          treesCount: 1,
          createdAt: new Date().toISOString(),
          isGuest: true,
          theme: get().theme,
          language: get().language,
        },
        isAuthModalOpen: false,
      });
    },

    loginMock: (provider, name, email) => {
      set({
        user: {
          id: `user-${Date.now()}`,
          email: email || `user@${provider}.com`,
          name: name || `${provider.toUpperCase()} Пайдаланушысы`,
          avatarUrl: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80`,
          treesCount: 3,
          createdAt: new Date().toLocaleDateString(),
          isGuest: false,
          theme: get().theme,
          language: get().language,
        },
        isAuthModalOpen: false,
      });
    },

    logout: () => {
      get().loginGuest();
    },

    openAuthModal: () => set({ isAuthModalOpen: true }),
    closeAuthModal: () => set({ isAuthModalOpen: false }),

    setTheme: (theme) => {
      localStorage.setItem('shezhire_theme', theme);
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      set({ theme });
    },

    setLanguage: (lang) => {
      localStorage.setItem('shezhire_lang', lang);
      set({ language: lang });
    },
  };
});
