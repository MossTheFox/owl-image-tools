import { Box, BoxProps, Button, ButtonGroup, Collapse, Slider, TextField, Typography } from "@mui/material";
import { useContext, useMemo } from "react";
import CheckboxWithTooltop from "../../../../components/styledComponents/CheckboxWithTooltip";
import SliderWithInput from "../../../../components/styledComponents/SliderWithInput";
import TypographyWithTooltip from "../../../../components/styledComponents/TypographyWithTooltip";
import { appConfigContext } from "../../../../context/appConfigContext";

export default function WEBPConfig(props: BoxProps) {

    const { outputConfig, updateOutputConfig } = useContext(appConfigContext);

    // i18n
    const i18nWebpCompressionPreset = useMemo(() => {
        return {
            'default': '默认',
            'picture': '图片',
            'photo': '照片',
            'drawing': '绘画',
            'icon': '图标',
            'text': '文本'
        };
    }, []);

    return <Box {...props}>

        <Typography variant="body2" fontWeight="bolder" color="textSecondary" gutterBottom>
            编码模式
        </Typography>
        <Box pb={2}>
            <ButtonGroup fullWidth disableElevation size="small" variant="outlined">
                <Button variant={outputConfig.WEBP_lossless ? 'outlined' : 'contained'}
                    onClick={() => updateOutputConfig('WEBP_lossless', false)}
                >有损压缩</Button>
                <Button variant={outputConfig.WEBP_lossless ? 'contained' : 'outlined'}
                    onClick={() => updateOutputConfig('WEBP_lossless', true)}
                >无损编码</Button>
            </ButtonGroup>
        </Box>

        <Box pb={1}>
            <CheckboxWithTooltop
                label="保留透明度信息"
                tooltip="对于有损压缩和无所压缩，WEBP 格式均支持携带透明度信息"
                checkboxProps={{
                    checked: outputConfig.WEBP_keepAlphaChannel,
                    onChange: (e, v) => updateOutputConfig('WEBP_keepAlphaChannel', v)
                }}
            />
        </Box>

        {/* ↓ This is useless */}
        {/* <Box pb={2}>
            <TypographyWithTooltip variant="body2" color="textSecondary" fontWeight="bolder" gutterBottom
                tooltip="用于尝试减小文件体积的 CPU 时间。"
            >
                压缩等级
            </TypographyWithTooltip>
            <SliderWithInput
                min={0} max={6} step={1}
                value={outputConfig.WEBP_cpuEffortToRediceSize}
                onChange={(n) => updateOutputConfig('WEBP_cpuEffortToRediceSize', n)}
                label="WEBP effort"
                mark
            />
        </Box> */}

        <Collapse in={!outputConfig.WEBP_lossless}>
            <Box>
                <Box pb={2}>
                    <Typography variant="body2" color="textSecondary" fontWeight="bolder" gutterBottom>
                        图像质量
                    </Typography>
                    <SliderWithInput
                        min={0} max={100} step={1}
                        value={outputConfig.WEBP_quality}
                        onChange={(n) => updateOutputConfig('WEBP_quality', n)}
                        label="WEBP quality"
                    />
                </Box>

                <Box pb={2}>
                    <Typography variant="body2" color="textSecondary" fontWeight="bolder" gutterBottom>
                        有损压缩方式预设
                    </Typography>
                    <ButtonGroup fullWidth variant="outlined" disableElevation size="small"
                        sx={{ overflow: 'auto' }}
                    >
                        {(['default', 'picture', 'photo', 'drawing', 'icon', 'text'] as const).map((v) =>
                            <Button key={v} variant={outputConfig.WEBP_lossyCompressionPreset === v ? 'contained' : 'outlined'}
                                onClick={() => updateOutputConfig('WEBP_lossyCompressionPreset', v)}
                                sx={{
                                    minWidth: 'unset !important',
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                {i18nWebpCompressionPreset[v]}
                            </Button>
                        )}

                    </ButtonGroup>
                </Box>

                <Collapse in={outputConfig.WEBP_keepAlphaChannel}>
                    <Box pb={2}>
                        <Typography variant="body2" color="textSecondary" fontWeight="bolder" gutterBottom>
                            有损压缩透明度信息保真度
                        </Typography>
                        <SliderWithInput
                            min={0} max={100} step={1}
                            value={outputConfig.WEBP_alphaQuality}
                            onChange={(n) => updateOutputConfig('WEBP_alphaQuality', n)}
                            label="WEBP Alpha Quality"
                        />
                    </Box>
                </Collapse>

            </Box>


        </Collapse>

    </Box>
}