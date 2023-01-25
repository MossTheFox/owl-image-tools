import { Box, BoxProps, Checkbox, FormControlLabel, FormHelperText, Typography } from "@mui/material";
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

        <Box pb={1}>
            <FormControlLabel control={
                <Checkbox size="small"
                    sx={{ py: 0.5 }}
                />

            } label={
                <Typography variant="body2" color="textSecondary" fontWeight="bolder">
                    保留图像元数据
                </Typography>
            } />
            <FormHelperText>
                如果勾选，对于支持的格式 (JPG, TIFF, PNG, WEBP) 将会保留原始图片的 Exif meta data。
            </FormHelperText>
            <FormHelperText>
                请留意，一些浏览器可能会在导入图片时默认抹去元数据。
            </FormHelperText>
        </Box>


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