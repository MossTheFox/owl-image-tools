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
    return `${(size / 1024 / 1024 / 1024 / 1024).toFixed(2)} TB` + detail;
}

export function parseDateDelta(dateA: Date, dateB: Date = new Date()) {
    const delta = Math.abs(dateA.getTime() - dateB.getTime());
    if (delta < 1000) return `${delta} ms`;
    if (delta < 1000 * 60) return `${(delta / 1000).toFixed(2)} s`;
    if (delta < 1000 * 60 * 60) return `${Math.floor(delta / (1000 * 60))} min, ${(delta % (1000 * 60) / 1000).toFixed(2)} s`;
    return `${Math.floor(delta / (1000 * 60 * 60))} h, ${(delta % (1000 * 60 * 60) / (1000 * 60)).toFixed(2)} min, ${(delta % (1000 * 60) / 1000).toFixed(2)} s`;
}

export function parseDateStringThatCanBeUsedInFileName(date = new Date(), tillMS = true) {
    return `${date.getFullYear()
        }-${(date.getMonth() + 1).toString().padStart(2, '0')}-${(date.getDate()).toString().padStart(2, '0')
        }_${date.getHours().toString().padStart(2, '0')
        }_${date.getMinutes().toString().padStart(2, '0')
        }_${date.getSeconds().toString().padStart(2, '0')}` + (tillMS ? date.getMilliseconds() : '')
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

function objectCheck<T>(unknown: unknown, expected: T) {
    // bool, number, string, symbol, etc.
    if (typeof expected !== 'object') {
        if (typeof expected === typeof unknown) {
            return unknown;
        }
        return expected;
    }
    // null
    if (!expected || !unknown) {
        return expected;
    }
    // Check array with basic types only
    if (Array.isArray(expected)) {
        const source = [...expected];
        if (!Array.isArray(unknown)) return source;
        // now...
        for (let i = 0; i < Math.min(source.length, unknown.length); i++) {
            source[i] = objectCheck(unknown[i], source[i]);
        }
        return source;
    }
    // Then it's Object time
    if (typeof expected === 'object') {
        const source = { ...expected };
        if (typeof unknown !== 'object') {
            return source;
        }
        for (const [key, val] of Object.entries(source)) {
            if (key in unknown) {
                // @ts-expect-error The check should already be finished.
                source[key] = objectCheck(unknown[key], val)
            }
        }
        return source;
    }
}

/**
 * Validate object from localStorage, and return it.
 */
export function getFromLocalStorageAndValidate<T extends object>(key: string, object: T) {
    try {
        const stored = localStorage.getItem(key);
        if (!stored) return { ...object };
        const json = JSON.parse(stored);
        const result: T = {
            ...object
        };
        for (const [key, val] of Object.entries(json)) {
            // @ts-expect-error um, unknown
            if (key in result && typeof result[key] === typeof json[key]) {
                // Additional check for the FIRST layer.
                // @ts-expect-error um.
                result[key] = objectCheck(val, result[key]);
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
        rawUsageObject: object
    } | {
        result: 'error',
        reason: 'NotSupportError' | 'AccessDenied' | 'UnknownError',
        err?: unknown
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
            // @ts-expect-error The `usageDetails` is only available on Chromium-based browsers.
            rawUsageObject: estimate.usageDetails
        }

    } catch (err) {
        return {
            result: 'error',
            reason: 'UnknownError',
            err: err
        };
    }
}


// um

/** return val ∈ [min, max] */
export function numBetween(val: number, min: number, max: number) {
    return val >= min && val <= max;
}

/**
 * x, y, w, h:
 * 
 * (x, y) - left top point
 * 
 * w - width
 * 
 * h - height
 */
export function checkRectOverlap(ax: number, ay: number, aw: number, ah: number,
    bx: number, by: number, bw: number, bh: number
) {
    const x_direction = numBetween(ax, bx, bx + bw) || numBetween(bx, ax, ax + aw);
    const y_direction = numBetween(ay, by, by + bh) || numBetween(by + bh, ay, ay + ah);

    return x_direction && y_direction;
}