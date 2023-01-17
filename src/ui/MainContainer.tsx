import { Box } from "@mui/material";

/**
 * Safari PWA status bar color: background color defined in `ThemeProvicer`
 * 
 * Page Background color: defined here.
 * 
 * Use as children for `ThemeProvider`, being after `CssBaseline`
 */
function MainContainer({ children }: { children: React.ReactNode }) {
    return <Box bgcolor={(theme) => theme.palette.mode === "dark" ? "unset" : "#faf9f6"}
        minHeight={'100vh'}
        sx={{
            transition: 'background-color 0.125s'
        }}
    >
        {children}
    </Box>
}

export default MainContainer;