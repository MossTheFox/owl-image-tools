import { Box, BoxProps, Link, MenuItem, Select, Slider, TextField, Typography } from "@mui/material";
import { useContext, useMemo } from "react";
import { appConfigContext, PNGCompressionOptions, pngCompressionOptions } from "../../../context/appConfigContext";
import ExternalLink from "../../../ui/icons/ExternalLink";
import BaseColorConfig from "./BaseColorConfig";
import ConfigPanelAccordion from "./ConfigPanelAccordion";

export default function OutputConfigArea(props: BoxProps) {

    const { outputConfig, updateOutputConfig } = useContext(appConfigContext);

    const pngOutputConfigDesc = useMemo<{ [key in PNGCompressionOptions]: string }>(() => {
        // i18n note
        return {
            'no-compression': '最快 (低压缩率)',
            'quick': '快速',
            'slow': '慢',
            "slow-as-hell": '很慢',
            'custom': '自定义'
        };
    }, []);

    return <Box {...props}>
        <Typography variant="body1" fontWeight='bolder' gutterBottom>
            高级输出设置
        </Typography>

        <BaseColorConfig py={1} />


        <Box py={1}>

            <ConfigPanelAccordion recordIndex={1} summary="JPEG 设置">
                <Typography variant="body2" color="textSecondary" >
                    JPEG 质量
                </Typography>
                <Box display='flex' gap={2}>

                    <Slider sx={{ flexGrow: 1 }}
                        size="small"
                        min={0}
                        max={100}
                        step={1}
                        onChange={(e, v) => {
                            updateOutputConfig('JPEG_quality', +v);
                        }}
                        value={outputConfig.JPEG_quality}
                        aria-label="JPEG Quality Slider"
                    />
                    <TextField sx={{
                        width: '3em'
                    }}
                        variant='standard'
                        size='small'
                        type='number'
                        value={outputConfig.JPEG_quality}
                        onChange={(e) => {
                            updateOutputConfig('JPEG_quality', +e.target.value);
                        }}
                        autoComplete='off'
                        aria-label="JPEG Quality Input"
                    />
                </Box>
            </ConfigPanelAccordion>

            <ConfigPanelAccordion recordIndex={2} summary="PNG 设置">
                <Box pb={1}>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                        压缩选项
                    </Typography>
                    <Select value={outputConfig.PNG_compressionOption}
                        fullWidth
                        size="small"
                        onChange={(e) => {
                            updateOutputConfig('PNG_compressionOption', e.target.value as PNGCompressionOptions);
                        }}
                    >
                        {pngCompressionOptions.map((v, i) =>
                            <MenuItem value={v} key={i}>
                                {pngOutputConfigDesc[v]}
                            </MenuItem>
                        )}

                    </Select>
                </Box>

                <Box pb={1} hidden={outputConfig.PNG_compressionOption !== 'custom'}>
                    <Box display="flex" justifyContent="space-between">

                        <Typography flexGrow={1} variant="body2" color="textSecondary" gutterBottom>
                            Pngcrush 参数
                        </Typography>
                        <Link variant="body2" underline="hover" gutterBottom
                            href="https://manpages.ubuntu.com/manpages/focal/en/man1/pngcrush.1.html"
                            rel="noopener noreferrer"
                            target="_blank"
                        >查看详情<ExternalLink fontSize="inherit" /> </Link>
                    </Box>
                    <TextField value={outputConfig.PNG_pngcrushCustomArgs}
                        fullWidth
                        size="small"
                        onChange={(e) => {
                            updateOutputConfig('PNG_pngcrushCustomArgs', e.target.value);
                        }}
                        helperText={"此参数将会插入在输入文件名和输出文件名的前方。\n例如: 自定义参数为 -v -brute\n执行的指令: pngcrush -v -brute input.png output.png"}
                        FormHelperTextProps={{
                            sx: {
                                ml: 0,
                                whiteSpace: 'pre-wrap'
                            }
                        }}
                    />
                </Box>
            </ConfigPanelAccordion>

            <ConfigPanelAccordion recordIndex={3} summary="WEBP 设置">
                <Typography variant="body2" color="textSecondary" >
                    WEBP 质量
                </Typography>
                <Box display='flex' gap={2}>

                    <Slider sx={{ flexGrow: 1 }}
                        size="small"
                        min={0}
                        max={100}
                        step={1}
                        onChange={(e, v) => {
                            updateOutputConfig('WEBP_quality', +v);
                        }}
                        value={outputConfig.WEBP_quality}
                        aria-label="WEBP Quality Slider"
                    />
                    <TextField sx={{
                        width: '3em'
                    }}
                        variant='standard'
                        size='small'
                        type='number'
                        value={outputConfig.WEBP_quality}
                        onChange={(e) => {
                            updateOutputConfig('WEBP_quality', +e.target.value);
                        }}
                        autoComplete='off'
                        aria-label="WEBP Quality Input"
                    />
                </Box>
            </ConfigPanelAccordion>
        </Box>


    </Box>;
}