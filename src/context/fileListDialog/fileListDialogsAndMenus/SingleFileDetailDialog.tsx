import { Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText, Box, Button, DialogProps, useMediaQuery, Theme, Typography, IconButton } from "@mui/material";
import { Close, Download } from "@mui/icons-material";
import { useCallback, useState, useEffect } from "react";
import ImageFilePreviewBox from "../../../components/ImageFilePreviewBox";
import { fireFileDownload, parseFileSizeString } from "../../../utils/randomUtils";

export default function SingleFileDetailDialog(props: DialogProps &
    ({
        file: File,
        // node: TreeNode<FileNodeData>,
        mode: 'FS'
    } | {
        file: File,
        // node: TreeNode<WebkitFileNodeData>,
        mode: 'no_FS'
    })
) {

    const closeDialog = useCallback((e: React.MouseEvent) => {
        if (props.onClose) {
            props.onClose(e, 'escapeKeyDown');
        }
    }, [props.onClose]);

    const {
        file,
        // node,
        mode,
        ...dialogProps
    } = props;

    const smallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

    const download = useCallback(() => {
        fireFileDownload(file, file.name);
    }, [file]);

    // Validate file object
    const [canDownload, setCanDownload] = useState(false);
    const [pending, setPending] = useState(true);
    useEffect(() => {
        let unmounted = false;
        setPending(true);
        setCanDownload(false);

        if (dialogProps.open && file) {
            (async () => {
                try {
                    const whatever = await file.stream().getReader().read();
                    if (!unmounted) {
                        setCanDownload(true);
                    }
                } catch (err) {
                    console.log(err);
                    if (!unmounted) {
                        setCanDownload(false);
                    }
                }
                if (!unmounted) {
                    setPending(false);
                }

            })();
        }
        return () => {
            unmounted = true;
        }
    }, [dialogProps.open, file]);

    return <>
        {!!file &&
            <Dialog fullWidth maxWidth="md" fullScreen={smallScreen} {...dialogProps}>
                <DialogTitle fontWeight="bolder" component="div"
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}
                >
                    <Typography variant="h6" fontWeight="bolder">文件信息</Typography>
                    {smallScreen &&
                        <IconButton color="primary" onClick={closeDialog} size="small"><Close /></IconButton>
                    }
                </DialogTitle>
                <DialogContent sx={{ position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'stretch' }}>

                    {/* Preview */}
                    <Box flexGrow={1} p={1} overflow="auto" display="flex" justifyContent="center">
                        <ImageFilePreviewBox file={file} overflow="auto" width="100%" minHeight="3rem" />
                    </Box>

                    {/* Detail */}
                    <Box flexShrink={0} sx={{ overflowX: 'auto' }}>
                        {!pending && !canDownload &&
                            <DialogContentText gutterBottom fontWeight="bolder">
                                无法读取文件。原始文件可能已被修改、移动或删除。
                            </DialogContentText>
                        }

                        <DialogContentText gutterBottom>
                            {file.name}
                        </DialogContentText>
                        <DialogContentText gutterBottom component={"ul"} whiteSpace="nowrap">
                            <DialogContentText component={"li"} whiteSpace="nowrap">
                                {`类型: ${file.type}`}
                            </DialogContentText>
                            <DialogContentText component={"li"} whiteSpace="nowrap">
                                {`文件大小: ${parseFileSizeString(file.size, true)}`}
                            </DialogContentText>
                            <DialogContentText component={"li"} whiteSpace="nowrap">
                                {`修改日期: ${new Date(file.lastModified).toLocaleString()}`}
                            </DialogContentText>
                        </DialogContentText>
                    </Box>

                </DialogContent>
                <DialogActions sx={{ justifyContent: 'space-between' }}>
                    <Button startIcon={<Download />} onClick={download}
                        disabled={!canDownload || pending}
                    >
                        {pending && '正在确认'}
                        {!pending && canDownload && '下载'}
                        {!pending && !canDownload && '无法读取文件'}
                    </Button>
                    <Button onClick={closeDialog}>
                        关闭
                    </Button>
                </DialogActions>
            </Dialog>
        }
    </>
}