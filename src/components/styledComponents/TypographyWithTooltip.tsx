import { Typography, TypographyProps } from "@mui/material";
import { HoverHelpPopup } from "./HoverHelpPopup";

export default function TypographyWithTooltip(props: Omit<TypographyProps<'div'>, 'component'> & {
    tooltip: React.ReactNode
}) {
    const { tooltip, ...typographyProps } = props;
    return <Typography {...typographyProps} component='div' display='flex' alignItems='center' justifyContent='left'
        gap={1}
    >
        {typographyProps.children}
        <HoverHelpPopup title={tooltip} />
    </Typography>
}