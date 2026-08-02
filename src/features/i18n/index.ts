import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { kk } from './locales/kk';
import { ru } from './locales/ru';
import { en } from './locales/en';

const savedLang = localStorage.getItem('shezhire_lang') || 'kk';

i18n.use(initReactI18next).init({
  resources: {
    kk: { translation: kk },
    ru: { translation: ru },
    en: { translation: en },
  },
  lng: savedLang,
  fallbackLng: 'kk',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
