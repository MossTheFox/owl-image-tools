import { Box, Paper, Typography, Stack, PaperProps, LinearProgress } from "@mui/material";
import { useContext, useMemo } from "react";
import { fileListContext as _fileListContext, webkitFileListContext as _webkitFileListContext } from "../../context/fileListContext";
import { CONTROL_PANEL_HEIGHT } from "../../App";
import { FileListDialogCallerContextProvider } from "../../context/fileListDialog/fileListDialogCallerContext";
import DialogLoadingIndicator from "../../ui/smallComponents/DialogLoadingIndicator";
import { outputFileListContext as _outputFileListContext } from "../../context/outputFileListContext";
import OutputFileListPreview from "./fileListPreview/OutputFileListPreview";
import StartTaskButton from "./outputPanelComponents/StartTaskButton";

export default function OutputPanel(props: PaperProps) {

    const {
        outputTrees, nodeMap, setOutputFolderHandle, // TODO
        loading, outputStatistic
    } = useContext(_outputFileListContext);

    const progress = useMemo(() => {
        if (outputStatistic.inputFiles.totalFiles <= 0) return 0;
        return outputStatistic.converted.totalFiles / outputStatistic.inputFiles.totalFiles * 100;
    }, [outputStatistic])



    return <Paper {...props} sx={{
        ...props.sx,
        overflow: 'hidden',
        flexGrow: 1,
        maxHeight: CONTROL_PANEL_HEIGHT,
        transition: 'background-color 0.25s',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'stretch'
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

        <Box px={2} pt={2} pb={1}
            borderBottom={1}
            borderColor="divider"
        >
            <Typography variant="h5" fontWeight='bolder'>
                输出
            </Typography>
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

            <FileListDialogCallerContextProvider>
                <OutputFileListPreview />
            </FileListDialogCallerContextProvider>

        </Box>
    </Paper>;
}