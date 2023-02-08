import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import I18nextBrowserLanguageDetector from "i18next-browser-languagedetector";
import zhCN from './zh-CN';
import en from './en';
import { LOCALSTORAGE_KEYS } from "../constraints";


/**
 * Note: For fields like dialog content, a Markdown parser will be applied.
 *       Use Markdown syntax for text formatting.
 */
export const resources = {
    en: {
        translation: en
    },
    'zh-CN': {
        translation: zhCN
    },
} as const;

/**
 * Allow override lang detection.
 * Won't trigger a page reload here. Do it manually if needed.
 */
export function setLang(lang: 'default' | keyof typeof resources) {
    try {
        if (lang === 'default') {
            localStorage.removeItem(LOCALSTORAGE_KEYS.languageOverride);
            return;
        }
        localStorage.setItem(LOCALSTORAGE_KEYS.languageOverride, lang);
    } catch (err) {
        // hm.
    }
}

export function getSavedLangConfig() {
    try {
        const saved = localStorage.getItem(LOCALSTORAGE_KEYS.languageOverride);
        const accepted = Object.keys(resources);
        if (!saved || !accepted.includes(saved)) return null;

        return {
            lng: saved as keyof typeof resources
        };
    } catch (err) {
        return null;
    }
}

i18next
    .use(I18nextBrowserLanguageDetector)
    .use(initReactI18next)
    .init({
        ...getSavedLangConfig(), // <- will override language detection
        fallbackLng: 'zh-CN',
        debug: import.meta.env.DEV,
        resources,
        interpolation: {
            escapeValue: false
        },
        react: {
            transSupportBasicHtmlNodes: true,
            transKeepBasicHtmlNodesFor: ['br', 'strong', 'i', 'p', 'small', 'del'],
        }

    });

document.documentElement.setAttribute('lang', i18next.language);
document.title = i18next.t('document.title');