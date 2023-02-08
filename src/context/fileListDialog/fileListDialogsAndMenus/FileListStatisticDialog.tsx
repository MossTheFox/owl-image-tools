import { Dialog, DialogTitle, DialogContent, DialogActions, Button, DialogProps, TableContainer, Table, TableHead, TableBody, TableCell, TableRow } from "@mui/material";
import { t } from "i18next";
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
            {t('title.inputFileListInfo')}
        </DialogTitle>
        <DialogContent>
            <TableContainer>
                <Table size="small">
                    <TableHead>
                        <TableRow sx={{ '& > *': { fontWeight: 'bolder' } }}>
                            <TableCell>{t('commonWords.type')}</TableCell>
                            <TableCell>{t('commonWords.count')}</TableCell>
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
                                    {`${v[1]}`}
                                </TableCell>
                            </TableRow>
                        ))}

                        <TableRow>
                            <TableCell>
                                {t('commonWords.total')}
                            </TableCell>
                            <TableCell>
                                {`${detail.totalFiles}`}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </DialogContent>
        <DialogActions>
            <Button onClick={closeDialog}>
                {t('commonWords.close')}
            </Button>
        </DialogActions>
    </Dialog>
}