import { useContext, useEffect, useRef } from "react";
import { SwipeableDrawer, SwipeableDrawerProps, Box, Typography, Divider, IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";
import { loggerContext } from "../../context/loggerContext";

export default function LogHistoryDrawer(props: SwipeableDrawerProps) {

    const { history } = useContext(loggerContext);

    const loggerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!loggerRef.current || !props.open) return;
        loggerRef.current.scrollTo(0, loggerRef.current.scrollHeight)
    }, [history, loggerRef, props.open]);

    return <SwipeableDrawer anchor="bottom" disableSwipeToOpen {...props}>
        <Box minHeight={'50vh'} maxHeight='90vh'
            display="flex"
            flexDirection="column"
        >
            <Box>
                <Box display='flex' justifyContent='space-between' alignItems='center' px={2} py={1}>
                    <Typography variant="h6" fontWeight='bolder'>
                        日志输出
                    </Typography>
                    <IconButton color="primary" size="small" aria-label="Close" onClick={props.onClose}>
                        <Close />
                    </IconButton>
                </Box>
                <Divider />
            </Box>

            <Box ref={loggerRef} overflow='auto' p={2} flexGrow={1}>
                {history.length === 0 &&
                    <Typography variant='body2' color={'textSecondary'}>
                        {`当前没有日志输出。`}
                    </Typography>
                }
                {history.map((v, i) =>
                    <Typography key={i} variant='body2' color={'textSecondary'}>
                        {`[${v.time.toLocaleTimeString()}] ${v.data}`}
                    </Typography>
                )}
            </Box>
        </Box>
    </SwipeableDrawer>
}