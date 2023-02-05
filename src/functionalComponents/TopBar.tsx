import { Box, Typography, Chip, ButtonBase, BoxProps } from "@mui/material";
import { Settings } from "@mui/icons-material";
import { useContext, useCallback, useState } from "react";
import { FS_Mode, storageDisabled } from "../utils/browserCompability";
import { loggerContext } from "../context/loggerContext";
import { TOP_BAR_HEIGHT } from "../App";
import LogHistoryDrawer from "./menus/LogHistoryDrawer";
import AppConfigDrawerMenu from "./menus/AppConfigDrawerMenu";
import { KeyframesFadeOutAndRemove } from "../transitions";

export default function TopBar(props: BoxProps) {

    const { line } = useContext(loggerContext);

    const [settingsDrawerOpen, setSettingsDrawerOpen] = useState(false);
    const openSettingsDrawer = useCallback(() => setSettingsDrawerOpen(true), []);
    const closeSettingsDrawer = useCallback(() => setSettingsDrawerOpen(false), []);


    const [loggerDrawerOpen, setLoggerDrawerOpen] = useState(false);

    const openLoggerDrawer = useCallback(() => setLoggerDrawerOpen(true), []);
    const closeLoggerDrawer = useCallback(() => setLoggerDrawerOpen(false), []);

    const animationEnd = useCallback((e: React.AnimationEvent<HTMLDivElement>) => {
        e.currentTarget.style.display = 'none';
    }, []);

    return <Box width="100%"
        height={TOP_BAR_HEIGHT}
        bgcolor={(theme) => theme.palette.primary.main}
        color={(theme) => theme.palette.primary.contrastText}
        boxShadow={(theme) => theme.shadows[1]}
        display='flex' flexWrap='nowrap'
        alignItems='stretch'
        justifyContent='left'
        overflow='hidden'
        position="sticky"
        top={0}
        left={0}
        zIndex={10}
        {...props}
        sx={{
            ...props.sx,
            transition: 'background-color 0.125s'
        }}
    >

        {/* Menu and Drawers */}
        <LogHistoryDrawer onClose={closeLoggerDrawer} onOpen={openLoggerDrawer} open={loggerDrawerOpen} />
        <AppConfigDrawerMenu onClose={closeSettingsDrawer} onOpen={openSettingsDrawer} open={settingsDrawerOpen} />

        <Box bgcolor={(theme) => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.5)' : theme.palette.primary.light}
            color={(theme) => theme.palette.primary.contrastText}
            display='flex'
            alignItems='stretch'
        >
            <ButtonBase aria-label="Open settings menu" onClick={openSettingsDrawer} >
                <Box px={1}
                    display='flex'
                    alignItems='center'
                    justifyContent='center'
                >
                    <Settings sx={{
                        fontSize: (theme) => theme.typography.body2.fontSize,
                        mr: '4px'
                    }} />
                    <Typography variant="body2" whiteSpace='nowrap'>
                        设置
                    </Typography>
                </Box>
            </ButtonBase>
        </Box>
        <ButtonBase sx={{
            flexGrow: 1,
            width: '100%',
            overflow: 'hidden',
            justifyContent: 'left'
        }} aria-label="Open Logger Drawer" onClick={openLoggerDrawer}>
            <Box px='4px'
                py='2px'
                display='flex' flexWrap='nowrap'
                alignItems='stretch'
                justifyContent='left'
                flexGrow={1}
            >
                {/* Log Info Output Here */}
                <Box flexGrow={1} overflow='hidden' px={1}>
                    <Typography variant="body2" whiteSpace='nowrap' textAlign='left'>
                        {line}
                    </Typography>
                </Box>
            </Box>
        </ButtonBase>

        <Box display='flex' gap={1} justifyContent="center" alignItems="center" px={1}
            sx={{
                animation: `0.25s ease-in 6s forwards ${KeyframesFadeOutAndRemove}`,
            }}
            onAnimationEnd={animationEnd}
        >
            {storageDisabled ? <>
                <Chip color="error" label={"访问 Storage API 被拒绝"} size="small" />
            </> : <>
                <Typography variant="body2" whiteSpace='nowrap'>FS Mode: </Typography>
                {FS_Mode === 'noFS' && <Chip color="warning" label={"受限模式"} size="small" />}
                {FS_Mode === 'privateFS' && <Chip color="info" label={"Private FS"} size="small" />}
                {FS_Mode === 'publicFS' && <Chip color="success" label={"Full Support"} size="small" />}
            </>}
        </Box>

    </Box>
}