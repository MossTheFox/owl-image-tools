// @ts-check
/*
    For saving files to OPFS.
    ref: https://webkit.org/blog/12257/the-file-system-access-api-with-origin-private-file-system/

    > To write a file, you can use the synchronous write() method of FileSystemSyncAccessHandle. 
    > In the current implementation, this is the only way to write a file in WebKit.

    Note: From Chrome 109+ on Android devices, OPFS is now supported. 
    
    Firefox had also added support for this in Nightly version. (Desktop)

*/

/**
 * Post data back to host.
 * @param {'ok' | 'error'} code 
 * @param {string} message 
 * @param {any} data 
 */
function postBackMessage(code, message, data) {
    self.postMessage({
        code,
        message,
        data
    });
}

self.addEventListener('message', async (e) => {
    try {
        /**
         * @type {{ type: 'saveFile', path: string, file: ArrayBuffer, debug?: boolean, override?: boolean }}
         */
        const data = e.data;
        if (data && data.type === 'saveFile' && typeof data.path === 'string' && data.file instanceof ArrayBuffer) {

            if (data.debug) {
                console.log('Request: ', data);
            }

            // now handle.
            const root = await navigator.storage.getDirectory();

            let dirs = data.path.split('/');

            let fileName = dirs.pop() || 'nah.';

            // now iterate to the target directory.

            let handle = root;
            for (const dir of dirs) {
                handle = await handle.getDirectoryHandle(dir, {
                    create: true
                });
            }

            // Check for duplicated file name if not doing override.
            if (!data.override) {
                let deadloop = 1000;
                while (await isFileExists(fileName, handle)) {
                    fileName = renameFileForDuplication(fileName);
                    deadloop--;
                    if (deadloop < 0) {
                        throw new Error('Error when renaming saved file: Too many retry times.');
                    }
                }
            }
            const fileHandle = await handle.getFileHandle(fileName, {
                create: true
            });

            // Prepare the buffer and handle.
            // need to ensure the buffer is readable
            const buffer = new Uint8Array(data.file);

            /**
             * @type {FileSystemSyncAccessHandle}
             */
            const accessHandle = await fileHandle.createSyncAccessHandle();

            // Sync
            accessHandle.write(buffer, {
                at: 0
            });

            await accessHandle.flush();

            await accessHandle.close();

            postBackMessage('ok', 'Saved.', {
                originalPath: data.path,
                renamed: fileName,
                handle: fileHandle
            });

        }
    } catch (err) {
        postBackMessage('error', 'Unknown error', err);
    }
});

/**
 * 
 * @param {string} filename 
 * @param {FileSystemDirectoryHandle} dirHandle 
 * @returns 
 */
async function isFileExists(filename, dirHandle) {
    let existed = false;
    try {
        const check = await dirHandle.getFileHandle(filename);
        existed = true;
    } catch (err) {
        if (err instanceof DOMException && (
            err.name === 'NotFoundError' || err.name === 'TypeMismatchError'
        )) {
            // go on
        } else {
            // ok that's bad
            throw err;
        }
    }
    return existed;
}

/**
 * 
 * @param {string} filename 
 * @returns 
 */
function renameFileForDuplication(filename) {
    let splitted = filename.split('.');
    let ext = splitted.pop() ?? '';
    let name = splitted.join('.');
    let nameSplitted = name.split(' ');
    const match = nameSplitted[nameSplitted.length - 1].match(/\((\d+)\)/);

    let tail = '(1)';
    if (match && match.index === 0) {
        // good
        const newExtOrder = isNaN(+match[1]) ? 1 : (+match[1]) + 1;
        tail = `(${newExtOrder})`;
        nameSplitted.pop();
    }
    nameSplitted.push(tail);
    return nameSplitted.join(' ') + (ext ? `.${ext}` : '');
}