import { Box, Button, Typography, Grid, GridProps, Popover } from "@mui/material";
import { useCallback, useRef, useContext, useMemo, useState } from "react";
import { FolderOpen, Image as ImageIcon } from '@mui/icons-material';
import { FS_Mode, isMobileBrowser, isWebkit } from "../../../utils/browserCompability";
import { fileListContext as _fileListContext, webkitFileListContext } from "../../../context/fileListContext";
import useAsync from "../../../hooks/useAsync";
import { appConfigContext } from "../../../context/appConfigContext";
import { t } from "i18next";
import { MarkdownRenderer, MarkdownRendererDialogContentText } from "../../../utils/mdRenderer";
import QuickDialog from "../../../components/styledComponents/QuickDialog";

export default function SelectLocalFileButtonRow(props: GridProps) {
    const { appendInputFsHandles, ready: iterateDirReady } = useContext(_fileListContext);
    const { ready, appendFileList } = useContext(webkitFileListContext);

    const processing = useMemo(() => !iterateDirReady || !ready, [iterateDirReady, ready]);

    // Case 1: window.showDirectoryPicker
    const asyncRequestOpenFolder = useCallback(async () => {
        return await window.showDirectoryPicker({
            id: 'img-open-folder'
        });
    }, []);

    const requestOpenFolderOnSuccess = useCallback((result: FileSystemDirectoryHandle) => {
        appendInputFsHandles([result])
    }, [appendInputFsHandles]);

    const requestOpenFolderOnError = useCallback((err: Error) => {
        // ignore?
    }, []);

    const fireRequestDir = useAsync(asyncRequestOpenFolder, requestOpenFolderOnSuccess, requestOpenFolderOnError);

    // Case 2: Directory Picker
    const fileInputRef = useRef<HTMLInputElement>(null);
    const directoryInputRef = useRef<HTMLInputElement>(null);
    const webkitDirectoryPickerButton = useRef<HTMLButtonElement>(null);

    const { siteConfig, setTipDisplay } = useContext(appConfigContext);
    const [notifyPopperOpen, setNotifyPopperOpen] = useState(false);
    const closeNotify = useCallback(() => {
        setNotifyPopperOpen(false);
    }, []);

    // -- Mobile devices directory picker not supported, show tip dialog --
    const [dirPickerNotSupportedDialogOpen, setDirPickerNotSupportedDialogOpen] = useState(false);

    const webkitDirectoryNotSupported = useCallback(() => {
        if (!siteConfig.tipDisplay['webkitDirectoryNotSupported']) return;
        setDirPickerNotSupportedDialogOpen(true);
    }, [siteConfig.tipDisplay]);
    // -- end dir picker not supported tip dialog --

    const openFilePicker = useCallback(() => fileInputRef.current?.click(), [fileInputRef]);
    const openWebkitDirectoryPicker = useCallback(() => {
        setNotifyPopperOpen(false);
        setTipDisplay('webkitOpenDirectory', false);
        directoryInputRef.current?.click();
    }, [directoryInputRef, setTipDisplay]);

    const openWebkitDirectoryPickerButton = useCallback(() => {
        // ↓ show the tip here
        if (isMobileBrowser && siteConfig.tipDisplay['webkitDirectoryNotSupported']) {
            webkitDirectoryNotSupported();
            return;
        } else {
            if (siteConfig.tipDisplay['webkitOpenDirectory']) {
                setNotifyPopperOpen(true);
                return;
            }
        }
        openWebkitDirectoryPicker();
    }, [openWebkitDirectoryPicker, siteConfig.tipDisplay, webkitDirectoryNotSupported]);

    // The dialog callbacks
    const closeDirPickerNotSupportedDialog = useCallback(() => {
        setDirPickerNotSupportedDialogOpen(false);
        openWebkitDirectoryPicker();
    }, [openWebkitDirectoryPicker]);

    const dirPickerNotSupportedDialogCloseAndDontShowAgain = useCallback(() => {
        setTipDisplay('webkitDirectoryNotSupported', false);
        closeDirPickerNotSupportedDialog();
    }, [setTipDisplay, closeDirPickerNotSupportedDialog]);

    // End the dialog callbacks

    const handleMultipleImageInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.currentTarget.files;
        if (!files || !files.length) return;
        appendFileList(files);
        e.target.value = '';    // ← if don't do so, picking the same file again won't fire onChange
    }, [appendFileList]);

    const handleWebkitDirectoryInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.currentTarget.files;
        if (!files || !files.length) return;
        appendFileList(files, true);
        e.target.value = '';    // ← if don't do so, picking the same file again won't fire onChange
    }, [appendFileList])

    return <Grid container {...props}>

        <QuickDialog open={dirPickerNotSupportedDialogOpen} onClose={closeDirPickerNotSupportedDialog}
            title={t('title.directoryPickerNotSupported')}
            content={
                <MarkdownRendererDialogContentText md={t('content.directoryPickerNotSupported')
                    + (isWebkit && isMobileBrowser ? (t('content.directoryPickerNotSupportedIOS')) : '')
                } />
            }
            keepCloseButton
            actions={
                <Button onClick={dirPickerNotSupportedDialogCloseAndDontShowAgain}>
                    {t('button.dontShowAgain')}
                </Button>
            }
        />

        <Grid item xs={6} pr={0.5}>
            <Button fullWidth startIcon={<ImageIcon />} onClick={openFilePicker} variant="outlined"
                disabled={processing}
                sx={{ whiteSpace: 'nowrap' }}
            >
                {t('button.selectFiles')}
            </Button>
            <input ref={fileInputRef} type='file' accept="image/*" multiple hidden
                name="image-selection-multiple"
                onChange={handleMultipleImageInput}
            />
        </Grid>
        <Grid item xs={6} pl={0.5}>
            {FS_Mode === 'publicFS' ?
                <Button fullWidth startIcon={<FolderOpen />} onClick={fireRequestDir} variant="outlined"
                    disabled={processing}
                    sx={{ whiteSpace: 'nowrap' }}
                >
                    {t('button.selectDirectory')}
                </Button>
                :
                <>
                    {/* @ts-expect-error: webkitdirectory property is not marked as valid tag for react. (It's also unusable for mobile browsers.) */}
                    <input ref={directoryInputRef} type='file' webkitdirectory="1"
                        hidden

                        // ↓ For mobile browsers...
                        multiple
                        accept="image/*"

                        name="image-dir-selection"
                        onChange={handleWebkitDirectoryInput}
                    />

                    <Button fullWidth startIcon={<FolderOpen />} variant="outlined"
                        disabled={processing}
                        onClick={openWebkitDirectoryPickerButton}
                        sx={{ whiteSpace: 'nowrap' }}
                        ref={webkitDirectoryPickerButton}
                    >
                        {t('button.selectWebkitDirectory')}
                    </Button>
                    <Popover open={notifyPopperOpen} onClose={closeNotify}
                        anchorEl={webkitDirectoryPickerButton.current}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left'
                        }}
                    >
                        <Box p={2} display="flex" flexDirection="column" alignItems="left">
                            <Box>
                                <MarkdownRenderer typographyProps={{
                                    color: 'text.secondary',
                                    variant: 'body2'
                                }}
                                    md={t('ui.inputPanel.webkitDirectoryPickerTip')}
                                />
                            </Box>
                            {isMobileBrowser && <Box pt={1}>
                                <MarkdownRenderer typographyProps={{
                                    color: 'text.secondary',
                                    variant: 'body2'
                                }}
                                    md={t('ui.inputPanel.webkitDirectoryPickerTipMobile')}
                                />
                            </Box>}
                            <Box display="flex" justifyContent="end">
                                <Button onClick={openWebkitDirectoryPicker}>
                                    {t('button.okAndDontShowAgain')}
                                </Button>
                            </Box>
                        </Box>
                    </Popover>
                </>
            }
        </Grid>
    </Grid>;
}