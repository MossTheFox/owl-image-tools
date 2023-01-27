import { Box, useMediaQuery, Theme, BoxProps, SxProps } from '@mui/material';
import { useMemo, useEffect, useCallback, useContext } from 'react';
import { CONTROL_PANEL_HEIGHT } from '../App';
import { panelNavigationContext } from '../context/panelNavigationContext';
import ConfigPanel from './mainPanel/ConfigPanel';
import InputPanel from './mainPanel/InputPanel';
import OutputPanel from './mainPanel/OutputPanel';

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

    // Context
    const {
        registerFunction,
        unregisterFunction,
        setOnScreenPanelCount,
        focused,
        setFocused
    } = useContext(panelNavigationContext);

    // Screen Size
    const screenSizePad = useMediaQuery((theme: Theme) => theme.breakpoints.between('sm', 'md'));
    const screenSizeDesktop = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));

    const onScreenPanelCount = useMemo(() => {
        if (screenSizePad) return 2;
        if (screenSizeDesktop) return 3;
        return 1;
    }, [screenSizePad, screenSizeDesktop]);

    useEffect(() => {
        setOnScreenPanelCount(onScreenPanelCount);
    }, [onScreenPanelCount, setOnScreenPanelCount]);

    // Update active panels when screen size changed
    useEffect(() => {
        if (screenSizeDesktop) {
            setFocused(['input', 'config', 'output']);
            return;
        }
        if (screenSizePad) {
            setFocused((prev) => prev[0] === 'input' ? ['input', 'config'] : ['config', 'output']);
            return;
        }
        setFocused((prev) => [prev[0]]);
    }, [screenSizePad, screenSizeDesktop, setFocused]);

    const navigateTo = useCallback((target: Panels) => {
        if (onScreenPanelCount === 3) {
            setFocused([...navOrder]);
            return;
        }
        if (onScreenPanelCount === 2) {
            (target === navOrder[2]) && setFocused(['config', 'output']);
            (target === navOrder[1]) && setFocused(['input', 'config']);
            (target === navOrder[0]) && setFocused(['input', 'config']);
            return;
        }
        setFocused([target]);
    }, [onScreenPanelCount, setFocused]);

    useEffect(() => {
        registerFunction(navigateTo);
    }, [navigateTo, registerFunction]);

    // Width for each panel
    const widthProp = useMemo(() => {
        if (screenSizePad) return '50%';
        if (screenSizeDesktop) return '33.33333%';
        return '100%';
    }, [screenSizePad, screenSizeDesktop]);

    // Filter (CSS filter: brightness) for each panel
    const filterProp = useMemo(() => {
        return {
            'input': focused.includes('input') ? 'brightness(100%)' : 'brightness(90%)',
            'config': focused.includes('config') ? 'brightness(100%)' : 'brightness(90%)',
            'output': focused.includes('output') ? 'brightness(100%)' : 'brightness(90%)'
        };
    }, [screenSizePad, screenSizeDesktop, focused]);

    // Was planned to allow swipping but now let's forget it
    const transitionDuration = useMemo(() => {
        return '0.25s';
    }, []);

    // Left property (CSS positioning) for the three panels
    const containerLeft = useMemo(() => {
        if (focused.length === 1) {
            // mind blown up. Hard coded here. whatever.
            let indexOrder = [0, 1, 2];
            switch (focused[0]) {
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

        if (focused.length === 2) {
            const firstIndex = Math.max(navOrder.indexOf(focused[0]), 0);
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
    }, [focused]);

    return <Box position="relative"
        overflow="visible"
        width="100%"
        flexGrow={1}
        {...props}
    >

        <PanelBox
            name='input'
            left={containerLeft.input}
            disabled={!focused.includes('input')}
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
            disabled={!focused.includes('config')}
            width={widthProp}
            sx={{
                transitionDuration,
                filter: filterProp.config,
            }}
        >
            <ConfigPanel />
        </PanelBox>

        <PanelBox
            name='output'
            left={containerLeft.output}
            disabled={!focused.includes('output')}
            width={widthProp}
            sx={{
                transitionDuration,
                filter: filterProp.output,
            }}
        >
            <OutputPanel />
        </PanelBox>

    </Box>
}
