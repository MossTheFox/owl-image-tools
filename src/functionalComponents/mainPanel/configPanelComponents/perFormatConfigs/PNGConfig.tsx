import { Box, BoxProps, Collapse, ButtonGroup, Button, FormHelperText } from "@mui/material";
import { t } from "i18next";
import { useContext } from "react";
import CheckboxWithTooltop from "../../../../components/styledComponents/CheckboxWithTooltip";
import SliderWithInput from "../../../../components/styledComponents/SliderWithInput";
import TypographyWithTooltip from "../../../../components/styledComponents/TypographyWithTooltip";
import { appConfigContext } from "../../../../context/appConfigContext";
import { MarkdownRendererNoGutterBottom } from "../../../../utils/mdRenderer";

export default function PNGConfig(props: BoxProps) {

    const { outputConfig, updateOutputConfig } = useContext(appConfigContext);


    return <Box {...props}>
        <Box pb={2}>

            <CheckboxWithTooltop
                label={t('label.PNG_strip')}
                tooltip={
                    <MarkdownRendererNoGutterBottom md={t('tooltip.PNG_strip')} />
                }
                checkboxProps={{
                    checked: outputConfig.PNG_removeAlphaChannel,
                    onChange: (e, v) => {
                        updateOutputConfig('PNG_removeAlphaChannel', v);
                    }
                }}
            />

            <CheckboxWithTooltop
                label={t('label.PNG_interlace')}
                tooltip={
                    <MarkdownRendererNoGutterBottom md={t('tooltip.PNG_interlace')} />
                }
                checkboxProps={{
                    checked: outputConfig.PNG_interlace,
                    onChange: (_, v) => {
                        updateOutputConfig('PNG_interlace', v)
                    }
                }}
                containerBoxProps={{ pb: 2 }}
            />


            <TypographyWithTooltip variant="body2" fontWeight="bolder" color="textSecondary" gutterBottom
                tooltip={t('tooltip.PNG_compressionLevel')}
            >
                {t('label.PNG_compressionLevel')}
            </TypographyWithTooltip>

            <SliderWithInput value={outputConfig.PNG_compressionLevel}
                onChange={(n) => updateOutputConfig('PNG_compressionLevel', n)}
                min={0} max={9} step={1} label="PNG compression level"
                sliderProps={{ marks: true }}
            />
        </Box>

        <Box pb={3}>
            <TypographyWithTooltip variant="body2" fontWeight="bolder" color="textSecondary" gutterBottom
                tooltip={
                    <MarkdownRendererNoGutterBottom md={t('tooltip.PNG_bitdepth')} />
                }
            >
                {t('label.bitdepth')}
            </TypographyWithTooltip>
            <Box overflow="auto">
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
                            }}
                        >
                            {v === 0 ? t('commonWords.auto') : v}
                        </Button>
                    )}
                </ButtonGroup>
            </Box>
        </Box>

        <Collapse in={![0, 8, 16].includes(outputConfig.PNG_bitDepth)}>
            <Box pb={2}>
                <TypographyWithTooltip variant="body2" fontWeight="bolder" color="textSecondary" gutterBottom
                    tooltip={
                        <MarkdownRendererNoGutterBottom md={t('tooltip.PNG_quantisationQuality')} />
                    }
                >
                    {t('label.PNG_quantisationQuality')}
                </TypographyWithTooltip>

                <SliderWithInput value={outputConfig.PNG_quantisationQuality}
                    onChange={(n) => updateOutputConfig('PNG_quantisationQuality', n)}
                    min={0} max={100} step={1} label="PNG quantisation quality"
                />

            </Box>
            <Box pb={2}>
                <TypographyWithTooltip variant="body2" fontWeight="bolder" color="textSecondary" gutterBottom
                    tooltip={
                        <MarkdownRendererNoGutterBottom md={t('tooltip.PNG_dithering')} />
                    }
                >
                    {t('label.PNG_dithering')}
                </TypographyWithTooltip>

                <SliderWithInput value={outputConfig.PNG_dither}
                    onChange={(n) => updateOutputConfig('PNG_dither', n)}
                    min={0} max={1} step={0.01} label="PNG dithering"
                />

            </Box>
        </Collapse>
        <FormHelperText>
            {t('ui.configPanel.png8NotSupported')}
        </FormHelperText>
    </Box >
}