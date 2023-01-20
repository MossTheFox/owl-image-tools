import { Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText, Box, Button, DialogProps, TableContainer, Table, TableHead, TableBody, TableCell, TableRow, useMediaQuery, Theme, Typography, IconButton, Menu, MenuItem, ListItem, ListItemButton, ListItemIcon, ListItemText, PopoverPosition } from "@mui/material";
import { Close, Download, Info, Delete } from "@mui/icons-material";
import { createContext, useCallback, useState, useEffect } from "react";
import ImageFilePreviewBox from "../../components/ImageFilePreviewBox";
import { ACCEPT_MIMEs } from "../../utils/imageMIMEs";
import { fireFileDownload, parseFileSizeString } from "../../utils/randomUtils";
import { FileListStatistic, FileNodeData, WebkitFileNodeData, TreeNode, defaultFileListStatistic } from "../fileListContext";

type FileNode = TreeNode<FileNodeData> | TreeNode<WebkitFileNodeData>;

function SingleFileDetailDialog(props: DialogProps &
    ({
        file: File,
        // node: TreeNode<FileNodeData>,
        mode: 'FS'
    } | {
        file: File,
        // node: TreeNode<WebkitFileNodeData>,
        mode: 'no_FS'
    })
) {

    const closeDialog = useCallback((e: React.MouseEvent) => {
        if (props.onClose) {
            props.onClose(e, 'escapeKeyDown');
        }
    }, [props.onClose]);

    const {
        file,
        // node,
        mode,
        ...dialogProps
    } = props;

    const smallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

    const download = useCallback(() => {
        fireFileDownload(file, file.name);
    }, [file]);

    // Validate file object
    const [canDownload, setCanDownload] = useState(false);
    const [pending, setPending] = useState(true);
    useEffect(() => {
        let unmounted = false;
        setPending(true);
        setCanDownload(false);

        if (dialogProps.open && file) {
            (async () => {
                try {
                    const whatever = await file.stream().getReader().read();
                    if (!unmounted) {
                        setCanDownload(true);
                    }
                } catch (err) {
                    console.log(err);
                    if (!unmounted) {
                        setCanDownload(false);
                    }
                }
                if (!unmounted) {
                    setPending(false);
                }

            })();
        }
        return () => {
            unmounted = true;
        }
    }, [dialogProps.open, file]);

    return <>
        {!!file &&
            <Dialog fullWidth maxWidth="md" fullScreen={smallScreen} {...dialogProps}>
                <DialogTitle fontWeight="bolder" component="div"
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}
                >
                    <Typography variant="h6" fontWeight="bolder">文件信息</Typography>
                    {smallScreen &&
                        <IconButton color="primary" onClick={closeDialog} size="small"><Close /></IconButton>
                    }
                </DialogTitle>
                <DialogContent sx={{ position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'stretch' }}>

                    {/* Preview */}
                    <Box flexGrow={1} p={1} overflow="auto" display="flex" justifyContent="center">
                        <ImageFilePreviewBox file={file} overflow="auto" width="100%" minHeight="3rem" />
                    </Box>

                    {/* Detail */}
                    <Box flexShrink={0} sx={{ overflowX: 'auto' }}>
                        {!pending && !canDownload &&
                            <DialogContentText gutterBottom fontWeight="bolder">
                                无法读取文件。原始文件可能已被修改、移动或删除。
                            </DialogContentText>
                        }

                        <DialogContentText gutterBottom>
                            {file.name}
                        </DialogContentText>
                        <DialogContentText gutterBottom component={"ul"} whiteSpace="nowrap">
                            <DialogContentText component={"li"} whiteSpace="nowrap">
                                {`类型: ${file.type}`}
                            </DialogContentText>
                            <DialogContentText component={"li"} whiteSpace="nowrap">
                                {`文件大小: ${parseFileSizeString(file.size, true)}`}
                            </DialogContentText>
                            <DialogContentText component={"li"} whiteSpace="nowrap">
                                {`修改日期: ${new Date(file.lastModified).toLocaleString()}`}
                            </DialogContentText>
                        </DialogContentText>
                    </Box>

                </DialogContent>
                <DialogActions sx={{ justifyContent: 'space-between' }}>
                    <Button startIcon={<Download />} onClick={download}
                        disabled={!canDownload || pending}
                    >
                        {pending && '正在确认'}
                        {!pending && canDownload && '下载'}
                        {!pending && !canDownload && '无法读取文件'}
                    </Button>
                    <Button onClick={closeDialog}>
                        关闭
                    </Button>
                </DialogActions>
            </Dialog>
        }
    </>
}

function FileListStatisticDialog(props: DialogProps & { detail: FileListStatistic }) {

    const closeDialog = useCallback((e: React.MouseEvent) => {
        if (props.onClose) {
            props.onClose(e, 'escapeKeyDown');
        }
    }, [props.onClose]);

    const {
        detail,
        ...dialogProps
    } = props;


    return <Dialog fullWidth maxWidth="sm" {...dialogProps}>
        <DialogTitle fontWeight="bolder">
            文件列表信息
        </DialogTitle>
        <DialogContent>
            <TableContainer>
                <Table size="small">
                    <TableHead>
                        <TableRow sx={{ '& > *': { fontWeight: 'bolder' } }}>
                            <TableCell>类型</TableCell>
                            <TableCell>数量</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Object.entries(detail.perFormatCount).map((v, i) => (
                            v[1] > 0 &&
                            <TableRow key={i}>
                                <TableCell>
                                    {`${v[0]}`}
                                </TableCell>
                                <TableCell>
                                    {`${v[1]} 个`}
                                </TableCell>
                            </TableRow>
                        ))}

                        <TableRow>
                            <TableCell>
                                {`合计`}
                            </TableCell>
                            <TableCell>
                                {`${detail.totalFiles} 个`}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </DialogContent>
        <DialogActions>
            <Button onClick={closeDialog}>
                关闭
            </Button>
        </DialogActions>
    </Dialog>
}


type FileListDialogCallerContext = {
    callFileListStatisticDialog: (detail: FileListStatistic | FileListStatistic[]) => void,
    callFilePreviewDialog: (file: File, type: 'FS' | 'no_FS', node: FileNode) => void,

    callFileListItemContextMenu: (anchorPosition: { top: number, left: number }, node: FileNode, type: 'FS' | 'no_FS') => void
}

export const fileListDialogCallerContext = createContext<FileListDialogCallerContext>({
    callFileListStatisticDialog(detail) { throw new Error('Not init') },
    callFilePreviewDialog(file, type, node) { throw new Error('Not init') },
    callFileListItemContextMenu(anchorPosition, node, type) { },
});


export function FileListDialogCallerContextProvider({ children }: { children: React.ReactNode }) {

    const [previewFile, setPreviewFile] = useState<File | null>(null);
    const [mode, setMode] = useState<'FS' | 'no_FS'>('FS');

    const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
    const closePreviewDialog = useCallback(() => setPreviewDialogOpen(false), []);
    const callPreviewDialog = useCallback((file: File, fileMode: typeof mode, fileNode: FileNode) => {
        setMode(fileMode);
        setPreviewFile(file);
        setPreviewDialogOpen(true);
    }, []);


    const [fullStatistic, setFullStatistic] = useState<FileListStatistic>(defaultFileListStatistic);
    const [fullStatisticDialogOpen, setFullStatisticDialogOpen] = useState(false);
    const closeFullStatisticDialog = useCallback(() => setFullStatisticDialogOpen(false), []);

    const callFileListStatisticDialog = useCallback((statistic: FileListStatistic | FileListStatistic[]) => {
        const total: FileListStatistic = Array.isArray(statistic) ?
            {
                totalFiles: statistic.reduce((prev, curr) => prev + curr.totalFiles, 0),
                perFormatCount: statistic.reduce((prev, curr) => {
                    for (const _key in curr.perFormatCount) {
                        let key = _key as typeof ACCEPT_MIMEs[number];
                        prev[key] += curr.perFormatCount[key];
                    }
                    return prev;
                }, { ...defaultFileListStatistic.perFormatCount })
            } : {
                ...statistic,
                perFormatCount: {
                    ...statistic.perFormatCount
                }
            };

        setFullStatistic(total);
        setFullStatisticDialogOpen(true);

    }, []);

    const [contextMenuNodeHold, setContextMenuNodeHold] = useState<FileNode>();
    const [contextMenuOpen, setContextMenuOpen] = useState(false);
    const closeMenu = useCallback(() => setContextMenuOpen(false), []);
    const [menuAnchor, setMenuAnchor] = useState<PopoverPosition>();
    const callFileListItemContextMenu = useCallback((anchorPosition: { top: number, left: number }, node: FileNode, type: 'FS' | 'no_FS') => {
        setMenuAnchor(anchorPosition);
        setContextMenuOpen(true);
        setMode(type);
        setContextMenuNodeHold(node);
    }, []);

    const contextMenuSeeFileDetail = useCallback(() => {
        setContextMenuOpen(false);
        if (!contextMenuNodeHold || contextMenuNodeHold?.data.kind !== 'file') return;
        callPreviewDialog(contextMenuNodeHold.data.file, mode, contextMenuNodeHold);

    }, [contextMenuNodeHold, mode, callPreviewDialog]);


    return <fileListDialogCallerContext.Provider value={{
        callFilePreviewDialog: callPreviewDialog,
        callFileListStatisticDialog,
        callFileListItemContextMenu
    }}>
        {previewFile && (
            <SingleFileDetailDialog
                file={previewFile}
                mode={mode}
                open={previewDialogOpen}
                onClose={closePreviewDialog}
            />
        )}

        <FileListStatisticDialog
            detail={fullStatistic}
            open={fullStatisticDialogOpen}
            onClose={closeFullStatisticDialog}
        />

        {contextMenuNodeHold &&
            <Menu open={contextMenuOpen} onClose={closeMenu}
                anchorReference="anchorPosition"
                anchorPosition={menuAnchor}
                transitionDuration={1}  // 1 ms since it may flash at (0, 0) if set to 0 (due to anchorPosition)
            >
                {/* For Direcrtory Node */}
                {contextMenuNodeHold.data.kind === 'directory' && [
                    <ListItem key={1}>
                        <Typography variant="body2" fontWeight="bolder" color="textSecondary"
                            sx={{ lineBreak: 'anywhere' }}
                        >
                            {`文件夹: ${contextMenuNodeHold.data.name}`}
                        </Typography>
                    </ListItem>,
                    <MenuItem key={2} >
                        <ListItemIcon><Delete color="error" /></ListItemIcon>
                        <ListItemText>
                            <Typography color="error">
                                {`移除目录 (${contextMenuNodeHold.data.childrenCount} 个子项)`}
                            </Typography>
                        </ListItemText>
                    </MenuItem>
                ]}
                {/* For File Node */}
                {contextMenuNodeHold.data.kind === 'file' && [
                    <ListItemButton key={1}
                        onClick={contextMenuSeeFileDetail}
                    >
                        <Box display="flex" flexDirection="column" alignItems="center"
                            maxWidth="12rem"
                        >

                            <ImageFilePreviewBox
                                file={contextMenuNodeHold.data.file}
                                height="6rem"
                                width="9rem"
                                flexGrow={1}
                                mb={0.5}
                            />

                            <Typography variant="body2" fontWeight="bolder" color="textSecondary"
                                sx={{ lineBreak: 'anywhere' }}
                            >
                                {contextMenuNodeHold.data.file.name}
                            </Typography>
                        </Box>
                    </ListItemButton>,
                    <MenuItem key={2}
                        onClick={contextMenuSeeFileDetail}
                    >
                        <ListItemIcon><Info /></ListItemIcon>
                        <ListItemText>详情</ListItemText>
                    </MenuItem>,
                    <MenuItem key={3} >
                        <ListItemIcon><Delete color="error" /></ListItemIcon>
                        <ListItemText>
                            <Typography color="error">
                                移除
                            </Typography>
                        </ListItemText>
                    </MenuItem>
                ]}
            </Menu>
        }



        {children}
    </fileListDialogCallerContext.Provider>
}