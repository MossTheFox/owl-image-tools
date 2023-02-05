import { TreeView } from "@mui/lab";
import { Typography, Box, ButtonGroup, Button, Link, Tooltip, Menu, MenuItem } from "@mui/material";
import { ExpandMore, ChevronRight, List as ListIcon, ViewList } from "@mui/icons-material";
import { useContext, useMemo, useCallback, useState, useRef } from "react";
import { fileListContext as _fileListContext, TreeNode, webkitFileListContext as _webkitFileListContext, WebkitFileNodeData } from "../../../context/fileListContext";
import { fileListDialogCallerContext } from "../../../context/fileListDialog/fileListDialogCallerContext";
import FileTreeItem from "./treeItems/FileTreeItem";
import FolderTreeItem from "./treeItems/FolderTreeItem";
import BGTransitionBox from "../../../components/styledComponents/BGTransitionBox";
import LazyLoadChunk from "../../../components/LazyLoadChunk";

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

    // Note: the `node` is not a state. Don't wrap inside React hooks.

    const [folderChildren, fileChildren] = (() => {
        if (rootNode.data.kind === 'file') {
            return [[], []];
        }
        // folder
        return [
            rootNode.children.filter((v) => v.data.kind === 'directory'),
            rootNode.children.filter((v) => v.data.kind === 'file'),
        ];
    })();

    const FolderChildrenChunks = (() => {
        // 30 in a row
        const result: (typeof folderChildren)[] = [];

        for (let i = 0; i < folderChildren.length; i += 30) {
            result.push(folderChildren.slice(i, i + 30));
        }
        return result;
    })();

    const fileChildrenChunks = (() => {
        // 30 in a row
        const result: (typeof fileChildren)[] = [];

        for (let i = 0; i < fileChildren.length; i += 30) {
            result.push(fileChildren.slice(i, i + 30));
        }
        return result;
    })();

    return <>
        {rootNode.data.kind === 'file' ? (
            <FileTreeItem node={rootNode} previewMode={previewMode} />
        ) : (
            <FolderTreeItem childrenCount={rootNode.data.childrenCount}
                name={rootNode.data.name}
                node={rootNode}>

                {/* Do the lazy load for File and Folder Items */}

                {FolderChildrenChunks.map((v, i) =>
                    <LazyLoadChunk key={i}
                        unitCount={v.length}
                        unitHeight={'1.5em'}
                    >
                        {
                            v.map((v, i) =>
                                <RenderTreeItem key={i} rootNode={v} previewMode={previewMode} />
                            )
                        }
                    </LazyLoadChunk>
                )}

                {fileChildrenChunks.map((v, i) =>
                    <LazyLoadChunk key={i}
                        unitCount={v.length}
                        unitHeight={previewMode ? '3em' : '1.5em'}
                    >
                        {
                            v.map((v, i) =>
                                v.data.kind === 'file' &&
                                <FileTreeItem key={i} node={v} previewMode={previewMode} />
                            )
                        }
                    </LazyLoadChunk>
                )}

            </FolderTreeItem>
        )}

    </>
}

export default function FileListPreview() {

    const { statistic, clearNodes, inputFileTreeRoots } = useContext(_webkitFileListContext);
    const { contextMenuActiveItem } = useContext(fileListDialogCallerContext);

    const totalFiles = useMemo(() => statistic.totalFiles,
        [statistic]);

    const [previewMode, setPreviewMode] = useState(false);
    const enablePreview = useCallback(() => setPreviewMode(true), []);
    const disablePreview = useCallback(() => setPreviewMode(false), []);

    const { callFileListStatisticDialog } = useContext(fileListDialogCallerContext);

    const callFullStatisticDialog = useCallback(() => {
        callFileListStatisticDialog([
            statistic
        ]);
    }, [callFileListStatisticDialog, statistic]);

    const menuAnchor = useRef<HTMLDivElement>(null);
    const [open, setOpen] = useState(false);
    const openMenu = useCallback(() => setOpen(true), []);
    const closeMenu = useCallback(() => setOpen(false), []);

    const clearAll = useCallback(() => {
        clearNodes();
        closeMenu();
    }, [closeMenu, clearNodes]);

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

        {inputFileTreeRoots.length > 0 && <Box mb={1}>
            <Box display='flex' justifyContent='space-between' alignItems='center' pb={1}>
                <Typography variant="body1" fontWeight="bolder" component="div"
                    display='flex' gap={1} whiteSpace="nowrap" ref={menuAnchor}
                >
                    文件列表 <Link component="button" underline="hover" onClick={openMenu}>选项</Link>
                </Typography>
                <Typography variant="body2" color="textSecondary">
                    {`共 ${statistic.totalFiles} 个文件`}
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
                {inputFileTreeRoots.sort((a, b) => {
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