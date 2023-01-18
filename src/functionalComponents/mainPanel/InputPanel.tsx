import { Box, Button, Divider, Paper, Typography, Stack, PaperProps, Grid } from "@mui/material";
import FileListPreview from "./fileListPreview/FileListPreview";
import { fileListContext as _fileListContext, webkitFileListContext as _webkitFileListContext } from "../../context/fileListContext";
import { CONTROL_PANEL_HEIGHT } from "../../App";
import ReadFromClipboardButton from "./inputPanelComponents/ReadFromClipboardButton";
import SelectLocalFileButtonRow from "./inputPanelComponents/SelectLocalFileButtonRow";

export default function InputPanel(props: PaperProps) {

    return <Paper {...props} sx={{
        overflowX: 'hidden',
        overflowY: 'auto',
        maxHeight: CONTROL_PANEL_HEIGHT,
        transition: 'background-color 0.125s'
    }}>
        <Box px={2} pt={2} pb={1} position='sticky' top={0} left={0}
            bgcolor={(theme) => theme.palette.background.paper}
            zIndex={1}
            borderBottom={1}
            borderColor="divider"
            sx={{
                transition: 'background-color 0.125s'
            }}
        >

            <Typography variant="h5" fontWeight='bolder' gutterBottom>
                源文件
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Stack spacing={1} pb={1}>

                <Typography variant="body2" color="primary" gutterBottom>
                    将文件拖动至此处以快速导入图片。
                </Typography>

                {/* 2 Cases: Clipboard API or popup an input then let user paste */}
                <ReadFromClipboardButton fullWidth />

                <SelectLocalFileButtonRow />
            </Stack>
        </Box>

        <Box px={2} pt={1} pb={2} position='relative'>

            <FileListPreview />

        </Box>
    </Paper>;
}