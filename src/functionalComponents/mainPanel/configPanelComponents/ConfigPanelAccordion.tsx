import { ExpandMore } from "@mui/icons-material";
import { Accordion, AccordionDetails, AccordionProps, AccordionSummary, Typography } from "@mui/material";

export default function ConfigPanelAccordion(props: AccordionProps & {
    summary?: string | React.ReactNode
}) {

    const { children, summary, ...accordionProps } = props;

    return <Accordion
        disableGutters
        {...accordionProps}
        sx={{
            ...accordionProps.sx,
            '&:not(:last-child)': {
                borderBottom: 1,
                borderColor: 'divider'
            }
        }}
    >
        <AccordionSummary expandIcon={<ExpandMore />}>
            {typeof summary === 'string' ? (
                <Typography variant="body2" fontWeight='bolder'>
                    {summary}
                </Typography>
            ) : summary}
        </AccordionSummary>
        <AccordionDetails>
            {children}
        </AccordionDetails>
    </Accordion>
}