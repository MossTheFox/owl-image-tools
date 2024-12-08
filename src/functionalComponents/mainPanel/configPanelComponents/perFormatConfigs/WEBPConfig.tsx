import { Box, BoxProps, Button, ButtonGroup, Collapse, Typography } from "@mui/material";
import { t } from "i18next";
import { useContext, useMemo } from "react";
import CheckboxWithTooltop from "../../../../components/styledComponents/CheckboxWithTooltip";
import SliderWithInput from "../../../../components/styledComponents/SliderWithInput";
import { appConfigContext } from "../../../../context/appConfigContext";

export default function WEBPConfig(props: BoxProps) {

    const { outputConfig, updateOutputConfig } = useContext(appConfigContext);

    // i18n
    const i18nWebpCompressionPreset = useMemo(() => {
        return t('label.WEBP_compressionPresets');
    }, []);

    return <Box {...props}>

        <Typography variant="body2" fontWeight="bolder" color="textSecondary" gutterBottom>
            {t('label.WEBP_encodeMode')}
        </Typography>
        <Box pb={2}>
            <ButtonGroup fullWidth disableElevation size="small" variant="outlined">
                <Button variant={outputConfig.WEBP_lossless ? 'outlined' : 'contained'}
                    onClick={() => updateOutputConfig('WEBP_lossless', false)}
                >{t('label.lossy')}</Button>
                <Button variant={outputConfig.WEBP_lossless ? 'contained' : 'outlined'}
                    onClick={() => updateOutputConfig('WEBP_lossless', true)}
                >{t('label.loseless')}</Button>
            </ButtonGroup>
        </Box>

        <Box pb={1}>
            <CheckboxWithTooltop
                label={t('label.keepAlphaChannel')}
                tooltip={t('tooltip.WEBP_keepAlphaChannel')}
                checkboxProps={{
                    checked: outputConfig.WEBP_keepAlphaChannel,
                    onChange: (e, v) => updateOutputConfig('WEBP_keepAlphaChannel', v)
                }}
            />
        </Box>

        <Collapse in={!outputConfig.WEBP_lossless}>
            <Box>
                <Box pb={2}>
                    <Typography variant="body2" color="textSecondary" fontWeight="bolder" gutterBottom>
                        {t('label.WEBP_quality')}
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
                        {t('label.WEBP_lossyCompressionPresets')}
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
                            {t('label.WEBP_alphaQuality')}
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