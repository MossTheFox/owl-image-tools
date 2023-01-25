import { Box, Typography, Menu, MenuItem, ListItem, ListItemButton, ListItemIcon, ListItemText, PopoverPosition } from "@mui/material";
import { Info, Delete } from "@mui/icons-material";
import { createContext, useCallback, useState, useMemo, useEffect, useContext } from "react";
import ImageFilePreviewBox from "../../components/ImageFilePreviewBox";
import { ACCEPT_MIMEs } from "../../utils/imageMIMEs";
import { FileListStatistic, WebkitFileNodeData, TreeNode, defaultFileListStatistic } from "../fileListContext";
import SingleFileDetailDialog from "./fileListDialogsAndMenus/SingleFileDetailDialog";
import FileListStatisticDialog from "./fileListDialogsAndMenus/FileListStatisticDialog";
import { fileListContext as _fileListContext, webkitFileListContext as _webkitFileListContext } from "../../context/fileListContext";

type FileNode = TreeNode<WebkitFileNodeData>;

type FileListDialogCallerContext = {
    callFileListStatisticDialog: (detail: FileListStatistic | FileListStatistic[]) => void,
    callFilePreviewDialog: (file: File, node: FileNode) => void,

    callFileListItemContextMenu: (anchorPosition: { top: number, left: number }, node: FileNode) => void,

    contextMenuActiveItem: string;
}

export const fileListDialogCallerContext = createContext<FileListDialogCallerContext>({
    callFileListStatisticDialog(detail) { throw new Error('Not init') },
    callFilePreviewDialog(file, node) { throw new Error('Not init') },
    callFileListItemContextMenu(anchorPosition, node) { },
    contextMenuActiveItem: ''
});


export function FileListDialogCallerContextProvider({ children }: { children: React.ReactNode }) {

    // File Preview Dialog //
    const [previewFile, setPreviewFile] = useState<File | null>(null);

    const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
    const closePreviewDialog = useCallback(() => setPreviewDialogOpen(false), []);

    const callPreviewDialog = useCallback((file: File, fileNode: FileNode) => {
        setPreviewFile(file);
        setPreviewDialogOpen(true);
    }, []);

    // Statistic Dialog //

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

    // Context Menu //
    const fileListContext = useContext(_fileListContext);
    const webkitFileListContext = useContext(_webkitFileListContext);

    const [contextMenuNodeHold, setContextMenuNodeHold] = useState<FileNode>();
    const [contextMenuOpen, setContextMenuOpen] = useState(false);
    const closeMenu = useCallback(() => setContextMenuOpen(false), []);
    const [menuAnchor, setMenuAnchor] = useState<PopoverPosition>();
    const callFileListItemContextMenu = useCallback((anchorPosition: { top: number, left: number }, node: FileNode) => {
        setMenuAnchor(anchorPosition);
        setContextMenuOpen(true);
        setContextMenuNodeHold(node);
    }, []);

    const contextMenuSeeFileDetail = useCallback(() => {
        setContextMenuOpen(false);
        if (!contextMenuNodeHold || contextMenuNodeHold?.data.kind !== 'file') return;
        callPreviewDialog(contextMenuNodeHold.data.file, contextMenuNodeHold);

    }, [contextMenuNodeHold, callPreviewDialog]);

    const deleteNode = useCallback(() => {
        console.log("WARRR")
        if (!contextMenuNodeHold) return;

        webkitFileListContext.deleteNode(contextMenuNodeHold as TreeNode<WebkitFileNodeData>);

        setContextMenuOpen(false);
    }, [contextMenuNodeHold, webkitFileListContext.deleteNode]);

    // When context menu is open, right click outside will close it
    useEffect(() => {
        if (!contextMenuOpen) return;

        const listener = function (e: MouseEvent) {
            // Click target is hidden then it means it's the backdrop.
            // Allow fire context menu on the image.
            if (e.target && !(e.target instanceof HTMLImageElement)) {
                e.preventDefault();
                setContextMenuOpen(false);
            }
        };

        document.body.addEventListener('contextmenu', listener);
        return () => {
            document.body.removeEventListener('contextmenu', listener);
        }
    }, [contextMenuOpen]);

    // When context menu is closed, clear all refs here
    useEffect(() => {
        if (!contextMenuOpen) {
            setContextMenuNodeHold(undefined);
        }
    }, [contextMenuOpen]);

    // This is for TreeView active object
    const contextMenuActiveItem = useMemo(() => {
        if (contextMenuOpen && contextMenuNodeHold) return contextMenuNodeHold.nodeId;
        return '';
    }, [contextMenuOpen, contextMenuNodeHold])


    return <fileListDialogCallerContext.Provider value={{
        callFilePreviewDialog: callPreviewDialog,
        callFileListStatisticDialog,
        callFileListItemContextMenu,
        contextMenuActiveItem
    }}>
        {previewFile && (
            <SingleFileDetailDialog
                file={previewFile}
                open={previewDialogOpen}
                onClose={closePreviewDialog}

            />
        )}

        <FileListStatisticDialog
            detail={fullStatistic}
            open={fullStatisticDialogOpen}
            onClose={closeFullStatisticDialog}
        />

        <Menu open={contextMenuOpen} onClose={closeMenu}
            anchorReference="anchorPosition"
            anchorPosition={menuAnchor}
            transitionDuration={0}
        >
            {/* For Direcrtory Node */}
            {contextMenuNodeHold && contextMenuNodeHold.data.kind === 'directory' && [
                <ListItem key={1}>
                    <Typography variant="body2" fontWeight="bolder" color="textSecondary"
                        sx={{ lineBreak: 'anywhere' }}
                    >
                        {`文件夹: ${contextMenuNodeHold.data.name}`}
                    </Typography>
                </ListItem>,
                <MenuItem key={2} onClick={deleteNode} >
                    <ListItemIcon><Delete color="error" /></ListItemIcon>
                    <ListItemText>
                        <Typography color={(theme) => theme.palette.error.main}>
                            {`移除目录 (${contextMenuNodeHold.data.childrenCount} 个子项)`}
                        </Typography>
                    </ListItemText>
                </MenuItem>
            ]}
            {/* For File Node */}
            {contextMenuNodeHold && contextMenuNodeHold.data.kind === 'file' && [
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
                <MenuItem key={3} onClick={deleteNode} >
                    <ListItemIcon><Delete color="error" /></ListItemIcon>
                    <ListItemText>
                        <Typography color={(theme) => theme.palette.error.main}>
                            移除
                        </Typography>
                    </ListItemText>
                </MenuItem>
            ]}
        </Menu>




        {children}
    </fileListDialogCallerContext.Provider >
}