import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, User, Globe, Moon, Sun, LogOut, Shield } from 'lucide-react';
import { useAuthStore } from '@/shared/store/authStore';

export const AuthModal: React.FC = () => {
  const { t, i18n } = useTranslation();
  const {
    user,
    isAuthModalOpen,
    closeAuthModal,
    loginMock,
    loginGuest,
    logout,
    theme,
    setTheme,
    setLanguage,
  } = useAuthStore();

  if (!isAuthModalOpen) return null;

  const handleLanguageSwitch = (lang: 'kk' | 'ru' | 'en') => {
    i18n.changeLanguage(lang);
    setLanguage(lang);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white border border-sky-100 rounded-3xl shadow-2xl text-slate-800 p-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600 font-bold">
              {user?.avatarUrl ? (
                <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover rounded-2xl" />
              ) : (
                <User className="w-5 h-5" />
              )}
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {user && !user.isGuest ? user.name : t('auth.title')}
              </h2>
              <p className="text-xs text-slate-500">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={closeAuthModal}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Card if Logged In / Guest */}
        {user && !user.isGuest ? (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="block text-[11px] text-slate-500">Шежірелер саны</span>
                <span className="text-xl font-bold text-sky-600">{user.treesCount}</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="block text-[11px] text-slate-500">Тіркелген күні</span>
                <span className="text-xs font-semibold text-slate-800">{new Date(user.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Language Controls */}
            <div className="space-y-4 border-t border-slate-100 pt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-2 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-sky-600" />
                  {t('app.language')}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { code: 'kk', label: 'Қазақша' },
                    { code: 'ru', label: 'Русский' },
                    { code: 'en', label: 'English' },
                  ].map((item) => (
                    <button
                      key={item.code}
                      onClick={() => handleLanguageSwitch(item.code as any)}
                      className={`py-2 rounded-xl text-xs font-medium border transition-all ${
                        i18n.language === item.code
                          ? 'bg-sky-500 border-sky-500 text-white font-bold'
                          : 'bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={logout}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl text-xs font-medium transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Жүйеден шығу
            </button>
          </div>
        ) : (
          /* Login options */
          <div className="space-y-4">
            <p className="text-xs text-slate-500">{t('auth.description')}</p>

            <button
              onClick={() => loginMock('google', 'Асанәлі Қабдыраш', 'asanali@gmail.com')}
              className="w-full flex items-center justify-center gap-3 py-3 rounded-2xl bg-white text-slate-800 hover:bg-slate-50 font-semibold text-xs border border-slate-200 shadow-sm transition-all"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              {t('auth.google')}
            </button>

            <button
              onClick={() => loginMock('github', 'Sultan Bek', 'sultan@github.com')}
              className="w-full flex items-center justify-center gap-3 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-sm transition-all"
            >
              <Shield className="w-4 h-4 text-sky-400" />
              {t('auth.github')}
            </button>

            {/* Language Selection inside Auth */}
            <div className="border-t border-slate-100 pt-4">
              <label className="block text-xs font-semibold text-slate-500 mb-2">{t('app.language')}</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { code: 'kk', label: 'Қазақша' },
                  { code: 'ru', label: 'Русский' },
                  { code: 'en', label: 'English' },
                ].map((item) => (
                  <button
                    key={item.code}
                    onClick={() => handleLanguageSwitch(item.code as any)}
                    className={`py-1.5 rounded-xl text-xs font-medium border transition-all ${
                      i18n.language === item.code
                        ? 'bg-sky-500 border-sky-500 text-white font-bold'
                        : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={loginGuest}
              className="w-full py-2.5 text-xs text-slate-500 hover:text-slate-900 transition-colors"
            >
              {t('auth.guestMode')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
