import { Box, BoxProps, Slider, TextField, Typography } from "@mui/material";
import { useContext } from "react";
import CheckboxWithTooltop from "../../../../components/styledComponents/CheckboxWithTooltip";
import { appConfigContext } from "../../../../context/appConfigContext";

export default function JPEGConfig(props: BoxProps) {

    const { outputConfig, updateOutputConfig } = useContext(appConfigContext);

    return <Box {...props}>
        <Typography variant="body2" color="textSecondary" fontWeight="bolder" gutterBottom>
            JPEG 质量
        </Typography>
        <Box display='flex' gap={2} pb={1}>

            <Slider sx={{ flexGrow: 1 }}
                size="small"
                min={1}
                max={100}
                step={1}
                valueLabelDisplay="auto"
                onChange={(e, v) => {
                    updateOutputConfig('JPEG_quality', +v);
                }}
                value={outputConfig.JPEG_quality}
                aria-label="JPEG Quality Slider"
            />
            <TextField sx={{
                width: '3em'
            }}
                variant='standard'
                size='small'
                type='number'
                value={outputConfig.JPEG_quality}
                onChange={(e) => {
                    updateOutputConfig('JPEG_quality', +e.target.value);
                }}
                autoComplete='off'
                aria-label="JPEG Quality Input"
            />
        </Box>

        <CheckboxWithTooltop
            label="交错 (interlace)"
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