import { TreeView } from "@mui/lab";
import { Typography, Box, ButtonGroup, Button, Link, Tooltip, Menu, MenuItem } from "@mui/material";
import { ExpandMore, ChevronRight, List as ListIcon, ViewList } from "@mui/icons-material";
import { useContext, useMemo, useCallback, useState, useRef } from "react";
import { fileListContext as _fileListContext, TreeNode, webkitFileListContext as _webkitFileListContext, WebkitFileNodeData } from "../../../context/fileListContext";
import { fileListDialogCallerContext } from "../../../context/fileListDialog/fileListDialogCallerContext";
import FileTreeItem from "./treeItems/FileTreeItem";
import FolderTreeItem from "./treeItems/FolderTreeItem";
import BGTransitionBox from "../../../components/styledComponents/BGTransitionBox";

/**
 * Tree Renderer.
 */
function RenderTreeItem({
    rootNode,
    previewMode
}: {
    rootNode: TreeNode<WebkitFileNodeData>,
} & {
    previewMode: boolean
}) {

    return <>
        {rootNode.data.kind === 'file' ? (
            <FileTreeItem file={rootNode.data.file} nodeId={rootNode.nodeId} previewMode={previewMode} />
        ) : (
            <FolderTreeItem childrenCount={rootNode.data.childrenCount}
                name={rootNode.data.name}
                nodeId={rootNode.nodeId}>

                {rootNode.children.sort((a, b) => {
                    if (a.data.kind === 'directory' && b.data.kind === 'file') return -1;
                    if (a.data.kind === 'file' && b.data.kind === 'directory') return 1;
                    return 0;
                }).map((v, i) => (
                    <RenderTreeItem key={i} rootNode={v} previewMode={previewMode} />
                ))}
            </FolderTreeItem>
        )}

    </>
}

export default function FileListPreview() {

    const webkitFileListContext = useContext(_webkitFileListContext);
    const { contextMenuActiveItem } = useContext(fileListDialogCallerContext);

    const totalFiles = useMemo(() => webkitFileListContext.statistic.totalFiles,
        [webkitFileListContext.statistic]);

    const [previewMode, setPreviewMode] = useState(false);
    const enablePreview = useCallback(() => setPreviewMode(true), []);
    const disablePreview = useCallback(() => setPreviewMode(false), []);

    const dialogCaller = useContext(fileListDialogCallerContext);

    const callFullStatisticDialog = useCallback(() => {
        dialogCaller.callFileListStatisticDialog([
            webkitFileListContext.statistic
        ]);
    }, [dialogCaller.callFileListStatisticDialog, webkitFileListContext.statistic]);

    const menuAnchor = useRef<HTMLDivElement>(null);
    const [open, setOpen] = useState(false);
    const openMenu = useCallback(() => setOpen(true), []);
    const closeMenu = useCallback(() => setOpen(false), []);

    const clearAll = useCallback(() => {
        webkitFileListContext.clearNodes();
        closeMenu();
    }, [closeMenu, webkitFileListContext.clearNodes]);

    return <>
        {/* Note: The root layer of file array CAN have duplicated filenames or directory names.
            Use tree nodeId as key
        */}
        <BGTransitionBox display="flex" justifyContent="space-between" alignItems="center" mb={1}
            // Sticky
            position="sticky"
            top={0}
            bgcolor={(theme) => theme.palette.background.paper}
            zIndex={1}
            pb={0.5}

            // Mobile (especially Safari) Selection disabled
            // Not sure if it helps.
            sx={{
                '& > *': {
                    WebkitUserSelect: 'none',
                    userSelect: 'none'
                }
            }}
        >
            {totalFiles > 0 ? (

                <Box display="flex" justifyContent="left" alignItems="center" gap={1}>
                    <Typography variant="body2" color='textSecondary' display="inline-block" whiteSpace="nowrap">
                        {`${totalFiles} 个文件`}
                    </Typography>

                    <Link component="button"
                        variant="body2"
                        underline="hover"
                        whiteSpace="nowrap"
                        onClick={callFullStatisticDialog}
                    >
                        查看详细信息
                    </Link>

                </Box>
            ) : (
                <Typography variant="body2" color='textSecondary' display="inline-block">
                    文件列表为空
                </Typography>
            )}
            <ButtonGroup variant="outlined" size="small" disableElevation>
                <Tooltip title="紧凑列表" arrow>
                    <Button variant={previewMode ? "outlined" : "contained"} aria-label="Show list"
                        onClick={disablePreview}
                    >
                        <ListIcon fontSize="small" />
                    </Button>
                </Tooltip>
                <Tooltip title="显示预览" arrow>
                    <Button variant={!previewMode ? "outlined" : "contained"} aria-label="Show list with preview"
                        onClick={enablePreview}
                    >
                        <ViewList fontSize="small" />
                    </Button>
                </Tooltip>
            </ButtonGroup>
        </BGTransitionBox>

        {webkitFileListContext.inputFileTreeRoots.length > 0 && <Box mb={1}>
            <Box display='flex' justifyContent='space-between' alignItems='center' pb={1}>
                <Typography variant="body1" fontWeight="bolder" component="div"
                    display='flex' gap={1} whiteSpace="nowrap" ref={menuAnchor}
                >
                    文件列表 <Link component="button" underline="hover" onClick={openMenu}>选项</Link>
                </Typography>
                <Typography variant="body2" color="textSecondary">
                    {`共 ${webkitFileListContext.statistic.totalFiles} 个文件`}
                </Typography>

                <Menu open={open} onClose={closeMenu} anchorEl={menuAnchor.current}>
                    <MenuItem dense onClick={clearAll}>
                        <Typography variant="body2" color={(t) => t.palette.error.main} fontWeight="bolder">
                            清空文件
                        </Typography>
                    </MenuItem>
                </Menu>


            </Box>
            <TreeView defaultCollapseIcon={<ExpandMore />} defaultExpandIcon={<ChevronRight />}
                selected={contextMenuActiveItem}
                sx={{
                    '& *': {
                        userSelect: 'none',
                        WebkitTouchCallout: 'none',
                        WebkitUserSelect: 'none',
                    }
                }}
            >
                {webkitFileListContext.inputFileTreeRoots.sort((a, b) => {
                    if (a.data.kind === 'directory' && b.data.kind === 'file') return -1;
                    if (a.data.kind === 'file' && b.data.kind === 'directory') return 1;
                    return 0;
                }).map((v, i) => (
                    <RenderTreeItem rootNode={v} key={v.nodeId} previewMode={previewMode} />
                ))}
            </TreeView>
        </Box>}
    </>
}