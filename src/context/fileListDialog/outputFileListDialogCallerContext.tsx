import { Box, Typography, Menu, MenuItem, ListItem, ListItemButton, ListItemIcon, ListItemText, PopoverPosition } from "@mui/material";
import { Info, Delete, Download, FolderZip } from "@mui/icons-material";
import { createContext, useCallback, useState, useMemo, useEffect, useContext } from "react";
import ImageFilePreviewBox from "../../components/ImageFilePreviewBox";
import { ACCEPT_MIMEs } from "../../utils/imageMIMEs";
import { FileListStatistic, WebkitFileNodeData, TreeNode, defaultFileListStatistic } from "../fileListContext";
import SingleFileDetailDialog from "./fileListDialogsAndMenus/SingleFileDetailDialog";
import FileListStatisticDialog from "./fileListDialogsAndMenus/FileListStatisticDialog";
import { fileListContext as _fileListContext, webkitFileListContext as _webkitFileListContext } from "../../context/fileListContext";
import { outputFileListContext, OutputTreeNode } from "../outputFileListContext";
import OutputFileCompareDialog from "./fileListDialogsAndMenus/OutputFileCompareDialog";
import { fireFileDownload } from "../../utils/randomUtils";
import { FS_Mode } from "../../utils/browserCompability";
import OutputFolderSaveAsDialog from "./fileListDialogsAndMenus/OutputFolderSaveAsDialog";
import OutputFolderSaveZipDialog from "./fileListDialogsAndMenus/OutputFolderSaveZipDialog";


type OutputFileListDialogCallerContext = {
    callNodePreviewDialog: (node: OutputTreeNode) => void,

    callFileListItemContextMenu: (anchorPosition: { top: number, left: number }, node: OutputTreeNode) => void,

    /** This is for treeview to display a focused look when menu is open.
     * 
     * Equals the nodeId.
     */
    contextMenuActiveItem: string;
}

export const outputFileListDialogCallerContext = createContext<OutputFileListDialogCallerContext>({
    callNodePreviewDialog(node) { throw new Error('Not init') },
    callFileListItemContextMenu(anchorPosition, node) { },
    contextMenuActiveItem: ''
});


export function OutputFileListDialogCallerContextProvider({ children }: { children: React.ReactNode }) {

    // File Preview Dialog //
    const [previewNode, setPreviewNode] = useState<OutputTreeNode | null>(null);

    const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
    const closePreviewDialog = useCallback(() => setPreviewDialogOpen(false), []);

    const callPreviewDialog = useCallback((node: OutputTreeNode) => {
        setPreviewNode(node);
        setPreviewDialogOpen(true);
    }, []);

    // Context Menu //
    const { } = useContext(outputFileListContext);

    const [contextMenuNodeHold, setContextMenuNodeHold] = useState<OutputTreeNode>();
    const [contextMenuOpen, setContextMenuOpen] = useState(false);
    const closeMenu = useCallback(() => setContextMenuOpen(false), []);
    const [menuAnchor, setMenuAnchor] = useState<PopoverPosition>();
    const callFileListItemContextMenu = useCallback((anchorPosition: { top: number, left: number }, node: OutputTreeNode) => {
        setMenuAnchor(anchorPosition);
        setContextMenuOpen(true);
        setContextMenuNodeHold(node);
    }, []);

    const contextMenuSeeFileDetail = useCallback(() => {
        setContextMenuOpen(false);
        if (!contextMenuNodeHold || contextMenuNodeHold?.kind !== 'file') return;
        callPreviewDialog(contextMenuNodeHold);

    }, [contextMenuNodeHold, callPreviewDialog]);

    const contextMenuDownloadOne = useCallback(() => {
        if (contextMenuNodeHold && contextMenuNodeHold.file) {
            fireFileDownload(contextMenuNodeHold.file);
        }
    }, [contextMenuNodeHold]);


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
    }, [contextMenuOpen, contextMenuNodeHold]);

    const [folderSaveDialogOperation, setFolderSaveDialogOperation] = useState<{
        handle: FileSystemDirectoryHandle,
        node: OutputTreeNode
    } | null>(null);

    const folderSaveOnEnd = useCallback(() => {
        setFolderSaveDialogOperation(null);
    }, []);

    const contextMenuFolderSaveToLocal = useCallback(() => {
        if (!contextMenuNodeHold) return;
        setContextMenuOpen(false);
        // async. whatever, not gonna care about the mem leak then. Probably won't happen.
        window.showDirectoryPicker({
            id: 'image-save-to',
            mode: 'readwrite'
        }).then((handle) => {
            setFolderSaveDialogOperation({
                handle,
                node: contextMenuNodeHold
            })
        }).catch((err) => {
            import.meta.env.DEV && console.log(err);
        });
    }, [contextMenuNodeHold]);

    const [zipDownloadDialogOperation, setZipDownloadDialogOperation] = useState<{ nodes: OutputTreeNode[] } | null>(null)
    const zipSaveOnEnd = useCallback(() => {
        setZipDownloadDialogOperation(null);
    }, []);

    const contextMenuFolderDownloadZip = useCallback(() => {
        if (!contextMenuNodeHold) return;
        setContextMenuOpen(false);
        setZipDownloadDialogOperation({
            nodes: [contextMenuNodeHold]
        });
    }, [contextMenuNodeHold]);



    return <outputFileListDialogCallerContext.Provider value={{
        callNodePreviewDialog: callPreviewDialog,
        callFileListItemContextMenu,
        contextMenuActiveItem
    }}>
        {previewNode && (
            <OutputFileCompareDialog
                node={previewNode}
                open={previewDialogOpen}
                onClose={closePreviewDialog}

            />
        )}

        {zipDownloadDialogOperation && (
            <OutputFolderSaveZipDialog nodes={zipDownloadDialogOperation.nodes}
                onFinished={zipSaveOnEnd}
            />
        )}

        {folderSaveDialogOperation &&
            <OutputFolderSaveAsDialog rootHandle={folderSaveDialogOperation.handle}
                onFinished={folderSaveOnEnd}
                node={folderSaveDialogOperation.node} />
        }


        <Menu open={contextMenuOpen} onClose={closeMenu}
            anchorReference="anchorPosition"
            anchorPosition={menuAnchor}
            transitionDuration={0}
        >
            {/* For Direcrtory Node */}
            {contextMenuNodeHold && contextMenuNodeHold.kind === 'directory' && [
                <ListItem key={1}>
                    <Typography variant="body2" fontWeight="bolder" color="textSecondary"
                        sx={{ lineBreak: 'anywhere' }}
                    >
                        {`文件夹: ${contextMenuNodeHold.name}`}
                    </Typography>
                </ListItem>,
                <ListItem key={2} dense>
                    <Typography variant="body2" color="textSecondary" sx={{ whiteSpace: 'pre-wrap' }}>
                        {`文件数量: ${contextMenuNodeHold.childrenCount}`
                            +
                            (contextMenuNodeHold.errorChildrenCount > 0 ?
                                `\n有 ${contextMenuNodeHold.errorChildrenCount} 个子项发生错误。`
                                : ''
                            )
                        }
                    </Typography>
                </ListItem>,
                ...contextMenuNodeHold.finished ? [
                    <MenuItem key={3} onClick={contextMenuFolderDownloadZip}>
                        <ListItemIcon><FolderZip color="primary" /></ListItemIcon>
                        <ListItemText>
                            <Typography color={(theme) => theme.palette.primary.main}>
                                打包下载
                            </Typography>
                        </ListItemText>
                    </MenuItem>,
                    ...FS_Mode === 'publicFS' ? [
                        <MenuItem key={'publicFS'} onClick={contextMenuFolderSaveToLocal}>
                            <ListItemIcon><Download color="primary" /></ListItemIcon>
                            <ListItemText>
                                <Typography color={(theme) => theme.palette.primary.main}>
                                    保存到本地
                                </Typography>
                            </ListItemText>
                        </MenuItem>
                    ] : []
                ] : [
                    <ListItem key={3} dense>
                        <Typography variant="body2" color="textSecondary" sx={{ whiteSpace: 'pre-wrap' }}>
                            {`进度: ${(contextMenuNodeHold.convertProgress * 100).toFixed(0)}%`}
                        </Typography>
                    </ListItem>
                ]
            ]}
            {/* For File Node */}
            {contextMenuNodeHold && contextMenuNodeHold.kind === 'file' && [
                <ListItemButton key={1}
                    onClick={contextMenuSeeFileDetail}
                >
                    <Box display="flex" flexDirection="column" alignItems="center"
                        maxWidth="12rem"    // <------------------------------------------------------
                    >

                        <ImageFilePreviewBox
                            file={contextMenuNodeHold.file}
                            error={!!contextMenuNodeHold.error}
                            height="6rem"
                            width="9rem"
                            flexGrow={1}
                            mb={0.5}
                        />

                        <Typography variant="body2" fontWeight="bolder" color="textSecondary"
                            sx={{ lineBreak: 'anywhere' }}
                        >
                            {contextMenuNodeHold.name}
                        </Typography>
                    </Box>
                </ListItemButton>,
                ...contextMenuNodeHold.error ? [
                    // Error 
                    <ListItem key={2}>
                        <Typography variant="body2" color="textSecondary" maxWidth="12rem"  // -------
                        >
                            错误信息: {contextMenuNodeHold.error}
                        </Typography>
                    </ListItem>
                ] :
                    contextMenuNodeHold.finished ?
                        [
                            // No error and is finished
                            <MenuItem key={2} onClick={contextMenuDownloadOne}>
                                <ListItemIcon><Download color="primary" /></ListItemIcon>
                                <ListItemText>
                                    <Typography color={(theme) => theme.palette.primary.main}>
                                        下载
                                    </Typography>
                                </ListItemText>
                            </MenuItem>,
                            <MenuItem key={3}
                                onClick={contextMenuSeeFileDetail}
                            >
                                <ListItemIcon><Info /></ListItemIcon>
                                <ListItemText>详情</ListItemText>
                            </MenuItem>,
                        ] :
                        [
                            // Pending
                            <ListItem key={2}>
                                <Typography variant="body2" color="textSecondary" maxWidth="12rem"  // -------
                                >
                                    进度: {`${(contextMenuNodeHold.convertProgress * 100).toFixed(0)}%`}
                                </Typography>
                            </ListItem>
                        ]
            ]}
        </Menu>




        {children}
    </outputFileListDialogCallerContext.Provider >
}