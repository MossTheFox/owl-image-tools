import { AlertProps } from "@mui/material";

// MUI
declare global {
    type MuiAlertState = {
        severity: AlertProps['severity'];
        title?: string;
        message?: string;
    };
}