import { useCallback, useEffect, useState } from "react"


/**
 * Workaround for Webkit (Safari) Context Menu. (https://bugs.webkit.org/show_bug.cgi?id=213953)
 * May have some issues if doing multiple touch.
 */
export default function useLongTouch(
    callback: (coord: { x: number, y: number }) => void,
    delay = 500,
    positionRadius = 16
) {

    const [startTime, setStartTime] = useState(-1);
    const [startPosition, setStartPosition] = useState({ x: -1, y: -1 });

    const onTouchStart = useCallback((e: React.TouchEvent) => {
        setStartTime(Date.now());
        setStartPosition({
            x: e.touches[0].clientX,
            y: e.touches[0].clientY
        });
    }, []);

    const onTouchEnd = useCallback(() => {
        setStartTime(-1);
    }, []);

    const onTouchCancel = useCallback(() => {
        setStartTime(-1);
    }, []);

    const onTouchMove = useCallback((e: React.TouchEvent) => {
        const { ax, ay } = {
            ax: e.touches[0].clientX,
            ay: e.touches[0].clientY
        };

        const { x: bx, y: by } = startPosition;

        const distancePX = Math.sqrt(Math.pow(ax - bx, 2) + Math.pow(ay - by, 2));
        if (distancePX > positionRadius) {
            setStartTime(-1);
        }
    }, [positionRadius, startPosition]);

    useEffect(() => {
        if (startTime <= 0) return;

        const timeout = setTimeout(() => {
            callback(startPosition);
        }, delay);

        return () => {
            clearTimeout(timeout);
        }
    }, [callback, startTime, delay, startPosition]);

    return { onTouchStart, onTouchEnd, onTouchCancel, onTouchMove }
}