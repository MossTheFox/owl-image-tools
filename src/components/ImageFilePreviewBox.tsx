import { Box, BoxProps, Skeleton } from "@mui/material";
import { useState, useEffect, useCallback } from "react";
import { BrokenImage } from "@mui/icons-material"

export default function ImageFilePreviewBox(props: BoxProps & { file: File, draggable?: boolean }) {

    const { file, draggable, ...boxProps } = props;

    const [objectUrl, setObjectUrl] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);  // May not catch the error object. Just record if it happened.

    useEffect(() => {
        const url = URL.createObjectURL(file);
        setObjectUrl(url);
        setLoading(false);
        return () => {
            URL.revokeObjectURL(url);
        }

    }, []);

    const imageLoadError = useCallback((e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        setError(true);
    }, []);

    const imageOnLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        setError(false);
    }, []);


    return <Box
        display="flex"
        alignItems="stretch"
        justifyContent="stretch"
        border={1}
        borderColor="divider"
        // bgcolor={(theme) => theme.palette.action.selected}
        {...boxProps}>
        {loading && <Skeleton variant="rectangular" width="100%" height="auto" />}
        {!loading && !error && <Box width="100%" height="auto" display="flex" alignItems="center" justifyContent="center">

            <img alt={file.name} src={objectUrl} style={{ maxWidth: '100%', maxHeight: '100%' }}
                loading="lazy"
                onError={imageLoadError}
                onLoad={imageOnLoad}
                draggable={!!draggable}
            />
        </Box>
        }
        {!loading && error && <Box width="100%" height="auto" display="flex" alignItems="center" justifyContent="center">
            <BrokenImage color="action" />
        </Box>}
    </Box>

}