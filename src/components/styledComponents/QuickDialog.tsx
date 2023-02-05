import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogProps, DialogTitle } from "@mui/material";
import React, { useCallback, useMemo } from "react";

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

    const { onClose } = dialogProps;

    const btnHandleClose = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        onClose && onClose(e, 'escapeKeyDown');
    }, [onClose]);

    const renderLines = useMemo(() => {
        return typeof content === 'string' ? content.split('\n').map((v, i) =>
            <DialogContentText key={i} gutterBottom whiteSpace='pre-wrap'>{v || <br />}</DialogContentText>
        ) : content;
    }, [content]);

    return <Dialog maxWidth="sm" fullWidth {...dialogProps}>
        <DialogTitle fontWeight="bolder">
            {title ?? '提示'}
        </DialogTitle>
        <DialogContent>
            {renderLines}
        </DialogContent>
        <DialogActions>
            {actions ?? <Button onClick={btnHandleClose}>关闭</Button>}
            {!!actions && keepCloseButton && <Button onClick={btnHandleClose}>关闭</Button>}
        </DialogActions>

    </Dialog>

}