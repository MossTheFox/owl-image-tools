import { useMediaQuery, ThemeProvider, CssBaseline } from '@mui/material'
import { useMemo } from 'react';
import { themeObject } from './theme';

/**
 * CssBaseline is already ready here as the first child.
 */
function WrappedThemeProvider({ children }: { children: React.ReactNode }) {
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
    const theme = useMemo(() => {
        if (prefersDarkMode) {
            return themeObject.dark;
        }
        return themeObject.light;
    }, [prefersDarkMode]);

    return <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
    </ThemeProvider>
}

export default WrappedThemeProvider;