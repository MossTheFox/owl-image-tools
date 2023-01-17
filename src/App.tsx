import { Container } from '@mui/material';
import { useState } from 'react';
import BrowserCompatibilityDetectionDialog from './components/notifications/BrowserCompatibilityDetectionDialog';

function App() {
    const [count, setCount] = useState(0)

    return (
        <Container maxWidth="lg">
            <BrowserCompatibilityDetectionDialog />
        </Container>
    )
}

export default App
