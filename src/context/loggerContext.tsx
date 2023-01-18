import { createContext, useState, useCallback, useMemo } from "react";
import { Panels } from "../functionalComponents/PanelNavigation";

type LoggerContext = {
    writeLine: (str: string) => void,
    line: string,
    history: string[]
};

export const loggerContext = createContext<LoggerContext>({
    writeLine(str) { },
    line: '',
    history: []
});


export function LoggerContextProvider({ children }: { children: React.ReactNode }) {

    const [line, setLine] = useState('');
    const [history, setHistory] = useState<string[]>([]);

    const writeLine = useCallback((line: string) => {
        setLine(line);
        setHistory((prev) => [...prev, line]);
    }, []);

    return <loggerContext.Provider value={{
        history,
        line,
        writeLine
    }}>
        {children}
    </loggerContext.Provider>
}
