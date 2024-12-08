import { Box, BoxProps, Link, Menu, MenuItem, Typography } from "@mui/material";
import { t } from "i18next";
import { useCallback, useContext, useRef, useState } from "react";
import CheckboxWithTooltop from "../../../components/styledComponents/CheckboxWithTooltip";
import { appConfigContext } from "../../../context/appConfigContext";
import { MarkdownRendererNoGutterBottom } from "../../../utils/mdRenderer";
import BaseColorConfig from "./BaseColorConfig";
import ConfigPanelAccordion from "./ConfigPanelAccordion";
import GIFConfig from "./perFormatConfigs/GIFConfig";
import JPEGConfig from "./perFormatConfigs/JPEGConfig";
import PNGConfig from "./perFormatConfigs/PNGConfig";
import WEBPConfig from "./perFormatConfigs/WEBPConfig";
import AVIFConfig from "./perFormatConfigs/AVIFConfig";

export default function OutputConfigArea(props: BoxProps) {

    const { outputConfig, updateOutputConfig, resetOutputConfigToDefault } = useContext(appConfigContext);

    const [menuOpen, setMenuOpen] = useState(false);
    const menuAnchor = useRef<HTMLButtonElement>(null);
    const openMenu = useCallback(() => setMenuOpen(true), []);
    const closeMenu = useCallback(() => setMenuOpen(false), []);

    const resetConfig = useCallback(() => {
        resetOutputConfigToDefault();
        closeMenu();
    }, [resetOutputConfigToDefault, closeMenu]);

    return <Box {...props}>
        <Typography variant="body1" fontWeight='bolder' gutterBottom
            component='div' display='flex' justifyContent='left' alignItems='baseline'
            gap={1}
        >
            <span>{t('ui.configPanel.advancedOutputSettings')}</span>
            <Link ref={menuAnchor} component='button' underline='hover' variant='body2' onClick={openMenu}>
                {t('commonWords.options')}
            </Link>
        </Typography>

        {/* MENU START */}
        <Menu open={menuOpen} onClose={closeMenu} anchorEl={menuAnchor.current}>
            <MenuItem dense onClick={resetConfig}>
                <Typography variant="body2" fontWeight="bolder" color={(theme) => theme.palette.warning.main}>
                    {t('ui.configPanel.resetToDefault')}
                </Typography>
            </MenuItem>
        </Menu>
        {/* END */}

        <BaseColorConfig py={1} pb={2} />

        <CheckboxWithTooltop label={t('label.keepMetaData')}
            tooltip={
                <MarkdownRendererNoGutterBottom md={t('tooltip.keepMetaData')} />
            }
            checkboxProps={{
                checked: outputConfig.keepMetaData,
                onChange: (e, checked) => {
                    updateOutputConfig('keepMetaData', checked);
                }
            }}
        />


        <Box py={1}>

            <ConfigPanelAccordion recordIndex={1} summary={t('ui.configPanel.JPEG')}>
                <JPEGConfig />
            </ConfigPanelAccordion>

            <ConfigPanelAccordion recordIndex={2} summary={t('ui.configPanel.PNG')}>
                <PNGConfig />
            </ConfigPanelAccordion>

            {/* <ConfigPanelAccordion hidden recordIndex={3} summary="APNG Settings">
                TODO
            </ConfigPanelAccordion> */}

            <ConfigPanelAccordion recordIndex={4} summary={t('ui.configPanel.GIF')}>
                <GIFConfig />
            </ConfigPanelAccordion>

            <ConfigPanelAccordion recordIndex={5} summary={t('ui.configPanel.WEBP')}>
                <WEBPConfig />
            </ConfigPanelAccordion>

            <ConfigPanelAccordion recordIndex={6} summary={t('ui.configPanel.AVIF')}>
                <AVIFConfig />
            </ConfigPanelAccordion>

            {/* <ConfigPanelAccordion recordIndex={7} summary={'SVG 设置 (仅读取)'}>
            </ConfigPanelAccordion> */}
        </Box>


    </Box>;
}