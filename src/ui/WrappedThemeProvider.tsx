import { useMediaQuery, ThemeProvider, CssBaseline } from '@mui/material'
import { useContext, useMemo } from 'react';
import { appConfigContext } from '../context/appConfigContext';
import { themeObject } from './theme';

/**
 * CssBaseline is already ready here as the first child.
 */
function WrappedThemeProvider({ children }: { children: React.ReactNode }) {
    const appConfig = useContext(appConfigContext);
    const sysPrefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

    const theme = useMemo(() => {
        if (appConfig.siteConfig.colorModeFollowSystem) {
            return sysPrefersDarkMode ? themeObject.dark : themeObject.light;
        }
        return appConfig.siteConfig.colorMode === 'dark' ? themeObject.dark : themeObject.light
    }, [sysPrefersDarkMode, appConfig.siteConfig.colorMode, appConfig.siteConfig.colorModeFollowSystem]);

    return <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
    </ThemeProvider>
}

export default WrappedThemeProvider;