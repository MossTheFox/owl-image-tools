/**
 * IMPORTANT: Microsoft Edge on Windows seems to have some issue with this API, 
 *            and will always throw `DOMException: An operation that depends on state cached in an interface object was made but the state had changed since it was read from disk.`
 */

/**
 * emm, not sure
 */
// let busy = false;

// let root: null | FileSystemDirectoryHandle = null;

// export async function getOPFSRoot() {
//     if (busy) throw new Error('Busy')
//     busy = true;
//     try {
//         root = await navigator.storage.getDirectory();
//         busy = false;
//         return root;
//     } catch (err) {
//         busy = false;
//         throw err;
//     }
// }


/**
 * Call when it's sure that browser is equipped with the FileSystemAccess API. (OPFS is OK)
 * @param path e.g. 'img/a/cat.png'
 * @param root 
 */
export async function getFileHandleViaPath(path: string, root: FileSystemDirectoryHandle) {
    const splitted = path.split('/');
    // wait will i really use this thing?
}

export async function isFileExists(filename: string, dirHandle: FileSystemDirectoryHandle) {
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

export function renameFileForDuplication(filename: string) {
    const splitted = filename.split('.');
    const ext = splitted.pop() ?? '';
    const name = splitted.join('.');
    const nameSplitted = name.split(' ');
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