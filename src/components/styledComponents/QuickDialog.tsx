import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogProps, DialogTitle } from "@mui/material";
import React, { useCallback } from "react";

export type QuickDialogData = {
    title?: React.ReactNode,
    content?: React.ReactNode,
    actions?: React.ReactNode,
};

export default function QuickDialog(props: Omit<DialogProps, 'title'> & {
    title?: React.ReactNode,
    content?: React.ReactNode,
    actions?: React.ReactNode,
    keepCloseButton?: boolean,
}) {
    const { title, content, actions, keepCloseButton, ...dialogProps } = props;

    const btnHandleClose = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        dialogProps.onClose && dialogProps.onClose(e, 'escapeKeyDown');
    }, [dialogProps.onClose])

    return <Dialog maxWidth="sm" fullWidth {...dialogProps}>
        <DialogTitle fontWeight="bolder">
            {title ?? '提示'}
        </DialogTitle>
        <DialogContent>
            {typeof content === 'string' ? content.split('\n').map((v, i) =>
                <DialogContentText key={i} gutterBottom whiteSpace='pre-wrap'>{v || <br />}</DialogContentText>
            ) : content}
        </DialogContent>
        <DialogActions>
            {actions ?? <Button onClick={btnHandleClose}>关闭</Button>}
            {!!actions && keepCloseButton && <Button onClick={btnHandleClose}>关闭</Button>}
        </DialogActions>

    </Dialog>

}