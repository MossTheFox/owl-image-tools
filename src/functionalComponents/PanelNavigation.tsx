import { Container, Grid, Typography, Paper, Box, Divider, Button, useMediaQuery, Theme } from '@mui/material';
import { useState, useMemo, useEffect, useCallback } from 'react';
import InputPanel from './mainPanel/InputPanel';

type Panels = 'input' | 'config' | 'output';

const navOrder = ['input', 'config', 'output'] as const;

const leftPositionAnchorsXS = [
    '-200%', '-100%', '0', '100%', '200%'
] as const;

const leftPositionAnchorsSM = [
    '-50%', '0', '50%', '100%'
] as const;

const leftPositionAnchorsMD = [
    '0', '33.33333%', '66.66666%'
] as const;

// TODO: trackpad, ctrl wheel, touch screen

/**
 * 
 * @param position 0 ~ 3
 */
function getAnchorPositions(position: number) {

}

export default function PanelNavigation() {

    const screenSizePad = useMediaQuery((theme: Theme) => theme.breakpoints.between('sm', 'md'));
    const screenSizeDesktop = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));

    const onScreenPanelCount = useMemo(() => {
        if (screenSizePad) return 2;
        if (screenSizeDesktop) return 3;
        return 1;
    }, [screenSizePad, screenSizeDesktop]);

    const [nav, setNav] = useState<Panels[]>(['input', 'config', 'output']);

    useEffect(() => {
        if (screenSizeDesktop) {
            setNav(['input', 'config', 'output']);
            return;
        }
        if (screenSizePad) {
            setNav((prev) => prev[0] === 'input' ? ['input', 'config'] : ['config', 'output']);
            return;
        }
        setNav((prev) => [prev[0]]);
    }, [screenSizePad, screenSizeDesktop]);

    const goNext = useCallback(() => {
        setNav((prev) => {
            let startIndex = navOrder.indexOf(prev[0]);
            if (onScreenPanelCount === 1 && startIndex < navOrder.length - 1) {
                return [navOrder[startIndex + 1]];
            }
            if (onScreenPanelCount === 2 && startIndex < navOrder.length - 2) {
                return [navOrder[startIndex + 1], navOrder[startIndex + 2]];
            }
            if (onScreenPanelCount === 3) {
                return [...navOrder];
            }
            return [...prev];
        })
    }, [onScreenPanelCount]);

    const goPrev = useCallback(() => {
        setNav((prev) => {
            let startIndex = navOrder.indexOf(prev[0]);
            if (onScreenPanelCount === 1 && startIndex > 0) {
                return [navOrder[startIndex - 1]];
            }
            if (onScreenPanelCount === 2 && startIndex > 0) {
                return [navOrder[startIndex - 1], navOrder[startIndex]];
            }
            if (onScreenPanelCount === 3) {
                return [...navOrder];
            }
            return [...prev];
        })
    }, [onScreenPanelCount]);

    const widthProp = useMemo(() => {
        if (screenSizePad) return '50%';
        if (screenSizeDesktop) return '33.33333%';
        return '100%';
    }, [screenSizePad, screenSizeDesktop]);


    const filterProp = useMemo(() => {
        return {
            'input': nav.includes('input') ? 'brightness(100%)' : 'brightness(90%)',
            'config': nav.includes('config') ? 'brightness(100%)' : 'brightness(90%)',
            'output': nav.includes('output') ? 'brightness(100%)' : 'brightness(90%)'
        };
    }, [screenSizePad, screenSizeDesktop, nav]);


    const [swipping, setSwipping] = useState(false);

    const transitionDuration = useMemo(() => {
        if (swipping) return '0';
        return '0.25s';
    }, [swipping]);

    const containerLeft = useMemo(() => {
        if (nav.length === 1) {
            // mind blown up. Hard coded here. whatever.
            let indexOrder = [0, 1, 2];
            switch (nav[0]) {
                case 'input':
                    indexOrder = [2, 3, 4];
                    break;
                case 'config':
                    indexOrder = [1, 2, 3];
                    break;
                case 'output':
                    indexOrder = [0, 1, 2];
                    break;
            }
            return {
                'input': leftPositionAnchorsXS[indexOrder[0]],
                'config': leftPositionAnchorsXS[indexOrder[1]],
                'output': leftPositionAnchorsXS[indexOrder[2]]
            }
        }

        if (nav.length === 2) {
            const firstIndex = Math.max(navOrder.indexOf(nav[0]), 0);
            if (firstIndex === 0 /* input panel be the first */) {
                return {
                    'input': leftPositionAnchorsSM[1],
                    'config': leftPositionAnchorsSM[2],
                    'output': leftPositionAnchorsSM[3]
                };
            } else {
                return {
                    'input': leftPositionAnchorsSM[0],
                    'config': leftPositionAnchorsSM[1],
                    'output': leftPositionAnchorsSM[2]
                };
            }
        }
        return {
            'input': leftPositionAnchorsMD[0],
            'config': leftPositionAnchorsMD[1],
            'output': leftPositionAnchorsMD[2]
        };
    }, [nav]);

    return <Box position="relative"
        overflow="visible"
        width="100%"
    >

        <Box position="absolute"
            top={0}
            px={1}
            width={widthProp}
            aria-hidden={!nav.includes('input')}
            left={containerLeft.input}
            sx={{
                transition: 'all 0.25s',
                transitionDuration,
                filter: filterProp.input,
                // transform: nav === 'input' ? 'scale(1)' : 'scale(0.95)',
            }}
        >
            <fieldset disabled={!nav.includes('input')}>
                <InputPanel />
            </fieldset>
        </Box>

        <Box position="absolute"
            top={0}
            px={1}
            width={widthProp}
            aria-hidden={!nav.includes('config')}
            left={containerLeft.config}
            sx={{
                transition: 'all 0.25s',
                transitionDuration,
                filter: filterProp.config,
                // transform: nav === 'config' ? 'scale(1)' : 'scale(0.95)',
            }}
        >
            {/* ↓ disable the buttons when not being active. */}
            <fieldset disabled={!nav.includes('config')}>
                <Paper>
                    <Box p={2}>
                        <Typography variant="h5" fontWeight='bolder' gutterBottom>
                            输出设置
                        </Typography>
                    </Box>
                </Paper>
            </fieldset>
        </Box>

        <Box position="absolute"
            top={0}
            px={1}
            width={widthProp}
            aria-hidden={!nav.includes('output')}
            left={containerLeft.output}
            sx={{
                transition: 'all 0.25s',
                transitionDuration,
                filter: filterProp.output,
                // transform: nav === 'output' ? 'scale(1)' : 'scale(0.95)',
            }}
        >
            <fieldset disabled={!nav.includes('output')}>
                <Paper>
                    <Box p={2}>
                        <Typography variant="h5" fontWeight='bolder' gutterBottom>
                            输出
                        </Typography>
                    </Box>
                </Paper>
            </fieldset>
        </Box>

        <Button onClick={goPrev}>debug 1</Button>
        <Button onClick={goNext}>debug 2</Button>

    </Box>
}
