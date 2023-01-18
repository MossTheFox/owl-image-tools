import { Box, Typography, Chip, Tooltip, ButtonBase, BoxProps } from "@mui/material";
import { Settings } from "@mui/icons-material";
import { useContext } from "react";
import { t } from "i18next";
import { FS_Mode, storageDisabled } from "../utils/browserCompability";
import { loggerContext } from "../context/loggerContext";
import { TOP_BAR_HEIGHT } from "../App";

export default function TopBar(props: BoxProps) {

    const { line, history } = useContext(loggerContext);

    // TODO: view history modal

    return <Box width="100%"
        height={TOP_BAR_HEIGHT}
        bgcolor={(theme) => theme.palette.primary.main}
        color={(theme) => theme.palette.primary.contrastText}
        boxShadow={(theme) => theme.shadows[1]}
        display='flex' flexWrap='nowrap'
        alignItems='stretch'
        justifyContent='left'
        overflow='hidden'
        position="sticky"
        top={0}
        left={0}
        zIndex={10}
        {...props}
    >
        <Box bgcolor={(theme) => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.5)' : theme.palette.primary.light}
            color={(theme) => theme.palette.primary.contrastText}
            display='flex'
            alignItems='stretch'
        >
            <ButtonBase>
                <Box px={1}
                    display='flex'
                    gap={'2px'}
                    alignItems='center'
                    justifyContent='center'
                >
                    <Settings fontSize="inherit" />
                    <Typography variant="body2" whiteSpace='nowrap'>
                        设置</Typography>
                </Box>
            </ButtonBase>
        </Box>
        <Box px='4px'
            py='2px'
            display='flex' flexWrap='nowrap'
            alignItems='center'
            justifyContent='space-between'
            flexGrow={1}
        >

            {/* Log Info Output Here */}
            <Box flexGrow={1} overflow='hidden' pr={1}>
                <Typography variant="body2" whiteSpace='nowrap'>
                    {line}
                </Typography>
            </Box>

            {/* TODO: ↓ FS Mode Chip auto fade out */}

            <Box display='flex' gap={1} justifyContent="center" alignItems="center">
                {storageDisabled ? <>
                    <Chip color="error" label={"访问 Storage API 被拒绝"} size="small" />
                </> : <>
                    <Typography variant="body2" whiteSpace='nowrap'>FS Mode: </Typography>
                    {FS_Mode === 'noFS' && <Tooltip title={"批量文件转换受限"} arrow enterDelay={0} enterTouchDelay={0}>
                        <Chip color="warning" label={"不支持文件系统访问"} size="small" />
                    </Tooltip>}
                    {FS_Mode === 'privateFS' && <Chip color="info" label={"Private FS"} size="small" />}
                    {FS_Mode === 'publicFS' && <Chip color="success" label={"Full Support"} size="small" />}
                </>}
            </Box>


        </Box>
    </Box>
}