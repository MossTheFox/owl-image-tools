import { TreeView } from "@mui/lab";
import { Typography, Box, ButtonGroup, Button, Link, Tooltip } from "@mui/material";
import { ExpandMore, ChevronRight, List as ListIcon, ViewList } from "@mui/icons-material";
import { useContext, useMemo, useCallback, useState } from "react";
import { fileListContext as _fileListContext, TreeNode, webkitFileListContext as _webkitFileListContext, WebkitFileNodeData } from "../../../context/fileListContext";
import { fileListDialogCallerContext } from "../../../context/fileListDialog/fileListDialogCallerContext";
import BGTransitionBox from "../../../components/styledComponents/BGTransitionBox";
import OutputFileTreeItem from "./outputTreeItems/OutputFileTreeItem";
import OutputFolderTreeItem from "./outputTreeItems/OutputFolderTreeItem";
import { outputFileListContext, OutputTreeNode } from "../../../context/outputFileListContext";

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

    return <>
        {rootNode.kind === 'file' ? (
            <OutputFileTreeItem node={rootNode} dataDisplay={dataDisplay}
                previewMode={previewMode} />
        ) : (
            <OutputFolderTreeItem childrenCount={rootNode.childrenCount}
                node={rootNode}
            >

                {rootNode.children.sort((a, b) => {
                    if (a.kind === 'directory' && b.kind === 'file') return -1;
                    if (a.kind === 'file' && b.kind === 'directory') return 1;
                    return 0;
                }).map((v, i) => (
                    <RenderTreeItem key={i} rootNode={v} previewMode={previewMode} dataDisplay={dataDisplay} />
                ))}
            </OutputFolderTreeItem>
        )}

    </>
}

export default function OutputFileListPreview() {

    const {
        outputStatistic, loading, error,
        nodeMap, outputTrees
    } = useContext(outputFileListContext);
    const { contextMenuActiveItem } = useContext(fileListDialogCallerContext);

    const [previewMode, setPreviewMode] = useState(false);
    const enablePreview = useCallback(() => setPreviewMode(true), []);
    const disablePreview = useCallback(() => setPreviewMode(false), []);

    const [detailDataDisplay, setDetailDataDisplay] = useState<OutputTreeItemDataDisplayMode>('sizeChange');

    const dialogCaller = useContext(fileListDialogCallerContext);


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
                                    {`进度: ${outputStatistic.converted.totalFiles} / ${outputStatistic.inputFiles.totalFiles}`}
                                </Typography>
                            }
                            {!loading &&
                                <Typography variant="body2" color='textSecondary' display="inline-block" whiteSpace="nowrap">
                                    {`文件总数: ${outputStatistic.inputFiles.totalFiles}`}
                                </Typography>
                            }
                        </Box>
                    ) : (
                        <Typography variant="body2" color='textSecondary' display="inline-block">
                            输出列表为空
                        </Typography>
                    )}
                </Box>
                {!previewMode &&
                    <Box display="flex" alignItems='baseline' gap={0.5} mr={0.5}
                        sx={{
                            '& > *': {
                                whiteSpace: 'nowrap'
                            }
                        }}
                    >
                        <Typography variant="body2" color="textSecondary">
                            显示:
                        </Typography>
                        <Link component="button" underline={detailDataDisplay === 'size' ? 'always' : 'none'}
                            onClick={() => setDetailDataDisplay('size')}
                        >
                            文件大小
                        </Link>
                        <Link component="button" underline={detailDataDisplay === 'sizeChange' ? 'always' : 'none'}
                            onClick={() => setDetailDataDisplay('sizeChange')}
                        >
                            变化量
                        </Link>
                    </Box>
                }
            </Box>

            <ButtonGroup variant="outlined" size="small" disableElevation>
                <Tooltip title="紧凑列表" arrow>
                    <Button variant={previewMode ? "outlined" : "contained"} aria-label="Show list"
                        onClick={disablePreview}
                    >
                        <ListIcon fontSize="small" />
                    </Button>
                </Tooltip>
                <Tooltip title="显示预览" arrow>
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
                <Typography variant="body1" fontWeight="bolder">
                    图像输出
                </Typography>
                <Typography variant="body2" color="textSecondary">
                    {`共 ${outputStatistic.inputFiles.totalFiles} 个文件`}
                </Typography>
            </Box>
            <TreeView defaultCollapseIcon={<ExpandMore />} defaultExpandIcon={<ChevronRight />}
                selected={contextMenuActiveItem}
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