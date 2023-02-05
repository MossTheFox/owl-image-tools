import type Vips from "wasm-vips";
import { TinyColor } from "@ctrl/tinycolor";

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

//////////////////// Exported Fns ////////////////////////////

export async function convertToJPEG(file: Blob, config = {
    Q: 75,
    interlace: false,

    strip: false,
    defaultBackground: "#ffffff"
}) {
    const result = await fireVipsWorkerTask(
        await blobToUint8Array(file), '',
        '.jpg', {
        Q: config.Q,
        strip: config.strip,
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
    strip: false,
    flatten: false,
    defaultBackground: "#ffffff"
}) {

    const result = await fireVipsWorkerTask(
        await blobToUint8Array(file), '',
        '.png', {
        compression: config.compression,
        strip: config.strip,
        interlace: config.interlace,
        dither: config.dither,
        ...config.bitdepth !== 0 ? { bitdepth: config.bitdepth } : {},
        Q: config.Q
    },
        config.flatten, parseBackground(config.defaultBackground)
    );
    return new Blob([result], {
        type: 'image/png',
    });
}

export async function convertToWebp(file: Blob, config = {
    Q: 75,
    lossless: false,
    preset: 'default',
    'smart-subsample': false,
    'alpha-q': 100,
    strip: false,
    flatten: false,
    defaultBackground: "#ffffff",
}) {

    const props = isMultiframePic(file.type) ? 'n=-1' : '';

    const result = await fireVipsWorkerTask(
        await blobToUint8Array(file), props,
        '.webp', {
        Q: config.Q,
        strip: config.strip,
        lossless: config.lossless,
        preset: config.preset,
        'smart-subsample': config["smart-subsample"],
        'alpha-q': config["alpha-q"],
    },
        config.flatten, parseBackground(config.defaultBackground)
    );

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
    strip: false,
    flatten: false,
    defaultBackground: "#ffffff",
}) {
    const props = isMultiframePic(file.type) ? 'n=-1' : '';
    const result = await fireVipsWorkerTask(
        await blobToUint8Array(file), props,
        '.gif', {
        bitdepth: config.bitdepth,
        strip: config.strip,
        effort: config.effort,
        // interlace: config.interlace,
        dither: config.dither,
        'interframe-maxerror': config["interframe-maxerror"],
        'interpalette-maxerror': config["interpalette-maxerror"],
    },
        config.flatten, parseBackground(config.defaultBackground)
    );
    return new Blob([result], {
        type: 'image/gif',
    });
}

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

/**
 * Any error that could occur due to buffer being unreadable should be exposed here.
 */
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

////////////////// For the Web Worker /////////////////////////

let worker: Worker | null = null;

/**
 * For how vips is called in the worker, check `vipsCall()` in `_libvipsConverterTemp.ts` for the typed caller function in `vips-loader.worker.js`.
 * 
 * @returns 
 */
function fireVipsWorkerTask(
    uint8Array: Parameters<typeof Vips.Image.newFromBuffer>[0],
    loadStrProps: Parameters<typeof Vips.Image.newFromBuffer>[1],
    writeFormatString: Parameters<Vips.Image['writeToBuffer']>[0],
    writeOptions: Parameters<Vips.Image['writeToBuffer']>[1],

    flatten = false,
    defaultBackgroundVector = [255, 255, 255]
) {
    return new Promise<Uint8Array>((resolve, reject) => {
        try {
            // INIT
            if (!worker) {
                worker = new Worker('/worker/vips-loader.worker.js');
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
                // eslint-disable-next-line
                args: [...arguments]    
                // ↑ the worker will call the relatived function with the EXACT same arguments.
                // see `vipsCall` function in `_libvipsConverterTemp.ts`.
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