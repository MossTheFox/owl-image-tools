// @ts-check

importScripts('/wasm/vips/vips.js');

// NOTE: when an error with name = 'RuntimeError' is fired, the instance should be dead (due to things like OOM).

// Need to reload it.

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
                    // local file ** important **
                    mainScriptUrlOrBlob: '/wasm/vips/vips.js',

                    // To fix an issue for parsing URLs when running in workers.
                    // For the comming version 0.0.5, it will be ['vips-jxl.wasm', 'vips-heif.wasm']
                    dynamicLibraries: ["/wasm/vips/vips-jxl.wasm"],
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
 * @param uint8Array Input file buffer.
 * @param loadStrProps Passed for `newFromBuffer` when creating a Vips Image.
 * @param writeFormatString Passed to `writeToBuffer` for specifying output format.
 * @param writeOptions Passed as second param for `writeToBuffer`.
 * @param flatten Do the flatten if has alpha channel.
 * @param defaultBackgroundVector If do the flatten or losing alpha channel data, the background.
 * @returns Uint8Array for output file buffer.
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
    let img = vips.Image.newFromBuffer(uint8Array, loadStrProps);
    if (flatten && img.hasAlpha()) {
        const flattened = img.flatten({
            background: defaultBackgroundVector
        });
        img.delete();
        img = flattened;
    }
    const result = img.writeToBuffer(writeFormatString, writeOptions);
    img.delete();
    return result;
}

///////////////////////////////////////////////////////////////////////////////

/**
 * 
 * @param {'ok' | 'error'} code 
 * @param {string} message 
 * @param {Uint8Array | Error} data
 */
function postBackMessage(code, message, data) {
    self.postMessage({
        code,
        message,
        data
    });
}

self.addEventListener('message', async (e) => {
    const data = e.data;
    /*  {
            type: 'run',
            args: [...arguments]
        }
        Turn `arguments` into array before passing to the worker. ([...arguments])
    */
    if (data.type !== 'run' || !Array.isArray(data.args)) {
        postBackMessage('error', 'Unknown operation');
        return;
    }

    try {
        const result = await vipsCall(...data.args);
        postBackMessage('ok', 'done', result);

    } catch (err) {
        postBackMessage('error', 'Error occurred.', err);
    }

});