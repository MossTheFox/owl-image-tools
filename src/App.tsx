import { Container, Grid, Typography, Paper, Box, Divider, Button } from '@mui/material';
import { LoggerContextProvider } from './context/loggerContext';
import { PanelNavigationContextProvider } from './context/panelNavigationContext';
import BrowserCompatibilityDetectionDialog from './functionalComponents/dialogs/BrowserCompatibilityDetectionDialog';
import PanelNavigation from './functionalComponents/PanelNavigation';
import TopBar from './functionalComponents/TopBar';

function App() {

    return <Box position="relative" height="100vh">
        {/* Context Here */}

        <PanelNavigationContextProvider>
            <LoggerContextProvider>
                <TopBar />
                <BrowserCompatibilityDetectionDialog />
                <Box width="100%"
                    height="calc(100vh - 2rem)"
                    overflow="hidden"
                    display="flex"
                    flexDirection="column"
                >
                    <Box py={2}>
                        <PanelNavigation />
                    </Box>
                </Box>
            </LoggerContextProvider>
        </PanelNavigationContextProvider>
    </Box>
}

export default App
