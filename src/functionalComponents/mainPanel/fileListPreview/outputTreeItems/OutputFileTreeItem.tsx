import { TreeItem } from "@mui/lab";
import { Typography, Box, PopoverPosition } from "@mui/material";
import React, { useContext, useCallback, useState, useEffect, useMemo } from "react";
import { fileListContext, fileListContext as _fileListContext, TreeNode, webkitFileListContext, webkitFileListContext as _webkitFileListContext } from "../../../../context/fileListContext";
import { parseFileSizeString } from "../../../../utils/randomUtils";
import ImageFilePreviewBox from "../../../../components/ImageFilePreviewBox";
import { fileListDialogCallerContext } from "../../../../context/fileListDialog/fileListDialogCallerContext";
import { outputFileListContext, OutputTreeNode } from "../../../../context/outputFileListContext";
import { OutputTreeItemDataDisplayMode } from "../OutputFileListPreview";


export default function OutputFileTreeItem({
    node,
    previewMode,
    dataDisplay
}: {
    node: OutputTreeNode;
    previewMode: boolean;
    dataDisplay: OutputTreeItemDataDisplayMode;
}) {

    const caller = useContext(fileListDialogCallerContext);

    const outputContext = useContext(outputFileListContext);

    const deltaSize = useMemo(() => {
        if (node.kind !== 'file' || !node.file || node.originalNode.data.kind !== 'file') {
            return 0;
        }
        return node.file.size - node.originalNode.data.file.size;
    }, [node]);

    const callPreviewDialog = useCallback(() => {
        if (node.kind !== 'file' || !node.file) return;
        // TODO: outputFileListContext

    }, [node, caller.callFilePreviewDialog]);

    const callContextMenu = useCallback((anchorPosition: PopoverPosition) => {
        if (!node) return;
        // TODO: outputFilelistContext
    }, [node, caller.callFileListItemContextMenu]);

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


    return <TreeItem nodeId={node.nodeId}
        // Click: Preview Dialog
        onClick={callPreviewDialog}

        ContentProps={{
            // Right Click (or touch hold): Context Menu
            onContextMenu: onRightClick,
        }}

        label={
            <Box display={'flex'} justifyContent={'space-between'} alignItems="center"
                position="relative"
                zIndex={0}
                overflow="hidden"
            >
                {/* Progress Bar BG Box */}
                <Box position="absolute" width='100%' height={0} left={0} top={0} zIndex={-1}>
                    <Box width={`${(node.convertProgress * 100).toFixed(2)}%`} height="3rem" bgcolor={(theme) => theme.palette.primary.main}
                        sx={{
                            transition: 'width 0.25s, opacity 0.25s 0.5s',
                            opacity: node.finished ? 0 : 0.25
                        }}
                    />
                </Box>

                {previewMode && <ImageFilePreviewBox file={node.file}
                    error={!!node.error}
                    height="3rem"
                    width="3rem"
                    minWidth="3rem"
                    m={'1px'}
                    mr={1}
                    onLoad={onImageLoad}
                    onError={onImageError}
                />}
                {previewMode ?
                    //  Preview Mode
                    <Box flexGrow={1}
                        display="flex"
                        flexDirection="column"
                        justifyContent="space-between"
                        overflow="hidden"
                    >
                        <Box flexGrow={1} display="flex" alignItems="baseline">

                            <Typography variant="body1" whiteSpace='nowrap' flexGrow={1} overflow='hidden'>
                                {node.name}
                            </Typography>
                            <Typography variant="body2" color={
                                node.error ? "error" : "textSecondary"
                            }
                                whiteSpace='nowrap' ml="1px">
                                {/* So ugly ↓ */}
                                {!node.error && (node.file ?
                                    <>
                                        <Typography component="span"
                                            variant="body2" color={deltaSize > 0 ? (theme) => theme.palette.error.main :
                                                deltaSize === 0 ? 'inherit' : (theme) => theme.palette.primary.main}>
                                            {deltaSize >= 0 ? `+` : '-'}{parseFileSizeString(Math.abs(deltaSize))}
                                        </Typography>
                                    </>
                                    : '等待中')}
                            </Typography>
                        </Box>
                        <Box display='flex' alignItems="baseline" justifyContent="space-between">
                            <Typography variant="body2" color="textSecondary" whiteSpace='nowrap' textAlign="end" overflow='hidden'>
                                {imageSizeText}
                            </Typography>
                            <Typography flexGrow={1} variant="body1" color={
                                node.error ? "error" : "textSecondary"
                            } whiteSpace='nowrap' textAlign="end" ml='1px'>
                                {!node.error && (node.file ? parseFileSizeString(node.file.size) : '等待中')}
                                {!!node.error && '出错'}
                            </Typography>
                        </Box>
                    </Box> :
                    <>
                        {/* Non-preview Mode */}
                        <Typography variant="body1" color='textSecondary' whiteSpace='nowrap' flexGrow={1} overflow='hidden'>
                            {node.name}
                        </Typography>
                        <Typography variant="body1" color={
                            node.error ? "error" : "textSecondary"
                        }
                            whiteSpace='nowrap' ml="1px">
                            {/* So ugly ↓ */}
                            {!node.error && (node.file ?
                                <>
                                    {dataDisplay === 'size' ?
                                        (deltaSize >= 0 ? `↑ ` : '↓ ') + parseFileSizeString(node.file.size)
                                        :
                                        <Typography component="span"
                                            color={deltaSize > 0 ? (theme) => theme.palette.error.main :
                                                deltaSize === 0 ? 'inherit' : (theme) => theme.palette.primary.main}>
                                            {deltaSize >= 0 ? `+` : '-'}{parseFileSizeString(Math.abs(deltaSize))}
                                        </Typography>
                                    }</>
                                : '等待中')}
                            {!!node.error && '出错'}

                        </Typography>
                    </>
                }
            </Box >

        } />
}