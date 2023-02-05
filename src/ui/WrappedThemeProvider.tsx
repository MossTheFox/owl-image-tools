import { useMediaQuery, ThemeProvider, CssBaseline, css, GlobalStyles } from '@mui/material'
import { useContext, useMemo } from 'react';
import { appConfigContext } from '../context/appConfigContext';
import { themeObject } from './theme';


/**
 * CssBaseline is already ready here as the first child.
 */
function WrappedThemeProvider({ children }: { children: React.ReactNode }) {
    const { siteConfig } = useContext(appConfigContext);
    const sysPrefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

    const theme = useMemo(() => {
        if (siteConfig.colorModeFollowSystem) {
            return sysPrefersDarkMode ? themeObject.dark : themeObject.light;
        }
        return siteConfig.colorMode === 'dark' ? themeObject.dark : themeObject.light
    }, [sysPrefersDarkMode, siteConfig.colorMode, siteConfig.colorModeFollowSystem]);

    return <ThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalStyles styles={css`
:root {
    --font-monospace: SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
}

code {
    font-family: var(--font-monospace);
    white-space: pre-wrap;
    word-wrap: break-word;
}

fieldset {
    display: unset;
    margin-inline: unset;
    margin: unset;
    padding-inline: unset;
    padding: unset;
    padding-block: unset;
    border: unset;
    min-inline-size: unset;

    width: 100%;
}
        `} />
        {children}
    </ThemeProvider>
}

export default WrappedThemeProvider;