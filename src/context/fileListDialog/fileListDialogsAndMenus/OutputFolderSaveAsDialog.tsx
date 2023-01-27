import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogProps, DialogTitle } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
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
    const [progress, setProgress] = useState(0);

    const handleClose = useCallback(() => {
        if (!loading) {
            setOpen(false);
            onFinished();
        }
    }, [onFinished, loading]);

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
                    setLogs((prev) => [...prev,
                    `跳过无效的文件: ${one.name}`
                    ]);
                    continue;
                }

                // do the save
                // there is a thing: the node holds parent to the very top level of foler.
                // The third param helps control that.
                const handle = await getFileHandle(one, rootHandle, node.parent || undefined);
                const writable = await handle.createWritable({
                    keepExistingData: false
                });
                await writable.write(one.file);
                await writable.close();

                if (unmounted) {
                    return;
                }

                setLogs((prev) => [...prev,
                `已保存文件: ${handle.name}`
                ]);
                setProgress((prev) => prev + 1);
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


    return <Dialog maxWidth="sm" fullWidth open={open} onClose={handleClose}>
        <DialogTitle fontWeight="bolder">
            {loading ? '正在保存文件' : '文件存储完毕'} {`${progress} / ${node.kind === 'file' ? 1 : node.childrenCount}`}
        </DialogTitle>
        <DialogContent>
            {err && <Box pb={1}>
                <ErrorBox title="发生错误" message={err.message} />
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
                {loading ? '终止' : '完成'}
            </Button>
        </DialogActions>
    </Dialog>
}