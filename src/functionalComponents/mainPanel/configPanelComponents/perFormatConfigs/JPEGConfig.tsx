import { Box, BoxProps, Typography } from "@mui/material";
import { t } from "i18next";
import { useContext } from "react";
import CheckboxWithTooltop from "../../../../components/styledComponents/CheckboxWithTooltip";
import SliderWithInput from "../../../../components/styledComponents/SliderWithInput";
import { appConfigContext } from "../../../../context/appConfigContext";
import { MarkdownRendererNoGutterBottom } from "../../../../utils/mdRenderer";

export default function JPEGConfig(props: BoxProps) {

    const { outputConfig, updateOutputConfig } = useContext(appConfigContext);

    return <Box {...props}>
        <Typography variant="body2" color="textSecondary" fontWeight="bolder" gutterBottom>
            {t('label.JPEG_quality')}
        </Typography>

        <SliderWithInput value={outputConfig.JPEG_quality}
            onChange={(n) => updateOutputConfig('JPEG_quality', n)}
            min={1} max={100} step={1}
            label="JPEG quality"
        />


        <CheckboxWithTooltop
            label={t('label.JPEG_interlace')}
            tooltip={<MarkdownRendererNoGutterBottom md={t('tooltip.JPEG_interlace')} />}
            checkboxProps={{
                checked: outputConfig.JPEG_interlace,
                onChange: (e, v) => {
                    updateOutputConfig('JPEG_interlace', v)
                }
            }}
        />

    </Box>
}