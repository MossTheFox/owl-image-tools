export const ACCEPT_FILE_EXTs = [
    'jpg',
    'jpeg',
    'png',
    'gif',
    'svg',
    'tif',
    'tiff',
    'bmp',
    'webp',
    'avif',
    'ico'
];

export function checkIsFilenameAccepted(filename: string) {
    const extIndex = filename.lastIndexOf('.');
    if (extIndex < 0) return false;
    if (ACCEPT_FILE_EXTs.includes(filename.substring(extIndex + 1))) return true;
    return false;
}

export const mimeExtMatch = {
    'image/avif': 'avif',
    'image/jpeg': 'jpg',
    'image/gif': 'gif',
    'image/bmp': 'bmp',
    'image/png': 'png',
    'image/svg+xml': 'svg',
    'image/tiff': 'tiff',
    'image/webp': 'webp',
    'image/vnd.microsoft.icon': 'ico',
} as const;

export const ACCEPT_MIMEs = Object.keys(mimeExtMatch) as (keyof typeof mimeExtMatch)[];

export function checkIsMimeSupported(mime: string) {
    return mime in mimeExtMatch;
}

/** Return empty string if no match */
export function mimeToExt(mime: string) {
    if (mime in mimeExtMatch) {
        return mimeExtMatch[mime as keyof typeof mimeExtMatch];
    }
    return '';
}