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
] as const;

export function checkIsFilenameAccepted(filename: string) {
    const extIndex = filename.lastIndexOf('.');
    if (extIndex < 0) return false;
    if ((ACCEPT_FILE_EXTs as Readonly<string[]>).includes(filename.substring(extIndex + 1).toLowerCase())) return true;
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
    // ico files... uses multiple mime.
    'image/vnd.microsoft.icon': 'ico',
    'image/x-icon': 'ico'
} as const;

export const extMimeMatch: {[key in typeof ACCEPT_FILE_EXTs[number]]: keyof typeof mimeExtMatch} = {
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'svg': 'image/svg+xml',
    'tif': 'image/tiff',
    'tiff': 'image/tiff',
    'bmp': 'image/bmp',
    'webp': 'image/webp',
    'avif': 'image/avif',
    'ico': 'image/x-icon'
} as const;


export const OUTPUT_FORMATS: Readonly<(typeof mimeExtMatch[keyof typeof mimeExtMatch])[]> = [
    'jpg', 'png', 'webp'
] as const;

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

/** Return empty string if no match */
export function extToMime(ext: string) {
    if (ext in extMimeMatch) {
        return extMimeMatch[ext as keyof typeof extMimeMatch];
    }
    return '';
}