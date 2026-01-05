import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import enTranslations from './locales/en.json';
import amTranslations from './locales/am.json';
import orTranslations from './locales/or.json';

const resources = {
    en: {
        translation: enTranslations
    },
    am: {
        translation: amTranslations
    },
    or: {
        translation: orTranslations
    }
};

i18n
    .use(LanguageDetector) // Detects user language
    .use(initReactI18next) // Passes i18n down to react-i18next
    .init({
        resources,
        fallbackLng: 'en',
        supportedLngs: ['en', 'am', 'or'],

        detection: {
            order: ['localStorage', 'navigator'],
            caches: ['localStorage'],
        },

        interpolation: {
            escapeValue: false // React already escapes values
        },

        react: {
            useSuspense: false
        }
    });

export default i18n;
