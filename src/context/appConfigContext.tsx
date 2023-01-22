import React, { createContext, SetStateAction, useState } from "react";

export type ColorFormatConfig = 'hex' | 'rgb' | 'hsl' | 'hsv';

export type PNGCompressionOptions = 'no-compression' | 'quick' | 'slow' | 'slow-as-hell' | 'custom';

// Output Config (Keep it not nested since when converting starts, a copy will need to be made to handle)
export type OutputConfig = {
    /** Base color when alpha data is lost or deprecated. Hex (#ffffff) */
    imageBaseColor: string;
    colorFormat: ColorFormatConfig;

    /** per format details */

    /** from 0 to 100 */
    JPEG_quality: number;

    /** If false, will apply the `imageBaseColor` */
    PNG_keepAlphaChannel: boolean;

    PNG_compressionOption: PNGCompressionOptions;

    /** Only when png compressionOption is 'custom' */
    PNG_pngcrushCustomArgs: string[];

    WEBP_quality: number;

    // TODO: advanced settings...
};

const defaultOutputConfig: OutputConfig = {
    imageBaseColor: '#ffffff',
    colorFormat: 'hex',
    JPEG_quality: 90,
    PNG_keepAlphaChannel: true,
    PNG_compressionOption: 'no-compression',
    PNG_pngcrushCustomArgs: [],
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

const defaultSiteConfig: SiteConfig = {
    colorModeFollowSystem: true,
    colorMode: 'light',
    tipDisplay: { ...TIPS_DIALOG_FLAGS.reduce((prev, curr) => ({ ...prev, [curr]: true }), {}) } as SiteConfig['tipDisplay'],
    fileListPreviewMode: false,
} as const;

// Context
export type AppConfigContext = {
    siteConfig: SiteConfig,
    setSiteConfig: React.Dispatch<SetStateAction<AppConfigContext['siteConfig']>>,

    outputConfig: OutputConfig,
    setOutputConfig: React.Dispatch<SetStateAction<AppConfigContext['outputConfig']>>,

}



export const appConfigContext = createContext<AppConfigContext>({
    siteConfig: { ...defaultSiteConfig },
    setSiteConfig() { },
    outputConfig: { ...defaultOutputConfig },
    setOutputConfig() { },
});

export function AppConfigContextProvider({ children }: { children: React.ReactNode }) {

    const [siteConfig, setSiteConfig] = useState(defaultSiteConfig);
    const [outputConfig, setOutputConfig] = useState(defaultOutputConfig);

    return <appConfigContext.Provider value={{
        siteConfig,
        setSiteConfig,
        outputConfig,
        setOutputConfig,
    }}>
        {children}
    </appConfigContext.Provider>
}