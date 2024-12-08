export const ACCEPT_FILE_EXTs = [
    'jpg',
    'jpeg',
    'png',
    'apng',
    'gif',
    'svg',
    'tif',
    'tiff',
    'bmp',
    'webp',
    'avif',
    'ico',
    'avif',
    'heif'
] as const;

export function checkIsFilenameAccepted(filename: string) {
    const extIndex = filename.lastIndexOf('.');
    if (extIndex < 0) return false;
    if ((ACCEPT_FILE_EXTs as Readonly<string[]>).includes(filename.substring(extIndex + 1).toLowerCase())) return true;
    return false;
}

export const mimeExtMatch = {
    'image/jpeg': 'jpg',
    'image/gif': 'gif',
    'image/bmp': 'bmp',
    'image/png': 'png',
    'image/apng': 'apng',
    'image/svg+xml': 'svg',
    'image/tiff': 'tiff',
    'image/webp': 'webp',
    // ico files... uses multiple mime.
    'image/vnd.microsoft.icon': 'ico',
    'image/x-icon': 'ico',
    'image/heif': 'heif',
    'image/avif': 'avif',
} as const;

export const extMimeMatch: { [key in typeof ACCEPT_FILE_EXTs[number]]: keyof typeof mimeExtMatch } = {
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'apng': 'image/apng',
    'gif': 'image/gif',
    'svg': 'image/svg+xml',
    'tif': 'image/tiff',
    'tiff': 'image/tiff',
    'bmp': 'image/bmp',
    'webp': 'image/webp',
    'avif': 'image/avif',
    'ico': 'image/x-icon',
    'heif': 'image/heif',
} as const;


export const OUTPUT_MIMEs: Readonly<(typeof extMimeMatch[keyof typeof extMimeMatch])[]> = [
    'image/jpeg', 'image/png', 'image/gif', 'image/webp', /* 'image/tiff', 'image/heif',  */ 'image/avif'
] as const;

export const ACCEPT_MIMEs = Object.keys(mimeExtMatch) as (keyof typeof mimeExtMatch)[];

/**
 * WARNING: DO NOT USE THIS TO DETECT INPUT FILE FORMAT since in some occations mime whon't be parsed
 */
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
export function extToMime(extOrFileName: string) {
    const ext = extOrFileName.split('.').pop() || extOrFileName;
    if (ext in extMimeMatch) {
        return extMimeMatch[ext as keyof typeof extMimeMatch];
    }
    return '';
}

export function changeFileExt(fileName: string, targetExt: string) {
    const splited = fileName.split('.');
    if (splited.length === 1) return `${fileName}.${targetExt}`;
    splited.pop();
    splited.push(targetExt);
    return splited.join('.');
}

export function getFileExt(fileName: string) {
    const splited = fileName.split('.');
    if (splited.length === 1) return '';
    return splited.pop()?.toLowerCase() ?? '';
}