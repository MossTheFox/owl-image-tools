import { Box, Paper, Typography, Stack, PaperProps, LinearProgress, Button } from "@mui/material";
import { useCallback, useContext, useMemo } from "react";
import { fileListContext as _fileListContext, webkitFileListContext as _webkitFileListContext } from "../../context/fileListContext";
import { CONTROL_PANEL_HEIGHT } from "../../App";
import { FileListDialogCallerContextProvider } from "../../context/fileListDialog/fileListDialogCallerContext";
import { outputFileListContext as _outputFileListContext } from "../../context/outputFileListContext";
import OutputFileListPreview from "./fileListPreview/OutputFileListPreview";
import StartTaskButton from "./outputPanelComponents/StartTaskButton";
import { Forward } from "@mui/icons-material";
import { panelNavigationContext } from "../../context/panelNavigationContext";
import { OutputFileListDialogCallerContextProvider } from "../../context/fileListDialog/outputFileListDialogCallerContext";
import BottomTipDisplay from "../../components/styledComponents/BottomTipDisplay";
import { appConfigContext } from "../../context/appConfigContext";

export default function OutputPanel(props: PaperProps) {

    const {
        outputTrees, nodeMap, setOutputFolderHandle, // TODO
        loading, outputStatistic
    } = useContext(_outputFileListContext);

    const progress = useMemo(() => {
        if (outputStatistic.inputFiles.totalFiles <= 0) return 0;
        return outputStatistic.converted.totalFiles / outputStatistic.inputFiles.totalFiles * 100;
    }, [outputStatistic])

    const { onScreenPanelCount, navigateTo } = useContext(panelNavigationContext);

    const { siteConfig, setTipDisplay } = useContext(appConfigContext);

    const tipConfirm = useCallback(() => {
        setTipDisplay('outputFileListTip', false);
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
                    component='div' display='flex' alignItems='stretch' justifyContent='space-between'
                    whiteSpace="nowrap"
                >
                    <span>输出</span>

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
                    输出设置
                </Button>
            </Box>
        </Box>

        <Box px={2} py={1}
            borderBottom={1}
            borderColor="divider"
        >
            <Stack spacing={1} py={1}>

                {/* <Typography variant="body2" color="primary" gutterBottom>
                    进度
                </Typography> */}

                <StartTaskButton />
            </Stack>
        </Box>

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
            <Typography variant="body1" gutterBottom>
                在文件列表的文件上，可以通过 <strong>鼠标右击</strong> 或 <strong>触摸长按</strong> 来对于单个 文件/文件夹 打开下载菜单。
            </Typography>
            <Typography variant="body1" gutterBottom>
                请留意，转换出错的文件会在批量保存时被跳过。请一定要保留好自己源文件的备份。
            </Typography>
            <Typography variant="body1" gutterBottom>
               <strong>开始新的转换任务之后，此列表将会被清空。</strong>确定文件已经保存完成之后，再开始下一组转换任务吧。
            </Typography>
        </BottomTipDisplay>
    </Paper>;
}