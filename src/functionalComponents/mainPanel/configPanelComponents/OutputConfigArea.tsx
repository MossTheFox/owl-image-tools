import { Box, BoxProps, ButtonBase, Checkbox, FormControlLabel, FormHelperText, Link, Menu, MenuItem, Typography } from "@mui/material";
import { useCallback, useContext, useRef, useState } from "react";
import CheckboxWithTooltop from "../../../components/styledComponents/CheckboxWithTooltip";
import { appConfigContext } from "../../../context/appConfigContext";
import BaseColorConfig from "./BaseColorConfig";
import ConfigPanelAccordion from "./ConfigPanelAccordion";
import GIFConfig from "./perFormatConfigs/GIFConfig";
import JPEGConfig from "./perFormatConfigs/JPEGConfig";
import PNGConfig from "./perFormatConfigs/PNGConfig";
import WEBPConfig from "./perFormatConfigs/WEBPConfig";

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
            <span>高级输出设置</span>
            <Link ref={menuAnchor} component='button' underline='hover' variant='body2' onClick={openMenu}>
                选项
            </Link>
        </Typography>

        {/* MENU START */}
        <Menu open={menuOpen} onClose={closeMenu} anchorEl={menuAnchor.current}>
            <MenuItem onClick={resetConfig}>
                <Typography variant="body2" fontWeight="bolder" color={(theme) => theme.palette.warning.main}>
                    重置为默认值
                </Typography>
            </MenuItem>
        </Menu>
        {/* END */}

        <BaseColorConfig py={1} pb={2} />

        <CheckboxWithTooltop label="保留图像元数据"
            tooltip={<>
                如果勾选，对于支持的格式 (JPG, TIFF, PNG, WEBP) 将会保留原始图片的 Exif meta data。<br />
                对于照片，这些数据可以包含图片的拍摄曝光信息、拍摄地点等信息。 <br />
                请留意，一些浏览器可能会在导入图片时默认抹去元数据。
            </>}
            checkboxProps={{
                checked: outputConfig.keepMetaData,
                onChange: (e, checked) => {
                    updateOutputConfig('keepMetaData', checked);
                }
            }}
        />


        <Box py={1}>

            <ConfigPanelAccordion recordIndex={1} summary="JPEG 设置">
                <JPEGConfig />
            </ConfigPanelAccordion>

            <ConfigPanelAccordion recordIndex={2} summary="PNG 设置">
                <PNGConfig />
            </ConfigPanelAccordion>

            <ConfigPanelAccordion hidden recordIndex={3} summary="APNG 设置">
                TODO
            </ConfigPanelAccordion>

            <ConfigPanelAccordion recordIndex={4} summary="GIF 设置">
                <GIFConfig />
            </ConfigPanelAccordion>

            <ConfigPanelAccordion recordIndex={5} summary="WEBP 设置">
                <WEBPConfig />
            </ConfigPanelAccordion>

            <ConfigPanelAccordion disabled recordIndex={6} summary="AVIF 设置 (暂时不可用)">
                TODO
            </ConfigPanelAccordion>
        </Box>


    </Box>;
}