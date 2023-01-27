import { Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText, Box, Button, DialogProps, useMediaQuery, Theme, Typography, IconButton, ButtonGroup } from "@mui/material";
import { Close, Download } from "@mui/icons-material";
import { useCallback, useState, useEffect, useMemo } from "react";
import ImageFilePreviewBox from "../../../components/ImageFilePreviewBox";
import { fireFileDownload, parseFileSizeString, tryReadABlob } from "../../../utils/randomUtils";
import { OutputTreeNode } from "../../outputFileListContext";

const VIEW_MODE = ['output', 'original', 'compare'] as const;

export default function OutputFileCompareDialog(props: DialogProps &
{
    node: OutputTreeNode,
}
) {

    const closeDialog = useCallback((e: React.MouseEvent) => {
        if (props.onClose) {
            props.onClose(e, 'escapeKeyDown');
        }
    }, [props.onClose]);

    const {
        node,
        ...dialogProps
    } = props;

    const smallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

    const downloadOutputFile = useCallback(() => {
        if (!node.file) return;
        fireFileDownload(node.file, node.name);
    }, [node]);

    const downloadOriginalFile = useCallback(() => {
        if (node.originalNode.data.kind !== 'file') return;
        fireFileDownload(node.originalNode.data.file, node.originalNode.data.file.name);
    }, [node]);

    // Validate file object itself
    const [canDownload, setCanDownload] = useState(false);
    const [canDownloadOriginal, setCanDownloadOriginal] = useState(false);
    const [pending, setPending] = useState(true);
    useEffect(() => {
        if (!dialogProps.open || !node.file) {
            return;
        }

        let unmounted = false;
        setPending(true);
        setCanDownload(false);
        setCanDownloadOriginal(false);

        (async () => {
            try {
                if (!node.file || node.originalNode.data.kind !== 'file') return;
                await tryReadABlob(node.file);
                if (!unmounted) {
                    setCanDownload(true);
                }
                await tryReadABlob(node.originalNode.data.file);
                if (!unmounted) {
                    setCanDownloadOriginal(true);
                }
            } catch (err) {
                import.meta.env.DEV && console.log(err);
            }
            if (!unmounted) {
                setPending(false);
            }

        })();
        return () => {
            unmounted = true;
        }
    }, [dialogProps.open, node]);

    // Check if the file can be read by the browser
    const [isImageDecodable, setIsImageDecodable] = useState(false);
    const [imageLoading, setImageLoading] = useState(true);
    const [imageSize, setImageSize] = useState('');

    useEffect(() => {
        if (dialogProps.open) {
            setImageSize('...');
            setImageLoading(true);
        }
    }, [dialogProps.open]);

    const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        if ('naturalWidth' in e.target && 'naturalHeight' in e.target) {
            setImageSize(`${e.target.naturalWidth} x ${e.target.naturalHeight}`);
        } else {
            setImageSize('获取失败');
        }
        setIsImageDecodable(true);
        setImageLoading(false);
    }, []);

    const onImageError = useCallback((e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        setImageSize('');
        setIsImageDecodable(false);
        setImageLoading(false);
    }, []);

    const [viewMode, setViewMode] = useState<'output' | 'original' | 'compare'>('output');
    const i18nViewMode = useMemo(() => {
        return ['输出', '原图', '对比'];
    }, []);

    return <>
        {!!node.file &&
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

                    <Box pb={1}>
                        <ButtonGroup fullWidth disableElevation variant="outlined" size="small">
                            {VIEW_MODE.map((v, i) =>
                                <Button key={v} variant={viewMode === v ? 'contained' : 'outlined'}
                                    onClick={() => setViewMode(v)}>
                                    {i18nViewMode[i]}
                                </Button>
                            )}
                        </ButtonGroup>
                    </Box>

                    {/* Preview */}
                    <Box flexGrow={1} pb={1} overflow="auto" display="flex" justifyContent="center">
                        <Box hidden={viewMode === 'original'}>
                            <ImageFilePreviewBox file={node.file} overflow="auto" width="100%" minHeight="3rem"
                                onLoad={onImageLoad}
                                onError={onImageError}
                            />
                        </Box>
                        <Box hidden={viewMode === 'output'}>
                            <ImageFilePreviewBox
                                file={node.originalNode.data.kind === 'file' ? node.originalNode.data.file : null}
                                overflow="auto" width="100%" minHeight="3rem"
                                onLoad={onImageLoad}
                            />
                        </Box>
                    </Box>

                    {/* Detail */}
                    <Box flexShrink={0} sx={{ overflowX: 'auto' }}>
                        {!pending && !canDownload &&
                            <DialogContentText gutterBottom fontWeight="bolder">
                                无法读取文件。原始文件可能已被修改、移动或删除。
                            </DialogContentText>
                        }

                        {!pending && canDownload && !imageLoading && !isImageDecodable &&
                            <DialogContentText gutterBottom fontWeight="bolder">
                                当前浏览器无法解码此图片。可能是格式不支持或文件损坏。
                            </DialogContentText>
                        }

                        <DialogContentText gutterBottom>
                            {node.name}
                        </DialogContentText>
                        <Box display='flex' gap={1}>

                            <DialogContentText gutterBottom component={"ul"} whiteSpace="nowrap">
                                {!!imageSize && (
                                    <DialogContentText component={"li"} whiteSpace="nowrap">
                                        {`尺寸: ${imageSize}`}
                                    </DialogContentText>
                                )}
                                <DialogContentText component={"li"} whiteSpace="nowrap">
                                    {`类型: ${node.file.type}`}
                                </DialogContentText>
                                <DialogContentText component={"li"} whiteSpace="nowrap">
                                    {`大小: ${parseFileSizeString(node.file.size, true)}`}
                                </DialogContentText>
                            </DialogContentText>

                            <DialogContentText gutterBottom component={"ul"} whiteSpace="nowrap">
                                {node.originalNode.data.kind === 'file' && <>
                                    <DialogContentText component={"li"} whiteSpace="nowrap">
                                        {`源文件大小: ${parseFileSizeString(node.originalNode.data.file.size, true)}`}
                                    </DialogContentText>
                                    <DialogContentText component={"li"} whiteSpace="nowrap">
                                        {`源文件类型: ${node.originalNode.data.file.type}`}
                                    </DialogContentText>
                                    <DialogContentText component={"li"} whiteSpace="nowrap">
                                        {`源文件修改日期: ${new Date(node.originalNode.data.file.lastModified).toLocaleString()}`}
                                    </DialogContentText>
                                </>
                                }
                            </DialogContentText>
                        </Box>
                    </Box>

                </DialogContent>
                <DialogActions sx={{ justifyContent: 'space-between' }}>
                    <Box display='flex' gap={1} flexWrap='wrap'>
                        <Button startIcon={<Download />} onClick={downloadOutputFile}
                            disabled={!canDownload || pending}
                        >
                            {pending && '正在确认'}
                            {!pending && canDownload && '下载输出文件'}
                            {!pending && !canDownload && '无法读取输出的文件'}
                        </Button>

                        <Button startIcon={<Download />} onClick={downloadOriginalFile}
                            disabled={!canDownloadOriginal || pending}
                        >
                            {pending && '正在确认'}
                            {!pending && canDownloadOriginal && '下载原始文件'}
                            {!pending && !canDownloadOriginal && '无法读取原始文件'}
                        </Button>
                    </Box>

                    <Button onClick={closeDialog}>
                        关闭
                    </Button>
                </DialogActions>
            </Dialog>
        }
    </>
}