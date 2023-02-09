import { Box, BoxProps } from "@mui/material";
import { t } from "i18next";
import { useContext } from "react";
import CheckboxWithTooltop from "../../../../components/styledComponents/CheckboxWithTooltip";
import SliderWithInput from "../../../../components/styledComponents/SliderWithInput";
import TypographyWithTooltip from "../../../../components/styledComponents/TypographyWithTooltip";
import { appConfigContext, defaultOutputConfig } from "../../../../context/appConfigContext";
import { MarkdownRendererNoGutterBottom } from "../../../../utils/mdRenderer";

export default function GIFConfig(props: BoxProps) {

    const { outputConfig, updateOutputConfig } = useContext(appConfigContext);


    return <Box {...props}>

        <Box pb={1}>
            <CheckboxWithTooltop
                label={t('label.GIF_keepAlphaChannel')}
                tooltip={
                    <MarkdownRendererNoGutterBottom md={t('tooltip.GIF_keepAlphaChannel')} />
                }
                checkboxProps={{
                    checked: outputConfig.GIF_keepAlphaChannel,
                    onChange: (e, v) => updateOutputConfig('GIF_keepAlphaChannel', v)
                }}
            />
        </Box>

        <Box pb={2}>

            {/* ⚠ vips 1.18.3 does NOT support GIF interlace. */}

            {/* <CheckboxWithTooltop containerBoxProps={{ pb: 2 }}
                label={t('label.GIF_interlace')}
                tooltip={t('tooltip.GIF_interlace')}
                checkboxProps={{
                    checked: outputConfig.GIF_interlace,
                    onChange: (e, v) => {
                        updateOutputConfig('GIF_interlace', v);
                    }
                }}
            /> */}


            <TypographyWithTooltip variant="body2" fontWeight="bolder" color="textSecondary" gutterBottom
                tooltip={
                    <MarkdownRendererNoGutterBottom md={t('tooltip.GIF_bitdepth', {
                        default: defaultOutputConfig.GIF_bitdepth
                    })} />
                }
            >
                {t('label.GIF_bitdepth')}
            </TypographyWithTooltip>

            <SliderWithInput value={outputConfig.GIF_bitdepth}
                onChange={(n) => updateOutputConfig('GIF_bitdepth', n)}
                min={1} max={8} step={1} label="GIF bitdepth"
                sliderProps={{ marks: true }}
            />
        </Box>

        <Box pb={2}>
            <TypographyWithTooltip variant="body2" fontWeight="bolder" color="textSecondary" gutterBottom
                tooltip={
                    <MarkdownRendererNoGutterBottom md={t('tooltip.GIF_dithering', {
                        default: defaultOutputConfig.GIF_dither
                    })} />
                }
            >
                {t('label.GIF_dithering')}
            </TypographyWithTooltip>

            <SliderWithInput value={outputConfig.GIF_dither}
                onChange={(n) => updateOutputConfig('GIF_dither', n)}
                min={0} max={1} step={0.01} label={t('label.GIF_dithering')}
            />

        </Box>

        <Box pb={2}>
            <TypographyWithTooltip variant="body2" fontWeight="bolder" color="textSecondary" gutterBottom
                tooltip={
                    <MarkdownRendererNoGutterBottom md={t('tooltip.GIF_interframeMaxerror', {
                        default: defaultOutputConfig.GIF_interframeMaxError
                    })} />
                }
            >
                {t('label.GIF_interframeMaxerror')}
            </TypographyWithTooltip>

            <SliderWithInput value={outputConfig.GIF_interframeMaxError}
                onChange={(n) => updateOutputConfig('GIF_interframeMaxError', n)}
                min={0} max={32} step={1} label={t('label.GIF_interframeMaxerror')}
            />

        </Box>

        <Box pb={2}>
            <TypographyWithTooltip variant="body2" fontWeight="bolder" color="textSecondary" gutterBottom
                tooltip={
                    <MarkdownRendererNoGutterBottom md={t('tooltip.GIF_interpaletteMaxerror', {
                        default: defaultOutputConfig.GIF_interpaletteMaxError
                    })} />

                }
            >
                {t('label.GIF_interpaletteMaxerror')}
            </TypographyWithTooltip>

            <SliderWithInput value={outputConfig.GIF_interpaletteMaxError}
                onChange={(n) => updateOutputConfig('GIF_interpaletteMaxError', n)}
                min={0} max={256} step={1} label="GIF_interpaletteMaxError"
            />

        </Box>

    </Box >
}