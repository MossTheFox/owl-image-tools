import { Box, BoxProps, Skeleton } from "@mui/material";
import { useState, useEffect, useCallback } from "react";
import { BrokenImage } from "@mui/icons-material"

export default function ImageFilePreviewBox(props: BoxProps & { file: File }) {

    const { file, ...boxProps } = props;

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


    return <Box {...boxProps}>
        {loading && <Skeleton variant="rectangular" width="100%" />}
        {!loading && !error &&
            <img alt={file.name} src={objectUrl} style={{ maxWidth: '100%', maxHeight: '100%' }}
                onError={imageLoadError}
            />}
        {!loading && error && <BrokenImage />}
    </Box>

}