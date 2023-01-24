import { Box, BoxProps, Checkbox, FormControlLabel, Typography, FormHelperText, Button, ButtonGroup, Select, Link, TextField, MenuItem } from "@mui/material";
import { useContext, useMemo } from "react";
import { appConfigContext, pngCompressionOptions, PNGCompressionOptions } from "../../../../context/appConfigContext";
import ExternalLink from "../../../../ui/icons/ExternalLink";

export default function PNGConfig(props: BoxProps) {

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
        <Box pb={1}>

            <Box pb={1}>
                <FormControlLabel control={
                    <Checkbox size="small"
                        sx={{ py: 0.5 }}
                        checked={outputConfig.PNG_keepAlphaChannel}
                        onChange={(e, v) => {
                            updateOutputConfig('PNG_keepAlphaChannel', v)
                        }} />

                } label={
                    <Typography variant="body2" color="textSecondary" fontWeight="bolder">
                        保留透明度信息
                    </Typography>
                } />
                <FormHelperText>
                    如果丢弃透明度信息，输出的图像将会应用设置的图片底色。
                </FormHelperText>
            </Box>

            {/* <Box pb={1}>
                <FormControlLabel control={
                    <Checkbox size="small"
                        sx={{ py: 0.5 }}
                    />
                } label={
                    <Typography variant="body2" color="textSecondary" fontWeight="bolder">
                        检测 APNG 格式
                    </Typography>
                } />
                <FormHelperText>
                    如果勾选，转换时会对于扩展名为 PNG 的图片进行额外的检查。若发现为 
                </FormHelperText>
            </Box> */}

            {/* APNG 转换应该直接支持。 */}



            <Typography variant="body2" fontWeight="bolder" color="textSecondary" gutterBottom>
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

        <Box pb={1} hidden={outputConfig.PNG_compressionOption === 'custom'}>
            <Typography variant="body2" fontWeight="bolder" color="textSecondary" gutterBottom>
                压缩模式
            </Typography>
            <ButtonGroup disableElevation size="small" variant="outlined">
                <Button>无损压缩</Button>
                <Button>有损压缩</Button>
            </ButtonGroup>
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
    </Box>
}