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

/**
 * Won't validate the blob (file). If the file object is no longer accessible, no download will be fired and no error will occurr.
 */
export function fireFileDownload(blob: Blob, fileName = randomUUIDv4()) {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = fileName;
    a.click();
    console.log(a);
    URL.revokeObjectURL(a.href);
}