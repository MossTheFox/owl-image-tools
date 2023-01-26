import { HelpOutline } from "@mui/icons-material";
import { Box, SvgIconProps, Tooltip, TooltipProps } from "@mui/material";

export function HoverHelpPopup(props: {
    iconProps?: SvgIconProps
} & Omit<TooltipProps, 'children'>) {

    const { iconProps, ...tooltipProps } = props;

    return <Tooltip arrow
        enterTouchDelay={0}
        leaveTouchDelay={10000}
        {...tooltipProps}
    >
        <Box display='flex' justifyContent='center' alignItems='center' color={(theme) => theme.palette.text.secondary}>
            <HelpOutline fontSize="small" color="inherit" {...iconProps} />
        </Box>
    </Tooltip>
}