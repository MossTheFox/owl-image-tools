import React, { createContext, SetStateAction, useCallback, useState } from "react";
import { LOCALSTORAGE_KEYS } from "../constraints";
import { ACCEPT_MIMEs, OUTPUT_MIMEs } from "../utils/imageMIMEs";
import { getFromLocalStorageAndValidate, saveToLocalStorage } from "../utils/randomUtils";

export type ColorFormatConfig = 'hex' | 'rgb' | 'hsl' | 'hsv';

// Output Config (Keep it not nested since when converting starts, a copy will need to be made to handle)
export type OutputConfig = {
    /** Base color when alpha data is lost or deprecated. Hex (#ffffff) */
    imageBaseColor: string;
    colorFormat: ColorFormatConfig;

    /** match the strip param for libvips */
    keepMetaData: boolean;


    /** per format details */

    /** Remember Collapse (Accordion) open */
    collapseOpenState: boolean[];

    /** Output format for different source image types */
    outputFormats: {
        [key in typeof ACCEPT_MIMEs[number]]: typeof OUTPUT_MIMEs[number]
    };

    /** from 0 to 100 */
    JPEG_quality: number;

    /** if interlaced, ... um check here https://graphicdesign.stackexchange.com/questions/6677/what-does-the-interlaced-option-in-photoshop-do */
    JPEG_interlace: boolean;

    /** If false, will apply the `imageBaseColor` */
    PNG_removeAlphaChannel: boolean;

    /** default 6
     * 0 ~ 9
    */
    PNG_compressionLevel: number /* 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 */;

    /** if interlaced, ... um check here https://graphicdesign.stackexchange.com/questions/6677/what-does-the-interlaced-option-in-photoshop-do */
    PNG_interlace: boolean;

    /** LOSSY compression for png. From 0 to 100 */
    PNG_quantisationQuality: number;
    /** 0 ~ 1, double */
    PNG_dither: number;

    /** default: 0 */
    PNG_bitDepth: 0 | 1 | 2 | 4 | 8 | 16;


    /** WEBP quality when not lossless. 0 ~ 100 */
    WEBP_quality: number;

    /** Enable lossless compression, default false */
    WEBP_lossless: boolean;

    WEBP_keepAlphaChannel: boolean;

    /** Preset for lossy compression */
    WEBP_lossyCompressionPreset: 'default' | 'picture' | 'photo' | 'drawing' | 'icon' | 'text';

    /** Enable high quality chroma subsampling, default false */
    WEBP_smartSubsample: boolean;

    /** Change alpha plane fidelity for lossy compression, default 100 */
    WEBP_alphaQuality: number;

    /** 0 ~ 6, default 4 */
    WEBP_cpuEffortToRediceSize: number;


    GIF_keepAlphaChannel: boolean;

    /** Progressive GIF, default false */
    GIF_interlace: boolean;

    /** From 1 to 8 */
    GIF_bitdepth: number;

    /** From 0 to 1 (double) */
    GIF_dither: number;

    /** From 0 to 32 */
    GIF_interframeMaxError: number;

    /** From 0 to 256 */
    GIF_interpaletteMaxError: number;

    /** Quantisation effort */
    // GIF_effort: number;

};

export const defaultOutputConfig: OutputConfig = {
    imageBaseColor: '#ffffff',
    colorFormat: 'hex',
    keepMetaData: true,
    collapseOpenState: new Array<boolean>(10).fill(false),
    outputFormats: {
        ...ACCEPT_MIMEs.reduce((prev, curr) => ({
            ...prev,
            [curr]: 'image/jpeg'
        }), {}) as OutputConfig['outputFormats']
    },
    JPEG_quality: 90,
    JPEG_interlace: false,
    PNG_removeAlphaChannel: false,
    PNG_interlace: false,
    PNG_compressionLevel: 6,
    PNG_bitDepth: 0,
    PNG_quantisationQuality: 100,
    PNG_dither: 1,
    WEBP_quality: 75,
    WEBP_keepAlphaChannel: true,
    WEBP_alphaQuality: 100,
    WEBP_lossless: false,
    WEBP_lossyCompressionPreset: 'default',
    WEBP_smartSubsample: false,
    WEBP_cpuEffortToRediceSize: 4,
    GIF_keepAlphaChannel: false,
    GIF_bitdepth: 8,
    GIF_dither: 1,
    GIF_interframeMaxError: 0,
    GIF_interpaletteMaxError: 3,
    GIF_interlace: false,
};

const TIPS_DIALOG_FLAGS = [
    'browserCompatibility', 'webkitOpenDirectory', 'webkitDirectoryNotSupported',
    'fileListTip', 'outputFileListTip',
    'dragAndDropEntryLimit',
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
    setOutputTargetFormat: (source: typeof ACCEPT_MIMEs[number] | 'ALL', target: typeof OUTPUT_MIMEs[number]) => void,
    resetOutputConfigToDefault: () => void,
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
    setOutputTargetFormat() { },
    resetOutputConfigToDefault() { },
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

    const setOutputTargetFormat = useCallback((source: typeof ACCEPT_MIMEs[number] | 'ALL', target: typeof OUTPUT_MIMEs[number]) => {
        if (source === 'ALL') {
            setOutputConfig((prev) => {
                const result = {
                    ...prev,
                    outputFormats: {
                        ...defaultOutputConfig.outputFormats,
                        ...ACCEPT_MIMEs.reduce((prev, curr) => ({
                            ...prev,
                            [curr]: target
                        }), {}) as OutputConfig['outputFormats']
                    }
                }
                saveToLocalStorage(LOCALSTORAGE_KEYS.outputConfig, result);
                return result;
            });
            return;
        }

        setOutputConfig((prev) => {
            const result: typeof prev = {
                ...prev,
                outputFormats: {
                    ...defaultOutputConfig.outputFormats,
                    ...prev.outputFormats,
                    [source]: target
                }
            };
            saveToLocalStorage(LOCALSTORAGE_KEYS.outputConfig, result);
            return result;
        });
    }, []);

    // Extra

    const resetOutputConfigToDefault = useCallback(() => {
        setOutputConfig(defaultOutputConfig);
        saveToLocalStorage(LOCALSTORAGE_KEYS.outputConfig, defaultOutputConfig);
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
        setOutputTargetFormat,
        resetOutputConfigToDefault,
    }}>
        {children}
    </appConfigContext.Provider>
}