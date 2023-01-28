import { CSSProperties, forwardRef, useEffect, useMemo, useRef, useState } from "react"
import { checkRectOverlap } from "../utils/randomUtils";

// This thing is supposed to be useful in many places
// so here I'm not requiring MUI components just for simplicity

export default function LazyLoadChunk({
    unitHeight,
    unitCount,
    // customPlacehoderBlock,
    children,
    observerInitOptions,
}: {
    unitHeight: string;
    unitCount: number;
    // customPlacehoderBlock?: React.ReactNode;
    children?: React.ReactNode;
    observerInitOptions?: Partial<IntersectionObserverInit>;
}) {


    const style = useMemo<CSSProperties>(() => ({
        minHeight: `calc(${unitCount} * ${unitHeight})`
    }), [unitHeight, unitCount]);

    const div = useRef<HTMLDivElement>(null);

    const [shouldRender, setShouldRender] = useState(typeof IntersectionObserver !== 'undefined' ? false : true);

    useEffect(() => {
        if (typeof IntersectionObserver === 'undefined') {
            // what hell browser is the user using holy gosh
            return;
        }
        if (!div.current) return;

        let unmounted = false;

        const observer = new IntersectionObserver((entry) => {
            for (const one of entry) {
                if (!unmounted) {
                    if (one.isIntersecting) {
                        setShouldRender(true);
                    } else {
                        setShouldRender(false);
                    }
                }
            }
        }, {
            // threshold: [0, 1],
            root: document.body,
            rootMargin: '128px 0px',
            ...observerInitOptions,
        });

        observer.observe(div.current);

        // initial Check. Only once.
        const { left, top, height, width } = div.current.getBoundingClientRect();
        // Check overlap
        // mind got burr so here the overlap calculation fn will be put in a util file.
        const isVisible = checkRectOverlap(
            left, top, width, height, 0, 0, window.innerWidth, window.innerHeight
        );
        setShouldRender(isVisible);

        return () => {
            observer.disconnect();
            unmounted = true;
        }
    }, [div, observerInitOptions]);

    return <div ref={div} style={style}>
        {shouldRender && children}
    </div>
}