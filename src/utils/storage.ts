import { get, set } from "idb-keyval";
import { IDB_KEYVAL_LAST_OUTPUT_DIRECTORY_KEY } from "../constraints";

export async function getStoredOutputDirectory() {
    const result = await get(IDB_KEYVAL_LAST_OUTPUT_DIRECTORY_KEY);
    if (result instanceof FileSystemDirectoryHandle) {
        const permission = await result.queryPermission({
            mode: 'readwrite'
        });
        if (permission === 'denied') return null;
        return result;
    }
    return null;
}

export async function setStoredOutputDirectory(handle: FileSystemDirectoryHandle) {
    await set(IDB_KEYVAL_LAST_OUTPUT_DIRECTORY_KEY, handle);
}