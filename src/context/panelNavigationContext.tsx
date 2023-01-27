import { Theme, useMediaQuery } from "@mui/material";
import React, { createContext, useState, useCallback, useMemo } from "react";
import { Panels } from "../functionalComponents/PanelNavigation";

type PanelNavigationContext = {
    registerFunction: (navigateTo: (panelName: Panels) => void) => void,
    unregisterFunction: () => void,
    navigateTo: (panelName: Panels) => void,
    onScreenPanelCount: number,
    setOnScreenPanelCount: React.Dispatch<React.SetStateAction<number>>,
    focused: Panels[],
    setFocused: React.Dispatch<React.SetStateAction<Panels[]>>,
}

export const panelNavigationContext = createContext<PanelNavigationContext>({
    navigateTo(panelName) { },
    registerFunction(navigateTo) { },
    unregisterFunction() { },
    onScreenPanelCount: 3,
    focused: ['input', 'config', 'output'],
    setFocused() { },
    setOnScreenPanelCount() { },
});


export function PanelNavigationContextProvider({ children }: { children: React.ReactNode }) {

    const [registeredFn, setRegisteredFn] = useState<{ fn: PanelNavigationContext['navigateTo'] }>({ fn: () => { } });

    const registerFunction = useCallback((fn: PanelNavigationContext['navigateTo']) => {
        setRegisteredFn({ fn: fn });
    }, []);

    const unregisterFunction = useCallback(() => setRegisteredFn({ fn: () => { } }), []);


    const [onScreenPanelCount, setOnScreenPanelCount] = useState(3);
    const [focused, setFocused] = useState<Panels[]>(['input', 'config', 'output']);

    return <panelNavigationContext.Provider value={{
        navigateTo: registeredFn.fn,
        registerFunction,
        unregisterFunction,
        onScreenPanelCount,
        setOnScreenPanelCount,
        focused,
        setFocused,
    }}>
        {children}
    </panelNavigationContext.Provider>
}
