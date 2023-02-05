import { Box, BoxProps, Slider, SliderProps, TextField } from "@mui/material";
import { useMemo, useCallback } from "react";

export default function SliderWithInput({
    boxProps,
    sliderProps,
    textFieldWidth = '3em',
    value,
    onChange,
    label,
    max,
    min,
    step,
    disabled,
    mark
}: {
    textFieldWidth?: string;
    boxProps?: BoxProps;
    sliderProps?: SliderProps;
    value: number;
    onChange: (v: number) => void;
    min: number;
    max: number;
    step: number;
    disabled?: boolean;
    label?: string;
    mark?: boolean;
}) {

    const shouldBeInteger = useMemo(() => {
        return Number.isInteger(min) && Number.isInteger(max) && Number.isInteger(step);
    }, [min, max, step]);

    const sliderOnChange = useCallback((e: Event, v: number | number[]) => {
        onChange(+v);
    }, [onChange]);

    const inputOnChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        // do check here...
        let trim = +e.target.value;
        if (isNaN(trim)) {
            trim = max;
        }
        if (shouldBeInteger && !Number.isInteger(trim)) {
            trim = Math.floor(trim);
        }
        if (trim < min || trim > max) {
            trim = max;
        }
        onChange(trim);
        e.target.value = trim + '';
    }, [onChange, shouldBeInteger, max, min]);

    return <Box display='flex' gap={2} {...boxProps}>
        <Slider sx={{ flexGrow: 1 }}
            size="small"
            disabled={disabled}
            min={min}
            max={max}
            step={1}
            onChange={sliderOnChange}
            value={value}
            aria-label={label}
            valueLabelDisplay="auto"
            marks={mark}
            {...sliderProps}
        />
        <TextField sx={{
            width: textFieldWidth
        }}
            disabled={disabled}
            variant='standard'
            size='small'
            type='number'
            value={value}
            onChange={inputOnChange}
            inputProps={{
                min,
                max,
                step
            }}
            autoComplete='off'
            aria-label={label}
        />
    </Box>
}