import { Box, BoxProps, Typography } from "@mui/material";
import { useContext } from "react";
import CheckboxWithTooltop from "../../../../components/styledComponents/CheckboxWithTooltip";
import SliderWithInput from "../../../../components/styledComponents/SliderWithInput";
import { appConfigContext } from "../../../../context/appConfigContext";

export default function JPEGConfig(props: BoxProps) {

    const { outputConfig, updateOutputConfig } = useContext(appConfigContext);

    return <Box {...props}>
        <Typography variant="body2" color="textSecondary" fontWeight="bolder" gutterBottom>
            JPEG 质量
        </Typography>

        <SliderWithInput value={outputConfig.JPEG_quality}
            onChange={(n) => updateOutputConfig('JPEG_quality', n)}
            min={1} max={100} step={1}
            label="JPEG quality"
        />


        <CheckboxWithTooltop
            label="交错 (Interlace)"
            tooltip='启用交错，可以让图片在没有被加载完成时也可以有低分辨率的预览。'
            checkboxProps={{
                checked: outputConfig.JPEG_interlace,
                onChange: (e, v) => {
                    updateOutputConfig('JPEG_interlace', v)
                }
            }}
        />

    </Box>
}