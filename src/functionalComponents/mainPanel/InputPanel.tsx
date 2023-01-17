import { Box, Button, Divider, Paper, Typography, Stack, PaperProps } from "@mui/material";
import { useCallback, useRef } from "react";
import { ContentPaste, FolderOpen } from '@mui/icons-material';
import { FS_Mode } from "../../utils/browserCompability";
import useAsync from "../../hooks/useAsync";

export default function InputPanel(props: PaperProps) {

    // Case 1: window.showDirectoryPicker
    const asyncRequestOpenFolder = useCallback(async () => {
        return await window.showDirectoryPicker();
    }, []);

    const requestOpenFolderOnSuccess = useCallback((result: FileSystemDirectoryHandle) => {

    }, []);

    const requestOpenFolderOnError = useCallback((err: Error) => {

    }, []);

    const fireRequestDir = useAsync(asyncRequestOpenFolder, requestOpenFolderOnSuccess, requestOpenFolderOnError);

    // Case 2: Directory Picker
    const fileInputRef = useRef<HTMLInputElement>(null);


    const handleFolderInput = useCallback(() => {
        if (!fileInputRef.current || !fileInputRef.current.files) return;
        const files = fileInputRef.current.files;
        // clearContext


    }, [fileInputRef])


    return <Paper {...props}>
        <Box p={2}>
            <Typography variant="h5" fontWeight='bolder' gutterBottom>
                源文件
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Stack spacing={1}>

                <Typography variant="body2" color="primary" gutterBottom>
                    将文件拖动至此处以快速导入图片。
                </Typography>

                <Button startIcon={<ContentPaste />} variant="outlined">从剪贴板读取</Button>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                    读取剪切板的文件数据。
                </Typography>

                {FS_Mode === 'publicFS' ? <>
                    <Button startIcon={<FolderOpen />} variant="outlined">打开文件夹</Button>
                </> : <>
                    <Button startIcon={<FolderOpen />} variant="outlined">选择文件夹</Button>
                </>
                }
                {/* @ts-expect-error */}
                <input ref={fileInputRef} type='file' webkitdirectory="1" multiple />
                <Typography variant="body2" color="textSecondary" gutterBottom>
                    浏览器的对话框可能会将操作写作 "上传"。你的文件不会离开此设备。
                </Typography>


            </Stack>
        </Box>
    </Paper>;
}