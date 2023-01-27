import { Folder, PlayArrow } from "@mui/icons-material";
import { Box, BoxProps, Button, Popover, Typography } from "@mui/material";
import { useCallback, useContext, useRef, useState, useMemo } from "react";
import { appConfigContext } from "../../../context/appConfigContext";
import { webkitFileListContext } from "../../../context/fileListContext";
import { loggerContext } from "../../../context/loggerContext";
import { outputFileListContext } from "../../../context/outputFileListContext";
import useAsync from "../../../hooks/useAsync";
import { FS_Mode } from "../../../utils/browserCompability";

const openDirPicker = window.showDirectoryPicker?.bind(null, {
    id: 'image-output',
    mode: 'readwrite'
});

const createOPFSTempDir = async () => {
    let name = Date.now() + '_temp';
    const root = await navigator.storage.getDirectory();

    return await root.getDirectoryHandle(name, {
        create: true
    });
};

export default function StartTaskButton(props: BoxProps) {

    const {
        setOutputFolderHandle, startConvertion, loading, outputStatistic
    } = useContext(outputFileListContext);

    const { fireAlertSnackbar } = useContext(loggerContext);

    const [lastTastFolderName, setLastTaskFolderName] = useState('');

    const { outputConfig } = useContext(appConfigContext);
    const { clearNodes, statistic } = useContext(webkitFileListContext);

    const handleGet = useCallback((handle?: FileSystemDirectoryHandle) => {
        setOutputFolderHandle(handle);
        setLastTaskFolderName(handle?.name ?? '');
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

    const fireOPFSDirGet = useAsync(createOPFSTempDir, handleGet, handleErr);


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

    const startBtn = useCallback(() => {
        if (lastTastFolderName) {
            setNotifyPopperOpen(true);
            return;
        }
        start();
    }, [start, lastTastFolderName]);

    const notifyConfirmClearAndContinueBtn = useCallback(() => {
        start();
        setNotifyPopperOpen(false);
    }, [start]);

    const justStart = useCallback(() => {
        startConvertion(clearNodes(), outputConfig);
        setNotifyPopperOpen(false);
    }, [setOutputFolderHandle, startConvertion, clearNodes, outputConfig]);

    return <Box {...props}>

        {/* TODO: button be as progress bar and change view when finished */}
        <Box ref={notifyAnchorRel}>
            {FS_Mode === 'publicFS' ?
                <Button fullWidth startIcon={<Folder />}
                    variant="outlined"
                    onClick={startBtn}
                    disabled={statistic.totalFiles <= 0 || loading}
                    sx={{
                        whiteSpace: 'nowrap'
                    }}
                >
                    {!!lastTastFolderName ? '开始下一组任务' :
                        '选择输出目录并开始转换'
                    }
                </Button>
                :
                <Button fullWidth startIcon={<PlayArrow />}
                    variant="outlined"
                    onClick={startBtn}
                    disabled={statistic.totalFiles <= 0 || loading}
                >
                    开始转换
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
                    {!!lastTastFolderName &&
                        <Typography variant="body2" color="textSecondary" gutterBottom>
                            上一次的输出目录名称: {lastTastFolderName}
                        </Typography>
                    }
                </Box>
                <Box display="flex" gap={1} alignItems="center" justifyContent="end">
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