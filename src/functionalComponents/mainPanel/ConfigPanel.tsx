import { Box, Paper, Typography, Stack, PaperProps, Grid, Select, MenuItem } from "@mui/material";
import { useContext, useMemo } from "react";
import { fileListContext as _fileListContext, webkitFileListContext as _webkitFileListContext } from "../../context/fileListContext";
import { CONTROL_PANEL_HEIGHT } from "../../App";
import DialogLoadingIndicator from "../../ui/smallComponents/DialogLoadingIndicator";
import { extToMime, mimeToExt, OUTPUT_MIMEs } from "../../utils/imageMIMEs";
import OutputConfigArea from "./configPanelComponents/OutputConfigArea";
import { appConfigContext } from "../../context/appConfigContext";

export default function ConfigPanel(props: PaperProps) {

    const fileListContext = useContext(_fileListContext);
    const webkitFileListContext = useContext(_webkitFileListContext);

    const { outputConfig, setOutputTargetFormat } = useContext(appConfigContext);

    const processing = useMemo(() => !fileListContext.ready || !webkitFileListContext.ready, [fileListContext.ready, webkitFileListContext.ready]);


    return <Paper {...props} sx={{
        ...props.sx,
        overflow: 'hidden',
        flexGrow: 1,
        maxHeight: CONTROL_PANEL_HEIGHT,
        transition: 'background-color 0.25s',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'stretch'
    }}>
        {/* Loading Indicator with ZIndex higher than content box */}
        <DialogLoadingIndicator loading={processing} zIndex={2} position="relative" />

        <Box px={2} pt={2} pb={1}
            borderBottom={1}
            borderColor='divider'
        >

            <Typography variant="h5" fontWeight='bolder'>
                输出设置
            </Typography>
        </Box>

        <Box overflow='auto'>
            <Box px={2} mt={1} pb={2}
                borderBottom={1}
                borderColor='divider'
            >
                <Typography variant="body1" fontWeight='bolder' gutterBottom>
                    目标格式
                </Typography>
                {webkitFileListContext.statistic.totalFiles <= 0 &&
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                        请先导入文件。
                    </Typography>
                }
                {webkitFileListContext.statistic.totalFiles > 0 &&
                    <Grid container spacing={1}>

                        <Grid item xs={5}>
                            <Typography variant="body2" fontWeight="bolder">
                                源文件格式
                            </Typography>
                        </Grid>
                        <Grid item xs={7}>
                            <Typography variant="body2" fontWeight="bolder">
                                输出格式
                            </Typography>
                        </Grid>
                        {Object.entries(webkitFileListContext.statistic.perFormatCount).map((v, i) => {
                            const [_mime, count] = v;
                            const mime = _mime as keyof typeof webkitFileListContext.statistic.perFormatCount;
                            return [
                                <Grid key={`${mime}-L`} item xs={5}
                                    display={count > 0 ? 'flex' : 'none'}
                                    alignItems='center'
                                >
                                    <Typography variant="body2">
                                        {`${mimeToExt(mime).toUpperCase()} (${count})`}
                                    </Typography>
                                </Grid>,
                                <Grid key={`${mime}-R`} item xs={7}
                                    display={count > 0 ? 'flex' : 'none'}
                                    alignItems='baseline'
                                >

                                    <Select autoComplete="off"
                                        fullWidth
                                        label={'输出格式'}
                                        size="small"
                                        value={outputConfig.outputFormats[mime]}
                                        variant="standard"
                                        onChange={(e) => {
                                            setOutputTargetFormat(mime, e.target.value as typeof OUTPUT_MIMEs[number])
                                        }}
                                    >
                                        {OUTPUT_MIMEs.map((v, i) =>
                                            <MenuItem key={v} value={v}>
                                                <Typography variant="body2" display='inline-block' px={0.5}>
                                                    {`${mimeToExt(v)} (${v})`}
                                                </Typography>
                                            </MenuItem>
                                        )}
                                    </Select>

                                </Grid>
                            ]
                        })}

                    </Grid>
                }
            </Box>
            <Box px={2} mt={1} pb={2}
            >
                <Stack spacing={1}>

                    <OutputConfigArea />

                </Stack>
            </Box>
        </Box >
    </Paper >;
}