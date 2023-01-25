import { v4 } from "uuid";

export function randomUUIDv4() {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    return v4();
}

export function parseFileSizeString(size: number, detailed = false) {
    const detail = detailed ? ` (${size})` : '';
    if (size < 1024) return `${size} B` + detail;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB` + detail;
    if (size < 1024 * 1024 * 1024) return `${(size / 1024 / 1024).toFixed(2)} MB` + detail;
    if (size < 1024 * 1024 * 1024 * 1024) return `${(size / 1024 / 1024 / 1024).toFixed(2)} GB` + detail;
}

export function parseDateDelta(dateA: Date, dateB: Date) {
    const delta = Math.abs(dateA.getTime() - dateB.getTime());
    if (delta < 1000) return `${delta} ms`;
    if (delta < 1000 * 60) return `${(delta / 1000).toFixed(2)} s`;
    if (delta < 1000 * 60 * 60) return `${Math.floor(delta / (1000 * 60))} min, ${(delta % (1000 * 60) / 1000).toFixed(2)} s`;
}

/**
 * Won't validate the blob (file). If the file object is no longer accessible, no download will be fired and no error will occurr.
 */
export function fireFileDownload(blob: Blob, fileName = randomUUIDv4()) {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(a.href);
}

/**
 * Try to read a blob. Can be used to check whether it's readable.
 * 
 * @throws If error is thrown, the blob should be unreadable.
 */
export async function tryReadABlob(blob: Blob) {
    const whatever = blob.stream()
    const reader = whatever.getReader();
    await reader.read();
    reader.cancel('Aborted');
    reader.releaseLock();
    await whatever.cancel('Aborted');
}

/**
 * Validate object from localStorage, and return it.
 */
export function getFromLocalStorageAndValidate<T extends Object>(key: string, object: T) {
    try {
        const stored = localStorage.getItem(key);
        if (!stored) return { ...object };
        const json = JSON.parse(stored);
        const result: T = {
            ...object
        };
        for (const [key, val] of Object.entries(json)) {
            // @ts-expect-error
            if (key in result && typeof result[key] === typeof json[key]) {
                // no additional check. whatever.
                // @ts-expect-error
                result[key] = json[key];
            }
        }
        return result;

    } catch (err) {
        import.meta.env.DEV && console.log(err);
        return { ...object };
    }
}

/** Save to localStorage. */
export function saveToLocalStorage(key: string, value: string | object) {
    try {
        if (typeof value !== 'string') {
            value = JSON.stringify(value);
        }
        localStorage.setItem(key, value);
        return true;
    } catch (err) {
        import.meta.env.DEV && console.log(err);
        return false;
    }
}

/** estimate storage usage */
export async function estimateStorageUsage(): Promise<
    {
        result: 'success',
        available: number,
        used: number,
        rawUsageObject: Object
    } | {
        result: 'error',
        reason: 'NotSupportError' | 'AccessDenied' | 'UnknownError'
    }
> {
    if (!navigator.storage) {
        return {
            result: 'error',
            reason: 'NotSupportError'
        };
    }
    try {
        const manager = navigator.storage;
        const estimate = await manager.estimate();

        return {
            result: 'success',
            available: estimate.quota ?? -1,
            used: estimate.usage ?? -1,
            // @ts-expect-error
            rawUsageObject: estimate.usageDetails
        }

    } catch (err) {
        return {
            result: 'error',
            reason: 'UnknownError'
        };
    }
}

/** Check for persis (TODO: um) */