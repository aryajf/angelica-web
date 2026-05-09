import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import id from './locales/id.json';

void i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            en: { translation: en },
            id: { translation: id },
        },
        fallbackLng: 'en',
        supportedLngs: ['en', 'id'],
        interpolation: { escapeValue: false },
        detection: {
            order: ['htmlTag', 'localStorage', 'navigator'],
            caches: ['localStorage'],
        },
        returnNull: false,
    });

export default i18n;
