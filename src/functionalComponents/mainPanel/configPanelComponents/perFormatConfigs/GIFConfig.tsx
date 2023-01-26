import { Box, BoxProps, Collapse, ButtonGroup, Button } from "@mui/material";
import { useContext } from "react";
import CheckboxWithTooltop from "../../../../components/styledComponents/CheckboxWithTooltip";
import SliderWithInput from "../../../../components/styledComponents/SliderWithInput";
import TypographyWithTooltip from "../../../../components/styledComponents/TypographyWithTooltip";
import { appConfigContext, defaultOutputConfig } from "../../../../context/appConfigContext";

export default function GIFConfig(props: BoxProps) {

    const { outputConfig, updateOutputConfig } = useContext(appConfigContext);


    return <Box {...props}>
        <Box pb={2}>

            <CheckboxWithTooltop containerBoxProps={{ pb: 2 }}
                label='交错 (for Progressive GIF)'
                tooltip='在例如弱网环境下会比较适用。解码这类图像会使用更多的内存。'
                checkboxProps={{
                    checked: outputConfig.GIF_interlace,
                    onChange: (e, v) => {
                        updateOutputConfig('GIF_interlace', v);
                    }
                }}
            />


            <TypographyWithTooltip variant="body2" fontWeight="bolder" color="textSecondary" gutterBottom
                tooltip={`每像素的比特数。`
                    + `默认 ${defaultOutputConfig.GIF_bitdepth}。`
                }
            >
                位深 (Bitdepth)
            </TypographyWithTooltip>

            <SliderWithInput value={outputConfig.GIF_bitdepth}
                onChange={(n) => updateOutputConfig('GIF_bitdepth', n)}
                min={1} max={8} step={1} label="GIF bitdepth"
                sliderProps={{ marks: true }}
            />
        </Box>

        <Box pb={2}>
            <TypographyWithTooltip variant="body2" fontWeight="bolder" color="textSecondary" gutterBottom
                tooltip={`Dithering，对于输出图片包含的可用色彩中缺失的色彩，采用例如栅格状像素布局来近似地表示目标颜色。`
                    + `默认 ${defaultOutputConfig.GIF_dither}。`
                }
            >
                GIF Dithering
            </TypographyWithTooltip>

            <SliderWithInput value={outputConfig.GIF_dither}
                onChange={(n) => updateOutputConfig('GIF_dither', n)}
                min={0} max={1} step={0.01} label="GIF dithering"
            />

        </Box>

        <Box pb={2}>
            <TypographyWithTooltip variant="body2" fontWeight="bolder" color="textSecondary" gutterBottom
                tooltip={<>
                    Interframe Maxerror, 帧与帧之间低于这个阈值的像素变化会被视为未改变，以此可以将这些像素视作透明。<br />
                    可以提高图像压缩率。默认 {defaultOutputConfig.GIF_interframeMaxError}。
                </>
                }
            >
                帧间色彩阈值
            </TypographyWithTooltip>

            <SliderWithInput value={outputConfig.GIF_interframeMaxError}
                onChange={(n) => updateOutputConfig('GIF_interframeMaxError', n)}
                min={0} max={100} step={1} label="GIF_interframeMaxError"
            />

        </Box>

        <Box pb={2}>
            <TypographyWithTooltip variant="body2" fontWeight="bolder" color="textSecondary" gutterBottom
                tooltip={<>
                    Interpalette Maxerror, 对于是否重用已生成的纹理。<br />
                    默认 {defaultOutputConfig.GIF_interpaletteMaxError}。
                </>
                }
            >
                纹理阈值
            </TypographyWithTooltip>

            <SliderWithInput value={outputConfig.GIF_interpaletteMaxError}
                onChange={(n) => updateOutputConfig('GIF_interpaletteMaxError', n)}
                min={0} max={100} step={1} label="GIF_interpaletteMaxError"
            />

        </Box>

    </Box >
}