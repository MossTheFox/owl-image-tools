import React, { createContext } from "react";


export type PNGCompressionOptions = 'no-compression' | 'quick' | 'slow' | 'slow-as-hell' | 'custom';

export type OutputConfigContext = {
    /** Base color when alpha data is lost */
    imageBaseColor: string;

    /** per format details */

    /** from 0 to 100 */
    JPEG_quality: number;

    PNG_compressionOption: PNGCompressionOptions;

    /** Only when png compressionOption is 'custom' */
    PNG_pngcrushCustomArgs: string[];

    WEBP_quality: number;

    // TODO: advanced settings...
};

export const outputConfigContext = createContext({

});

export function OutputConfigContextProvider({ children }: { children: React.ReactNode }) {

    return <outputConfigContext.Provider value={{

    }}>
        {children}
    </outputConfigContext.Provider>
}