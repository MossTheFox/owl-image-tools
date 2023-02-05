import { keyframes } from "@emotion/react";

export const KeyframesFadeIn = keyframes`
    0% {
        opacity: 0;
    }
    
    100% {
        opacity: 1;
    }
`;

export const KeyframesFadeOutAndRemove = keyframes`
    0% {
        transform: translateX(0);
        opacity: 1;
    }
    
    100% {
        transform: translateX(100%);
        opacity: 0;
    }
`;