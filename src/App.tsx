import { Container, Grid, Typography, Paper, Box, Divider, Button } from '@mui/material';
import BrowserCompatibilityDetectionDialog from './functionalComponents/dialogs/BrowserCompatibilityDetectionDialog';
import PanelNavigation from './functionalComponents/PanelNavigation';
import TopBar from './functionalComponents/TopBar';

function App() {

    return <Box position="relative" height="100vh">
        <TopBar />
        <BrowserCompatibilityDetectionDialog />
        <Box width="100%"
            height="calc(100vh - 2rem)"
            overflow="hidden"
            display="flex"
            flexDirection="column"
        >
            <Container maxWidth="lg">
                <Box py={2}>
                    <PanelNavigation />
                </Box>
            </Container>
        </Box>
    </Box>
}

export default App
