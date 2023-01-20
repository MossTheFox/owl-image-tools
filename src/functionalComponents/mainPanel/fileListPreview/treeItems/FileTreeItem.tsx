import { TreeItem } from "@mui/lab";
import { Typography, Box, PopoverPosition } from "@mui/material";
import { useContext, useCallback } from "react";
import { fileListContext, fileListContext as _fileListContext, webkitFileListContext, webkitFileListContext as _webkitFileListContext } from "../../../../context/fileListContext";
import { parseFileSizeString } from "../../../../utils/randomUtils";
import ImageFilePreviewBox from "../../../../components/ImageFilePreviewBox";
import { fileListDialogCallerContext } from "../../../../context/fileListDialog/fileListDialogCallerContext";


export default function FileTreeItem({
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

    }, [type, webkitFile.nodeMap, fsFile.nodeMap, caller.callFilePreviewDialog, file]);

    const callContextMenu = useCallback((anchorPosition: PopoverPosition) => {
        const node = type === 'FS' ? fsFile.nodeMap.get(nodeId) : webkitFile.nodeMap.get(nodeId);
        if (!node) return;
        caller.callFileListItemContextMenu(anchorPosition, node, type)
    }, [type, webkitFile.nodeMap, fsFile.nodeMap, caller.callFileListItemContextMenu]);

    const onRightClick = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const anchorPosition = {
            top: e.clientY,
            left: e.clientX
        };
        callContextMenu(anchorPosition);
    }, [callContextMenu]);


    return <TreeItem nodeId={nodeId}
        // Click: Preview Dialog
        onClick={callPreviewDialog}

        ContentProps={{
            // Right Click (or touch hold): Context Menu
            onContextMenu: onRightClick,
        }}

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