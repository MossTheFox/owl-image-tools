import { Container, Grid, Typography, Paper, Box, Divider, Button } from '@mui/material';
import { FileListContext, WebkitDirectoryFileListContext } from './context/fileListContext';
import { LoggerContextProvider } from './context/loggerContext';
import { PanelNavigationContextProvider } from './context/panelNavigationContext';
import BrowserCompatibilityDetectionDialog from './functionalComponents/dialogs/BrowserCompatibilityDetectionDialog';
import PanelNavigation from './functionalComponents/PanelNavigation';
import TopBar from './functionalComponents/TopBar';

function App() {

    return <Box position="relative" height="100vh">
        {/* Context Here */}

        {/* Panels Navigarion Context */}
        <PanelNavigationContextProvider>
            {/* (FS_MODE !== 'noFS') Context that records all the file handles */}
            <FileListContext>
                {/* For Dropped in folders (or files) and folder selector */}
                <WebkitDirectoryFileListContext>
                    {/* Context for the logs (display at the top bar) */}
                    <LoggerContextProvider>

                        <TopBar />
                        <BrowserCompatibilityDetectionDialog />
                        <Box width="100%"
                            height="calc(100vh - 2rem)"
                            overflow="hidden"
                            display="flex"
                            flexDirection="column"
                        >
                            <Box py={1}>
                                <PanelNavigation />
                            </Box>
                        </Box>

                    </LoggerContextProvider>
                </WebkitDirectoryFileListContext>
            </FileListContext>
        </PanelNavigationContextProvider>
    </Box>
}

export default App
