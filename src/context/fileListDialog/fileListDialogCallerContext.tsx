import { Dialog, DialogTitle, DialogContent, DialogActions, Box, Button, DialogProps, TableContainer, Table, TableHead, TableBody, TableCell, TableRow, Typography, Menu, MenuItem, ListItem, ListItemButton, ListItemIcon, ListItemText, PopoverPosition } from "@mui/material";
import { Info, Delete } from "@mui/icons-material";
import { createContext, useCallback, useState, useMemo } from "react";
import ImageFilePreviewBox from "../../components/ImageFilePreviewBox";
import { ACCEPT_MIMEs } from "../../utils/imageMIMEs";
import { FileListStatistic, FileNodeData, WebkitFileNodeData, TreeNode, defaultFileListStatistic } from "../fileListContext";
import SingleFileDetailDialog from "./fileListDialogsAndMenus/SingleFileDetailDialog";
import FileListStatisticDialog from "./fileListDialogsAndMenus/FileListStatisticDialog";

type FileNode = TreeNode<FileNodeData> | TreeNode<WebkitFileNodeData>;

type FileListDialogCallerContext = {
    callFileListStatisticDialog: (detail: FileListStatistic | FileListStatistic[]) => void,
    callFilePreviewDialog: (file: File, type: 'FS' | 'no_FS', node: FileNode) => void,

    callFileListItemContextMenu: (anchorPosition: { top: number, left: number }, node: FileNode, type: 'FS' | 'no_FS') => void,

    contextMenuActiveItem: string;
}

export const fileListDialogCallerContext = createContext<FileListDialogCallerContext>({
    callFileListStatisticDialog(detail) { throw new Error('Not init') },
    callFilePreviewDialog(file, type, node) { throw new Error('Not init') },
    callFileListItemContextMenu(anchorPosition, node, type) { },
    contextMenuActiveItem: ''
});


export function FileListDialogCallerContextProvider({ children }: { children: React.ReactNode }) {

    // File Preview Dialog //

    const [previewFile, setPreviewFile] = useState<File | null>(null);
    const [mode, setMode] = useState<'FS' | 'no_FS'>('FS');

    const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
    const closePreviewDialog = useCallback(() => setPreviewDialogOpen(false), []);
    const callPreviewDialog = useCallback((file: File, fileMode: typeof mode, fileNode: FileNode) => {
        setMode(fileMode);
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