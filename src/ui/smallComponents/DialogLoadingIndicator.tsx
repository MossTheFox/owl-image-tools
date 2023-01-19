import { Box, LinearProgress, BoxProps } from "@mui/material";

function DialogLoadingIndicator(
    {
        loading = false,
        ...props
    }: {
        loading: boolean
    } & BoxProps
) {
    return <Box height={0} overflow="visible" {...props}>
        {loading && <LinearProgress />}
    </Box>
}

export default DialogLoadingIndicator;