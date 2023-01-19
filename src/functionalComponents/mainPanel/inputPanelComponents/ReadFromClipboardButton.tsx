import { ButtonProps, Button, Popover, Box, TextField, Typography } from "@mui/material";
import { ContentPaste } from "@mui/icons-material";
import { useCallback, useContext, useState, useRef, useMemo } from "react";
import { webkitFileListContext as _webkitFileListContext, fileListContext as _fileListContext } from "../../../context/fileListContext";
import { clipboardSupport } from "../../../utils/browserCompability";
import useAsync from "../../../hooks/useAsync";
import { checkIsMimeSupported, mimeToExt } from "../../../utils/imageMIMEs";
import { loggerContext } from "../../../context/loggerContext";


export default function ReadFromClipboardButton(props: ButtonProps) {
    const logger = useContext(loggerContext);
    const fileListContext = useContext(_fileListContext);
    const webkitFileListContext = useContext(_webkitFileListContext);

    const processing = useMemo(() => !fileListContext.ready || !webkitFileListContext.ready, [fileListContext.ready, webkitFileListContext.ready]);

    // From Clipboard (Async API)
    const asyncRequestReadClipboard = useCallback(async () => {
        if (!clipboardSupport) throw new Error('Not supported.');
        const items = await navigator.clipboard.read()
        if (!items.length) throw new Error('剪切板为空');
        const picArray: File[] = [];
        for (const item of items) {
            const imageType = item.types.find((v) => checkIsMimeSupported(v));
            if (!imageType || !mimeToExt(imageType)) continue;
            const file = await item.getType(imageType);
            picArray.push(new File([file], 'clipboard_image.' + mimeToExt(imageType), {
                type: imageType
            }));
        }
        if (picArray.length === 0) throw new Error('剪切板中没有有效的图片数据');
        return picArray;
    }, []);

    const readClipboardOnSuccess = useCallback((files: File[]) => {
        webkitFileListContext.appendFileList(files);
        logger.writeLine(`从剪切板读取了 ${files.length} 张图片。`)
    }, [webkitFileListContext.appendFileList, logger.writeLine]);

    const readClipboardOnError = useCallback((err: Error) => {
        console.log(err);
        // DOMExcention: Read permission denied.
        if (err instanceof DOMException) {
            logger.fireAlertSnackbar({
                severity: 'error',
                title: '读取剪切板出错',
                message: `${err.message}`
            });
            return;
        }
        // Custom Errors
        logger.fireAlertSnackbar({
            severity: 'warning',
            message: err.message
        })
    }, [logger.fireAlertSnackbar]);

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
            logger.fireAlertSnackbar({
                severity: 'warning',
                message: '剪切板中没有有效的图片数据'
            });
            return;
        }
        const imageFiles: File[] = [];
        for (const file of data.files) {
            if (checkIsMimeSupported(file.type)) {
                imageFiles.push(file);
            }
        }
        if (imageFiles.length === 0) {
            logger.fireAlertSnackbar({
                severity: 'warning',
                message: '剪切板中没有有效的图片数据'
            });
            return;
        }
        readClipboardOnSuccess(imageFiles);
    }, [readClipboardOnSuccess, logger.fireAlertSnackbar]);

    const resetTextField = useCallback(() => inputField.current && (inputField.current.value = ''), [inputField]);

    return <>
        <Button ref={anchorEl} startIcon={<ContentPaste />} variant="outlined"
            onClick={readClipboardButton}
            disabled={processing}
            sx={{ whiteSpace: 'nowrap' }}
            {...props}
        >
            从剪贴板读取
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
                    请在输入框中粘贴图片:
                </Typography>
                <TextField fullWidth autoComplete="off" inputRef={inputField} size="small" variant="standard"
                    onPaste={readFromPaste}
                    onChange={resetTextField}
                />
            </Box>
        </Popover>
    </>
}