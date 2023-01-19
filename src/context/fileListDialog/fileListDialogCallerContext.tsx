import { Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText, Box, Button, DialogProps, TableContainer, Table, TableHead, TableBody, TableCell, TableRow, useMediaQuery, Theme } from "@mui/material";
import { createContext, useCallback, useState } from "react";
import ImageFilePreviewBox from "../../components/ImageFilePreviewBox";
import { ACCEPT_MIMEs } from "../../utils/imageMIMEs";
import { parseFileSizeString } from "../../utils/randomUtils";
import { FileListStatistic, FileNodeData, WebkitFileNodeData, TreeNode, defaultFileListStatistic } from "../fileListContext";

type FileNode = TreeNode<FileNodeData> | TreeNode<WebkitFileNodeData>;

function SingleFileDetailDialog(props: DialogProps &
    ({
        file: File,
        // node: TreeNode<FileNodeData>,
        mode: 'FS'
    } | {
        file: File,
        // node: TreeNode<WebkitFileNodeData>,
        mode: 'no_FS'
    })
) {

    const closeDialog = useCallback((e: React.MouseEvent) => {
        if (props.onClose) {
            props.onClose(e, 'escapeKeyDown');
        }
    }, [props.onClose]);

    const {
        file,
        // node,
        mode,
        ...dialogProps
    } = props;

    const smallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

    return <>
        {!!file &&
            <Dialog fullWidth maxWidth="md" fullScreen={smallScreen} {...dialogProps}>
                <DialogTitle fontWeight="bolder">
                    文件信息
                </DialogTitle>
                <DialogContent sx={{ position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'stretch' }}>

                    {/* Preview */}
                    <Box flexGrow={1} p={1} overflow="auto" display="flex" justifyContent="center">
                        <ImageFilePreviewBox file={file} overflow="auto" width="100%" minHeight="3rem" />
                    </Box>

                    {/* Detail */}
                    <Box>
                        <DialogContentText gutterBottom>
                            {file.name}
                        </DialogContentText>
                        <DialogContentText component={"ul"} whiteSpace="nowrap">
                            <DialogContentText component={"li"} whiteSpace="nowrap">
                                {`类型: ${file.type}`}
                            </DialogContentText>
                            <DialogContentText component={"li"} whiteSpace="nowrap">
                                {`文件大小: ${parseFileSizeString(file.size, true)}`}
                            </DialogContentText>
                            <DialogContentText component={"li"} whiteSpace="nowrap">
                                {`修改日期: ${new Date(file.lastModified).toLocaleString()}`}
                            </DialogContentText>
                        </DialogContentText>
                    </Box>

                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDialog}>
                        关闭
                    </Button>
                </DialogActions>
            </Dialog>
        }
    </>
}

function FileListStatisticDialog(props: DialogProps & { detail: FileListStatistic }) {

    const closeDialog = useCallback((e: React.MouseEvent) => {
        if (props.onClose) {
            props.onClose(e, 'escapeKeyDown');
        }
    }, [props.onClose]);

    const {
        detail,
        ...dialogProps
    } = props;


    return <Dialog fullWidth maxWidth="sm" {...dialogProps}>
        <DialogTitle fontWeight="bolder">
            文件列表信息
        </DialogTitle>
        <DialogContent>
            <TableContainer>
                <Table size="small">
                    <TableHead>
                        <TableRow sx={{ '& > *': { fontWeight: 'bolder' } }}>
                            <TableCell>类型</TableCell>
                            <TableCell>数量</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Object.entries(detail.perFormatCount).map((v, i) => (
                            v[1] > 0 &&
                            <TableRow key={i}>
                                <TableCell>
                                    {`${v[0]}`}
                                </TableCell>
                                <TableCell>
                                    {`${v[1]} 个`}
                                </TableCell>
                            </TableRow>
                        ))}

                        <TableRow>
                            <TableCell>
                                {`合计`}
                            </TableCell>
                            <TableCell>
                                {`${detail.totalFiles} 个`}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </DialogContent>
        <DialogActions>
            <Button onClick={closeDialog}>
                关闭
            </Button>
        </DialogActions>
    </Dialog>
}


type FileListDialogCallerContext = {
    callFileListStatisticDialog: (detail: FileListStatistic | FileListStatistic[]) => void,
    callFilePreviewDialog: (file: File, type: 'FS' | 'no_FS', node: FileNode) => void
}

export const fileListDialogCallerContext = createContext<FileListDialogCallerContext>({
    callFileListStatisticDialog(detail) { throw new Error('Not init') },
    callFilePreviewDialog(file, type, node) { throw new Error('Not init') },
});


export function FileListDialogCallerContextProvider({ children }: { children: React.ReactNode }) {

    const [previewFile, setPreviewFile] = useState<File | null>(null);
    const [mode, setMode] = useState<'FS' | 'no_FS'>('FS');

    const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
    const closePreviewDialog = useCallback(() => setPreviewDialogOpen(false), []);
    const callPreviewDialog = useCallback((file: File, fileMode: typeof mode, fileNode: FileNode) => {
        setMode(fileMode);
        setPreviewFile(file);
        setPreviewDialogOpen(true);
    }, []);


    const [fullStatistic, setFullStatistic] = useState<FileListStatistic>(defaultFileListStatistic);
    const [fullStatisticDialogOpen, setFullStatisticDialogOpen] = useState(false);
    const closeFullStatisticDialog = useCallback(() => setFullStatisticDialogOpen(false), []);

    const callFileListStatisticDialog = useCallback((statistic: FileListStatistic | FileListStatistic[]) => {
        const total: FileListStatistic = Array.isArray(statistic) ?
            {
                totalFiles: statistic.reduce((prev, curr) => prev + curr.totalFiles, 0),
                perFormatCount: statistic.reduce((prev, curr) => {
                    for (const _key in curr.perFormatCount) {
                        let key = _key as typeof ACCEPT_MIMEs[number];
                        prev[key] += curr.perFormatCount[key];
                    }
                    return prev;
                }, { ...defaultFileListStatistic.perFormatCount })
            } : {
                ...statistic,
                perFormatCount: {
                    ...statistic.perFormatCount
                }
            };

        setFullStatistic(total);
        setFullStatisticDialogOpen(true);

    }, []);


    return <fileListDialogCallerContext.Provider value={{
        callFilePreviewDialog: callPreviewDialog,
        callFileListStatisticDialog
    }}>
        {previewFile && (
            <SingleFileDetailDialog
                file={previewFile}
                mode={mode}
                open={previewDialogOpen}
                onClose={closePreviewDialog}
            />
        )}

        <FileListStatisticDialog
            detail={fullStatistic}
            open={fullStatisticDialogOpen}
            onClose={closeFullStatisticDialog}
        />


        {children}
    </fileListDialogCallerContext.Provider>
}