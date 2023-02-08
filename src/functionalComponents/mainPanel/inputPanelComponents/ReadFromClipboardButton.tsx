import { ButtonProps, Button, Popover, Box, TextField, Typography } from "@mui/material";
import { ContentPaste } from "@mui/icons-material";
import { useCallback, useContext, useState, useRef, useMemo } from "react";
import { webkitFileListContext as _webkitFileListContext, fileListContext as _fileListContext } from "../../../context/fileListContext";
import { clipboardSupport } from "../../../utils/browserCompability";
import useAsync from "../../../hooks/useAsync";
import { checkIsMimeSupported, extToMime, mimeToExt } from "../../../utils/imageMIMEs";
import { loggerContext } from "../../../context/loggerContext";
import { t } from "i18next";


export default function ReadFromClipboardButton(props: ButtonProps) {
    const { writeLine, fireAlertSnackbar } = useContext(loggerContext);
    const { ready: iterateDirReady } = useContext(_fileListContext);
    const { appendFileList, ready } = useContext(_webkitFileListContext);

    const processing = useMemo(() => !iterateDirReady || !ready, [iterateDirReady, ready]);

    // From Clipboard (Async API)
    const asyncRequestReadClipboard = useCallback(async () => {
        if (!clipboardSupport) throw new Error('Not supported.');
        const items = await navigator.clipboard.read()
        if (!items.length) throw new Error(t('errorMessage.clipboardEmpty'));
        const picArray: File[] = [];
        for (const item of items) {
            const imageType = item.types.find((v) => checkIsMimeSupported(v));
            if (!imageType || !mimeToExt(imageType)) continue;
            const file = await item.getType(imageType);
            picArray.push(new File([file], 'clipboard_image.' + mimeToExt(imageType), {
                type: imageType
            }));
        }
        if (picArray.length === 0) throw new Error(t('errorMessage.noImageFoundFromClipboard'));
        return picArray;
    }, []);

    const readClipboardOnSuccess = useCallback((files: File[]) => {
        appendFileList(files);
        const log = t('logger.readFromClipboard', { length: files.length });
        writeLine(log);
        fireAlertSnackbar({
            severity: 'success',
            message: log
        }, 3000);
    }, [appendFileList, writeLine, fireAlertSnackbar]);

    const readClipboardOnError = useCallback((err: Error) => {
        import.meta.env.DEV && console.log(err);
        // DOMExcention: Read permission denied.
        if (err instanceof DOMException) {
            fireAlertSnackbar({
                severity: 'error',
                title: t('errorMessage.failToReadClipboard'),
                message: `${err.message}`
            });
            return;
        }
        // Custom Errors
        fireAlertSnackbar({
            severity: 'warning',
            message: err.message
        })
    }, [fireAlertSnackbar]);

    const fireRequestClipboard = useAsync(asyncRequestReadClipboard, readClipboardOnSuccess, readClipboardOnError);

    // From Inputfield Paste
    const [popoverOpen, setPopoverOpen] = useState(false);
    const closePopover = useCallback(() => setPopoverOpen(false), []);
    const anchorEl = useRef<HTMLButtonElement>(null);
    const inputField = useRef<HTMLInputElement>(null);

    const readClipboardButton = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        if (clipboardSupport) {
            fireRequestClipboard();
        } else {
            setPopoverOpen(true);
        }
    }, [fireRequestClipboard]);

    const focus = useCallback(() => {
        if (popoverOpen && inputField.current) {
            inputField.current.focus();
        }
    }, [inputField, popoverOpen]);

    const readFromPaste = useCallback((e: React.ClipboardEvent<HTMLDivElement>) => {
        e.preventDefault();
        const data = e.clipboardData;
        if (!data || data.files.length === 0) {
            fireAlertSnackbar({
                severity: 'warning',
                message: t('errorMessage.noImageFoundFromClipboard')
            });
            return;
        }
        const imageFiles: File[] = [];
        for (const file of data.files) {
            if (checkIsMimeSupported(file.type || extToMime(file.name))) {
                imageFiles.push(file);
            }
        }
        if (imageFiles.length === 0) {
            fireAlertSnackbar({
                severity: 'warning',
                message: t('errorMessage.noImageFoundFromClipboard')
            });
            return;
        }
        readClipboardOnSuccess(imageFiles);
    }, [readClipboardOnSuccess, fireAlertSnackbar]);

    const resetTextField = useCallback(() => inputField.current && (inputField.current.value = ''), [inputField]);

    return <>
        <Button ref={anchorEl} startIcon={<ContentPaste />} variant="outlined"
            onClick={readClipboardButton}
            disabled={processing}
            sx={{ whiteSpace: 'nowrap' }}
            {...props}
        >
            {t('button.readFromClipboard')}
        </Button>
        <Popover open={popoverOpen} onClose={closePopover} anchorEl={anchorEl.current}
            anchorOrigin={{
                horizontal: 'left',
                vertical: 'bottom'
            }}
            onAnimationEnd={focus}
        >
            <Box p={2}>
                <Typography variant="body1" gutterBottom>
                    {t('ui.readFromClipboardInputPopup')}
                </Typography>
                <TextField fullWidth autoComplete="off" inputRef={inputField} size="small" variant="standard"
                    onPaste={readFromPaste}
                    onChange={resetTextField}
                />
            </Box>
        </Popover>
    </>
}