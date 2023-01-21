import { tryReadABlob } from "../randomUtils";

const CANVAS_MAX_IMG_SIZE = 32767;

export const CANVAS_ACTION_ERROR_CAUSES = [
    'ImageFileUnreadable',
    'FormatNotSupportedByBrowser',
    'InvalidImageSize',
    'ImageTooLarge',
    'CanvasError'
] as const;

export type ConvertWithCanvasErrorCause = typeof CANVAS_ACTION_ERROR_CAUSES[number];

const errorBuilder = (message: string, cause: ConvertWithCanvasErrorCause) => new Error(message, { cause });

// OffscreenCanvas is not supported by Safari. So here we put these in the main thread.

/**
 * When catching Errors, the `err.cause` is one of `CANVAS_ACTION_ERROR_CAUSES` exported.
 */
export function convertViaCanvas(fileOrBlob: File | Blob, { outputMIME, jpegQualityParam }: {
    outputMIME: 'image/png' | 'image/jpeg' | 'image/webp',
    jpegQualityParam?: number
}) {
    return new Promise<Blob>(async (resolve, reject) => {

        try {
            await tryReadABlob(fileOrBlob);
        } catch (err) {
            reject(errorBuilder('无法读取文件，原文件可能已被修改、移动或删除。', 'ImageFileUnreadable'));
            return;
        }

        const url = URL.createObjectURL(fileOrBlob);
        // try read...

        const img = new Image();
        img.src = url;
        img.onerror = (ev) => {
            reject(errorBuilder('浏览器无法解析此图片。可能是由于格式不受支持或图片文件损坏。', 'FormatNotSupportedByBrowser'));
        };
        img.onload = (ev) => {
            const { width, height } = {
                width: img.naturalWidth,
                height: img.naturalHeight
            };

            if (Math.min(width, height) <= 0) {
                reject(errorBuilder('无效的图形大小。', 'InvalidImageSize'));
                return;
            }

            if (Math.max(width, height) > CANVAS_MAX_IMG_SIZE) {
                reject(errorBuilder('图片尺寸过大。', 'ImageTooLarge'));
                return;
            }

            const canvas = document.createElement('canvas');
            canvas.height = height;
            canvas.width = width;
            const context = canvas.getContext('2d');
            if (!context) {
                reject(errorBuilder('Canvas 出错。', 'CanvasError'));
                return;
            }
            context.drawImage(img, 0, 0);
            try {
                canvas.toBlob((blob) => {
                    if (!blob) {
                        reject(errorBuilder('Canvas 导出图形时出错。', 'CanvasError'));
                        return;
                    }
                    resolve(blob);
                }, outputMIME, jpegQualityParam);
            } catch (err) {
                reject(errorBuilder('Canvas 导出图形时出错。' + err, 'CanvasError'));
                return;
            }
        };
    });
}