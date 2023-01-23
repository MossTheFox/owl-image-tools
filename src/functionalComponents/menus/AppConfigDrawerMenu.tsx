import { SwipeableDrawer, SwipeableDrawerProps, Box, Typography, List, ListItem, ListItemButton, ListItemText, ListItemIcon, ListSubheader, IconButton, Divider, Switch, Collapse, Button } from "@mui/material";
import { Close, DarkMode, LightMode } from '@mui/icons-material';
import { VERSION_TEXT, VERSION_TEXT_SECONDARY } from "../../constraints";
import { FS_Mode } from "../../utils/browserCompability";
import { useCallback, useContext, useState } from "react";
import { appConfigContext, defaultSiteConfig } from "../../context/appConfigContext";
import BGTransitionBox from "../../components/styledComponents/BGTransitionBox";
import QuickDialog, { QuickDialogData } from "../../components/styledComponents/QuickDialog";
import InspectSiteDataDialog from "../dialogs/InspectSiteDataDialog";

export default function AppConfigDrawerMenu(props: SwipeableDrawerProps) {

    const { siteConfig, updateSiteConfig } = useContext(appConfigContext);
    const toggleThemeFollowSystem = useCallback(() => {
        updateSiteConfig('colorModeFollowSystem', !siteConfig.colorModeFollowSystem);
    }, [updateSiteConfig, siteConfig.colorModeFollowSystem]);

    const toggleColorMode = useCallback(() => {
        updateSiteConfig('colorMode', siteConfig.colorMode === 'dark' ? 'light' : 'dark');
    }, [updateSiteConfig, siteConfig.colorMode]);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogData, setDialogData] = useState<QuickDialogData>({});
    const closeDialog = useCallback(() => setDialogOpen(false), []);

    const openResetTipsDialog = useCallback(() => {
        setDialogData({
            title: '将重置所有提示信息',
            content: '被选择过 "不再提示" 的提示信息将会恢复正常显示。',
            actions: <Button onClick={() => {
                updateSiteConfig('tipDisplay', { ...defaultSiteConfig.tipDisplay });
                setDialogOpen(false);
            }}>
                确认重置
            </Button>
        });
        setDialogOpen(true);
    }, [updateSiteConfig]);

    const openFSDetailDialog = useCallback(() => {
        setDialogData({
            title: '关于文件系统访问模式',
            content: '不同浏览器对于网页应用的文件系统访问有着不同的支持程度。\n'
                + '此应用对于不同的浏览器支持程度进行了三种划分，如下: \n'
                + '- 完整支持: 浏览器支持 Public File System Access API，此模式下，应用程序可以在请求授权目录访问之后，直接将输出的文件写入指定目录；\n'
                + '- Private FS: 浏览器支持 Origin Private File System，此模式下，转换完成的图片会在私有文件系统中暂存，并提供打包下载；\n'
                + '- 受限模式: 浏览器不支持上述两种文件系统访问，此模式下，输出的文件会被暂存在内存中，同时转换较多的文件可能会造成页面内存占用过多而崩溃。\n'
                + '\n'
                + '你的浏览器' +
                (FS_Mode === 'noFS' ? '不支持文件系统访问' :
                    FS_Mode === 'publicFS' ? '有着完整的文件系统访问支持' : '支持 Private FS (私有文件系统)') + '。'
        })
        setDialogOpen(true);
    }, []);

    const [clearSiteDataDialogOpen, setClearSiteDataDialogOpen] = useState(false);
    const closeClearSiteDataDialog = useCallback(() => setClearSiteDataDialogOpen(false), []);
    const clearSiteData = useCallback(() => {
        // site data: localStorage, privateFS
        setClearSiteDataDialogOpen(true);
    }, []);

    return <SwipeableDrawer anchor="left" disableSwipeToOpen {...props}
        sx={{
            ...props.sx,
            transitionProperty: 'all',
            display: 'flex',
        }}
    >

        <QuickDialog open={dialogOpen} onClose={closeDialog} {...dialogData} keepCloseButton />

        <InspectSiteDataDialog open={clearSiteDataDialogOpen} onClose={closeClearSiteDataDialog} />

        <BGTransitionBox flexGrow={1}>
            <Box display='flex' justifyContent='space-between' alignItems='center' px={2} py={1} >
                <Typography variant="h6" fontWeight='bolder'>
                    设置
                </Typography>
                <IconButton color="primary" size="small" aria-label="Close" onClick={props.onClose}>
                    <Close />
                </IconButton>
            </Box>
            <Divider />
            <List
                subheader={<ListSubheader>
                    <Typography variant="body1" fontWeight="bolder">
                        界面设置
                    </Typography>
                </ListSubheader>}
            >
                <ListItem>
                    <ListItemText primary="主题跟随系统" />
                    <Switch onChange={toggleThemeFollowSystem} checked={siteConfig.colorModeFollowSystem} />
                </ListItem>
                <Collapse in={!siteConfig.colorModeFollowSystem}>

                    <ListItemButton disabled={siteConfig.colorModeFollowSystem}
                        onClick={toggleColorMode}
                    >
                        <ListItemIcon>
                            {siteConfig.colorMode === 'dark' ?
                                <DarkMode /> : <LightMode />}
                        </ListItemIcon>
                        <ListItemText primary={siteConfig.colorMode === 'dark' ? "深色模式" : "亮色模式"} />
                    </ListItemButton>
                </Collapse>
            </List>

            <Divider />
            <List
                subheader={<ListSubheader>
                    <Typography variant="body1" fontWeight="bolder">
                        偏好设置
                    </Typography>
                </ListSubheader>}
            >
                {/* <ListItem>
                    <ListItemText primary="从剪切板读取后自动开始任务" secondary="对于快速操作很有用" />
                    <Switch />
                </ListItem> */}
                <ListItemButton onClick={openResetTipsDialog}>
                    <ListItemText primary="重置提示信息显示状态"
                        secondary={`移除所有勾选过的 "不再提示" 选项`}
                    />
                </ListItemButton>
            </List>

            <Divider />
            <List
                subheader={<ListSubheader>
                    <Typography variant="body1" fontWeight="bolder">
                        系统
                    </Typography>
                </ListSubheader>}
            >
                <ListItemButton onClick={openFSDetailDialog} >
                    <ListItemText primary={"文件系统模式: " + (() => {
                        switch (FS_Mode) {
                            case 'noFS':
                                return '不支持文件系统访问';
                            case 'privateFS':
                                return 'Private FS';
                            case 'publicFS':
                                return '完整支持'
                        }
                    })()}
                        secondary={(() => {
                            switch (FS_Mode) {
                                case 'noFS':
                                    return '批量转换的任务结果将存储在内存中，可能造成程序崩溃';
                                case 'privateFS':
                                    return '批量转换的任务会在 Origin Private File System 中暂存';
                                case 'publicFS':
                                    return '对于取得访问权限的目录有着完整的读写支持'
                            }
                        })()}
                    />
                </ListItemButton>

                <ListItemButton onClick={clearSiteData}>
                    <ListItemText primary="检查站点数据"
                        secondary={`查看和清除保存的配置信息与文件缓存`}
                    />
                </ListItemButton>

                <ListItem>
                    <ListItemText primary={VERSION_TEXT} secondary={VERSION_TEXT_SECONDARY} />
                </ListItem>
            </List>

        </BGTransitionBox>
    </SwipeableDrawer>
}