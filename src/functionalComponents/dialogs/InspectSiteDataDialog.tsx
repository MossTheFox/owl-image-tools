import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogProps, DialogTitle, Divider } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import useAsync from "../../hooks/useAsync";
import { FS_Mode, storageDisabled } from "../../utils/browserCompability";
import { estimateStorageUsage, parseFileSizeString } from "../../utils/randomUtils";

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
    }, []);

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

                {/* {FS_Mode !== 'noFS' &&
                    <Button variant="outlined" size="small" color="warning">
                        清除私有文件系统中的缓存
                    </Button>
                } */}

                <DialogContentText variant='body2' gutterBottom>
                    其他可用的站点数据操作正在测试中。如有清理的需要，可以在浏览器设置中直接清除此站的的数据。
                </DialogContentText>
            </Box>


        </DialogContent>
        <DialogActions>
            <Button onClick={btnHandleClose}>关闭</Button>
        </DialogActions>
    </Dialog>
}