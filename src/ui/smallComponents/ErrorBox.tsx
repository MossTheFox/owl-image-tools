import { Alert, AlertTitle, Button } from "@mui/material";
import { t } from "i18next";

function ErrorBox({ retryFunc,
    title,
    message,
    retryButtonText = t('commonWords.retry')
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