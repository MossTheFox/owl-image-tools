/**
 * IMPORTANT: Microsoft Edge on Windows seems to have some issue with this API, 
 *            and will always throw `DOMException: An operation that depends on state cached in an interface object was made but the state had changed since it was read from disk.`
 */

/**
 * emm, not sure
 */
let busy = false;

let root: null | FileSystemDirectoryHandle = null;

export async function getRoot() {
    if (busy) throw new Error('Busy')
    busy = true;
    try {
        root = await navigator.storage.getDirectory();
        busy = false;
        return root;
    } catch (err) {
        busy = false;
        throw err;
    }
}