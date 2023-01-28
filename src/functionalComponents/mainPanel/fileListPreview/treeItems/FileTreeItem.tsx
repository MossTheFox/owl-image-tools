import { TreeItem } from "@mui/lab";
import { Typography, Box, PopoverPosition } from "@mui/material";
import React, { useContext, useCallback, useState, useEffect } from "react";
import { fileListContext, fileListContext as _fileListContext, webkitFileListContext, webkitFileListContext as _webkitFileListContext } from "../../../../context/fileListContext";
import { parseFileSizeString } from "../../../../utils/randomUtils";
import ImageFilePreviewBox from "../../../../components/ImageFilePreviewBox";
import { fileListDialogCallerContext } from "../../../../context/fileListDialog/fileListDialogCallerContext";

// TODO: handle Safari long touch event..... (it don't open context menu)

export default function FileTreeItem({
    nodeId,
    file,
    previewMode,
}: {
    nodeId: string;
    file: File;
    previewMode: boolean;
}) {

    const caller = useContext(fileListDialogCallerContext);

    const webkitFile = useContext(webkitFileListContext);

    const callPreviewDialog = useCallback(() => {
        const node = webkitFile.nodeMap.get(nodeId);
        if (!node) return;
        caller.callFilePreviewDialog(file, node)

    }, [webkitFile.nodeMap, caller.callFilePreviewDialog, file]);

    const callContextMenu = useCallback((anchorPosition: PopoverPosition) => {
        const node = webkitFile.nodeMap.get(nodeId);
        if (!node) return;
        caller.callFileListItemContextMenu(anchorPosition, node)
    }, [webkitFile.nodeMap, caller.callFileListItemContextMenu]);

    const onRightClick = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const anchorPosition = {
            top: e.clientY,
            left: e.clientX
        };
        callContextMenu(anchorPosition);
    }, [callContextMenu]);

    // Image Detail in Preview Mode
    const [imageSizeText, setImageSizeText] = useState('');

    useEffect(() => {
        if (previewMode) {
            setImageSizeText('');
        }
    }, [previewMode]);

    const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLDivElement, Event>) => {
        if ('naturalHeight' in e.target && 'naturalWidth' in e.target) {
            setImageSizeText(`${e.target.naturalWidth} x ${e.target.naturalHeight}`);
        }
    }, []);

    const onImageError = useCallback((e: React.SyntheticEvent<HTMLDivElement, Event>) => {
        setImageSizeText('无法载入图片');
    }, []);


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
                    onLoad={onImageLoad}
                    onError={onImageError}
                />}
                {previewMode ? <Box flexGrow={1}
                    display="flex"
                    flexDirection="column"
                    justifyContent="space-between"
                    overflow="hidden"
                >
                    <Typography variant="body1" whiteSpace='nowrap' flexGrow={1} overflow='hidden'>
                        {file.name}
                    </Typography>
                    <Box display='flex' alignItems="baseline" justifyContent="space-between">
                        <Typography variant="body2" color="textSecondary" whiteSpace='nowrap' textAlign="end" overflow='hidden'>
                            {imageSizeText}
                        </Typography>
                        <Typography flexGrow={1} variant="body1" color="textSecondary" whiteSpace='nowrap' textAlign="end" ml='1px'>
                            {parseFileSizeString(file.size)}
                        </Typography>
                    </Box>
                </Box> : <>
                    <Typography variant="body1" color='textSecondary' whiteSpace='nowrap' flexGrow={1} overflow='hidden'>
                        {file.name}
                    </Typography>
                    <Typography variant="body1" color="textSecondary" whiteSpace='nowrap' ml="1px">
                        {parseFileSizeString(file.size)}
                    </Typography>
                </>}
            </Box>

        } />
}