import { Container, Grid, Typography, Paper, Box, Divider, Button, useMediaQuery, Theme, BoxProps, SxProps } from '@mui/material';
import { useState, useMemo, useEffect, useCallback, useContext } from 'react';
import { CONTROL_PANEL_HEIGHT } from '../App';
import { panelNavigationContext } from '../context/panelNavigationContext';
import ConfigPanel from './mainPanel/ConfigPanel';
import InputPanel from './mainPanel/InputPanel';

export type Panels = 'input' | 'config' | 'output';

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


function PanelBox({ left, width, sx, name, disabled, children }: {
    left: string | number,
    width: string | number,
    sx: SxProps<Theme>,
    name: Panels,
    disabled: boolean,
    children: React.ReactNode
}) {
    return <Box position="absolute"
        top={0}
        px={1}
        width={width}
        aria-hidden={disabled}
        left={left}
        // maxHeight={CONTROL_PANEL_HEIGHT}
        height={CONTROL_PANEL_HEIGHT}
        sx={{
            transition: 'filter 0.25s, left 0.125s, width 0.25s',
            animation: '0.125s ease-in fade-in',
            // transform: nav === 'input' ? 'scale(1)' : 'scale(0.95)',
            ...sx
        }}
        display='flex'
        flexDirection='column'
        justifyContent='stretch'

        component={'fieldset'}
        disabled={disabled}
    >
        {/* ↓ disable the buttons when not being active. */}
        {/* <fieldset disabled={disabled}> */}
        {children}
        {/* </fieldset> */}
    </Box>;
}


// TODO: trackpad, ctrl wheel, touch screen

export default function PanelNavigation(props: BoxProps) {

    // Screen Size
    const screenSizePad = useMediaQuery((theme: Theme) => theme.breakpoints.between('sm', 'md'));
    const screenSizeDesktop = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));

    const onScreenPanelCount = useMemo(() => {
        if (screenSizePad) return 2;
        if (screenSizeDesktop) return 3;
        return 1;
    }, [screenSizePad, screenSizeDesktop]);

    // Current Active Panel(s)
    const [nav, setNav] = useState<Panels[]>(() => {
        if (screenSizeDesktop) {
            return ['input', 'config', 'output'];
        }
        if (screenSizePad) {
            return ['input', 'config'];
        }
        return ['input'];
    });

    // Update active panels when screen size changed
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

    // [Next] button
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

    // [Prev] button
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

    const navigateTo = useCallback((target: Panels) => {
        if (onScreenPanelCount === 3) {
            setNav([...navOrder]);
            return;
        }
        if (onScreenPanelCount === 2) {
            (target === navOrder[2]) && setNav(['config', 'output']);
            (target === navOrder[1]) && setNav(['input', 'config']);
            (target === navOrder[0]) && setNav(['input', 'config']);
            return;
        }
        setNav([target]);
    }, [onScreenPanelCount]);

    const panelNavContext = useContext(panelNavigationContext);
    useEffect(() => {
        panelNavContext.registerFunction(navigateTo);
    }, [navigateTo, panelNavContext.registerFunction]);

    // Width for each panel
    const widthProp = useMemo(() => {
        if (screenSizePad) return '50%';
        if (screenSizeDesktop) return '33.33333%';
        return '100%';
    }, [screenSizePad, screenSizeDesktop]);

    // Filter (CSS filter: brightness) for each panel
    const filterProp = useMemo(() => {
        return {
            'input': nav.includes('input') ? 'brightness(100%)' : 'brightness(90%)',
            'config': nav.includes('config') ? 'brightness(100%)' : 'brightness(90%)',
            'output': nav.includes('output') ? 'brightness(100%)' : 'brightness(90%)'
        };
    }, [screenSizePad, screenSizeDesktop, nav]);


    // Touch screen swipping action
    // TODO: (?) do or skip?
    const [swipping, setSwipping] = useState(false);

    // When swipping, duratio should be 0
    const transitionDuration = useMemo(() => {
        if (swipping) return '0';
        return '0.25s';
    }, [swipping]);

    // Left property (CSS positioning) for the three panels
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
        flexGrow={1}
        {...props}
    >

        <PanelBox
            name='input'
            left={containerLeft.input}
            disabled={!nav.includes('input')}
            width={widthProp}
            sx={{
                transitionDuration,
                filter: filterProp.input,
            }}
        >
            <InputPanel />
        </PanelBox>

        <PanelBox
            name='config'
            left={containerLeft.config}
            disabled={!nav.includes('config')}
            width={widthProp}
            sx={{
                transitionDuration,
                filter: filterProp.config,
            }}
        >
            <ConfigPanel />
        </PanelBox>

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
                animation: '0.125s ease-in fade-in',
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

        <Button onClick={navigateTo.bind(null, 'input')}>debug 1</Button>
        <Button onClick={navigateTo.bind(null, 'config')}>debug 2</Button>
        <Button onClick={navigateTo.bind(null, 'output')}>debug 3</Button>

    </Box>
}
