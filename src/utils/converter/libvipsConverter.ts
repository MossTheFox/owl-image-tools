import type Vips from "wasm-vips";
import { TinyColor } from "@ctrl/tinycolor";

/** the comments (JSDoc) of the lib is way too detailed so here I'll just write nothing.
 * 
 * Go check this awesone library: https://github.com/kleisauke/wasm-vips
 * 
 * For the usage of libvips, play with the commandline tool and ya'll know about it.
 * 
 * For example, to simply convert the image file, create a VIPS_Image with `newFrom____` method, then use `writeTo___` to save.
 * 
 * The functions here in wasm module is all camelCased, while in the original doc of C/C++, it's like `vips_image_write_to_file`.
 * 
 * ref: https://github.com/libvips/libvips/issues/285
 */
let vips: (typeof Vips) | null = null;

// Now here is some more details for the supported formats. 
// (Not sure if there's a way to build with plug-ins but here is what is already ready to use)
// avif will be in 0.0.5
/* DEBUG OUTPUT:
    vips version:                  8.13.3
    Emscripten version:            3.1.24
    Concurrency:                   8
    Cache max mem:                 52428800
    Cache max operations:          100
    Cache current operations:      0
    Cache max open files:          20
    Memory allocations:            0
    Memory currently allocated:    0
    Memory high water:             0
    Open files:                    0
    JPEG support:                  yes
    JPEG XL support:               yes
    PNG support:                   yes
    TIFF support:                  yes
    WebP support:                  yes
    GIF support:                   yes
    SVG load:                      no
    Text rendering support:        no
*/

// TODO: let a worker to load this... It blocks main thread.

function initVips() {
    return new Promise<typeof Vips>(async (resolve, reject) => {
        // firefox doesn't supprot dynamic module import in workers (https://bugzil.la/1540913)
        // so the createModule function will be initialized in the script tag
        const VipsCreateModule = typeof globalThis.Vips === 'undefined' ? null : globalThis.Vips;
        if (!VipsCreateModule) {
            reject(new Error('Module Not Loaded', {
                cause: 'moduleNotFound'
            }));
            return;
        }

        if (!vips) {
            vips = await VipsCreateModule({
                // local file ** important **
                locateFile(url, scriptDirectory) {
                    return `/wasm/vips/${url}`;
                },
                print(str) {
                    console.log(str);
                },
                printErr(str) {
                    console.warn(str);
                },
                onAbort(what) {
                    reject(new Error(what));
                },
            });
            import.meta.env.DEV && console.log(`${vips.version(0)}.${vips.version(1)}.${vips.version(2)}`);
        }
        resolve(vips);
    })
};

///////////////////////////////////////////////////////////

export const VIPS_ACTION_ERROR_CAUSES = [
    'ImageFileUnreadable',
    'UnknownError'
] as const;

export type ConvertWithVipsCause = typeof VIPS_ACTION_ERROR_CAUSES[number];

const errorBuilder = (message: string, cause: ConvertWithVipsCause) => new Error(message, { cause });

export async function parseBackground(hex: string) {
    if (!vips) {
        vips = await initVips();
    }
    const color = new TinyColor(hex);

    return [color.r, color.g, color.b];
}

const blobToUint8Array = async (blob: Blob) => {
    let arrayBuffer: ArrayBuffer | null = null;
    try {
        arrayBuffer = await blob.arrayBuffer();
        if (!arrayBuffer) throw new Error('whatever');
    } catch (err) {
        throw errorBuilder('Unable to read File', 'ImageFileUnreadable');
    }
    const buffer = new Uint8Array(arrayBuffer);
    return buffer
};

export function isFormatAccepted(fileExtention: string) {
    return ['png', 'jpg', 'jpeg', 'webp', 'gif', 'tif', 'tiff'].includes(fileExtention.toLowerCase());
}

const isMultiframePic = (type: string) => {
    return ['image/gif', 'image/webp'].includes(type);
};

//////////////////////////////////////////////////////////////

export async function convertToJPEG(file: Blob, config = {
    quality: 75,
    interlace: false,
    stripMetaData: false,
    defaultBackground: "#ffffff"
}) {
    if (!vips) {
        vips = await initVips();
    }

    // try read the blob

    const img = vips.Image.newFromBuffer(await blobToUint8Array(file));
    const result = img.writeToBuffer('.jpg', {
        Q: config.quality,
        strip: config.stripMetaData,
        background: await parseBackground(config.defaultBackground),
        interlace: config.interlace,
    });
    img.delete();
    return new Blob([result], {
        type: 'image/jpeg',
    });
}

export async function convertToPNG(file: Blob, config = {
    /** 0 ~ 9 */
    compression: 2,
    interlace: false,
    Q: 100,
    dither: 1,
    bitdepth: 0,
    stripMetaData: false,
    keepAlphaChannel: true,
    defaultBackground: "#ffffff"
}) {
    if (!vips) {
        vips = await initVips();
    }

    // try read the blob

    let img = vips.Image.newFromBuffer(await blobToUint8Array(file));
    if (!config.keepAlphaChannel) {
        const flattened = img.flatten({
            background: await parseBackground(config.defaultBackground),
        });
        img.delete();
        img = flattened;
    }
    const result = img.writeToBuffer('.png', {
        compression: config.compression,
        strip: config.stripMetaData,
        interlace: config.interlace,
        dither: config.dither,
        ...config.bitdepth !== 0 ? { bitdepth: config.bitdepth } : {},
        Q: config.Q
    });
    img.delete();
    return new Blob([result], {
        type: 'image/png',
    });
}

export async function convertToWebp(file: Blob, config = {
    quality: 75,
    lossless: false,
    lossyCompressionPreset: 'default',
    smartSubsample: false,
    alphaQuality: 100,
    stripMetaData: false,
    keepAlphaChannel: true,
    defaultBackground: "#ffffff",
}) {
    if (!vips) {
        vips = await initVips();
    }
    const props = isMultiframePic(file.type) ? 'n=-1' : '';
    let img = vips.Image.newFromBuffer(await blobToUint8Array(file), props);
    if (!config.keepAlphaChannel) {
        const flattened = img.flatten({
            background: await parseBackground(config.defaultBackground),
        });
        img.delete();
        img = flattened;
    }
    const result = img.writeToBuffer('.webp', {
        Q: config.quality,
        strip: config.stripMetaData,
        ...config.keepAlphaChannel ? {} : {
            background: await parseBackground(config.defaultBackground)
        },
        lossless: config.lossless,
        preset: config.lossyCompressionPreset,
        'smart-subsample': config.smartSubsample,
        'alpha-q': config.alphaQuality,
    });
    img.delete();
    return new Blob([result], {
        type: 'image/webp',
    });
}

export async function convertToGIF(file: Blob, config = {
    bitdepth: 8,
    effort: 7,
    // interlace: false,    // ⚠ Not supported by 8.13
    dither: 1,
    'interframe-maxerror': 0,
    'interpalette-maxerror': 3,
    stripMetaData: false,
    keepAlphaChannel: true,
    defaultBackground: "#ffffff",
}) {
    if (!vips) {
        vips = await initVips();
    }
    const props = isMultiframePic(file.type) ? 'n=-1' : '';
    let img = vips.Image.newFromBuffer(await blobToUint8Array(file), props);
    if (!config.keepAlphaChannel) {
        const flattened = img.flatten({
            background: await parseBackground(config.defaultBackground),
        });
        img.delete();
        img = flattened;
    }
    const result = img.writeToBuffer('.gif', {
        bitdepth: config.bitdepth,
        strip: config.stripMetaData,
        ...config.keepAlphaChannel ? {} : {
            background: await parseBackground(config.defaultBackground)
        },
        effort: config.effort,
        // interlace: config.interlace,
        dither: config.dither,
        'interframe-maxerror': config["interframe-maxerror"],
        'interpalette-maxerror': config["interpalette-maxerror"],
    });
    img.delete();
    return new Blob([result], {
        type: 'image/gif',
    });
}

// @ts-expect-error
window.__DEBUG = convertToJPEG;