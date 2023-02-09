import { Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText, Box, Button, DialogProps, useMediaQuery, Theme, Typography, IconButton, ButtonGroup } from "@mui/material";
import { Close, Download } from "@mui/icons-material";
import { useCallback, useState, useEffect, useMemo } from "react";
import ImageFilePreviewBox from "../../../components/ImageFilePreviewBox";
import { fireFileDownload, parseFileSizeString, tryReadABlob } from "../../../utils/randomUtils";
import { OutputTreeNode } from "../../outputFileListContext";
import { extToMime } from "../../../utils/imageMIMEs";
import { t } from "i18next";

const VIEW_MODE = ['output', 'original', 'compare'] as const;

export default function OutputFileCompareDialog(props: DialogProps &
{
    node: OutputTreeNode,
    cleanupFn: () => void,
}
) {

    const { onClose } = props;

    const closeDialog = useCallback((e: React.MouseEvent) => {
        if (onClose) {
            onClose(e, 'escapeKeyDown');
        }
    }, [onClose]);

    const {
        node,
        cleanupFn,
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
            } catch (err) {
                import.meta.env.DEV && console.log(err);
            }
            try {
                if (!node.file || node.originalNode.data.kind !== 'file') return;
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
            setImageSize(t('ui.fileDetailDialog.failToGetData'));
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
        return [t('ui.fileDetailDialog.output'), t('ui.fileDetailDialog.original'), t('ui.fileDetailDialog.comparison')];
    }, []);

    return <>
        {!!node.file &&
            <Dialog fullWidth maxWidth="md" fullScreen={smallScreen} {...dialogProps}
                TransitionProps={{
                    onExited: cleanupFn
                }}
            >
                <DialogTitle fontWeight="bolder" component="div"
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}
                >
                    <Typography variant="h6" fontWeight="bolder">{t('title.fileDetail')}</Typography>
                    <IconButton color="primary" onClick={closeDialog} size="small"><Close /></IconButton>
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
                        {!pending && (!canDownload || !canDownloadOriginal) &&
                            <DialogContentText gutterBottom fontWeight="bolder">
                                {t('ui.fileDetailDialog.fileBufferUnreadableError')}
                            </DialogContentText>
                        }

                        {!pending && canDownload && !imageLoading && !isImageDecodable &&
                            <DialogContentText gutterBottom fontWeight="bolder">
                                {t('ui.fileDetailDialog.browserFailToDecodeImageError')}
                            </DialogContentText>
                        }

                        <DialogContentText gutterBottom>
                            {node.name}
                        </DialogContentText>
                        <Box display='flex' gap={1}>

                            <DialogContentText gutterBottom component={"ul"} whiteSpace="nowrap">
                                {!!imageSize && (
                                    <DialogContentText component={"li"} whiteSpace="nowrap">
                                        {`${t('ui.fileDetailDialog.imageResolution')}: ${imageSize}`}
                                    </DialogContentText>
                                )}
                                <DialogContentText component={"li"} whiteSpace="nowrap">
                                    {`${t('ui.fileDetailDialog.imageFormat')}: ${node.file.type || extToMime(node.name)}`}
                                </DialogContentText>
                                <DialogContentText component={"li"} whiteSpace="nowrap">
                                    {`${t('ui.fileDetailDialog.imageSize')}: ${parseFileSizeString(node.file.size, true)}`}
                                </DialogContentText>
                            </DialogContentText>

                            <DialogContentText gutterBottom component={"ul"} whiteSpace="nowrap">
                                {node.originalNode.data.kind === 'file' && <>
                                    <DialogContentText component={"li"} whiteSpace="nowrap">
                                        {`${t('ui.fileDetailDialog.originalImageSize')}: ${parseFileSizeString(node.originalNode.data.file.size, true)}`}
                                    </DialogContentText>
                                    <DialogContentText component={"li"} whiteSpace="nowrap">
                                        {`${t('ui.fileDetailDialog.originalImageFormat')}: ${node.originalNode.data.file.type || extToMime(node.originalNode.data.file.name)}`}
                                    </DialogContentText>
                                    <DialogContentText component={"li"} whiteSpace="nowrap">
                                        {`${t('ui.fileDetailDialog.originalImageLastModified')}: ${new Date(node.originalNode.data.file.lastModified).toLocaleString()}`}
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
                            {pending && t('ui.fileDetailDialog.pending')}
                            {!pending && canDownload && t('ui.fileDetailDialog.downloadOutputFileButton')}
                            {!pending && !canDownload && t('ui.fileDetailDialog.downloadOutputFileButtonError')}
                        </Button>

                        <Button startIcon={<Download />} onClick={downloadOriginalFile}
                            disabled={!canDownloadOriginal || pending}
                        >
                            {pending && t('ui.fileDetailDialog.pending')}
                            {!pending && canDownloadOriginal && t('ui.fileDetailDialog.downloadOriginalFileButton')}
                            {!pending && !canDownloadOriginal && t('ui.fileDetailDialog.downloadOriginalFileButtonError')}
                        </Button>
                    </Box>

                    <Button onClick={closeDialog}>
                        {t('commonWords.close')}
                    </Button>
                </DialogActions>
            </Dialog>
        }
    </>
}