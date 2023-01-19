import { TreeView, TreeItem } from "@mui/lab";
import { Typography, Box, ButtonGroup, Button, Link, Tooltip } from "@mui/material";
import { ExpandMore, ChevronRight, FolderOpen, List as ListIcon, ViewList } from "@mui/icons-material";
import { useContext, useMemo, useCallback, useState } from "react";
import { fileListContext as _fileListContext, FileNodeData, TreeNode, webkitFileListContext as _webkitFileListContext, WebkitFileNodeData } from "../../../context/fileListContext";
import { FS_Mode } from "../../../utils/browserCompability";
import { parseFileSizeString } from "../../../utils/randomUtils";

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
                <TreeItem nodeId={rootNode.nodeId} label={

                    <Box display={'flex'} justifyContent={'center'}>
                        <Typography variant="body1" color='textSecondary' whiteSpace='nowrap' flexGrow={1} overflow='hidden'>
                            {rootNode.data.file.name}
                        </Typography>
                        <Typography variant="body1" color="textSecondary" whiteSpace='nowrap'>
                            {parseFileSizeString(rootNode.data.file.size)}
                        </Typography>
                    </Box>

                } />
            ) : (
                <TreeItem nodeId={rootNode.nodeId} label={
                    <Box display={'flex'} justifyContent={'space-between'}>
                        <Box component={FolderOpen} color='inherit' mr={1} />
                        <Typography variant="body1" fontWeight='bolder' whiteSpace='nowrap' flexGrow={1}>
                            {rootNode.data.name}
                        </Typography>
                        <Typography variant="body1" color="textSecondary" whiteSpace='nowrap'>
                            {rootNode.children.length}
                        </Typography>
                    </Box>
                }>
                    {rootNode.children.sort((a, b) => {
                        if (a.data.kind === 'directory' && b.data.kind === 'file') return -1;
                        if (a.data.kind === 'file' && b.data.kind === 'directory') return 1;
                        return 0;
                    }).map((v, i) => (
                        <RenderTreeItem key={i} rootNode={v} type='no_FS' previewMode={previewMode} />
                    ))}
                </TreeItem>
            )}
        </>}

        {type === 'FS' && <>
            {rootNode.data.kind === 'file' ? (
                <TreeItem nodeId={rootNode.nodeId} label={
                    <Box display={'flex'} justifyContent={'center'}>
                        <Typography variant="body1" color='textSecondary' whiteSpace='nowrap' flexGrow={1} overflow='hidden'>
                            {rootNode.data.file.name}
                        </Typography>
                        <Typography variant="body1" color="textSecondary" whiteSpace='nowrap'>
                            {parseFileSizeString(rootNode.data.file.size)}
                        </Typography>
                    </Box>
                } />
            ) : (
                <TreeItem nodeId={rootNode.nodeId} label={
                    <Box display={'flex'} justifyContent={'space-between'}>
                        <Box component={FolderOpen} mr={1} />
                        <Typography variant="body1" fontWeight='bolder' whiteSpace='nowrap' flexGrow={1}>
                            {rootNode.data.handle.name}
                        </Typography>
                        <Typography variant="body1" color="textSecondary" whiteSpace='nowrap'>
                            {rootNode.data.childrenCount}
                        </Typography>

                    </Box>
                }>
                    {rootNode.children.sort((a, b) => {
                        if (a.data.kind === 'directory' && b.data.kind === 'file') return -1;
                        if (a.data.kind === 'file' && b.data.kind === 'directory') return 1;
                        return 0;
                    }).map((v, i) => (
                        <RenderTreeItem key={i} rootNode={v} type='FS' previewMode={previewMode} />
                    ))}
                </TreeItem>
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
                    <Link component="button" variant="body2" underline="hover" whiteSpace="nowrap">
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

        {FS_Mode === 'publicFS' && fileListContext.inputFileHandleTrees.length > 0 && <>
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
        </>}
        {webkitFileListContext.inputFileTreeRoots.length > 0 && <>
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
        </>}
    </Box>
}