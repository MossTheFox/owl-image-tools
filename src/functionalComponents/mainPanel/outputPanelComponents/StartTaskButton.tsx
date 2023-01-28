import { Download, Folder, PlayArrow } from "@mui/icons-material";
import { Box, BoxProps, Button, Collapse, Popover, Typography } from "@mui/material";
import { useCallback, useContext, useRef, useState, useMemo } from "react";
import { appConfigContext } from "../../../context/appConfigContext";
import { webkitFileListContext } from "../../../context/fileListContext";
import OutputFolderSaveZipDialog from "../../../context/fileListDialog/fileListDialogsAndMenus/OutputFolderSaveZipDialog";
import { loggerContext } from "../../../context/loggerContext";
import { outputFileListContext, OutputTreeNode } from "../../../context/outputFileListContext";
import useAsync from "../../../hooks/useAsync";
import { FS_Mode } from "../../../utils/browserCompability";
import { clearCurrentActiveTempFolders, createOPFSTempFolder } from "../../../utils/privateFS";

const openDirPicker = window.showDirectoryPicker?.bind(null, {
    id: 'image-output',
    mode: 'readwrite'
});

export default function StartTaskButton(props: BoxProps) {

    const {
        setOutputFolderHandle, startConvertion, loading, outputStatistic,
        outputTrees
    } = useContext(outputFileListContext);

    const { fireAlertSnackbar } = useContext(loggerContext);

    /** Mark folder or last task... */
    const [lastTaskFolderName, setLastTaskFolderName] = useState('');

    const { outputConfig } = useContext(appConfigContext);
    const { clearNodes, statistic } = useContext(webkitFileListContext);

    const handleGet = useCallback((handle?: FileSystemDirectoryHandle) => {
        setOutputFolderHandle(handle);
        if (handle?.name) {
            setLastTaskFolderName(handle.name);
        }
        startConvertion(clearNodes(), outputConfig);
    }, [setOutputFolderHandle, startConvertion, clearNodes, outputConfig]);

    const handleErr = useCallback((err: Error) => {
        import.meta.env.DEV && console.log(err, err?.name);
        if (err.name !== 'AbortError') {
            fireAlertSnackbar({
                severity: 'error',
                title: '开始任务时出错',
                message: '错误信息: ' + err?.message
            });
        }

    }, [fireAlertSnackbar]);

    const fireOpenDirPicker = useAsync(openDirPicker, handleGet, handleErr);

    const opfs = useCallback(async () => {
        await clearCurrentActiveTempFolders();
        return await createOPFSTempFolder();
    }, []);

    const fireOPFSDirGet = useAsync(opfs, handleGet, handleErr);


    // Notify
    const [notifyPopperOpen, setNotifyPopperOpen] = useState(false);
    const closeNotify = useCallback(() => {
        setNotifyPopperOpen(false);
    }, []);
    const notifyAnchorRel = useRef<HTMLDivElement>(null);

    // Actions
    const start = useCallback(() => {
        switch (FS_Mode) {
            case 'publicFS':
                fireOpenDirPicker();
                break;
            case 'privateFS':
                fireOPFSDirGet();
                break;
            case 'noFS':
                handleGet();
        }
    }, [handleGet, fireOPFSDirGet, fireOpenDirPicker]);

    // Zip Download
    const hasFileToDownload = useMemo(() => {
        return !loading && outputStatistic.converted.totalFiles > 0
    }, [loading, outputStatistic]);

    const startBtn = useCallback(() => {
        if (lastTaskFolderName) {
            setNotifyPopperOpen(true);
            return;
        }
        if (FS_Mode !== 'publicFS') {
            // Placeholder, means already began a task.
            setLastTaskFolderName('temp1');
        }
        start();
    }, [start, lastTaskFolderName]);

    const notifyConfirmClearAndContinueBtn = useCallback(() => {
        start();
        setNotifyPopperOpen(false);
    }, [start]);

    const justStart = useCallback(() => {
        startConvertion(clearNodes(), outputConfig);
        setNotifyPopperOpen(false);
    }, [setOutputFolderHandle, startConvertion, clearNodes, outputConfig]);

    // Zip Download
    const [zipDownloadDialogOperation, setZipDownloadDialogOperation] = useState<{ nodes: OutputTreeNode[] } | null>(null)
    const zipSaveOnEnd = useCallback(() => {
        setZipDownloadDialogOperation(null);
    }, []);

    const fireZipSaveDialog = useCallback(() => {
        if (!outputTrees) return;
        setZipDownloadDialogOperation({
            nodes: outputTrees
        });
    }, [outputTrees]);

    return <Box {...props}>

        {zipDownloadDialogOperation &&
            <OutputFolderSaveZipDialog nodes={zipDownloadDialogOperation.nodes}
                onFinished={zipSaveOnEnd}
            />
        }

        <Collapse in={hasFileToDownload}>
            <Box pb={1}>
                <Button fullWidth startIcon={<Download />} disableElevation variant="contained"
                    disabled={!hasFileToDownload}
                    onClick={fireZipSaveDialog}
                >
                    打包下载
                </Button>
            </Box>
        </Collapse>
        <Box ref={notifyAnchorRel}>
            {FS_Mode === 'publicFS' ?
                <Button fullWidth startIcon={<Folder />}
                    variant={statistic.totalFiles > 0 ? 'contained' : "outlined"}
                    onClick={startBtn}
                    disableElevation
                    disabled={statistic.totalFiles <= 0 || loading}
                    sx={{
                        whiteSpace: 'nowrap'
                    }}
                >
                    {lastTaskFolderName ? '开始下一组任务' :
                        '选择输出目录并开始转换'
                    }
                </Button>
                :
                <Button fullWidth startIcon={<PlayArrow />}
                    variant={statistic.totalFiles > 0 ? 'contained' : "outlined"}
                    onClick={startBtn}
                    disableElevation
                    disabled={statistic.totalFiles <= 0 || loading}
                >
                    {lastTaskFolderName ? '开始下一组任务' :
                        '开始转换'
                    }
                </Button>
            }
        </Box>

        <Popover open={notifyPopperOpen} onClose={closeNotify}
            anchorEl={notifyAnchorRel.current}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left'
            }}
        >
            <Box p={2} display="flex" flexDirection="column" alignItems="end">
                <Box>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                        已完成的任务将会被清空。
                    </Typography>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                        <strong>请确定文件已经被正确保存</strong>，然后，点击继续来从开始下一组任务。
                    </Typography>
                    {!!lastTaskFolderName && FS_Mode === 'publicFS' &&
                        <Typography variant="body2" color="textSecondary" gutterBottom>
                            上一次的输出目录名称: {lastTaskFolderName}
                        </Typography>
                    }
                </Box>
                <Box display="flex" gap={1} alignItems="center" justifyContent="end" flexWrap="wrap">
                    {FS_Mode === 'publicFS' && <Button onClick={justStart}
                        sx={{ textTransform: 'unset' }}
                    >
                        使用上一次的输出目录继续
                    </Button>}

                    <Button onClick={notifyConfirmClearAndContinueBtn}>
                        {FS_Mode === 'publicFS' ? '选择输出目录并继续' : '继续'}
                    </Button>
                </Box>
            </Box>
        </Popover>
    </Box>
}