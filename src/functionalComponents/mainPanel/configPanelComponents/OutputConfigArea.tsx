import { Box, BoxProps, Typography } from "@mui/material";
import BaseColorConfig from "./BaseColorConfig";
import ConfigPanelAccordion from "./ConfigPanelAccordion";
import JPEGConfig from "./perFormatConfigs/JPEGConfig";
import PNGConfig from "./perFormatConfigs/PNGConfig";
import WEBPConfig from "./perFormatConfigs/WEBPConfig";

export default function OutputConfigArea(props: BoxProps) {


    return <Box {...props}>
        <Typography variant="body1" fontWeight='bolder' gutterBottom>
            高级输出设置
        </Typography>

        <BaseColorConfig py={1} />


        <Box py={1}>

            <ConfigPanelAccordion recordIndex={1} summary="JPEG 设置">
                <JPEGConfig />
            </ConfigPanelAccordion>

            <ConfigPanelAccordion recordIndex={2} summary="PNG 设置">
                <PNGConfig />
            </ConfigPanelAccordion>

            <ConfigPanelAccordion recordIndex={3} summary="APNG 设置">
                TODO
            </ConfigPanelAccordion>

            <ConfigPanelAccordion recordIndex={4} summary="WEBP 设置">
                <WEBPConfig />
            </ConfigPanelAccordion>

            <ConfigPanelAccordion recordIndex={5} summary="AVIF 设置">
                TODO
            </ConfigPanelAccordion>
        </Box>


    </Box>;
}