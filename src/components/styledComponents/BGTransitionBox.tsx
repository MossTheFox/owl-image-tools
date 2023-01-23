import { BoxProps, Box } from "@mui/material";

/**
 * For Boxes that should have a transitioned bg when switching color mode.
 * 
 * Default Background color matches Mui Paper
 */
export default function BGTransitionBox(props: BoxProps) {
    return <Box
        bgcolor={(theme) => theme.palette.background.paper}
        {...props} sx={{
            backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))`,
            ...props.sx,
            transition: 'background-color 0.125s'
        }} />
}