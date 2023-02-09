import { TreeView } from "@mui/lab";
import { Typography, Box, ButtonGroup, Button, Link, Tooltip, Menu, MenuItem, ListItem } from "@mui/material";
import { ExpandMore, ChevronRight, List as ListIcon, ViewList } from "@mui/icons-material";
import { useContext, useCallback, useState, useRef } from "react";
import { fileListContext as _fileListContext, webkitFileListContext as _webkitFileListContext } from "../../../context/fileListContext";
import BGTransitionBox from "../../../components/styledComponents/BGTransitionBox";
import OutputFileTreeItem from "./outputTreeItems/OutputFileTreeItem";
import OutputFolderTreeItem from "./outputTreeItems/OutputFolderTreeItem";
import { outputFileListContext, OutputTreeNode } from "../../../context/outputFileListContext";
import { outputFileListDialogCallerContext } from "../../../context/fileListDialog/outputFileListDialogCallerContext";
import LazyLoadChunk from "../../../components/LazyLoadChunk";
import { t } from "i18next";

export type OutputTreeItemDataDisplayMode = 'size' | 'sizeChange';

/**
 * Tree Renderer.
 */
function RenderTreeItem({
    rootNode,
    previewMode,
    dataDisplay
}: {
    rootNode: OutputTreeNode;
    previewMode: boolean;
    dataDisplay: OutputTreeItemDataDisplayMode;
}) {

    const [folderChildren, fileChildren] = (() => {
        if (rootNode.kind === 'file') {
            return [[], []];
        }
        // folder
        return [
            rootNode.children.filter((v) => v.kind === 'directory'),
            rootNode.children.filter((v) => v.kind === 'file'),
        ];
    })();

    const FolderChildrenChunks = (() => {
        // 30 in a row
        const result: (typeof folderChildren)[] = [];

        for (let i = 0; i < folderChildren.length; i += 30) {
            result.push(folderChildren.slice(i, i + 30));
        }
        return result;
    })();

    const fileChildrenChunks = (() => {
        // 30 in a row
        const result: (typeof fileChildren)[] = [];

        for (let i = 0; i < fileChildren.length; i += 30) {
            result.push(fileChildren.slice(i, i + 30));
        }
        return result;
    })();


    return <>
        {rootNode.kind === 'file' ? (
            <OutputFileTreeItem node={rootNode} dataDisplay={dataDisplay}
                previewMode={previewMode} />
        ) : (
            <OutputFolderTreeItem
                node={rootNode}
            >

                {/* Do the lazy load for File and Folder Items */}

                {FolderChildrenChunks.map((v, i) =>
                    <LazyLoadChunk key={i}
                        unitCount={v.length}
                        unitHeight={'1.5em'}
                    >
                        {
                            v.map((v, i) =>
                                <RenderTreeItem key={i} rootNode={v} previewMode={previewMode} dataDisplay={dataDisplay} />
                            )
                        }
                    </LazyLoadChunk>
                )}

                {fileChildrenChunks.map((v, i) =>
                    <LazyLoadChunk key={i}
                        unitCount={v.length}
                        unitHeight={previewMode ? '3em' : '1.5em'}
                    >
                        {
                            v.map((v, i) =>
                                v.kind === 'file' &&
                                <OutputFileTreeItem key={i} node={v} dataDisplay={dataDisplay}
                                    previewMode={previewMode} />
                            )
                        }
                    </LazyLoadChunk>
                )}
            </OutputFolderTreeItem>
        )}

    </>
}

export default function OutputFileListPreview() {

    const {
        outputStatistic, loading,
        outputTrees, clearAll: clearOutputContext
    } = useContext(outputFileListContext);
    const { contextMenuActiveItem } = useContext(outputFileListDialogCallerContext);

    const [previewMode, setPreviewMode] = useState(false);
    const enablePreview = useCallback(() => setPreviewMode(true), []);
    const disablePreview = useCallback(() => setPreviewMode(false), []);

    const [detailDataDisplay, setDetailDataDisplay] = useState<OutputTreeItemDataDisplayMode>('sizeChange');

    // Menu...
    const menuAnchor = useRef<HTMLDivElement>(null);
    const [open, setOpen] = useState(false);
    const openMenu = useCallback(() => setOpen(true), []);
    const closeMenu = useCallback(() => setOpen(false), []);

    const clearAll = useCallback(() => {
        clearOutputContext();
        closeMenu();
    }, [closeMenu, clearOutputContext]);

    return <>
        {/* Note: The root layer of file array CAN have duplicated filenames or directory names.
            Use tree nodeId as key
        */}
        <BGTransitionBox display="flex" justifyContent="space-between" alignItems="center" mb={1}
            // Sticky
            position="sticky"
            top={0}
            bgcolor={(theme) => theme.palette.background.paper}
            zIndex={1}
            pb={0.5}

            // Mobile (especially Safari) Selection disabled
            // Not sure if it helps.
            sx={{
                '& > *': {
                    WebkitUserSelect: 'none',
                    userSelect: 'none'
                }
            }}
        >
            <Box display="flex" justifyContent="space-between" alignItems="center" flexGrow={1}
                flexWrap='wrap'
            >
                <Box flexGrow={1} mr={0.5}>

                    {outputStatistic.inputFiles.totalFiles > 0 ? (

                        <Box display="flex" justifyContent="left" alignItems="center" gap={1}>
                            {loading &&
                                <Typography variant="body2" color='textSecondary' display="inline-block" whiteSpace="nowrap">
                                    {`${t('ui.outputPanel.progress')}: ${outputStatistic.converted.totalFiles} / ${outputStatistic.inputFiles.totalFiles}`}
                                </Typography>
                            }
                            {!loading &&
                                <Typography variant="body2" color='textSecondary' display="inline-block" whiteSpace="nowrap">
                                    {`${t('ui.outputPanel.fileTotal')}: ${outputStatistic.inputFiles.totalFiles}`}
                                </Typography>
                            }
                        </Box>
                    ) : (
                        <Typography variant="body2" color='textSecondary' display="inline-block">
                            {t('ui.outputPanel.outputListEmpty')}
                        </Typography>
                    )}
                </Box>
                {!previewMode &&
                    <Box display="flex" alignItems='baseline' gap={0.5} mr={1}
                        sx={{
                            '& > *': {
                                whiteSpace: 'nowrap'
                            }
                        }}
                    >
                        <Typography variant="body2" color="textSecondary">
                            {t('ui.outputPanel.displayConfigLabel')}
                        </Typography>
                        <Link component="button" underline={detailDataDisplay === 'size' ? 'always' : 'none'}
                            onClick={() => setDetailDataDisplay('size')}
                        >
                            {t('ui.outputPanel.displayFileSize')}
                        </Link>
                        <Link component="button" underline={detailDataDisplay === 'sizeChange' ? 'always' : 'none'}
                            onClick={() => setDetailDataDisplay('sizeChange')}
                        >
                            {t('ui.outputPanel.displaySizeChange')}
                        </Link>
                    </Box>
                }
            </Box>

            <ButtonGroup variant="outlined" size="small" disableElevation>
                <Tooltip title={t('button.denseList')} arrow>
                    <Button variant={previewMode ? "outlined" : "contained"} aria-label="Show list"
                        onClick={disablePreview}
                    >
                        <ListIcon fontSize="small" />
                    </Button>
                </Tooltip>
                <Tooltip title={t('button.showPreview')} arrow>
                    <Button variant={!previewMode ? "outlined" : "contained"} aria-label="Show list with preview"
                        onClick={enablePreview}
                    >
                        <ViewList fontSize="small" />
                    </Button>
                </Tooltip>
            </ButtonGroup>
        </BGTransitionBox>

        {outputStatistic.inputFiles.totalFiles > 0 && <Box mb={1}>

            <Box display='flex' justifyContent='space-between' alignItems='center' pb={1}>
                <Typography variant="body1" fontWeight="bolder" component="div"
                    display='flex' gap={1} whiteSpace="nowrap" ref={menuAnchor}
                >
                    {t('ui.outputPanel.fileOutput')} <Link component="button" underline="hover" onClick={openMenu}
                        hidden={loading}
                    >{t('ui.outputPanel.options')}</Link>
                </Typography>

                <Typography variant="body2" color="textSecondary">
                    {t('ui.outputPanel.filesInTotal', { count: outputStatistic.inputFiles.totalFiles })}
                </Typography>

                <Menu open={open} onClose={closeMenu} anchorEl={menuAnchor.current}>
                    <MenuItem dense onClick={clearAll}>
                        <Typography variant="body2" color={(t) => t.palette.error.main} fontWeight="bolder">
                            {t('ui.outputPanel.menuClearFiles')}
                        </Typography>
                    </MenuItem>
                    <ListItem dense>
                        <Typography variant="body2" fontWeight="bolder" color="textSecondary">
                            <small>
                                {t('ui.outputPanel.menuClearFilesSecondary')}
                            </small>
                        </Typography>
                    </ListItem>
                </Menu>

            </Box>

            <TreeView defaultCollapseIcon={<ExpandMore />} defaultExpandIcon={<ChevronRight />}
                selected={contextMenuActiveItem}
                sx={{
                    '& *': {
                        userSelect: 'none',
                        WebkitTouchCallout: 'none',
                        WebkitUserSelect: 'none',
                    }
                }}
            >
                {outputTrees.sort((a, b) => {
                    if (a.kind === 'directory' && b.kind === 'file') return -1;
                    if (a.kind === 'file' && b.kind === 'directory') return 1;
                    return 0;
                }).map((v, i) => (
                    <RenderTreeItem rootNode={v} key={v.nodeId} previewMode={previewMode} dataDisplay={detailDataDisplay} />
                ))}
            </TreeView>
        </Box>}
    </>
}