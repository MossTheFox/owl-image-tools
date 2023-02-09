import { t } from "i18next";
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
export async function convertViaCanvas(fileOrBlob: File | Blob, { outputMIME, jpegQualityParam, background }: {
    outputMIME: 'image/png' | 'image/jpeg' | 'image/webp',
    jpegQualityParam?: number,
    background?: string,
}) {
    try {
        await tryReadABlob(fileOrBlob);
    } catch (err) {
        throw errorBuilder(t('errorMessage.cannotReadFileBuffer'), 'ImageFileUnreadable');
    }
    return await new Promise<Blob>((resolve, reject) => {
        const url = URL.createObjectURL(fileOrBlob);
        // try read...

        const img = new Image();
        img.src = url;
        img.onerror = (ev) => {
            reject(errorBuilder(t('errorMessage.browserDecodingFailed'), 'FormatNotSupportedByBrowser'));
        };
        img.onload = (ev) => {
            const { width, height } = {
                width: img.naturalWidth,
                height: img.naturalHeight
            };

            if (Math.min(width, height) <= 0) {
                reject(errorBuilder(t('errorMessage.canvasConverter.invalidImageSize'), 'InvalidImageSize'));
                return;
            }

            if (Math.max(width, height) > CANVAS_MAX_IMG_SIZE) {
                reject(errorBuilder(t('errorMessage.canvasConverter.imageSizeTooLarge'), 'ImageTooLarge'));
                return;
            }

            const canvas = document.createElement('canvas');
            canvas.height = height;
            canvas.width = width;
            const context = canvas.getContext('2d');
            if (!context) {
                reject(errorBuilder(t('errorMessage.canvasConverter.canvasError'), 'CanvasError'));
                return;
            }
            if (background) {
                context.fillStyle = background;
                context.fillRect(0, 0, width, height);
            }
            context.drawImage(img, 0, 0);
            try {
                canvas.toBlob((blob) => {
                    if (!blob) {
                        reject(errorBuilder(t('errorMessage.canvasConverter.canvasFailToExport'), 'CanvasError'));
                        return;
                    }
                    resolve(blob);
                }, outputMIME, jpegQualityParam);
            } catch (err) {
                reject(errorBuilder(t('errorMessage.canvasConverter.canvasFailToExport') + err, 'CanvasError'));
                return;
            }
        };
    });
}