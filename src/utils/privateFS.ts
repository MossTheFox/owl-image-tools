
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
    for (const handle of inUseTempFolders) {
        await root.removeEntry(handle.name, {
            recursive: true
        });
    }
}

export async function clearAllTempFolders() {
    const root = await navigator.storage.getDirectory();
    try {
        await root.removeEntry('temp', {
            recursive: true
        });
    } catch (err) {
        // Maybe not exist. Skip.
        import.meta.env.DEV && console.log(err);
    }
}

export async function getCurrentOPFSTempFolders() {
    const root = await navigator.storage.getDirectory();
    try {
        const dir = await root.getDirectoryHandle('temp');
        const handles: [string, FileSystemDirectoryHandle | FileSystemFileHandle][] = [];
        for await (const what of dir.entries()) {
            handles.push(what);
        }
        return handles;
    } catch (err) {
        import.meta.env.DEV && console.log(err);
        return [];
    }
}