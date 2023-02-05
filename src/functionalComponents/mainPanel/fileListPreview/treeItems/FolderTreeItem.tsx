import { TreeItem } from "@mui/lab";
import { Typography, Box } from "@mui/material";
import { FolderOpen } from "@mui/icons-material";
import { useContext, useCallback } from "react";
import { fileListContext as _fileListContext, TreeNode, webkitFileListContext, WebkitFileNodeData } from "../../../../context/fileListContext";
import { fileListDialogCallerContext } from "../../../../context/fileListDialog/fileListDialogCallerContext";

export default function FolderTreeItem({
    node,
    name,
    childrenCount,
    children,
}: {
    node: TreeNode<WebkitFileNodeData>;
    name: string;
    childrenCount: number;
    children: React.ReactNode;
}) {
    const { callFileListItemContextMenu } = useContext(fileListDialogCallerContext);

    const webkitFile = useContext(webkitFileListContext);

    const callContextMenu = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const anchorPositon = {
            top: e.clientY,
            left: e.clientX
        };

        callFileListItemContextMenu(anchorPositon, node,)
    }, [node, callFileListItemContextMenu]);

    return <TreeItem nodeId={node.nodeId}
        ContentProps={{
            // Right Click (or touch hold): Context Menu
            onContextMenu: callContextMenu
        }}

        label={
            <Box display={'flex'} justifyContent={'space-between'} height="1.5em">
                <Box component={FolderOpen} color='inherit' mr={1} />
                <Typography variant="body1" fontWeight='bolder' whiteSpace='nowrap' flexGrow={1}
                    overflow='hidden'
                >
                    {name}
                </Typography>
                <Typography variant="body1" color="textSecondary" whiteSpace='nowrap' ml='1px'>
                    {childrenCount}
                </Typography>
            </Box>
        }>
        {children}
    </TreeItem>
}