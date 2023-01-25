import { Container, Grid, Typography, Paper, Box, Divider, Button } from '@mui/material';
import { FileListContext, WebkitDirectoryFileListContext } from './context/fileListContext';
import { LoggerContextProvider } from './context/loggerContext';
import { OutputFileListContextProvider } from './context/outputFileListContext';
import { PanelNavigationContextProvider } from './context/panelNavigationContext';
import BrowserCompatibilityDetectionDialog from './functionalComponents/dialogs/BrowserCompatibilityDetectionDialog';
import PanelNavigation from './functionalComponents/PanelNavigation';
import TopBar from './functionalComponents/TopBar';

export const TOP_BAR_HEIGHT = '2rem' as const;
export const CONTROL_PANEL_CONTAINER_HEIGHT = `calc(100vh - ${TOP_BAR_HEIGHT})` as const;
export const CONTROL_PANEL_HEIGHT = `calc(100vh - ${TOP_BAR_HEIGHT} - 16px)` as const;

function App() {

    return <Box position="relative" height="100vh">
        {/* Small Context Here */}
        {/* Node: output config and site settings are on the higher level.
                  See main.tsx
        */}

        {/* Panels Navigarion Context */}
        <PanelNavigationContextProvider>
            {/* Context for the logs (display at the top bar) */}
            <LoggerContextProvider>
                {/* For Dropped in folders (or files) and folder selector */}
                <WebkitDirectoryFileListContext>
                    {/* (FS_MODE !== 'noFS') Context that records all the file handles 
                        ** NO LONGER RECORD DATA ** Now will transfer all nodes to webkitFileList.
                    */}
                    <FileListContext>
                        {/* For Output File List. Should be children of input file list contexts */}
                        <OutputFileListContextProvider>

                            <TopBar />
                            <BrowserCompatibilityDetectionDialog />
                            <Box width="100%"
                                height={CONTROL_PANEL_CONTAINER_HEIGHT}
                                display="flex"
                                alignItems="stretch"
                                justifyContent="stretch"
                                flexDirection="column"
                                py={1}
                                // sx={{
                                //     overflowX: 'hidden',
                                //     overflowY: 'auto'
                                // }}
                                overflow="hidden"

                            >
                                <Box display="flex"
                                    flexGrow={1}
                                    flexDirection="column"
                                >
                                    <PanelNavigation
                                        maxHeight={CONTROL_PANEL_HEIGHT}
                                    />
                                </Box>
                            </Box>

                        </OutputFileListContextProvider>
                    </FileListContext>
                </WebkitDirectoryFileListContext>
            </LoggerContextProvider>
        </PanelNavigationContextProvider>
    </Box>
}

export default App
