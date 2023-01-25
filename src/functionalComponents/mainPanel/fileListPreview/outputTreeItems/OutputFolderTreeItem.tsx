import { TreeItem } from "@mui/lab";
import { Typography, Box } from "@mui/material";
import { FolderOpen } from "@mui/icons-material";
import { useContext, useCallback } from "react";
import { fileListContext, fileListContext as _fileListContext, TreeNode, webkitFileListContext, webkitFileListContext as _webkitFileListContext } from "../../../../context/fileListContext";
import { fileListDialogCallerContext } from "../../../../context/fileListDialog/fileListDialogCallerContext";
import { OutputTreeNode } from "../../../../context/outputFileListContext";

export default function OutputFolderTreeItem({
    node,
    childrenCount,
    children,
}: {
    node: OutputTreeNode;
    childrenCount: number;
    children: React.ReactNode;
}) {
    const caller = useContext(fileListDialogCallerContext);

    const webkitFile = useContext(webkitFileListContext);

    const callContextMenu = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const anchorPositon = {
            top: e.clientY,
            left: e.clientX
        };

        // TODO: 
    }, [webkitFile.nodeMap, caller.callFileListItemContextMenu]);

    return <TreeItem nodeId={node.nodeId}
        ContentProps={{
            // Right Click (or touch hold): Context Menu
            onContextMenu: callContextMenu
        }}

        label={
            <Box display={'flex'} justifyContent={'space-between'}>
                <Box component={FolderOpen} color='inherit' mr={1} />
                <Typography variant="body1" fontWeight='bolder' whiteSpace='nowrap' flexGrow={1}
                    overflow='hidden'
                >
                    {node.name}
                </Typography>
                <Typography variant="body1" color="textSecondary" whiteSpace='nowrap' ml='1px'>
                    {childrenCount}
                </Typography>
            </Box>
        }>
        {children}
    </TreeItem>
}