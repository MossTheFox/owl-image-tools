import { Dialog, DialogTitle, DialogContent, DialogActions, Button, DialogProps, TableContainer, Table, TableHead, TableBody, TableCell, TableRow } from "@mui/material";
import { useCallback } from "react";
import { FileListStatistic } from "../../fileListContext";

export default function FileListStatisticDialog(props: DialogProps & { detail: FileListStatistic }) {

    const { onClose } = props;
    const closeDialog = useCallback((e: React.MouseEvent) => {
        if (onClose) {
            onClose(e, 'escapeKeyDown');
        }
    }, [onClose]);

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