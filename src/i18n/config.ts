import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import I18nextBrowserLanguageDetector from "i18next-browser-languagedetector";
import zhCN from './zh-CN';
import zhTW from './zh-TW';
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
    'zh-TW': {
        translation: zhTW
    }
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
        fallbackLng: 'en',
        debug: import.meta.env.DEV,
        resources,
        interpolation: {
            escapeValue: false
        },
        react: {
            transSupportBasicHtmlNodes: true,
            transKeepBasicHtmlNodesFor: ['br', 'strong', 'i', 'p', 'small', 'del'],
        },
        returnObjects: true,

    });

document.documentElement.setAttribute('lang', i18next.language);
document.title = i18next.t('document.title');

// DEBUG
// @ts-expect-error Log the translation completion
window.__I18N_DEBUG = () => {
    function iterateKeys(obj: { [key: string]: unknown }, prefix = '', receiver: string[]) {
        for (const key in obj) {
            if (typeof obj[key] === 'object') {
                // @ts-expect-error Um.
                iterateKeys(obj[key], prefix + `.${key}`, receiver)
                continue;
            }
            receiver.push(prefix + '.' + key);
        }
    }

    const keyMap = new Map<string, string[]>();

    for (const [key, val] of Object.entries(resources)) {
        const iterArr: string[] = [];
        iterateKeys(val, '', iterArr);
        console.log(`lang: ${key}, keys: ${iterArr.length}`);
        keyMap.set(key, iterArr);
    }

    for (const [key, val] of keyMap.entries()) {
        console.log([key, val]);
    }

}