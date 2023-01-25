import type Vips from "wasm-vips";

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

/**
 * 
 * @param quality From 1 to 100.
 */
export async function convertToJPEG(file: Blob, quality: number = 75) {
    if (!vips) {
        vips = await initVips();
    }

    // try read the blob
    let arrayBuffer: ArrayBuffer | null = null;
    try {
        arrayBuffer = await file.arrayBuffer();
        if (!arrayBuffer) throw new Error('whatever');
    } catch (err) {
        throw errorBuilder('Unable to read File', 'ImageFileUnreadable');
    }

    const buffer = new Uint8Array(arrayBuffer);

    const img = vips.Image.newFromBuffer(buffer, '', {

    });
    const result = img.writeToBuffer('.jpg', {
        Q: quality
    });
    return new Blob([result], {
        type: 'image/jpeg'
    });
}

// @ts-expect-error
window.__DEBUG = convertToJPEG;