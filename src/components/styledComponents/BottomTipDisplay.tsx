import { Box, BoxProps, Button } from "@mui/material";
import { t } from "i18next";
import { useCallback, useEffect, useState } from "react";

export default function BottomTipDisplay(props: BoxProps & {
    onDismiss?: () => void;
    buttonText?: string;
    hidden?: boolean;
}) {

    const { children, onDismiss, buttonText, hidden, ...boxProps } = props;

    const [bottom, setBottom] = useState('-100%');
    const onClosed = useCallback(() => {
        setBottom('-100%');
        onDismiss && onDismiss();
    }, [onDismiss]);

    useEffect(() => {
        if (!hidden) {
            setBottom('0%');
        } else {
            setBottom('-100%');
        }
    }, [hidden]);

    return <Box position="absolute" bottom={bottom} left={0} width="100%" bgcolor={(t) => t.palette.primary.main}
        overflow="hidden"
        {...boxProps}
        sx={{
            ...boxProps.sx,
            '& *': {
                color: (theme) => theme.palette.primary.contrastText
            },
            transition: 'all 0.5s ease-in-out'
        }}
        aria-hidden={hidden}
    >
        <Box py={1} px={1} pt={2}>
            {children}
        </Box>
        <Box py={1} px={1} bgcolor={(t) => t.palette.action.disabled}
            display="flex" justifyContent="end">
            <Button variant="contained" color="info" onClick={onClosed} disableElevation
                aria-hidden={hidden}
            >
                {buttonText ?? t('button.okAndDontShowAgain')}
            </Button>
        </Box>
    </Box>
}