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
            编码方式
        </Typography>
        <Box pb={2}>
            <ButtonGroup fullWidth disableElevation size="small" variant="outlined">
                <Button variant={outputConfig.AVIF_lossless ? 'outlined' : 'contained'}
                    onClick={() => updateOutputConfig('AVIF_lossless', false)}
                >{t('label.lossy')}</Button>
                <Button variant={outputConfig.AVIF_lossless ? 'contained' : 'outlined'}
                    onClick={() => updateOutputConfig('AVIF_lossless', true)}
                >{t('label.loseless')}</Button>
            </ButtonGroup>
        </Box>

        <Box pb={1}>
            <CheckboxWithTooltop
                label={t('label.keepAlphaChannel')}
                checkboxProps={{
                    checked: outputConfig.AVIF_keepAlphaChannel,
                    onChange: (e, v) => updateOutputConfig('AVIF_keepAlphaChannel', v)
                }}
            />
        </Box>

        <Collapse in={!outputConfig.AVIF_lossless}>
            <Box>
                <Box pb={2}>
                    <Typography variant="body2" color="textSecondary" fontWeight="bolder" gutterBottom>
                        {t('label.quality')}
                    </Typography>
                    <SliderWithInput
                        min={0} max={100} step={1}
                        value={outputConfig.AVIF_Q}
                        onChange={(n) => updateOutputConfig('AVIF_Q', n)}
                        label="Quality"
                    />
                </Box>
            </Box>

            <Box hidden pb={2}>
                <Typography variant="body2" color="textSecondary" fontWeight="bolder" gutterBottom>
                    {t('label.AVIF_compression')}
                </Typography>
                <ButtonGroup fullWidth variant="outlined" disableElevation size="small"
                    sx={{ overflow: 'auto' }}
                >
                    {([/* 'hevc', 'avc', */ 'jpeg', 'av1'] as const).map((v) =>
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
            
        </Collapse>

        <Box pb={2}>
            <Typography variant="body2" color="textSecondary" fontWeight="bolder" gutterBottom>
                {t('label.AVIF_subsampleMode')}
            </Typography>
            <ButtonGroup fullWidth variant="outlined" disableElevation size="small"
                sx={{ overflow: 'auto' }}
            >
                {(['auto', 'on', 'off'] as const).map((v) =>
                    <Button key={v} variant={outputConfig.AVIF_subsampleMode === v ? 'contained' : 'outlined'}
                        onClick={() => updateOutputConfig('AVIF_subsampleMode', v)}
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



        {/* <Box pb={2}>

            <TypographyWithTooltip variant="body2" fontWeight="bolder" color="textSecondary" gutterBottom
                tooltip={'Default: 12'}
            >
                {t('label.bitdepth')}
            </TypographyWithTooltip>

            <SliderWithInput value={outputConfig.AVIF_bitdepth}
                onChange={(n) => updateOutputConfig('AVIF_bitdepth', n)}
                min={1} max={16} step={1} label="bitdepth"
                sliderProps={{ marks: true }}
            />
        </Box> */}
    </Box>

}