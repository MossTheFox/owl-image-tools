import { createContext, useState, useCallback, useMemo } from "react";
import { Panels } from "../functionalComponents/PanelNavigation";

type PanelNavigationContext = {
    registerFunction: (navigateTo: (panelName: Panels) => void) => void,
    unregisterFunction: () => void,
    navigateTo: (panelName: Panels) => void,

}

export const panelNavigationContext = createContext<PanelNavigationContext>({
    navigateTo(panelName) { },
    registerFunction(navigateTo) { },
    unregisterFunction() { },
});


export function PanelNavigationContextProvider({ children }: { children: React.ReactNode }) {

    const [registeredFn, setRegisteredFn] = useState<{ fn: PanelNavigationContext['navigateTo'] }>({ fn: () => { } });

    const registerFunction = useCallback((fn: PanelNavigationContext['navigateTo']) => {
        setRegisteredFn({ fn: fn });
    }, []);

    const unregisterFunction = useCallback(() => setRegisteredFn({ fn: () => { } }), []);

    return <panelNavigationContext.Provider value={{
        navigateTo: registeredFn.fn,
        registerFunction,
        unregisterFunction
    }}>
        {children}
    </panelNavigationContext.Provider>
}
