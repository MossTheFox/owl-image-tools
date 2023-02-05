import { Box, CircularProgress, Fade } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import ErrorBox from "../ui/smallComponents/ErrorBox";
import useAsync from "./useAsync";

export function TemplateLoadingPlaceHolder() {
    return <Box display="block" textAlign="center">
        <Fade in style={{
            transitionDelay: '800ms'
        }}>
            <CircularProgress aria-label="Loading..." color="primary" />
        </Fade>
    </Box>;
}

export function TemplateOnErrorRender({ title, message = 'Unknown Error', retryFunc }: {
    title?: string
    message?: string,
    retryFunc?: () => void
}) {
    return <ErrorBox message={message} title={title || 'Error'} retryFunc={retryFunc} />
}

/**
 * Content that need to load asynchronously can wrap itself here. 
 * 
 * The async function will only be called once.
 * 
 * Suitable for components that **won't need any rerenders during the life cycle**. (change of `asyncFunc` won't trigger rerender.)
 * 
 * Required fields: `asyncFunc` amd `OnSuccessRender`。
 * 
 * Note: OnXXRender should return JSX.Element. Wrap with useCallback to avoid unnecessary rerenders.
 * 
 */
function AsyncLoadingHandler<T>({
    asyncFunc,
    LoadingPlaceholder = TemplateLoadingPlaceHolder,
    OnSuccessRender,
    OnErrorRender = TemplateOnErrorRender,
}: {
    asyncFunc: (signal?: (AbortSignal)) => Promise<T>;
    LoadingPlaceholder?: () => JSX.Element;
    OnSuccessRender: ({ data }: {
        data: T;
    }) => JSX.Element;
    OnErrorRender?: ({ message, retryFunc }: {
        message?: string,
        retryFunc?: () => void
    }) => JSX.Element;
}) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [data, setData] = useState<T | null>(null);

    const asyncOnSuccess = useCallback((data: T) => {
        setData(data);
        setError(null);
        setLoading(false);
    }, []);

    const asyncOnError = useCallback((err: Error) => {
        setLoading(false);
        setError(err);
        setData(null);
    }, []);


    const fireOnce = useAsync(asyncFunc, asyncOnSuccess, asyncOnError);

    const startFetch = useCallback(() => {
        setLoading(true);
        setError(null);
        setData(null);
        fireOnce();
    }, [fireOnce]);

    useEffect(() => {
        fireOnce();
    }, [fireOnce]);

    return (
        loading ? (
            <LoadingPlaceholder />
        ) : (
            error ? (
                <OnErrorRender message={error?.message || 'Unknown Error'} retryFunc={startFetch} />
            ) : (
                // eslint-disable-next-line
                <OnSuccessRender data={data!} />
            )
        )
    )
}

export default AsyncLoadingHandler;