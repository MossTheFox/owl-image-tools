import { Box, BoxProps, Button, ButtonGroup, Slider, TextField, Typography } from "@mui/material";
import { useContext } from "react";
import { appConfigContext } from "../../../../context/appConfigContext";

export default function WEBPConfig(props: BoxProps) {

    const { outputConfig, updateOutputConfig } = useContext(appConfigContext);

    return <Box {...props}>

        <Typography variant="body2" fontWeight="bolder" color="textSecondary" gutterBottom>
            编码模式
        </Typography>
        <Box display="flex" flexWrap="wrap" justifyContent="left" pb={1}>
            <Box pr={2} pb={1}>
                <Typography variant="body2" color="textSecondary" >
                    对于静态图片，采用：
                </Typography>
                <ButtonGroup disableElevation size="small" variant="outlined">
                    <Button>有损压缩</Button>
                    <Button>无损编码</Button>
                </ButtonGroup>
            </Box>
            <Box pb={1}>
                <Typography variant="body2" color="textSecondary">
                    对于动态图片，采用：
                </Typography>
                <ButtonGroup disableElevation size="small" variant="outlined">
                    <Button>有损压缩</Button>
                    <Button>无损编码</Button>
                </ButtonGroup>
            </Box>
        </Box>

        <Box>
            <Typography variant="body2" color="textSecondary" fontWeight="bolder" gutterBottom>
                有损压缩模式下，图像质量
            </Typography>
            <Box display='flex' gap={2}>

                <Slider sx={{ flexGrow: 1 }}
                    size="small"
                    min={0}
                    max={100}
                    step={1}
                    onChange={(e, v) => {
                        updateOutputConfig('WEBP_quality', +v);
                    }}
                    value={outputConfig.WEBP_quality}
                    aria-label="WEBP Quality Slider"
                />
                <TextField sx={{
                    width: '3em'
                }}
                    variant='standard'
                    size='small'
                    type='number'
                    value={outputConfig.WEBP_quality}
                    onChange={(e) => {
                        updateOutputConfig('WEBP_quality', +e.target.value);
                    }}
                    autoComplete='off'
                    aria-label="WEBP Quality Input"
                />
            </Box>
        </Box>
    </Box>
}