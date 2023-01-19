import { TreeView, TreeItem } from "@mui/lab";
import { Typography, Box, ButtonGroup, Button, Link, Tooltip } from "@mui/material";
import { ExpandMore, ChevronRight, FolderOpen, List as ListIcon, ViewList } from "@mui/icons-material";
import { useContext, useMemo, useCallback, useState } from "react";
import { fileListContext, fileListContext as _fileListContext, FileNodeData, TreeNode, webkitFileListContext, webkitFileListContext as _webkitFileListContext, WebkitFileNodeData } from "../../../context/fileListContext";
import { FS_Mode } from "../../../utils/browserCompability";
import { parseFileSizeString } from "../../../utils/randomUtils";
import ImageFilePreviewBox from "../../../components/ImageFilePreviewBox";
import { fileListDialogCallerContext } from "../../../context/fileListDialog/fileListDialogCallerContext";


function FileTreeItem({
    nodeId,
    file,
    previewMode,
    type,
}: {
    nodeId: string;
    file: File;
    previewMode: boolean;
    type: 'FS' | 'no_FS'
}) {

    const caller = useContext(fileListDialogCallerContext);

    const webkitFile = useContext(webkitFileListContext);
    const fsFile = useContext(fileListContext);

    const callPreviewDialog = useCallback(() => {

        const node = type === 'FS' ? fsFile.nodeMap.get(nodeId) : webkitFile.nodeMap.get(nodeId);
        if (!node) return;
        caller.callFilePreviewDialog(file, type, node)

    }, [webkitFile, fsFile, caller.callFilePreviewDialog, file]);

    return <TreeItem nodeId={nodeId}
        onClick={callPreviewDialog}
        label={
            <Box display={'flex'} justifyContent={'space-between'} alignItems="center">
                {previewMode && <ImageFilePreviewBox file={file}
                    height="3rem"
                    width="3rem"
                    minWidth="3rem"
                    m={'1px'}
                    mr={1}
                />}
                {previewMode ? <Box flexGrow={1}
                    display="flex"
                    flexDirection="column"
                    justifyContent="space-between"
                    overflow="hidden"
                >
                    <Typography variant="body1" color='textSecondary' whiteSpace='nowrap' flexGrow={1} overflow='hidden'>
                        {file.name}
                    </Typography>
                    <Typography variant="body1" color="textSecondary" whiteSpace='nowrap' textAlign="end">
                        {parseFileSizeString(file.size)}
                    </Typography>
                </Box> : <>
                    <Typography variant="body1" color='textSecondary' whiteSpace='nowrap' flexGrow={1} overflow='hidden'>
                        {file.name}
                    </Typography>
                    <Typography variant="body1" color="textSecondary" whiteSpace='nowrap'>
                        {parseFileSizeString(file.size)}
                    </Typography>
                </>}
            </Box>

        } />
}

function FolderTreeItem({
    nodeId,
    name,
    childrenCount,
    children
}: {
    nodeId: string;
    name: string;
    childrenCount: number;
    children: React.ReactNode
}) {
    return <TreeItem nodeId={nodeId} label={
        <Box display={'flex'} justifyContent={'space-between'}>
            <Box component={FolderOpen} color='inherit' mr={1} />
            <Typography variant="body1" fontWeight='bolder' whiteSpace='nowrap' flexGrow={1}>
                {name}
            </Typography>
            <Typography variant="body1" color="textSecondary" whiteSpace='nowrap'>
                {childrenCount}
            </Typography>
        </Box>
    }>
        {children}
    </TreeItem>
}

function RenderTreeItem({
    rootNode,
    type,
    previewMode
}: ({
    rootNode: TreeNode<FileNodeData>,
    type: 'FS'
} | {
    rootNode: TreeNode<WebkitFileNodeData>,
    type: 'no_FS'
}) & {
    previewMode: boolean
}) {

    return <>
        {type === 'no_FS' && <>
            {rootNode.data.kind === 'file' ? (
                <FileTreeItem file={rootNode.data.file} nodeId={rootNode.nodeId} previewMode={previewMode} type={type} />
            ) : (
                <FolderTreeItem childrenCount={rootNode.data.childrenCount}
                    name={rootNode.data.name}
                    nodeId={rootNode.nodeId}>

                    {rootNode.children.sort((a, b) => {
                        if (a.data.kind === 'directory' && b.data.kind === 'file') return -1;
                        if (a.data.kind === 'file' && b.data.kind === 'directory') return 1;
                        return 0;
                    }).map((v, i) => (
                        <RenderTreeItem key={i} rootNode={v} type='no_FS' previewMode={previewMode} />
                    ))}
                </FolderTreeItem>
            )}
        </>}

        {type === 'FS' && <>
            {rootNode.data.kind === 'file' ? (
                <FileTreeItem file={rootNode.data.file} nodeId={rootNode.nodeId} previewMode={previewMode} type={type} />
            ) : (
                <FolderTreeItem childrenCount={rootNode.data.childrenCount} name={rootNode.data.handle.name}
                    nodeId={rootNode.nodeId}>

                    {rootNode.children.sort((a, b) => {
                        if (a.data.kind === 'directory' && b.data.kind === 'file') return -1;
                        if (a.data.kind === 'file' && b.data.kind === 'directory') return 1;
                        return 0;
                    }).map((v, i) => (
                        <RenderTreeItem key={i} rootNode={v} type='FS' previewMode={previewMode} />
                    ))}
                </FolderTreeItem>
            )}
        </>}
    </>
}

export default function FileListPreview() {

    const fileListContext = useContext(_fileListContext);
    const webkitFileListContext = useContext(_webkitFileListContext);

    const totalFiles = useMemo(() => fileListContext.statistic.totalFiles + webkitFileListContext.statistic.totalFiles,
        [fileListContext, webkitFileListContext]);

    const [previewMode, setPreviewMode] = useState(false);
    const enablePreview = useCallback(() => setPreviewMode(true), []);
    const disablePreview = useCallback(() => setPreviewMode(false), []);

    const dialogCaller = useContext(fileListDialogCallerContext);

    const callFullStatisticDialog = useCallback(() => {
        dialogCaller.callFileListStatisticDialog([
            webkitFileListContext.statistic,
            fileListContext.statistic
        ]);
    }, [dialogCaller.callFileListStatisticDialog, webkitFileListContext.statistic, fileListContext.statistic]);


    return <Box>
        {/* Note: The root layer of file array CAN have duplicated filenames or directory names.
            Use tree nodeId as key
        */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
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
        </Box>

        {FS_Mode === 'publicFS' && fileListContext.inputFileHandleTrees.length > 0 && <Box mb={1}>
            <Box display='flex' justifyContent='space-between' alignItems='center' pb={1}>
                <Typography variant="body1" fontWeight="bolder">
                    打开的文件夹
                </Typography>
                <Typography variant="body2" color="textSecondary">
                    {`共 ${fileListContext.statistic.totalFiles} 个文件`}
                </Typography>
            </Box>
            <TreeView defaultCollapseIcon={<ExpandMore />} defaultExpandIcon={<ChevronRight />}>
                {fileListContext.inputFileHandleTrees.sort((a, b) => {
                    if (a.data.kind === 'directory' && b.data.kind === 'file') return -1;
                    if (a.data.kind === 'file' && b.data.kind === 'directory') return 1;
                    return 0;
                }).map((v, i) => (
                    <RenderTreeItem type="FS" rootNode={v} key={v.nodeId} previewMode={previewMode} />
                ))}
            </TreeView>
        </Box>}
        {webkitFileListContext.inputFileTreeRoots.length > 0 && <Box mb={1}>
            <Box display='flex' justifyContent='space-between' alignItems='center' pb={1}>
                <Typography variant="body1" fontWeight="bolder">
                    文件列表 (只读)
                </Typography>
                <Typography variant="body2" color="textSecondary">
                    {`共 ${webkitFileListContext.statistic.totalFiles} 个文件`}
                </Typography>
            </Box>
            <TreeView defaultCollapseIcon={<ExpandMore />} defaultExpandIcon={<ChevronRight />}>
                {webkitFileListContext.inputFileTreeRoots.sort((a, b) => {
                    if (a.data.kind === 'directory' && b.data.kind === 'file') return -1;
                    if (a.data.kind === 'file' && b.data.kind === 'directory') return 1;
                    return 0;
                }).map((v, i) => (
                    <RenderTreeItem type="no_FS" rootNode={v} key={v.nodeId} previewMode={previewMode} />
                ))}
            </TreeView>
        </Box>}
    </Box>
}