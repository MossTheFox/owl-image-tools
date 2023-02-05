/**
 * folders of
 *      temp/_____
 */
const inUseTempFolders: FileSystemDirectoryHandle[] = [];

/**
 * 
 * @returns A temp folder
 */
export async function createOPFSTempFolder() {
    const root = await navigator.storage.getDirectory();
    const tempFolder = await root.getDirectoryHandle('temp', {
        create: true
    });

    const target = await tempFolder.getDirectoryHandle(`${Date.now()}`, {
        create: true
    });
    inUseTempFolders.push(target);

    return target;
}

export async function clearCurrentActiveTempFolders() {
    const root = await navigator.storage.getDirectory();
    const tempFolder = await root.getDirectoryHandle('temp', {
        create: true
    });
    for (const handle of inUseTempFolders) {
        await tempFolder.removeEntry(handle.name, {
            recursive: true
        });
    }
}

/**
 * in case there's need for a path string like `temp/tempfolderename'. This will return it.
 */
export function parseTempFolderDirectory(handle: FileSystemDirectoryHandle) {
    return `temp/${handle.name}`;
}

export async function clearAllTempFolders(cleanRoot = false) {
    const root = await navigator.storage.getDirectory();
    try {
        await root.removeEntry('temp', {
            recursive: true
        });
        if (cleanRoot) {
            for await (const handle of root.values()) {
                await root.removeEntry(handle.name, {
                    recursive: true
                });
            }
        }
    } catch (err) {
        // Maybe not exist. Skip.
        import.meta.env.DEV && console.log(err);
    }
}

export async function getCurrentOPFSTempFolders() {
    const root = await navigator.storage.getDirectory();
    try {
        const dir = await root.getDirectoryHandle('temp');
        const handles: (FileSystemDirectoryHandle | FileSystemFileHandle)[] = [];
        for await (const what of dir.values()) {
            handles.push(what);
        }
        return handles;
    } catch (err) {
        import.meta.env.DEV && console.log(err);
        return [];
    }
}

/**
 * Write a file. This needs a dedicated Worker for `createSyncAccessHandle`, the very only way of writing to file in webkit.
 * 
 * https://webkit.org/blog/12257/the-file-system-access-api-with-origin-private-file-system/
 * 
 * @param path e.g. 'temp/wow.png'
 * 
 * Resolves the real file name. Directory path will not be changed.
 */
export function writeOPFSFile(path: string, blob: Blob) {
    return new Promise<string>((resolve, reject) => {
        try {
            const worker = new Worker('/worker/opfs-file-saver.worker.js');

            worker.addEventListener('error', (e) => {
                reject(e.error);
                worker.terminate();
            });

            worker.addEventListener('message', (e) => {
                const data = e.data;

                if (data.code === 'ok' && data.data) {
                    const what = data.data as ({
                        originalPath: string,
                        renamed: string,
                        handle: FileSystemFileHandle,
                    });
                    console.log(what);
                    if (what.originalPath !== path) {
                        // Not this task. ignore
                        // um, should not happen actually
                        return;
                    }

                    // ok
                    resolve(what.renamed);
                    worker.terminate();
                    return;
                }

                if (data.code === 'error') {
                    reject(data.data instanceof Error ? data.data : new Error(data.message || 'Unknown error from worker.'));
                    worker.terminate();
                }
            });

            // ok now
            worker.postMessage({
                type: 'saveFile',
                path,
                file: blob,
                debug: import.meta.env.DEV
            });
        } catch (err) {
            reject(err);
        }
    });
}

export async function readOPFSFile(path: string) {
    let dirPath = path.split('/');
    let filename = dirPath.pop() || 'what the';

    let handle = await navigator.storage.getDirectory();

    for (const dir of dirPath) {
        handle = await handle.getDirectoryHandle(dir);  // no create. throw error if not found.
    }

    return await handle.getFileHandle(filename);
}

// DEBUG FN
// Keep it public since it can be useful
// @ts-expect-error
/* import.meta.env.DEV && */ (window.__OPFS_DEBUG = async () => {

    async function it(handle: FileSystemDirectoryHandle | FileSystemFileHandle, prefix = '') {
        // file
        if (handle.kind === 'file') {
            console.log(prefix + '/' + handle.name, handle);
            return;
        }

        // directory
        console.log(prefix + '/' + handle.name, handle);

        // iterate directory
        for await (const h of handle.values()) {
            await it(h, prefix + '/' + handle.name);
        }
    }


    const root = await navigator.storage.getDirectory();

    console.log('root: ');
    for await (const handle of root.values()) {
        await it(handle, 'root');
    }
});