import React, { createContext, SetStateAction, useCallback, useState } from "react";
import { LOCALSTORAGE_KEYS } from "../constraints";
import { getFromLocalStorageAndValidate, saveToLocalStorage } from "../utils/randomUtils";

export type ColorFormatConfig = 'hex' | 'rgb' | 'hsl' | 'hsv';


export const pngCompressionOptions = [
    'no-compression',
    'quick',
    'slow',
    'slow-as-hell',
    'custom'
] as const;

export type PNGCompressionOptions = typeof pngCompressionOptions[number];


// Output Config (Keep it not nested since when converting starts, a copy will need to be made to handle)
export type OutputConfig = {
    /** Base color when alpha data is lost or deprecated. Hex (#ffffff) */
    imageBaseColor: string;
    colorFormat: ColorFormatConfig;


    /** per format details */

    /** Remember Collapse (Accordion) open */
    collapseOpenState: boolean[];

    /** from 0 to 100 */
    JPEG_quality: number;

    /** If false, will apply the `imageBaseColor` */
    PNG_keepAlphaChannel: boolean;

    PNG_compressionOption: PNGCompressionOptions;

    /** Only when png compressionOption is 'custom' */
    PNG_pngcrushCustomArgs: string;

    WEBP_quality: number;

    // TODO: advanced settings...
};

export const defaultOutputConfig: OutputConfig = {
    imageBaseColor: '#ffffff',
    colorFormat: 'hex',
    collapseOpenState: new Array<boolean>(10).fill(false),
    JPEG_quality: 90,
    PNG_keepAlphaChannel: true,
    PNG_compressionOption: 'no-compression',
    PNG_pngcrushCustomArgs: '',
    WEBP_quality: 90,
};

const TIPS_DIALOG_FLAGS = [
    'browserCompatibility', 'webkitOpenDirectory'
] as const;

// Site Config
export type SiteConfig = {
    colorModeFollowSystem: boolean;
    colorMode: 'light' | 'dark';
    /** False means hidden */
    tipDisplay: { [key in typeof TIPS_DIALOG_FLAGS[number]]: boolean; },
    fileListPreviewMode: boolean;
};

export const defaultSiteConfig: SiteConfig = {
    colorModeFollowSystem: true,
    colorMode: 'light',
    tipDisplay: { ...TIPS_DIALOG_FLAGS.reduce((prev, curr) => ({ ...prev, [curr]: true }), {}) } as SiteConfig['tipDisplay'],
    fileListPreviewMode: false,
} as const;

// Context
export type AppConfigContext = {
    siteConfig: SiteConfig,
    setSiteConfig: React.Dispatch<SetStateAction<AppConfigContext['siteConfig']>>,
    updateSiteConfig: <T extends keyof SiteConfig>(key: T, value: SiteConfig[T]) => void,
    setTipDisplay: (key: typeof TIPS_DIALOG_FLAGS[number], display: boolean) => void,

    outputConfig: OutputConfig,
    setOutputConfig: React.Dispatch<SetStateAction<AppConfigContext['outputConfig']>>,
    updateOutputConfig: <T extends keyof OutputConfig>(key: T, value: OutputConfig[T]) => void,
    recordCollapseState: (index: number, open: boolean) => void,

}



export const appConfigContext = createContext<AppConfigContext>({
    siteConfig: { ...defaultSiteConfig },
    setSiteConfig() { },
    updateOutputConfig(key, value) { },
    setTipDisplay(key, display) { },
    outputConfig: { ...defaultOutputConfig },
    setOutputConfig() { },
    updateSiteConfig(key, value) { },
    recordCollapseState(index, open) { },
});


export function AppConfigContextProvider({ children }: { children: React.ReactNode }) {

    const [siteConfig, setSiteConfig] = useState(getFromLocalStorageAndValidate(LOCALSTORAGE_KEYS.siteConfig, defaultSiteConfig));
    const [outputConfig, setOutputConfig] = useState(getFromLocalStorageAndValidate(LOCALSTORAGE_KEYS.outputConfig, defaultOutputConfig));

    const updateSiteConfig = useCallback(<T extends keyof SiteConfig>(key: T, value: SiteConfig[T]) => {
        setSiteConfig((prev) => {
            const result = {
                ...prev,
                [key]: value
            }
            saveToLocalStorage(LOCALSTORAGE_KEYS.siteConfig, result);
            return result;
        });
    }, []);

    const updateOutputConfig = useCallback(<T extends keyof OutputConfig>(key: T, value: OutputConfig[T]) => {
        setOutputConfig((prev) => {
            const result = {
                ...prev,
                [key]: value
            }
            saveToLocalStorage(LOCALSTORAGE_KEYS.outputConfig, result);
            return result;
        });
    }, []);

    const setTipDisplay = useCallback((key: typeof TIPS_DIALOG_FLAGS[number], display: boolean) => {
        setSiteConfig((prev) => {
            const result = {
                ...prev,
                tipDisplay: {
                    ...prev.tipDisplay,
                    [key]: display
                }
            };
            saveToLocalStorage(LOCALSTORAGE_KEYS.siteConfig, result);
            return result;
        });
    }, []);

    const recordCollapseState = useCallback((index: number, open: boolean) => {
        setOutputConfig((prev) => {
            const arr = [...prev.collapseOpenState];
            arr[index] = open;
            const result: typeof prev = {
                ...prev,
                collapseOpenState: arr
            };
            saveToLocalStorage(LOCALSTORAGE_KEYS.outputConfig, result);
            return result;
        });
    }, []);



    return <appConfigContext.Provider value={{
        siteConfig,
        setSiteConfig,
        updateOutputConfig,
        setTipDisplay,
        outputConfig,
        setOutputConfig,
        updateSiteConfig,
        recordCollapseState,
    }}>
        {children}
    </appConfigContext.Provider>
}