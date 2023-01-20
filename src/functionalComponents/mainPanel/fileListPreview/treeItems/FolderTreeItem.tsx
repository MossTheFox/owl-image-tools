import { TreeItem } from "@mui/lab";
import { Typography, Box } from "@mui/material";
import { FolderOpen } from "@mui/icons-material";
import { useContext, useCallback } from "react";
import { fileListContext, fileListContext as _fileListContext, webkitFileListContext, webkitFileListContext as _webkitFileListContext } from "../../../../context/fileListContext";
import { fileListDialogCallerContext } from "../../../../context/fileListDialog/fileListDialogCallerContext";

export default function FolderTreeItem({
    nodeId,
    name,
    childrenCount,
    children,
    type
}: {
    nodeId: string;
    name: string;
    childrenCount: number;
    children: React.ReactNode;
    type: 'FS' | 'no_FS'
}) {
    const caller = useContext(fileListDialogCallerContext);

    const webkitFile = useContext(webkitFileListContext);
    const fsFile = useContext(fileListContext);

    const callContextMenu = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const anchorPositon = {
            top: e.clientY,
            left: e.clientX
        };
        const node = type === 'FS' ? fsFile.nodeMap.get(nodeId) : webkitFile.nodeMap.get(nodeId);
        if (!node) return;

        caller.callFileListItemContextMenu(anchorPositon, node, type)
    }, [type, webkitFile.nodeMap, fsFile.nodeMap, caller.callFileListItemContextMenu]);

    return <TreeItem nodeId={nodeId}
        ContentProps={{
            // Right Click (or touch hold): Context Menu
            onContextMenu: callContextMenu
        }}

        label={
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