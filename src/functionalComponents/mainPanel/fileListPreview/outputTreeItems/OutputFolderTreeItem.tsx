import { TreeItem } from "@mui/lab";
import { Typography, Box } from "@mui/material";
import { FolderOpen } from "@mui/icons-material";
import { useContext, useCallback } from "react";
import { fileListContext as _fileListContext } from "../../../../context/fileListContext";
import { OutputTreeNode } from "../../../../context/outputFileListContext";
import { outputFileListDialogCallerContext } from "../../../../context/fileListDialog/outputFileListDialogCallerContext";
import { t } from "i18next";
import useLongTouch from "../../../../hooks/useLongTouch";
import { isWebkit } from "../../../../utils/browserCompability";

export default function OutputFolderTreeItem({
    node,
    children,
}: {
    node: OutputTreeNode;
    children: React.ReactNode;
}) {
    const { callFileListItemContextMenu } = useContext(outputFileListDialogCallerContext);

    const callContextMenu = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const anchorPositon = {
            top: e.clientY,
            left: e.clientX
        };
        callFileListItemContextMenu(anchorPositon, node)
    }, [callFileListItemContextMenu, node]);

    const onLongTapCallback = useCallback((coord: { x: number, y: number }) => {
        callFileListItemContextMenu({
            left: coord.x,
            top: coord.y
        }, node);
    }, [callFileListItemContextMenu, node]);

    const longTouchListener = useLongTouch(onLongTapCallback);

    return <TreeItem nodeId={node.nodeId}
        ContentProps={{
            // Right Click (or touch hold): Context Menu
            onContextMenu: callContextMenu,
            ...isWebkit ? longTouchListener : {}
        }}

        label={
            <Box display={'flex'} justifyContent={'space-between'}
                position="relative" zIndex={0} overflow="hidden" height="1.5rem"
            >
                <Box position="absolute" width='100%' height={0} left={0} top={0} zIndex={-1}>
                    <Box width={`${(node.convertProgress * 100).toFixed(2)}%`} height="3rem" bgcolor={(theme) => theme.palette.primary.main}
                        sx={{
                            transition: 'width 0.25s, opacity 0.25s 0.5s',
                            opacity: node.finished ? 0 : 0.25
                        }}
                    />
                </Box>
                <Box component={FolderOpen} color='inherit' mr={1} />
                <Typography variant="body1" fontWeight='bolder' whiteSpace='nowrap' flexGrow={1}
                    overflow='hidden'
                >
                    {node.name}
                </Typography>
                <Typography variant="body1" color="textSecondary" whiteSpace='nowrap' ml='1px'>
                    {node.childrenCount}{node.errorChildrenCount > 0 ? ` (${node.errorChildrenCount} ${t('commonWords.error')})` : ''}
                </Typography>
            </Box>
        }>
        {children}
    </TreeItem>
}