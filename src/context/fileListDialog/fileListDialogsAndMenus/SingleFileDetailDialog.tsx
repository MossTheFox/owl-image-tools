import { Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText, Box, Button, DialogProps, useMediaQuery, Theme, Typography, IconButton } from "@mui/material";
import { Close, Download } from "@mui/icons-material";
import { useCallback, useState, useEffect } from "react";
import ImageFilePreviewBox from "../../../components/ImageFilePreviewBox";
import { fireFileDownload, parseFileSizeString, tryReadABlob } from "../../../utils/randomUtils";
import { extToMime } from "../../../utils/imageMIMEs";
import { t } from "i18next";

export default function SingleFileDetailDialog(props: DialogProps &
{
    file: File,
}
) {

    const { onClose } = props;

    const closeDialog = useCallback((e: React.MouseEvent) => {
        if (onClose) {
            onClose(e, 'escapeKeyDown');
        }
    }, [onClose]);

    const {
        file,
        ...dialogProps
    } = props;

    const smallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

    const download = useCallback(() => {
        fireFileDownload(file, file.name);
    }, [file]);

    // Validate file object itself
    const [canDownload, setCanDownload] = useState(false);
    const [pending, setPending] = useState(true);
    useEffect(() => {
        if (!dialogProps.open || !file) {
            return;
        }

        let unmounted = false;
        setPending(true);
        setCanDownload(false);

        (async () => {
            try {
                await tryReadABlob(file);
                if (!unmounted) {
                    setCanDownload(true);
                }
            } catch (err) {
                import.meta.env.DEV && console.log(err);
                if (!unmounted) {
                    setCanDownload(false);
                }
            }
            if (!unmounted) {
                setPending(false);
            }

        })();
        return () => {
            unmounted = true;
        }
    }, [dialogProps.open, file]);

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
                    <Typography variant="h6" fontWeight="bolder">{t('title.fileDetail')}</Typography>
                    <IconButton color="primary" onClick={closeDialog} size="small"><Close /></IconButton>
                </DialogTitle>
                <DialogContent sx={{ position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'stretch' }}>

                    {/* Preview */}
                    <Box flexGrow={1} pb={1} overflow="auto" display="flex" justifyContent="center">
                        <ImageFilePreviewBox file={file} overflow="auto" width="100%" minHeight="3rem"
                            onLoad={onImageLoad}
                            onError={onImageError}
                        />
                    </Box>

                    {/* Detail */}
                    <Box flexShrink={0} sx={{ overflowX: 'auto' }}>
                        {!pending && !canDownload &&
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
                            {file.name}
                        </DialogContentText>
                        <DialogContentText gutterBottom component={"ul"} whiteSpace="nowrap">
                            {!!imageSize && (
                                <DialogContentText component={"li"} whiteSpace="nowrap">
                                    {`${t('ui.fileDetailDialog.imageSize')}: ${imageSize}`}
                                </DialogContentText>
                            )}
                            <DialogContentText component={"li"} whiteSpace="nowrap">
                                {`${t('ui.fileDetailDialog.imageFormat')}: ${file.type || extToMime(file.name)}`}
                            </DialogContentText>
                            <DialogContentText component={"li"} whiteSpace="nowrap">
                                {`${t('ui.fileDetailDialog.imageSize')}: ${parseFileSizeString(file.size, true)}`}
                            </DialogContentText>
                            <DialogContentText component={"li"} whiteSpace="nowrap">
                                {`${t('ui.fileDetailDialog.imageLastModified')}: ${new Date(file.lastModified).toLocaleString()}`}
                            </DialogContentText>
                        </DialogContentText>
                    </Box>

                </DialogContent>
                <DialogActions sx={{ justifyContent: 'space-between' }}>
                    <Button startIcon={<Download />} onClick={download}
                        disabled={!canDownload || pending}
                    >
                        {pending && t('ui.fileDetailDialog.pending')}
                        {!pending && canDownload && t('commonWords.download')}
                        {!pending && !canDownload && t('ui.fileDetailDialog.downloadButtonError')}
                    </Button>
                    <Button onClick={closeDialog}>
                        {t('commonWords.close')}
                    </Button>
                </DialogActions>
            </Dialog>
        }
    </>
}