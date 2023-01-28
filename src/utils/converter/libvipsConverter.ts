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

// Note: err.name === 'RuntimeError' when things like OOM occuurred.

//////////////////////// UTILs /////////////////////////////

export const VIPS_ACTION_ERROR_CAUSES = [
    'ImageFileUnreadable',
    'UnknownError'
] as const;

export type ConvertWithVipsCause = typeof VIPS_ACTION_ERROR_CAUSES[number];

const errorBuilder = (message: string, cause: ConvertWithVipsCause) => new Error(message, { cause });

export function parseBackground(hex: string) {
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
    return buffer;
};

export function isFormatAcceptedByVips(fileExtention: string) {
    return ['png', 'jpg', 'jpeg', 'webp', 'gif', 'tif', 'tiff'].includes(fileExtention.toLowerCase());
}

const isMultiframePic = (type: string) => {
    return ['image/gif', 'image/webp'].includes(type);
};

//////////////////////////////////////////////////////////////

////////////////// For the webworker /////////////////////////

let worker: Worker | null = null;

function fireVipsWorkerTask(
    uint8Array: Uint8Array,
    loadStrProps: string,
    writeFormatString: string,
    writeOptions: {},
    flatten: boolean = false,
    defaultBackgroundVector = [255, 255, 255]
) {
    return new Promise<Uint8Array>((resolve, reject) => {
        try {
            // INIT
            if (!worker) {
                worker = new Worker('/wasm/vips-loader.worker.js');
            }

            // The callback functions will be override everytime
            // Parallel tasks not sure if stable, so it's not implemented.

            // Here begins
            worker.onerror = async (e) => {
                import.meta.env.DEV && console.log(e);

                reject(e.error);
                worker?.terminate();
                // restart on error.
                await restartVipsWorker();
            };

            worker.onmessage = async (e) => {

                import.meta.env.DEV && console.log(e);

                const data = e.data as {
                    code: 'ok' | 'error',
                    message: string,
                    data: Uint8Array | Error
                };

                // Handle Errors
                if (data.code === 'error' && data.message) {

                    reject(data.data as Error);
                    if (data.data instanceof Error && (
                        data.data.name === 'RuntimeError'   // wait this seems not right
                        || data.data.message.startsWith('Aborted')
                    )) {
                        await restartVipsWorker();
                    }
                    return;
                }

                // Resolve here
                if (data.code === 'ok' && data.data instanceof Uint8Array) {
                    resolve(data.data);
                    return;
                }
            };

            // CALL
            worker.postMessage({
                type: 'run',
                args: [...arguments]
            });


        } catch (err) {
            reject(err);
        }

    });
}

export async function restartVipsWorker() {
    if (worker) {
        worker.terminate();
    }
    worker = new Worker('/wasm/vips-loader.worker.js');
}

//////////////////////////////////////////////////////////////

//////////////////// Exported Fns ////////////////////////////

export async function convertToJPEG(file: Blob, config = {
    quality: 75,
    interlace: false,
    stripMetaData: false,
    defaultBackground: "#ffffff"
}) {
    // try read the blob
    const result = await fireVipsWorkerTask(await blobToUint8Array(file),
        '', '.jpg', {
        Q: config.quality,
        strip: config.stripMetaData,
        background: parseBackground(config.defaultBackground),
        interlace: config.interlace,
    });
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

    const result = await fireVipsWorkerTask(await blobToUint8Array(file), '', '.png', {
        compression: config.compression,
        strip: config.stripMetaData,
        interlace: config.interlace,
        dither: config.dither,
        ...config.bitdepth !== 0 ? { bitdepth: config.bitdepth } : {},
        Q: config.Q
    }, !config.keepAlphaChannel, parseBackground(config.defaultBackground));
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

    const props = isMultiframePic(file.type) ? 'n=-1' : '';

    const result = await fireVipsWorkerTask(await blobToUint8Array(file), props, '.webp', {
        Q: config.quality,
        strip: config.stripMetaData,
        lossless: config.lossless,
        preset: config.lossyCompressionPreset,
        'smart-subsample': config.smartSubsample,
        'alpha-q': config.alphaQuality,
    }, !config.keepAlphaChannel, parseBackground(config.defaultBackground));

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
    const props = isMultiframePic(file.type) ? 'n=-1' : '';
    const result = await fireVipsWorkerTask(await blobToUint8Array(file), props, '.gif', {
        bitdepth: config.bitdepth,
        strip: config.stripMetaData,
        effort: config.effort,
        // interlace: config.interlace,
        dither: config.dither,
        'interframe-maxerror': config["interframe-maxerror"],
        'interpalette-maxerror': config["interpalette-maxerror"],
    }, !config.keepAlphaChannel, parseBackground(config.defaultBackground));
    return new Blob([result], {
        type: 'image/gif',
    });
}