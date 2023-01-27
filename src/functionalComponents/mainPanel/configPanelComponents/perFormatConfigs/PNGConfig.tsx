import { Box, BoxProps, Collapse, ButtonGroup, Button } from "@mui/material";
import { useContext } from "react";
import CheckboxWithTooltop from "../../../../components/styledComponents/CheckboxWithTooltip";
import SliderWithInput from "../../../../components/styledComponents/SliderWithInput";
import TypographyWithTooltip from "../../../../components/styledComponents/TypographyWithTooltip";
import { appConfigContext } from "../../../../context/appConfigContext";

export default function PNGConfig(props: BoxProps) {

    const { outputConfig, updateOutputConfig } = useContext(appConfigContext);


    return <Box {...props}>
        <Box pb={2}>

            <CheckboxWithTooltop
                label='丢弃透明度信息'
                tooltip='如果丢弃透明度信息，输出的图像将会应用设置的图片底色。对于真彩色 (RGB) 图像，则由 PNG32 变为 PNG24。'
                checkboxProps={{
                    checked: outputConfig.PNG_removeAlphaChannel,
                    onChange: (e, v) => {
                        updateOutputConfig('PNG_removeAlphaChannel', v);
                    }
                }}
            />

            <CheckboxWithTooltop
                label='交错 (Interlace)'
                tooltip='启用交错，可以让图片在没有被加载完成时也可以有低分辨率的预览。'
                checkboxProps={{
                    checked: outputConfig.PNG_interlace,
                    onChange: (e, v) => {
                        updateOutputConfig('PNG_interlace', v)
                    }
                }}
                containerBoxProps={{ pb: 2 }}
            />


            <TypographyWithTooltip variant="body2" fontWeight="bolder" color="textSecondary" gutterBottom
                tooltip={`压缩等级的变化不会影响图像质量。等级越高，文件体积越小，处理速度越慢。`}
            >
                压缩等级
            </TypographyWithTooltip>

            <SliderWithInput value={outputConfig.PNG_compressionLevel}
                onChange={(n) => updateOutputConfig('PNG_compressionLevel', n)}
                min={0} max={9} step={1} label="PNG compression level"
                sliderProps={{ marks: true }}
            />
        </Box>

        <Box pb={3}>
            <TypographyWithTooltip variant="body2" fontWeight="bolder" color="textSecondary" gutterBottom
                tooltip={<Box sx={{ whiteSpace: 'pre-wrap' }}>
                    {`这里指的是 PNG 图像第 24 字节的标记。\n` +
                        'RGB (真彩色) PNGs 只支持两种位深: 8 和 16，分别对应每像素 24 和 48 位。\n' +
                        '另外，顺便补充一下其他的内容。图像的第 25 字节是色彩类型，可能的的值为：\n' +
                        '> 灰度 (0)、RGB (2)、映射 (3)、灰度 + 透明 (4)、RGBA (6)\n' +
                        '由此，常见的 PNG 类型称呼与这些数据的对应关系是这样的：\n' +
                        '- PNG8: bit depth = 8, color type = 3\n' +
                        '- PNG24: bit depth = 8, color type = 2\n' +
                        '- PNG32: bit depth = 8, color type = 6\n' +
                        '在例如 Windows 资源管理器中查看的图像 "位深度" 信息 (8, 24, 32)，指的就是 PNG8、PNG24、PNG32。'
                    }
                </Box>
                }
            >
                位深 (Bit Depth)
            </TypographyWithTooltip>
            <ButtonGroup size="small" variant="outlined" disableElevation
                fullWidth
            >
                {([0, 1, 2, 4, 8, 16] as const).map((v, i) =>
                    <Button key={v}
                        variant={outputConfig.PNG_bitDepth === v ? 'contained' : 'outlined'}
                        onClick={() => updateOutputConfig('PNG_bitDepth', v)}
                        sx={{
                            whiteSpace: 'nowrap',
                            // on VERY small screen here is potential problems for the preset 40px
                            minWidth: '20px !important',
                        }}
                    >
                        {v === 0 ? '自动' : v}
                    </Button>
                )}
            </ButtonGroup>
        </Box>

        <Collapse in={![0, 8, 16].includes(outputConfig.PNG_bitDepth)}>
            <Box pb={2}>
                <TypographyWithTooltip variant="body2" fontWeight="bolder" color="textSecondary" gutterBottom
                    tooltip={<>
                        (Quantisation quality)<br />对于非真彩色图像，色彩的选择质量。
                    </>
                    }
                >
                    色彩量化质量
                </TypographyWithTooltip>

                <SliderWithInput value={outputConfig.PNG_quantisationQuality}
                    onChange={(n) => updateOutputConfig('PNG_quantisationQuality', n)}
                    min={0} max={100} step={1} label="PNG quantisation quality"
                />

            </Box>
            <Box pb={2}>
                <TypographyWithTooltip variant="body2" fontWeight="bolder" color="textSecondary" gutterBottom
                    tooltip={`Dithering，对于输出图片包含的可用色彩中缺失的色彩，采用例如栅格状像素布局来近似地表示目标颜色。`}
                >
                    Dithering
                </TypographyWithTooltip>

                <SliderWithInput value={outputConfig.PNG_dither}
                    onChange={(n) => updateOutputConfig('PNG_dither', n)}
                    min={0} max={1} step={0.01} label="PNG dithering"
                />

            </Box>
        </Collapse>

    </Box >
}