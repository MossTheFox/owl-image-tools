// @ts-check

const VIPS_LIB_START_URL = '/wasm/vips-0.0.11'

importScripts(`${VIPS_LIB_START_URL}/vips.js`);

// NOTE: when an error with name = 'RuntimeError' is fired, the instance should be dead (due to things like OOM).

// Need to reload it.

/**
 * @type {import("wasm-vips")}
 */
let vips = null;

function initVips() {
    return new Promise(async (resolve, reject) => {
        const VipsCreateModule = typeof globalThis.Vips === 'undefined' ? null : globalThis.Vips;
        if (!VipsCreateModule) {
            reject(new Error('Module Not Loaded'));
            return;
        }
        try {

            if (!vips) {
                vips = await VipsCreateModule({
                    mainScriptUrlOrBlob: `${VIPS_LIB_START_URL}/vips.js`,
                    dynamicLibraries: [
                        `vips-jxl.wasm`,
                        `vips-heif.wasm`,
                        `vips-resvg.wasm`
                    ],
                    locateFile(url, scriptDirectory) {
                        return `${VIPS_LIB_START_URL}/${url}`;
                    },
                    print(str) {
                        console.log(str);
                    },
                    printErr(str) {
                        console.warn(str);
                    },
                    onAbort(what) {
                        reject(new Error(what));
                        console.warn(what);
                    },
                });
                // console.log(`${vips.version(0)}.${vips.version(1)}.${vips.version(2)}`);
            }
            resolve(vips);
        } catch (err) {
            reject(err);
        }
    });
};

/**
 * Main fn. Catch AbortError if needed.
 * @param {Uint8Array | ArrayBuffer} uint8Array Input file buffer.
 * @param loadStrProps Passed for `newFromBuffer` when creating a Vips Image.
 * @param writeFormatString Passed to `writeToBuffer` for specifying output format.
 * @param writeOptions Passed as second param for `writeToBuffer`.
 * @param flatten Do the flatten if has alpha channel.
 * @param defaultBackgroundVector If do the flatten or losing alpha channel data, the background.
 * @returns {Promise<Uint8Array>} for output file buffer.
 */
async function vipsCall(
    uint8Array,
    loadStrProps,
    writeFormatString,
    writeOptions,
    flatten = false,
    defaultBackgroundVector = [255, 255, 255]
) {
    if (!vips) {
        vips = await initVips();
    }
    if (!(uint8Array instanceof Uint8Array)) {
        // likely to be a regular ArrayBuffer due to some change.
        uint8Array = new Uint8Array(uint8Array);
    }
    let img = vips.Image.newFromBuffer(uint8Array, loadStrProps);
    if (flatten && img.hasAlpha()) {
        const flattened = img.flatten({
            background: defaultBackgroundVector
        });
        img.delete();
        img = flattened;
    }
    img.onProgress = (percent) => {
        postBackMessage('ok', 'progress', percent);
    };
    const result = img.writeToBuffer(writeFormatString, writeOptions);
    img.delete();
    return result;
}

///////////////////////////////////////////////////////////////////////////////

/**
 * 
 * @param {'ok' | 'error'} code 
 * @param {string} message 
 * @param {number | ArrayBuffer | Error} data
 */
function postBackMessage(code, message, data) {
    self.postMessage({
        code,
        message,
        data
    });
}

const initPromise = initVips();

self.addEventListener('message', async (e) => {
    const data = e.data;
    /*  {
            type: 'run',
            args: [...arguments]
        }
        Turn `arguments` into array before passing to the worker. ([...arguments])
    */
    if (data.type !== 'run' || !Array.isArray(data.args)) {
        postBackMessage('error', 'Unknown operation', new Error('Invalid Operation.'));
        return;
    }

    await initPromise;

    try {
        const result = await vipsCall(...data.args);
        // Safari will throw error if trying to post a Uint8Array. Convert it to ArrayBuffer.
        postBackMessage('ok', 'done', result.buffer);

    } catch (err) {
        postBackMessage('error', 'Error occurred.', err);
    }

});

// auto init.