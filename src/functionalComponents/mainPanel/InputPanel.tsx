import { Box, Button, Paper, Typography, Stack, PaperProps } from "@mui/material";
import { useCallback, useContext, useMemo } from "react";
import FileListPreview from "./fileListPreview/FileListPreview";
import { fileListContext as _fileListContext, webkitFileListContext as _webkitFileListContext } from "../../context/fileListContext";
import { CONTROL_PANEL_HEIGHT } from "../../App";
import ReadFromClipboardButton from "./inputPanelComponents/ReadFromClipboardButton";
import SelectLocalFileButtonRow from "./inputPanelComponents/SelectLocalFileButtonRow";
import { FileListDialogCallerContextProvider } from "../../context/fileListDialog/fileListDialogCallerContext";
import DialogLoadingIndicator from "../../ui/smallComponents/DialogLoadingIndicator";
import { Forward } from "@mui/icons-material";
import { panelNavigationContext } from "../../context/panelNavigationContext";
import { appConfigContext } from "../../context/appConfigContext";
import BottomTipDisplay from "../../components/styledComponents/BottomTipDisplay";
import { MarkdownRenderer } from "../../utils/mdRenderer";
import { t } from "i18next";

export default function InputPanel(props: PaperProps) {

    const fileListContext = useContext(_fileListContext);
    const webkitFileListContext = useContext(_webkitFileListContext);

    const { siteConfig, setTipDisplay } = useContext(appConfigContext);

    const processing = useMemo(() => !fileListContext.ready || !webkitFileListContext.ready, [fileListContext.ready, webkitFileListContext.ready]);

    const { onScreenPanelCount, navigateTo } = useContext(panelNavigationContext);

    const tipConfirm = useCallback(() => {
        setTipDisplay('fileListTip', false);
    }, [setTipDisplay]);

    return <Paper {...props} sx={{
        ...props.sx,
        overflow: 'hidden',
        flexGrow: 1,
        maxHeight: CONTROL_PANEL_HEIGHT,
        transition: 'background-color 0.25s',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'stretch',
        position: 'relative'
    }}>
        {/* Loading Indicator with ZIndex higher than content box */}
        <DialogLoadingIndicator loading={processing} zIndex={2} position="relative" />

        <Box px={2} pb={1}
            borderBottom={1}
            borderColor="divider"
            display='flex' justifyContent='baseline' alignItems='stretch'
        >
            <Box pt={2}>
                <Typography variant="h5" fontWeight='bolder'
                    component='div' display='flex' alignItems='stretch' justifyContent='space-between'
                    whiteSpace="nowrap"
                >
                    <span>{t('ui.inputPanel.sourceFiles')}</span>

                </Typography>
            </Box>

            <Box pt={1} flexGrow={1} display="flex" justifyContent="end"
                sx={{
                    transition: 'opacity 0.25s',
                    opacity: onScreenPanelCount === 1 ? 1 : 0
                }}
            >
                <Button variant={webkitFileListContext.statistic.totalFiles > 0 ? 'contained' : 'outlined'} size="small"
                    endIcon={<Forward />}
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
            <Stack spacing={1} pb={1}>

                <Typography variant="body2" color="primary" gutterBottom>
                    {t('ui.inputPanel.dragFilesHereToImport')}
                </Typography>

                {/* 2 Cases: Clipboard API or popup an input then let user paste */}
                <ReadFromClipboardButton fullWidth />

                <SelectLocalFileButtonRow />
            </Stack>
        </Box>

        <Box px={2} mt={1} pb={2} position='relative' flexGrow={1}
            overflow="auto"
        >

            <FileListDialogCallerContextProvider>
                <FileListPreview />
            </FileListDialogCallerContextProvider>

        </Box>

        {/* Tip Display */}
        <BottomTipDisplay onDismiss={tipConfirm}
            hidden={webkitFileListContext.statistic.totalFiles === 0 || !siteConfig.tipDisplay['fileListTip']}
        >
            <MarkdownRenderer md={t('content.inputPanelTip')} />
        </BottomTipDisplay>

    </Paper>;
}