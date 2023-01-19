import { Box, Button, Typography, Grid, GridProps } from "@mui/material";
import { useCallback, useRef, useContext, useMemo } from "react";
import { FolderOpen, Image as ImageIcon } from '@mui/icons-material';
import { FS_Mode } from "../../../utils/browserCompability";
import { fileListContext as _fileListContext, webkitFileListContext as _webkitFileListContext } from "../../../context/fileListContext";
import useAsync from "../../../hooks/useAsync";

export default function SelectLocalFileButtonRow(props: GridProps) {
    const fileListContext = useContext(_fileListContext);
    const webkitFileListContext = useContext(_webkitFileListContext);

    const processing = useMemo(() => !fileListContext.ready || !webkitFileListContext.ready, [fileListContext.ready, webkitFileListContext.ready]);

    // Case 1: window.showDirectoryPicker
    const asyncRequestOpenFolder = useCallback(async () => {
        return await window.showDirectoryPicker({
            id: 'img-open-folder'
        });
    }, []);

    const requestOpenFolderOnSuccess = useCallback((result: FileSystemDirectoryHandle) => {
        fileListContext.setRootInputFsHandles((prev) => [...prev, result])
    }, [fileListContext.setRootInputFsHandles]);

    const requestOpenFolderOnError = useCallback((err: Error) => {
        // ignore?
    }, []);

    const fireRequestDir = useAsync(asyncRequestOpenFolder, requestOpenFolderOnSuccess, requestOpenFolderOnError);

    // Case 2: Directory Picker
    const fileInputRef = useRef<HTMLInputElement>(null);
    const directoryInputRef = useRef<HTMLInputElement>(null);

    const openFilePicker = useCallback(() => fileInputRef.current?.click(), [fileInputRef]);
    const openWebkitDirectoryPicker = useCallback(() => directoryInputRef.current?.click(), [directoryInputRef]);

    const handleMultipleImageInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.currentTarget.files;
        if (!files || !files.length) return;
        webkitFileListContext.appendFileList(files);
    }, [webkitFileListContext.appendFileList]);

    const handleWebkitDirectoryInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.currentTarget.files;
        if (!files || !files.length) return;
        webkitFileListContext.appendFileList(files, true);
    }, [webkitFileListContext.appendFileList])

    return <Grid container {...props}>
        <Grid item xs={6} pr={0.5}>
            <Button fullWidth startIcon={<ImageIcon />} onClick={openFilePicker} variant="outlined"
                disabled={processing}
                sx={{ whiteSpace: 'nowrap' }}
            >选择文件</Button>
            <input ref={fileInputRef} type='file' accept="image/*" multiple hidden
                name="image-selection-multiple"
                onChange={handleMultipleImageInput}
            />
        </Grid>
        <Grid item xs={6} pl={0.5}>
            {FS_Mode === 'publicFS' ?
                <Button fullWidth startIcon={<FolderOpen />} onClick={fireRequestDir} variant="outlined"
                    disabled={processing}
                    sx={{ whiteSpace: 'nowrap' }}
                >打开文件夹</Button>
                :
                <>
                    {/* @ts-expect-error */}
                    <input ref={directoryInputRef} type='file' webkitdirectory="1" multiple hidden
                        name="image-dir-selection"
                        onChange={handleWebkitDirectoryInput}
                    />

                    <Button fullWidth startIcon={<FolderOpen />} variant="outlined"
                        disabled={processing}
                        onClick={openWebkitDirectoryPicker}
                        sx={{ whiteSpace: 'nowrap' }}
                    >
                        导入文件夹
                    </Button>
                    {/* ↓ TODO: One-time popup */}
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                        浏览器的对话框可能会将操作写作 "上传"。你的文件不会离开此设备。
                    </Typography>
                </>
            }
        </Grid>
    </Grid>;
}