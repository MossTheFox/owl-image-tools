import { Alert, AlertTitle, Button } from "@mui/material";

function ErrorBox({ retryFunc,
    title,
    message,
    retryButtonText = '重试'
}: {
    retryFunc?: () => void;
    retryButtonText?: string;
    title?: string;
    message?: string;
}) {

    return <Alert severity="error"
        variant="filled"
        action={
            retryFunc ?
                <Button color="inherit" size="small" onClick={retryFunc}>{retryButtonText}</Button> : undefined
        }>
        {title &&
            <AlertTitle sx={{ fontWeight: 'bolder' }} >{title}</AlertTitle>
        }
        {message ?? 'Unknown Error'}
    </Alert>
}

export default ErrorBox;