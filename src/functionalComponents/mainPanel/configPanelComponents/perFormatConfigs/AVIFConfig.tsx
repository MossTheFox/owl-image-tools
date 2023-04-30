import { Box, BoxProps, Button, ButtonGroup, Collapse, Typography } from "@mui/material";
import { t } from "i18next";
import { useContext, useMemo } from "react";
import CheckboxWithTooltop from "../../../../components/styledComponents/CheckboxWithTooltip";
import SliderWithInput from "../../../../components/styledComponents/SliderWithInput";
import { appConfigContext } from "../../../../context/appConfigContext";
import TypographyWithTooltip from "../../../../components/styledComponents/TypographyWithTooltip";

export default function AVIFConfig(props: BoxProps) {

    const { outputConfig, updateOutputConfig } = useContext(appConfigContext);

    return <Box {...props}>

        <Typography variant="body2" fontWeight="bolder" color="textSecondary" gutterBottom>
            {t('label.WEBP_encodeMode')}
        </Typography>
        <Box pb={2}>
            <ButtonGroup fullWidth disableElevation size="small" variant="outlined">
                <Button variant={outputConfig.AVIF_loseless ? 'outlined' : 'contained'}
                    onClick={() => updateOutputConfig('AVIF_loseless', false)}
                >{t('label.WEBP_lossy')}</Button>
                <Button variant={outputConfig.AVIF_loseless ? 'contained' : 'outlined'}
                    onClick={() => updateOutputConfig('AVIF_loseless', true)}
                >{t('label.WEBP_loseless')}</Button>
            </ButtonGroup>
        </Box>

        <Box pb={1}>
            <CheckboxWithTooltop
                label={t('label.WEBP_keepAlphaChannel')}
                tooltip={t('tooltip.WEBP_keepAlphaChannel')}
                checkboxProps={{
                    checked: outputConfig.AVIF_keepAlphaChannel,
                    onChange: (e, v) => updateOutputConfig('AVIF_keepAlphaChannel', v)
                }}
            />
        </Box>

        <Collapse in={!outputConfig.AVIF_loseless}>
            <Box>
                <Box pb={2}>
                    <Typography variant="body2" color="textSecondary" fontWeight="bolder" gutterBottom>
                        {t('label.WEBP_quality')}
                    </Typography>
                    <SliderWithInput
                        min={0} max={100} step={1}
                        value={outputConfig.AVIF_Q}
                        onChange={(n) => updateOutputConfig('AVIF_Q', n)}
                        label="WEBP quality"
                    />
                </Box>
            </Box>
        </Collapse>

        <Box pb={2}>
            <TypographyWithTooltip variant="body2" color="textSecondary" fontWeight="bolder" gutterBottom
                tooltip="默认为 HEVC。"
            >
                {'压缩格式'}
            </TypographyWithTooltip>
            <ButtonGroup fullWidth variant="outlined" disableElevation size="small"
                sx={{ overflow: 'auto' }}
            >
                {(['hevc', 'avc', 'jpeg', 'av1'] as const).map((v) =>
                    <Button key={v} variant={outputConfig.AVIF_compression === v ? 'contained' : 'outlined'}
                        onClick={() => updateOutputConfig('AVIF_compression', v)}
                        sx={{
                            minWidth: 'unset !important',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        {v}
                    </Button>
                )}

            </ButtonGroup>
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
                tooltip={'每像素的位数。默认 12。'}
            >
                {t('label.GIF_bitdepth')}
            </TypographyWithTooltip>

            <SliderWithInput value={outputConfig.AVIF_bitdepth}
                onChange={(n) => updateOutputConfig('AVIF_bitdepth', n)}
                min={1} max={16} step={1} label="GIF bitdepth"
                sliderProps={{ marks: true }}
            />
        </Box>
    </Box>

}