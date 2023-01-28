import { TreeItem } from "@mui/lab";
import { Typography, Box } from "@mui/material";
import { FolderOpen } from "@mui/icons-material";
import { useContext, useCallback } from "react";
import { fileListContext as _fileListContext, webkitFileListContext } from "../../../../context/fileListContext";
import { fileListDialogCallerContext } from "../../../../context/fileListDialog/fileListDialogCallerContext";

export default function FolderTreeItem({
    nodeId,
    name,
    childrenCount,
    children,
}: {
    nodeId: string;
    name: string;
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
        const node = webkitFile.nodeMap.get(nodeId);
        if (!node) return;

        caller.callFileListItemContextMenu(anchorPositon, node,)
    }, [webkitFile.nodeMap, caller.callFileListItemContextMenu]);

    return <TreeItem nodeId={nodeId}
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