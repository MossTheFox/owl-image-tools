import { Box, BoxProps, Checkbox, CheckboxProps, FormControlLabel, Typography, TypographyProps } from "@mui/material"
import { HoverHelpPopup } from "./HoverHelpPopup"

export default function CheckboxWithTooltop(props: {
    labelProps?: Omit<TypographyProps, 'children'>,
    label?: React.ReactNode,
    tooltip?: React.ReactNode,
    checkboxProps?: CheckboxProps,
    containerBoxProps?: BoxProps
}) {

    const { label, labelProps, checkboxProps, tooltip, containerBoxProps } = props;

    return <Box pb={1} display="flex" justifyContent="left" alignItems='center' {...containerBoxProps}>
        <Box>
            <FormControlLabel control={
                <Checkbox size="small"
                    {...checkboxProps}
                    sx={{
                        ...checkboxProps ? checkboxProps.sx : {},
                        py: 0.5
                    }}
                />

            } label={
                <Typography variant="body2" color="textSecondary" fontWeight="bolder" {...labelProps}>
                    {label}
                </Typography>
            } />
        </Box>
        <HoverHelpPopup title={tooltip} />
    </Box>
}