import { ExpandMore } from "@mui/icons-material";
import { Accordion, AccordionDetails, AccordionProps, AccordionSummary, Typography } from "@mui/material";
import { useCallback, useContext } from "react";
import { appConfigContext } from "../../../context/appConfigContext";

export default function ConfigPanelAccordion(props: AccordionProps & {
    summary?: string | React.ReactNode,
    recordIndex?: number,
}) {

    const { children, summary, recordIndex, ...accordionProps } = props;

    const { recordCollapseState, outputConfig } = useContext(appConfigContext);

    const accordionChange = useCallback((_: React.SyntheticEvent, expanded: boolean) => {
        if (typeof recordIndex === 'number') {
            recordCollapseState(recordIndex, expanded);
        }
    }, [recordIndex, recordCollapseState])

    return <Accordion
        onChange={accordionChange}
        {...typeof recordIndex === 'number' ? {
            expanded: !!outputConfig.collapseOpenState[recordIndex]
        } : {}}
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