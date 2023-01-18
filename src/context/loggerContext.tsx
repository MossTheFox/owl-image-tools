import { createContext, useState, useCallback, useMemo } from "react";
import { Snackbar, Alert, AlertTitle } from "@mui/material";

type LoggerContext = {
    writeLine: (str: string) => void,
    line: string,
    history: string[],
    fireAlertSnackbar: (data: MuiAlertState, autoHideDuration?: number) => void
};

export const loggerContext = createContext<LoggerContext>({
    writeLine(str) { },
    line: '',
    history: [],
    fireAlertSnackbar() { },
});


export function LoggerContextProvider({ children }: { children: React.ReactNode }) {

    const [line, setLine] = useState('');
    const [history, setHistory] = useState<string[]>([]);

    const writeLine = useCallback((line: string) => {
        setLine(line);
        setHistory((prev) => [...prev, line]);
    }, []);

    // Snackbar

    const [alertState, setAlertState] = useState<MuiAlertState>({ severity: 'success' });
    const [snackAutohideDuration, seetSnackAutohideDuration] = useState(6000);
    const [snackOpen, setSnackOpen] = useState(false);
    const closeSnack = useCallback(() => setSnackOpen(false), []);

    const fireAlertSnackbar = useCallback((data: MuiAlertState, autoHideDuration?: number) => {
        if (arguments.length === 2 && typeof autoHideDuration === 'number') {
            seetSnackAutohideDuration(autoHideDuration);
        }
        setAlertState(data);
        setSnackOpen(true);
    }, []);

    return <loggerContext.Provider value={{
        history,
        line,
        writeLine,
        fireAlertSnackbar
    }}>
        {children}
        <Snackbar open={snackOpen} onClose={closeSnack} autoHideDuration={snackAutohideDuration}
            anchorOrigin={{
                horizontal: 'center',
                vertical: 'bottom'
            }}
        >
            <Alert variant="filled" severity={alertState.severity} title={alertState.title}>
                {alertState.title && <AlertTitle sx={{ fontWeight: 'bolder' }}>{alertState.title}</AlertTitle>}
                {alertState.message}
            </Alert>
        </Snackbar>
    </loggerContext.Provider>
}
