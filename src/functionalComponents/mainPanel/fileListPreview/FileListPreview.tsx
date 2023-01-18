import { TreeView, TreeItem } from "@mui/lab";
import { Typography, Box } from "@mui/material";
import { ExpandMore, ChevronRight, FolderOpen } from "@mui/icons-material";
import { useContext } from "react";
import { fileListContext as _fileListContext, FileNodeData, TreeNode, webkitFileListContext as _webkitFileListContext, WebkitFileNodeData } from "../../../context/fileListContext";
import { FS_Mode } from "../../../utils/browserCompability";


function RenderTreeItem({
    rootNode,
    type
}: {
    rootNode: TreeNode<FileNodeData>,
    type: 'FS'
} | {
    rootNode: TreeNode<WebkitFileNodeData>,
    type: 'no_FS'
}) {

    return <>
        {type === 'no_FS' && <>
            {rootNode.data.kind === 'file' ? (
                <TreeItem nodeId={rootNode.nodeId} label={rootNode.data.file.name} />
            ) : (
                <TreeItem nodeId={rootNode.nodeId} label={
                    <Box display={'flex'} justifyContent={'center'}>
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
                        <RenderTreeItem key={i} rootNode={v} type='no_FS' />
                    ))}
                </TreeItem>
            )}
        </>}

        {type === 'FS' && <>
            {rootNode.data.kind === 'file' ? (
                <TreeItem nodeId={rootNode.nodeId} label={rootNode.data.name} />
            ) : (
                <TreeItem nodeId={rootNode.nodeId} label={
                    <Box display={'flex'} justifyContent={'center'}>
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
                        <RenderTreeItem key={i} rootNode={v} type='FS' />
                    ))}
                </TreeItem>
            )}
        </>}
    </>
}

export default function FileListPreview() {

    const fileListContext = useContext(_fileListContext);
    const webkitFileListContext = useContext(_webkitFileListContext);


    return <Box>
        {/* Note: The root layer of file array CAN have duplicated filenames or directory names.
            Use tree nodeId as key
        */}
        {fileListContext.inputFileHandleTrees.length === 0 && webkitFileListContext.inputFileTreeRoots.length === 0 && (
            <Typography variant="body2" color='textSecondary' gutterBottom>
                文件列表为空
            </Typography>
        )}
        {FS_Mode === 'publicFS' && fileListContext.inputFileHandleTrees.length > 0 && <>
            <Typography variant="body1" fontWeight="bolder" gutterBottom>
                打开的文件夹
            </Typography>
            <TreeView defaultCollapseIcon={<ExpandMore />} defaultExpandIcon={<ChevronRight />}>
                {fileListContext.inputFileHandleTrees.sort((a, b) => {
                    if (a.data.kind === 'directory' && b.data.kind === 'file') return -1;
                    if (a.data.kind === 'file' && b.data.kind === 'directory') return 1;
                    return 0;
                }).map((v, i) => (
                    <RenderTreeItem type="FS" rootNode={v} key={v.nodeId} />
                ))}
            </TreeView>
        </>}
        {webkitFileListContext.inputFileTreeRoots.length > 0 && <>

            <Typography variant="body1" fontWeight="bolder" gutterBottom>
                文件列表 (只读)
            </Typography>
            <TreeView defaultCollapseIcon={<ExpandMore />} defaultExpandIcon={<ChevronRight />}>
                {webkitFileListContext.inputFileTreeRoots.sort((a, b) => {
                    if (a.data.kind === 'directory' && b.data.kind === 'file') return -1;
                    if (a.data.kind === 'file' && b.data.kind === 'directory') return 1;
                    return 0;
                }).map((v, i) => (
                    <RenderTreeItem type="no_FS" rootNode={v} key={v.nodeId} />
                ))}
            </TreeView>
        </>}
    </Box>
}