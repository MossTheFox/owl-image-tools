import { Download } from "@mui/icons-material";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, LinearProgress, Typography } from "@mui/material";
import { t } from "i18next";
import { useCallback, useEffect, useState } from "react";
import useAsync from "../../../hooks/useAsync";
import ErrorBox from "../../../ui/smallComponents/ErrorBox";
import { fireFileDownload, parseDateStringThatCanBeUsedInFileName, parseFileSizeString } from "../../../utils/randomUtils";
import { createZipInMemory } from "../../../utils/zipTools";
import { OutputTreeNode } from "../../outputFileListContext";

export default function OutputFolderSaveZipDialog(props: {
    onFinished: () => void,
    nodes: OutputTreeNode[],
}) {

    const { onFinished, nodes } = props;
    const [open, setOpen] = useState(false);

    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState<Error | null>(null);

    const [resultBlob, setResultBlob] = useState<Blob | null>(null);
    const [blobName, setBlobName] = useState('what.zip');

    // download btn
    const downloadBlob = useCallback(() => {
        if (!resultBlob) return;
        fireFileDownload(resultBlob, blobName);
    }, [resultBlob, blobName]);

    /** 0 - 100 */
    const [progress, setProgress] = useState(0);

    const handleClose = useCallback(() => {
        if (!loading) {
            setOpen(false);
        }
    }, [loading]);

    // For some wtf reason JSZip doesn't allow abort.

    // um, forget it.

    const asyncStartGenerate = useCallback(async () => {
        setLoading(true);
        setErr(null);
        setProgress(0);
        return await createZipInMemory(nodes, setProgress);
    }, [nodes]);

    const onSuccess = useCallback((blob: Blob) => {
        setLoading(false);
        setErr(null);
        setResultBlob(blob);
        // in case for weird localeStrings, here...
        setBlobName(`image_${parseDateStringThatCanBeUsedInFileName()}.zip`);
    }, []);

    const onError = useCallback((err: Error) => {
        setLoading(false);
        setErr(err);
    }, [])

    const fireGenerate = useAsync(asyncStartGenerate, onSuccess, onError, false, -1);

    useEffect(() => {
        if (!nodes || nodes.length <= 0) {
            setOpen(false);
            return;
        }
        setOpen(true);
        fireGenerate();
    }, [nodes, fireGenerate]);


    return <Dialog maxWidth="sm" fullWidth open={open} onClose={handleClose}
        TransitionProps={{
            onExited: onFinished
        }}
    >
        <Box height={0} overflow="visible" sx={{
            transition: 'opacity 0.25s 0.5s',
            opacity: progress >= 100 ? 0 : 1
        }}>
            <LinearProgress variant="determinate" value={progress} />
        </Box>
        <DialogTitle fontWeight="bolder">
            {loading ? t('ui.fileSaverDialog.titleGeneratingZip') : (
                err ? t('ui.fileSaverDialog.titleErrorOccurred') : t('ui.fileSaverDialog.titleZipFinished')
            )} {progress < 100 ?
                <Typography component="span" fontFamily="var(--font-monospace)">
                    {`${progress.toFixed(2)}%`}
                </Typography>
                : ''}
        </DialogTitle>
        <DialogContent>
            {err && <Box pb={1}>
                <ErrorBox title={t('ui.fileSaverDialog.titleErrorOccurred')} message={err.message} />
            </Box>
            }
            {loading && !err && <>
                <DialogContentText>{t('ui.fileSaverDialog.holdAWhile')}</DialogContentText>
            </>}
            {!loading && !err && resultBlob && <>
                <DialogContentText gutterBottom>
                    {t('ui.fileSaverDialog.zipFileName')}: {blobName}
                </DialogContentText>
                <DialogContentText gutterBottom>
                    {t('ui.fileSaverDialog.zipFileSize')}: {parseFileSizeString(resultBlob.size, true)}
                </DialogContentText>
                <Box py={2}>
                    <Button variant="contained" fullWidth startIcon={<Download />}
                        onClick={downloadBlob}
                    >
                        {t('commonWords.download')} ({parseFileSizeString(resultBlob.size)})
                    </Button>
                </Box>

            </>}
        </DialogContent>

        <DialogActions>
            <Button onClick={handleClose} disabled={loading}>
                {loading ? t('commonWords.abort') : (err ? t('commonWords.cancel') : t('commonWords.finished'))}
            </Button>
        </DialogActions>
    </Dialog>
}