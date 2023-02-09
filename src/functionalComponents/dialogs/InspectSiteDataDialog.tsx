import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogProps, DialogTitle, Divider } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import useAsync from "../../hooks/useAsync";
import { FS_Mode, serviceWorkerSupport, storageDisabled } from "../../utils/browserCompability";
import { estimateStorageUsage, parseFileSizeString } from "../../utils/randomUtils";
import { clearAllTempFolders } from "../../utils/privateFS";
import { t } from "i18next";
import { MarkdownRendererDialogContentText } from "../../utils/mdRenderer";

export default function InspectSiteDataDialog(props: DialogProps) {

    const { open, onClose } = props;

    const btnHandleClose = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        onClose && onClose(e, 'escapeKeyDown');
    }, [onClose])


    const [text, setText] = useState('...');

    const onResolved = useCallback((data: Awaited<ReturnType<typeof estimateStorageUsage>>) => {
        if (data.result === 'error') {
            switch (data.reason) {
                case 'NotSupportError':
                    setText(t('content.inspectSiteDataDialog.notSupportError'));
                    break;
                default:
                    setText(t('errorMessage.unknownError') + (data.err ? ` ${data.err}` : ''));
            }
            return;
        }
        setText(`${t('content.inspectSiteDataDialog.available')
            }: ${parseFileSizeString(data.available)}; ${t('content.inspectSiteDataDialog.used')
            }: ${parseFileSizeString(data.used, true)}`);
    }, [])

    const fireFetch = useAsync(estimateStorageUsage, onResolved);


    const [localStorageSize, setLocalStorageSize] = useState(storageDisabled ? 0 : localStorage.length)

    useEffect(() => {
        if (open) {
            fireFetch();
        }
        setLocalStorageSize(storageDisabled ? 0 : localStorage.length);
    }, [open, fireFetch]);

    const clearLocalStorage = useCallback(() => {
        localStorage.clear();
        setLocalStorageSize(0);
        setText('...');
        fireFetch();
    }, [fireFetch]);

    useEffect(() => {
        if (!props.open) return;

        const fn = (e: StorageEvent) => {
            if (e.storageArea) {
                setLocalStorageSize(e.storageArea.length);
            }
        };

        window.addEventListener('storage', fn);

        return () => {
            window.removeEventListener('storage', fn)
        }
    }, [props.open]);

    const [opfsBtnDisabled, setOPFSBtnDisabled] = useState(false);

    const asyncClearOPFS = useCallback(async () => {
        setOPFSBtnDisabled(true);
        setText('...');
        await clearAllTempFolders(true);
    }, []);

    const onOPFSOK = useCallback(() => {
        setOPFSBtnDisabled(false);
        fireFetch();
    }, [fireFetch]);

    const onOPFSErr = useCallback((err: Error) => {
        setText(t('errorMessage.errorOccurredWithMsg', { msg: err?.message }));
        setOPFSBtnDisabled(false);
    }, []);

    const fireOPFS = useAsync(asyncClearOPFS, onOPFSOK, onOPFSErr);

    const [cacheBtnDisabled, setCacheBtnDisabled] = useState(false);

    const asyncClearCacheStorage = useCallback(async () => {
        setText('...');
        setCacheBtnDisabled(true);
        const keys = await caches.keys();
        for (const key of keys) {
            await caches.delete(key);
        }
    }, []);

    const onCacheClearOK = useCallback(() => {
        setCacheBtnDisabled(false);
        fireFetch();
    }, [fireFetch]);

    const onCacheClearError = useCallback((err: Error) => {
        setCacheBtnDisabled(false);
        setText(t('errorMessage.errorOccurredWithMsg', { msg: err?.message }));
    }, []);

    const fireCacheClear = useAsync(asyncClearCacheStorage, onCacheClearOK, onCacheClearError);

    const [removeSWBtnDisabled, setRemoveSWBtnDisabled] = useState(false);

    const asyncRemoveSW = useCallback(async () => {
        setText('...');
        setRemoveSWBtnDisabled(true);
        const all = await navigator.serviceWorker.getRegistrations();
        for (const sw of all) {
            await sw.unregister();
        }
    }, []);

    const onRemoveSWOK = useCallback(() => {
        setRemoveSWBtnDisabled(false);
        fireFetch();
    }, [fireFetch]);

    const onRemoveSWErr = useCallback((err: Error) => {
        setRemoveSWBtnDisabled(false);
        setText(t('errorMessage.errorOccurredWithMsg', { msg: err?.message }));
    }, []);

    const fireRemoveSW = useAsync(asyncRemoveSW, onRemoveSWOK, onRemoveSWErr);

    return <Dialog maxWidth="sm" fullWidth {...props}>
        <DialogTitle fontWeight="bolder">
            {t('title.inspectSiteData')}
        </DialogTitle>
        <DialogContent>
            <MarkdownRendererDialogContentText md={t('content.inspectSiteDataDialog.main')} />
            <DialogContentText gutterBottom>
                {text}
            </DialogContentText>
            <MarkdownRendererDialogContentText md={t('content.inspectSiteDataDialog.secondary')}
                typographyProps={{
                    variant: 'body2'
                }}
            />
            <Divider />
            <Box display='flex' flexDirection="column" gap={1} pt={1}>

                {!storageDisabled && <>
                    <Button variant="outlined" size="small" color="warning"
                        disabled={localStorageSize === 0}
                        onClick={clearLocalStorage}
                    >
                        {localStorageSize > 0 ?
                            t('content.inspectSiteDataDialog.clearLocalStorage') :
                            t('content.inspectSiteDataDialog.localStorageEmpty')}
                    </Button>
                    <MarkdownRendererDialogContentText md={t('content.inspectSiteDataDialog.clearLocalStorageTip')}
                        typographyProps={{
                            variant: 'body2'
                        }}
                    />
                </>
                }

                {serviceWorkerSupport && <>
                    <Button variant="outlined" size="small" color="warning"
                        disabled={cacheBtnDisabled}
                        onClick={fireCacheClear}
                    >
                        {t('content.inspectSiteDataDialog.clearCacheStorage')}
                    </Button>
                    <MarkdownRendererDialogContentText
                        md={t('content.inspectSiteDataDialog.cleatCacheStorageTip')}
                        typographyProps={{
                            variant: 'body2'
                        }}
                    />

                    <Button variant="outlined" size="small" color="warning"
                        disabled={removeSWBtnDisabled}
                        onClick={fireRemoveSW}
                    >
                        {t('content.inspectSiteDataDialog.unregisterSW')}
                    </Button>
                    <MarkdownRendererDialogContentText
                        md={t('content.inspectSiteDataDialog.unregisterSWTip')}
                        typographyProps={{
                            variant: 'body2'
                        }}
                    />
                </>
                }

                {FS_Mode !== 'noFS' && <>
                    <Button variant="outlined" size="small" color="warning"
                        disabled={opfsBtnDisabled}
                        onClick={fireOPFS}
                    >
                        {t('content.inspectSiteDataDialog.clearOPFS')}
                    </Button>

                    <MarkdownRendererDialogContentText md={t('content.inspectSiteDataDialog.clearOPFSTip')}
                        typographyProps={{
                            variant: 'body2'
                        }}
                    />
                </>
                }

            </Box>


        </DialogContent>
        <DialogActions>
            <Button onClick={btnHandleClose}>
                {t('commonWords.close')}
            </Button>
        </DialogActions>
    </Dialog>
}