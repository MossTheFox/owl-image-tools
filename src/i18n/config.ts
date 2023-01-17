import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import I18nextBrowserLanguageDetector from "i18next-browser-languagedetector";
import zhCN from './zh-CN.json';
import en from './en.json';

export const resources = {
    en: {
        translation: en
    },
    'zh-CN': {
        translation: zhCN
    },
} as const;

i18next
    .use(I18nextBrowserLanguageDetector)
    .use(initReactI18next)
    .init({
        lng: 'zh-CN',
        fallbackLng: 'en',
        debug: import.meta.env.DEV,
        resources,
    });

document.documentElement.setAttribute('lang', i18next.language);
document.title = i18next.t('document.title');