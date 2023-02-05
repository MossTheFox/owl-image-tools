import { useCallback, useEffect, useState } from "react";

/**
 * Hook for async functions to avoid memory leak.
 * 
 * ref: https://stackoverflow.com/questions/53949393/cant-perform-a-react-state-update-on-an-unmounted-component
 * 
 * @param asyncFunc Async function, DO NOT update state inside.
 * @param onSuccess Callback function on success. Update states here if needed. Shouldn't be updated before resolved (or else it won't be called)
 * @param onError Callback function on error. Update states here if needed. Shouldn't be updated before resolved (or else it won't be called)
 * @param fireOnMount fire immediately, default `false`
 * @param abortSeconds If the async function accepts a `AbortSignal`, this is when it will be aborted.
 * @returns `fireOnce` function
 */
function useAsync<T>(
    asyncFunc: (signal?: (AbortSignal)) => Promise<T>,
    onSuccess?: (result: T) => void,
    onError?: (error: Error) => void,
    fireOnMount = false,
    abortSeconds = 30
) {
    const [fire, setFire] = useState(fireOnMount);

    useEffect(() => {
        if (asyncFunc && fire) {
            let isActive = true;
            const abortController = new AbortController();
            let timeout = -1;
            if (abortSeconds > 0) {
                timeout = setTimeout(() => {
                    abortController.abort();
                }, abortSeconds * 1000);
            }
            asyncFunc(abortController.signal).then((res) => {
                import.meta.env.DEV && console.log(res, "resolved", isActive);
                if (isActive && typeof onSuccess === "function") {
                    setFire(false);
                    onSuccess(res);
                }
            }).catch((err) => {
                import.meta.env.DEV && console.log(err, "rejected", isActive);
                if (isActive && typeof onError === "function") {
                    setFire(false);
                    onError(err);
                }
            }).finally(() => {
                if (isActive) {
                    setFire(false);
                }
            });
            return () => {
                import.meta.env.DEV && console.log("unmount");
                isActive = false;
                abortController.abort();
                clearTimeout(timeout);
            }
        }
    }, [fire, asyncFunc, onSuccess, onError, abortSeconds]);

    const fireOnce = useCallback(() => {
        setFire(true);
    }, []);

    return fireOnce;
}

export default useAsync;