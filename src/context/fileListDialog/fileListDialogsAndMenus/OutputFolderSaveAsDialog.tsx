import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, LinearProgress } from "@mui/material";
import { t } from "i18next";
import { useCallback, useEffect, useMemo, useState } from "react";
import ErrorBox from "../../../ui/smallComponents/ErrorBox";
import { getFileHandle, OutputTreeNode } from "../../outputFileListContext";

export default function OutputFolderSaveAsDialog(props: {
    onFinished: () => void,
    rootHandle: FileSystemDirectoryHandle,
    node: OutputTreeNode,
}) {

    const { onFinished, rootHandle, node } = props;
    const [open, setOpen] = useState(false);

    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState<Error | null>(null);

    const [logs, setLogs] = useState<string[]>([]);
    /** number of files ↓ */
    const [progress, setProgress] = useState(0);
    const [errorFileCount, setErrorFileCount] = useState(0);

    const handleClose = useCallback(() => {
        if (!loading) {
            setOpen(false);
        }
    }, [loading]);

    const handleAbort = useCallback(() => {
        onFinished();
    }, [onFinished]);

    useEffect(() => {
        if (!rootHandle || !node) {
            setOpen(false);
            return;
        }
        setOpen(true);
        setProgress(0);
        setErrorFileCount(0);
        setLogs([]);
        setLoading(true);
        setErr(null);
        // do the job
        let unmounted = false;

        async function rush() {
            const nodes = node.kind === 'file' ? [node] : node.flatChildrenFilesOnly;
            for (const one of nodes) {
                if (unmounted) {
                    import.meta.env.DEV && console.log('Save dialog discarded');
                    return;
                }

                if (one.kind !== 'file') {
                    continue;
                }

                if (!one.file) {
                    setProgress((prev) => prev + 1);
                    setLogs((prev) =>
                        [...prev,
                        t('ui.fileSaverDialog.skipInvalidFile', { name: one.name })
                        ]
                    );
                    setErrorFileCount((prev) => prev + 1);
                    continue;
                }

                // do the save
                // there is a thing: the node holds parent to the very top level of foler.
                // The third param helps control that.
                const handle = await getFileHandle(one, rootHandle, node.parent || undefined);
                const writable = await handle.createWritable({
                    keepExistingData: false
                });

                try {
                    await writable.write(one.file);
                    await writable.close();
                    if (unmounted) {
                        return;
                    }

                    setLogs((prev) =>
                        [...prev,
                        t('ui.fileSaverDialog.savedFile', { name: handle.name })
                        ]
                    );
                    setProgress((prev) => prev + 1);
                } catch (err) {
                    if (unmounted) {
                        return;
                    }
                    setProgress((prev) => prev + 1);
                    setLogs((prev) =>
                        [...prev,
                        t('ui.fileSaverDialog.failToLoadFileWithError', { name: one.name, msg: err + '' })
                        ]
                    );
                    setErrorFileCount((prev) => prev + 1);
                    continue;
                }
            }
        }

        rush().then(() => {
            if (!unmounted) {
                setLoading(false);
                setErr(null);
            }
        }).catch((err) => {
            if (!unmounted) {
                setErr(err);
                setLoading(false);
            }
        });

        return () => {
            unmounted = true;
        }
    }, [rootHandle, node]);

    const progressBarProgress = useMemo(() => {
        return 100 * progress / (node.kind === 'file' ? 1 : node.childrenCount);
    }, [node, progress]);


    return <Dialog maxWidth="sm" fullWidth open={open} onClose={handleClose}
        TransitionProps={{
            onExited: onFinished
        }}
    >
        <Box height={0} overflow="visible" sx={{
            transition: 'opacity 0.25s 0.5s',
            opacity: progressBarProgress >= 100 ? 0 : 1
        }}>
            <LinearProgress variant="determinate" value={progressBarProgress} />
        </Box>
        <DialogTitle fontWeight="bolder">
            {loading ? t('ui.fileSaverDialog.titleSavingFile') :
                err ? t('ui.fileSaverDialog.titleErrorOccurred') : t('ui.fileSaverDialog.titleSaveFinished')
            } {`${progress} / ${node.kind === 'file' ? 1 : node.childrenCount}`}
            {errorFileCount > 0 && ` ${t('ui.fileSaverDialog.skippedSomeFiles', { count: errorFileCount })}`}
        </DialogTitle>
        <DialogContent>
            {err && <Box pb={1}>
                <ErrorBox title={t('ui.fileSaverDialog.titleErrorOccurred')} message={err.message} />
            </Box>
            }
            {logs.map((v, i) =>
                <DialogContentText key={i}>
                    {v}
                </DialogContentText>
            )}
        </DialogContent>

        <DialogActions>
            <Button onClick={loading ? handleAbort : handleClose}>
                {loading ? t('commonWords.abort') : t('commonWords.finished')}
            </Button>
        </DialogActions>
    </Dialog>
}