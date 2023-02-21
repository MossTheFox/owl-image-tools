import { TreeItem } from "@mui/lab";
import { Typography, Box, PopoverPosition } from "@mui/material";
import React, { useContext, useCallback, useState, useEffect } from "react";
import { fileListContext as _fileListContext, TreeNode, WebkitFileNodeData } from "../../../../context/fileListContext";
import { parseFileSizeString } from "../../../../utils/randomUtils";
import ImageFilePreviewBox from "../../../../components/ImageFilePreviewBox";
import { fileListDialogCallerContext } from "../../../../context/fileListDialog/fileListDialogCallerContext";
import { t } from "i18next";
import { isWebkit } from "../../../../utils/browserCompability";
import useLongTouch from "../../../../hooks/useLongTouch";

// TODO: handle Safari long touch event..... (it doesn't open context menu)

export default function FileTreeItem({
    node,
    previewMode,
}: {
    node: TreeNode<WebkitFileNodeData>;
    previewMode: boolean;
}) {

    const { callFilePreviewDialog, callFileListItemContextMenu } = useContext(fileListDialogCallerContext);

    const callPreviewDialog = useCallback(() => {
        callFilePreviewDialog(node)
    }, [node, callFilePreviewDialog]);

    const callContextMenu = useCallback((anchorPosition: PopoverPosition) => {
        callFileListItemContextMenu(anchorPosition, node)
    }, [node, callFileListItemContextMenu]);

    const onRightClick = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const anchorPosition = {
            top: e.clientY,
            left: e.clientX
        };
        callContextMenu(anchorPosition);
    }, [callContextMenu]);

    const onLongTapCallback = useCallback((coord: { x: number, y: number }) => {
        callContextMenu({
            left: coord.x,
            top: coord.y
        });
    }, [callContextMenu]);

    const longTouchListener = useLongTouch(onLongTapCallback);

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
        setImageSizeText(t('errorMessage.imageLoadFailed'));
    }, []);


    return <TreeItem nodeId={node.nodeId}
        // Click: Preview Dialog
        onClick={callPreviewDialog}

        ContentProps={{
            // Right Click (or touch hold): Context Menu
            onContextMenu: onRightClick,

            ...isWebkit ? longTouchListener : {}
        }}

        label={node.data.kind === 'file' &&
            <Box display={'flex'} justifyContent={'space-between'} alignItems="center"
                height={previewMode ? "3em" : "1.5em"}
            >
                {previewMode && <ImageFilePreviewBox file={node.data.file}
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
                        {node.data.file.name}
                    </Typography>
                    <Box display='flex' alignItems="baseline" justifyContent="space-between">
                        <Typography variant="body2" color="textSecondary" whiteSpace='nowrap' textAlign="end" overflow='hidden'>
                            {imageSizeText}
                        </Typography>
                        <Typography flexGrow={1} variant="body1" color="textSecondary" whiteSpace='nowrap' textAlign="end" ml='1px'>
                            {parseFileSizeString(node.data.file.size)}
                        </Typography>
                    </Box>
                </Box> : <>
                    <Typography variant="body1" color='textSecondary' whiteSpace='nowrap' flexGrow={1} overflow='hidden'>
                        {node.data.file.name}
                    </Typography>
                    <Typography variant="body1" color="textSecondary" whiteSpace='nowrap' ml="1px">
                        {parseFileSizeString(node.data.file.size)}
                    </Typography>
                </>}
            </Box>

        } />
}