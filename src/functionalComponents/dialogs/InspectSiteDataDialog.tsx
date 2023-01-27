import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogProps, DialogTitle, Divider } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import useAsync from "../../hooks/useAsync";
import { FS_Mode, storageDisabled } from "../../utils/browserCompability";
import { estimateStorageUsage, parseFileSizeString } from "../../utils/randomUtils";
import { clearAllTempFolders } from "../../utils/privateFS";

export default function InspectSiteDataDialog(props: DialogProps) {

    const btnHandleClose = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        props.onClose && props.onClose(e, 'escapeKeyDown');
    }, [props.onClose])


    const [text, setText] = useState('...');

    const onResolved = useCallback((data: Awaited<ReturnType<typeof estimateStorageUsage>>) => {
        if (data.result === 'error') {
            switch (data.reason) {
                case 'NotSupportError':
                    setText('你的浏览器不支持获取存储占用的详细信息。');
                    break;
                default:
                    setText('未知错误。');
            }
            return;
        }
        setText(`可用: ${parseFileSizeString(data.available)}; 已用: ${parseFileSizeString(data.used, true)}`);
    }, [])

    const fireFetch = useAsync(estimateStorageUsage, onResolved);

    useEffect(() => {
        if (props.open) {
            fireFetch();
        }
    }, [props.open])

    const [localStorageSize, setLocalStorageSize] = useState(storageDisabled ? 0 : localStorage.length)

    const clearLocalStorage = useCallback(() => {
        localStorage.clear();
        setLocalStorageSize(0);
        fireFetch();
    }, [fireFetch]);

    useEffect(() => {
        if (!props.open) return;

        const fn = (e: StorageEvent) => {
            if (e.storageArea) {
                setLocalStorageSize(e.storageArea.length);
            }
        };

        window.addEventListener('storage', fn);

        return () => {
            window.removeEventListener('storage', fn)
        }
    }, [props.open]);

    const [opfsBtnDisabled, setOPFSBtnDisabled] = useState(false);

    const asyncClearOPFS = useCallback(async () => {
        setOPFSBtnDisabled(true);
        setText('...');
        await clearAllTempFolders();
    }, []);

    const onOPFSOK = useCallback(() => {
        setOPFSBtnDisabled(false);
        fireFetch();
    }, [fireFetch]);

    const onOPFSErr = useCallback((err: Error) => {
        setText(`发生错误, 错误信息: ${err?.message}`);
    }, []);

    const fireOPFS = useAsync(asyncClearOPFS, onOPFSOK, onOPFSErr);

    return <Dialog maxWidth="sm" fullWidth {...props}>
        <DialogTitle fontWeight="bolder">
            站点数据管理
        </DialogTitle>
        <DialogContent>
            <DialogContentText gutterBottom>
                以下是站点的数据占用情况。你可以手动执行需要的清除操作。
            </DialogContentText>
            <DialogContentText gutterBottom>
                {text}
            </DialogContentText>
            <DialogContentText variant='body2' gutterBottom>
                一些浏览器可能会将静态文件缓存也计入存储占用量中。这些内容会需要你在浏览器设置中进行清除。
            </DialogContentText>

            <Divider />
            <Box display='flex' flexDirection="column" gap={1} pt={1}>

                {!storageDisabled &&
                    <Button variant="outlined" size="small" color="warning"
                        disabled={localStorage.length === 0}
                        onClick={clearLocalStorage}
                    >
                        {localStorage.length > 0 ? '清除存储的设置信息' : '没有保存的设置信息'}
                    </Button>
                }

                {FS_Mode !== 'noFS' &&
                    <Button variant="outlined" size="small" color="warning"
                        disabled={opfsBtnDisabled}
                        onClick={fireOPFS}
                    >
                        清除私有文件系统中的缓存
                    </Button>
                }

                {FS_Mode !== 'noFS' &&
                    <DialogContentText variant='body2' gutterBottom>
                        请小心，若当前或者其他窗口有在进行转换任务，如果有使用到私有文件系统作为缓存的话，进行清理可能会导致正在进行的任务出错。未保存的文件也将被清除。
                    </DialogContentText>
                }
            </Box>


        </DialogContent>
        <DialogActions>
            <Button onClick={btnHandleClose}>关闭</Button>
        </DialogActions>
    </Dialog>
}