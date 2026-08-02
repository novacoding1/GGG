export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  treesCount: number;
  createdAt: string;
  isGuest: boolean;
  theme: 'dark' | 'light';
  language: 'kk' | 'ru' | 'en';
}
