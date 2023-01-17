import { Box, LinearProgress } from "@mui/material";

function DialogLoadingIndicator({
    loading = false
}) {
    return <Box height={0} overflow="visible">
        {loading && <LinearProgress />}
    </Box>
}

export default DialogLoadingIndicator;