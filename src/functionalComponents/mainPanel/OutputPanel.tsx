import { Box, Paper, Typography, PaperProps, LinearProgress, Button, Link, Menu, MenuItem } from "@mui/material";
import { useCallback, useContext, useMemo, useRef, useState } from "react";
import { fileListContext as _fileListContext, webkitFileListContext as _webkitFileListContext } from "../../context/fileListContext";
import { CONTROL_PANEL_HEIGHT } from "../../App";
import { outputFileListContext as _outputFileListContext } from "../../context/outputFileListContext";
import OutputFileListPreview from "./fileListPreview/OutputFileListPreview";
import StartTaskButton from "./outputPanelComponents/StartTaskButton";
import { Forward } from "@mui/icons-material";
import { panelNavigationContext } from "../../context/panelNavigationContext";
import { OutputFileListDialogCallerContextProvider } from "../../context/fileListDialog/outputFileListDialogCallerContext";
import BottomTipDisplay from "../../components/styledComponents/BottomTipDisplay";
import { appConfigContext } from "../../context/appConfigContext";
import { loggerContext } from "../../context/loggerContext";
import { restartVipsWorker } from "../../utils/converter/libvipsConverter";
import { MarkdownRenderer } from "../../utils/mdRenderer";
import { t } from "i18next";

export default function OutputPanel(props: PaperProps) {

    const {
        terminateTask,
        loading, outputStatistic
    } = useContext(_outputFileListContext);

    const progress = useMemo(() => {
        if (outputStatistic.inputFiles.totalFiles <= 0) return 0;
        return outputStatistic.converted.totalFiles / outputStatistic.inputFiles.totalFiles * 100;
    }, [outputStatistic])

    const { onScreenPanelCount, navigateTo } = useContext(panelNavigationContext);

    const { siteConfig, setTipDisplay } = useContext(appConfigContext);

    const { fireAlertSnackbar } = useContext(loggerContext);

    const tipConfirm = useCallback(() => {
        setTipDisplay('outputFileListTip', false);
    }, [setTipDisplay]);

    // Menu

    const [menuOpen, setMenuOpen] = useState(false);
    const menuAnchorEl = useRef<HTMLDivElement>(null);

    const closeMenu = useCallback(() => setMenuOpen(false), []);
    const openMenu = useCallback(() => setMenuOpen(true), []);

    const menuResetVipsWorker = useCallback(() => {
        closeMenu();
        restartVipsWorker().then(() => {
            fireAlertSnackbar({
                severity: 'success',
                message: t('ui.outputPanel.workerReloaded')
            });
        }).catch((err) => {
            fireAlertSnackbar({
                severity: 'error',
                message: t('ui.outputPanel.errorSnackbarWithMessage', {msg: err})
            });
        });
    }, [closeMenu, fireAlertSnackbar]);

    const menuTerminateTask = useCallback(() => {
        closeMenu();
        terminateTask();
    }, [closeMenu, terminateTask]);

    return <Paper {...props} sx={{
        ...props.sx,
        overflow: 'hidden',
        flexGrow: 1,
        maxHeight: CONTROL_PANEL_HEIGHT,
        transition: 'background-color 0.25s',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'stretch',
        position: 'relative',
    }}>
        {/* Loading Indicator with ZIndex higher than content box */}
        <Box height={0} overflow="visible" zIndex={2} position="relative"
            sx={{
                opacity: loading ? 1 : 0,
                transition: 'opacity 0.25s'
            }}
        >
            <LinearProgress variant="determinate" value={progress} />
        </Box>

        <Box px={2} pb={1}
            borderBottom={1}
            borderColor="divider"
            display='flex' justifyContent='baseline' alignItems='stretch'
        >
            <Box pt={2}>
                <Typography variant="h5" fontWeight='bolder'
                    component='div' display='flex' alignItems='baseline' justifyContent='space-between'
                    whiteSpace="nowrap"
                >
                    <span>{t('ui.outputPanel.output')}</span>

                    <Box display="flex"
                        alignItems="baseline"
                        justifyContent="end"
                        px={1}
                        ref={menuAnchorEl}
                    >
                        <Link component="button" variant="body2" underline="hover"
                            onClick={openMenu}
                        >
                            {t('commonWords.options')}
                        </Link>
                    </Box>

                </Typography>
            </Box>

            <Box pt={1} flexGrow={1} display="flex" justifyContent="end"
                sx={{
                    transition: 'opacity 0.25s',
                    opacity: onScreenPanelCount === 1 ? 1 : 0
                }}
            >
                <Button variant={'outlined'} size="small"
                    startIcon={<Forward sx={{ transform: 'scaleX(-1)' }} />}
                    onClick={() => navigateTo('config')}
                    disableElevation
                    disabled={onScreenPanelCount === 1 ? false : true}
                    sx={{ whiteSpace: 'nowrap', py: 0 }}
                >
                    {t('ui.navigateButton.config')}
                </Button>
            </Box>
        </Box>

        <Box px={2} py={1}
            borderBottom={1}
            borderColor="divider"
        >
            <Box py={1}>
                <StartTaskButton />
            </Box>
        </Box>

        {/* Menu */}

        <Menu anchorEl={menuAnchorEl.current} open={menuOpen} onClose={closeMenu}>

            {loading &&
                <MenuItem dense onClick={menuTerminateTask}>
                    <Box display='flex' flexDirection='column'>
                        <Typography variant="body1" color={(t) => t.palette.error.main} fontWeight="bolder"
                            gutterBottom
                        >
                            {t('ui.outputPanel.menuAbortTask')}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            {t('ui.outputPanel.menuAbortTaskSecondary')}
                        </Typography>
                    </Box>
                </MenuItem>
            }

            <MenuItem dense disabled={loading} onClick={menuResetVipsWorker}>
                <Box display='flex' flexDirection='column'>
                    <Typography variant="body1" color={(t) => t.palette.error.main} fontWeight="bolder"
                        gutterBottom
                    >
                        {t('ui.outputPanel.menuReloadWorker')}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                        {t('ui.outputPanel.menuReloadWorkerSecondary')}
                    </Typography>
                </Box>
            </MenuItem>

        </Menu>

        {/* End */}

        <Box px={2} mt={1} pb={2} position='relative' flexGrow={1}
            overflow="auto"
        >

            <OutputFileListDialogCallerContextProvider>
                <OutputFileListPreview />
            </OutputFileListDialogCallerContextProvider>

        </Box>

        <BottomTipDisplay onDismiss={tipConfirm}
            hidden={outputStatistic.inputFiles.totalFiles === 0 || !siteConfig.tipDisplay['outputFileListTip']}
        >
            <MarkdownRenderer md={t('content.outputPanelTip')} />
        </BottomTipDisplay>
    </Paper>;
}