import { SwipeableDrawer, SwipeableDrawerProps, Box, Typography, List, ListItem, ListItemButton, ListItemText, ListItemIcon, ListSubheader, IconButton, Divider, Switch } from "@mui/material";
import { Close, DarkMode, LightMode } from '@mui/icons-material';
import { VERSION_TEXT, VERSION_TEXT_SECONDARY } from "../../constraints";

export default function AppConfigDrawerMenu(props: SwipeableDrawerProps) {

    return <SwipeableDrawer anchor="left" disableSwipeToOpen {...props}>
        <Box>
            <Box display='flex' justifyContent='space-between' alignItems='center' px={2} py={1} >
                <Typography variant="h6" fontWeight='bolder'>
                    设置
                </Typography>
                <IconButton color="primary" size="small" aria-label="Close" onClick={props.onClose}>
                    <Close />
                </IconButton>
            </Box>
            <Divider />
            <Box py={1}>
                <List
                    subheader={<ListSubheader>
                        <Typography variant="body1" fontWeight="bolder">
                            界面设置
                        </Typography>
                    </ListSubheader>}
                >
                    <ListItem>
                        <ListItemText primary="主题跟随系统" />
                        <Switch />
                    </ListItem>
                    <ListItemButton >
                        <ListItemIcon>
                            <DarkMode />
                        </ListItemIcon>
                        <ListItemText primary="深色模式 | 浅色模式" />
                    </ListItemButton>
                </List>
            </Box>
            <Divider />
            <Box py={1}>
                <List
                    subheader={<ListSubheader>
                        <Typography variant="body1" fontWeight="bolder">
                            偏好设置
                        </Typography>
                    </ListSubheader>}
                >
                    <ListItem>
                        <ListItemText primary="PLACEHOLDER" />
                        <Switch />
                    </ListItem>
                    <ListItemButton >

                        <ListItemText primary="重置提示信息显示状态"
                            secondary={`移除所有勾选过的 "不再提示" 选项`}
                        />

                    </ListItemButton>
                </List>
            </Box>
            <Divider />
            <Box py={1}>
                <List
                    subheader={<ListSubheader>
                        <Typography variant="body1" fontWeight="bolder">
                            系统
                        </Typography>
                    </ListSubheader>}
                >
                    <ListItemButton >
                        <ListItemText primary="清空站点数据"
                            secondary={`清除保存的配置信息与文件缓存`}
                        />
                    </ListItemButton>

                    <ListItem>
                        <ListItemText primary={VERSION_TEXT} secondary={VERSION_TEXT_SECONDARY} />
                    </ListItem>
                </List>
            </Box>
        </Box>
    </SwipeableDrawer>
}