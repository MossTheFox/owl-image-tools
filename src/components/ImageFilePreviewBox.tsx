import { Box, BoxProps, Skeleton } from "@mui/material";
import { useState, useEffect, useCallback } from "react";
import { BrokenImage } from "@mui/icons-material"

export default function ImageFilePreviewBox(props: BoxProps & {
    file?: File | null,
    loading?: boolean,
    error?: boolean,
    draggable?: boolean,
    imageOnLoad?: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void,
    imageOnError?: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void
}) {

    const { file, draggable, error: shouldDisplayError, loading: shouldDisplayLoading,
        imageOnLoad: imageOnLoadCallback,
        imageOnError: imageOnErrorCallback,
        ...boxProps
    } = props;

    const [objectURL, setObjectURL] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(!!shouldDisplayError);  // May not catch the error object. Just record if it happened.

    useEffect(() => {
        if (file) {
            const url = URL.createObjectURL(file);
            setObjectURL(url);
            setLoading(false);
            return () => {
                URL.revokeObjectURL(url);
            }
        }
        if (shouldDisplayLoading) {
            setLoading(true);
            setError(false);
        }
        if (shouldDisplayError) {
            setError(true);
            setLoading(false);
        }
    }, [file, shouldDisplayError, shouldDisplayLoading]);

    const imageLoadError = useCallback((e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        setError(true);
        imageOnErrorCallback && imageOnErrorCallback(e);
    }, [imageOnErrorCallback]);

    const imageOnLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        setError(false);
        imageOnLoadCallback && imageOnLoadCallback(e);
    }, [imageOnLoadCallback]);


    return <Box
        display="flex"
        alignItems="stretch"
        justifyContent="stretch"
        border={1}
        borderColor="divider"
        // bgcolor={(theme) => theme.palette.action.selected}
        {...boxProps}>
        {loading && <Skeleton variant="rectangular" width="100%" height="auto" />}
        {!!file && !loading && !error && <Box width="100%" height="auto" display="flex" alignItems="center" justifyContent="center">

            <img alt={file.name} src={objectURL} style={{ maxWidth: '100%', maxHeight: '100%' }}
                loading="lazy"
                onError={imageLoadError}
                onLoad={imageOnLoad}
                draggable={!!draggable}
                decoding="async"
            />
        </Box>
        }
        {!loading && error && <Box width="100%" height="auto" display="flex" alignItems="center" justifyContent="center">
            <BrokenImage color="action" />
        </Box>}
    </Box>

}