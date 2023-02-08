import { Box, Paper, Typography, Stack, PaperProps, Grid, Select, MenuItem, Link, Menu, ListItem, Button } from "@mui/material";
import { useCallback, useContext, useMemo, useRef, useState } from "react";
import { fileListContext as _fileListContext, webkitFileListContext as _webkitFileListContext } from "../../context/fileListContext";
import { CONTROL_PANEL_HEIGHT } from "../../App";
import DialogLoadingIndicator from "../../ui/smallComponents/DialogLoadingIndicator";
import { mimeToExt, OUTPUT_MIMEs } from "../../utils/imageMIMEs";
import OutputConfigArea from "./configPanelComponents/OutputConfigArea";
import { appConfigContext } from "../../context/appConfigContext";
import { panelNavigationContext } from "../../context/panelNavigationContext";
import { Forward } from "@mui/icons-material";
import { t } from "i18next";

export default function ConfigPanel(props: PaperProps) {

    const fileListContext = useContext(_fileListContext);
    const webkitFileListContext = useContext(_webkitFileListContext);

    const { onScreenPanelCount, navigateTo, focused } = useContext(panelNavigationContext);

    const { outputConfig, setOutputTargetFormat } = useContext(appConfigContext);

    const processing = useMemo(() => !fileListContext.ready || !webkitFileListContext.ready, [fileListContext.ready, webkitFileListContext.ready]);

    const [menuOpen, setMenuOpen] = useState(false);
    const menuAnchor = useRef<HTMLDivElement>(null);

    const openMenu = useCallback(() => setMenuOpen(true), []);
    const closeMenu = useCallback(() => setMenuOpen(false), []);

    const setAllTo = useCallback((mime: typeof OUTPUT_MIMEs[number]) => {
        setOutputTargetFormat('ALL', mime);
        closeMenu();
    }, [setOutputTargetFormat, closeMenu]);

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

        <Box px={2} pb={1}
            borderBottom={1}
            borderColor="divider"
            display='flex' justifyContent='baseline' alignItems='stretch'
        >
            <Box pt={2}>
                <Typography variant="h5" fontWeight='bolder'
                    component='div' display='flex' alignItems='stretch' justifyContent='space-between'
                    whiteSpace="nowrap"
                >
                    <span>输出设置</span>

                </Typography>
            </Box>

            {/* Navigation Here */}
            <Box pt={1} flexGrow={1} display="flex" justifyContent="end" alignItems="stretch" gap={1}
                sx={{
                    transition: 'opacity 0.25s',
                    opacity: onScreenPanelCount <= 2 ? 1 : 0
                }}
            >
                <Box display="flex" alignItems="stretch"
                    overflow="hidden" gap={1}
                >
                    {(!focused.includes('input') || onScreenPanelCount === 1) && <Button variant='outlined' size="small"
                        startIcon={<Forward sx={{ transform: 'scaleX(-1)' }} />}
                        onClick={() => navigateTo('input')}
                        disabled={onScreenPanelCount === 3}
                        sx={{ whiteSpace: 'nowrap', py: 0 }}
                    >
                        导入文件
                    </Button>}
                    {(!focused.includes('output') || onScreenPanelCount === 1) &&
                        <Button variant={'contained'} size="small"
                            disableElevation
                            endIcon={<Forward />}
                            onClick={() => navigateTo('output')}
                            disabled={onScreenPanelCount === 3}
                            sx={{ whiteSpace: 'nowrap', py: 0 }}
                        >
                            开始任务
                        </Button>}
                </Box>

            </Box>
        </Box>

        <Box overflow='auto'>
            <Box px={2} mt={1} pb={2}
                borderBottom={1}
                borderColor='divider'
            >
                <Typography ref={menuAnchor} variant="body1" fontWeight='bolder' gutterBottom
                    component="div" display="flex" alignItems="baseline" justifyContent="left" gap={1}
                >
                    <span>目标格式</span>
                    <Link component="button" underline="hover" variant="body2" onClick={openMenu}>
                        选项
                    </Link>
                </Typography>

                <Menu open={menuOpen} anchorEl={menuAnchor.current} onClose={closeMenu}>
                    <ListItem dense>
                        <Typography fontWeight="bolder">全部设置为:</Typography>
                    </ListItem>
                    {OUTPUT_MIMEs.map((v, i) =>
                        <MenuItem dense key={v} value={v} onClick={setAllTo.bind(null, v)}>
                            <Typography variant="body2" display='inline-block' px={0.5}>
                                {`${mimeToExt(v)} (${v})`}
                            </Typography>
                        </MenuItem>
                    )}
                </Menu>


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
                <Box py={2}>
                    <Typography variant="body2" color="textSecondary" whiteSpace="pre-wrap">
                        {t('global.knownIssues')}
                    </Typography>
                </Box>
            </Box>

        </Box >
    </Paper >;
}