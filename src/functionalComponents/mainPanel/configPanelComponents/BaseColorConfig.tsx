import { Box, BoxProps, ButtonBase, Link, Paper, Typography, FormHelperText, InputBase } from "@mui/material";
import { TinyColor } from '@ctrl/tinycolor';
import { useCallback, useContext, useMemo, useRef, useState } from "react";
import { appConfigContext, ColorFormatConfig } from "../../../context/appConfigContext";
import TypographyWithTooltip from "../../../components/styledComponents/TypographyWithTooltip";


const formats: ColorFormatConfig[] = ['hex', 'rgb', 'hsl', 'hsv'];
const defaultColors: { [key in ColorFormatConfig]: string } = {
    hex: '#ffffff',
    hsl: 'hsl(0, 0%, 100%)',
    hsv: 'hsv(0, 0%, 100%)',
    rgb: 'rgb(255, 255, 255)'
};

const convertTo = (color: string, target: ColorFormatConfig) => {
    let result = color;
    switch (target) {
        case 'hex':
            result = new TinyColor(result).toHexString();
            break;
        case 'hsl':
            result = new TinyColor(result).toHslString();
            break;
        case 'hsv':
            result = new TinyColor(result).toHsvString();
            break;
        case 'rgb':
            result = new TinyColor(result).toRgbString();
            break;
    }
    return result;
};

export default function BaseColorConfig(props: BoxProps) {

    // 👇 Store Hex. Display format up to the user.
    const { outputConfig, updateOutputConfig } = useContext(appConfigContext);

    const [format, setFormat] = useState<ColorFormatConfig>(outputConfig.colorFormat);

    const [focused, setFocused] = useState(false);

    const [colorInput, setColorInput] = useState(() => {
        const savedColor = new TinyColor(outputConfig.imageBaseColor);
        if (savedColor.isValid) {
            return convertTo(outputConfig.imageBaseColor, outputConfig.colorFormat);
        }
        return defaultColors[outputConfig.colorFormat];
    });

    const storedColorDisplay = useMemo(() => {
        return convertTo(outputConfig.imageBaseColor, format);
    }, [outputConfig.imageBaseColor, format]);

    const nativePicker = useRef<HTMLInputElement>(null);

    const openNativePicker = useCallback(() => {
        nativePicker.current && nativePicker.current.click();
    }, []);

    const handleColorInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setColorInput(e.target.value);
        let input = e.target.value;
        const t = new TinyColor(input);
        if (t.isValid) {
            updateOutputConfig('imageBaseColor', t.toHexString());
        }
    }, [updateOutputConfig]);

    const onLostFocus = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
        let input = e.target.value;
        const t = new TinyColor(input);
        if (t.isValid) {
            setColorInput(convertTo(input, format));
            updateOutputConfig('imageBaseColor', t.toHexString());
        } else {
            setColorInput(defaultColors[format]);
            updateOutputConfig('imageBaseColor', "#ffffff");
        }
        setFocused(false);
    }, [format, updateOutputConfig])

    const handleInputFocus = useCallback(() => {
        setColorInput(convertTo(outputConfig.imageBaseColor, format));
        setFocused(true);
    }, [format, outputConfig.imageBaseColor]);


    const handleNativeColorPickerChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        let result = convertTo(e.target.value, format);
        setColorInput(result);
        updateOutputConfig('imageBaseColor', e.target.value);   // HEX
    }, [format, updateOutputConfig]);

    const handleFormatChange = useCallback((format: ColorFormatConfig) => {
        setFormat(format);
        setColorInput(convertTo(outputConfig.imageBaseColor, format));
        updateOutputConfig('colorFormat', format)
    }, [outputConfig.imageBaseColor, updateOutputConfig]);

    return <Box {...props}>
        <Box display='flex' justifyContent='space-between'
            alignItems='baseline'
            pb={0.5}
        >
            <TypographyWithTooltip variant="body2" color="textSecondary" fontWeight='bolder'
                tooltip='丢失透明度信息时，默认的图像底色。不会影响支持透明通道的图像格式，除非手动指定丢弃透明度信息。'
            >
                图片底色
            </TypographyWithTooltip>

            <Box flexGrow={1} display='flex' gap={0.5} flexWrap='nowrap' overflow='hidden'
                justifyContent='end'
            >
                {formats.map((v) =>
                    <Link key={v} variant="body2" component="button"
                        underline={format === v ? 'always' : 'none'}
                        onClick={handleFormatChange.bind(null, v)}
                    >
                        {v.toUpperCase()}
                    </Link>
                )}
            </Box>
        </Box>
        <Box>
            <Paper elevation={0} sx={{
                border: 1,
                borderColor: 'divider'
            }}>
                <Box px={2} py={1}
                    display='flex'
                    alignItems='center'
                >
                    <ButtonBase
                        onClick={openNativePicker}
                        sx={{
                            borderRadius: (theme) => `${theme.shape.borderRadius / 2}px`,
                        }} >
                        <Box boxShadow={1} sx={{
                            width: '24px',
                            height: '24px',
                            bgcolor: outputConfig.imageBaseColor,
                            borderRadius: (theme) => `${theme.shape.borderRadius / 2}px`,
                        }} />
                    </ButtonBase>

                    <Box pl={1} flexGrow={1}>
                        <InputBase fullWidth size="small"
                            value={focused ? colorInput : storedColorDisplay}
                            onChange={handleColorInputChange}
                            onFocus={handleInputFocus}
                            onBlur={onLostFocus}
                            spellCheck={false}
                            sx={{
                                'input': {
                                    p: 0,
                                    fontFamily: 'var(--font-monospace)'
                                }
                            }} />
                    </Box>

                </Box>
            </Paper>


            <input ref={nativePicker} type='color' autoComplete="off" aria-label="Color Picker Hidden"
                style={{ height: 0, margin: 0, padding: 0, border: 0, outline: 0, display: 'block', opacity: 0 }}
                value={outputConfig.imageBaseColor}
                onChange={handleNativeColorPickerChange}
            />

        </Box>
    </Box>
}