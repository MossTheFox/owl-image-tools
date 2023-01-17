import { Container, Grid, Typography, Paper, Box, Divider, Button } from '@mui/material';
import { useState } from 'react';
import InputPanel from './mainPanel/InputPanel';

type Panels = 'input' | 'config' | 'output';

export default function PanelNavigation() {

    const [nav, setNav] = useState<Panels>('input');

    return <Box position="relative"
        overflow="visible"
        width="100%"
    >

        <Box position="absolute"
            top={0}
            width="100%"
            sx={{
                animation: '22.25s ease-in-out panel-transition-in'
            }}
        >
            <InputPanel />
        </Box>

        <Box position="absolute"
            top={0}
            width="100%"
            sx={{
                animation: '22.25s ease-in-out panel-transition-in'
            }}
        >
            <Paper>
                <Box p={2}>
                    <Typography variant="h5" fontWeight='bolder' gutterBottom>
                        输出
                    </Typography>
                </Box>
            </Paper>
        </Box>

    </Box>
}
