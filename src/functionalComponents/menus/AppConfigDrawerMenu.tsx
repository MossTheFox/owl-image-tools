import { SwipeableDrawer, SwipeableDrawerProps, Box, Typography, List, ListItem, ListItemButton, ListItemText, ListItemIcon, ListSubheader, IconButton, Divider, Switch, Collapse, Button } from "@mui/material";
import { Close, DarkMode, GitHub, LightMode } from '@mui/icons-material';
import { GITHUB_REPO_URL, VERSION_TEXT, VERSION_TEXT_SECONDARY } from "../../constraints";
import { FS_Mode } from "../../utils/browserCompability";
import { useCallback, useContext, useState } from "react";
import { appConfigContext, defaultSiteConfig } from "../../context/appConfigContext";
import BGTransitionBox from "../../components/styledComponents/BGTransitionBox";
import QuickDialog, { QuickDialogData } from "../../components/styledComponents/QuickDialog";
import InspectSiteDataDialog from "../dialogs/InspectSiteDataDialog";
import ExternalLink from "../../ui/icons/ExternalLink";
import { t } from "i18next";
import { MarkdownRenderer } from "../../utils/mdRenderer";
import ChangeLanguageDialog from "../dialogs/ChangeLanguageDialog";

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
            title: t('title.resetTipDisplayPreference'),
            content: t('content.resetTipDisplayPreference'),
            actions: <Button onClick={() => {
                updateSiteConfig('tipDisplay', { ...defaultSiteConfig.tipDisplay });
                setDialogOpen(false);
            }}>
                {t('button.confirmReset')}
            </Button>
        });
        setDialogOpen(true);
    }, [updateSiteConfig]);

    const openFSDetailDialog = useCallback(() => {
        setDialogData({
            title: t('title.aboutFSMode'),
            content: <MarkdownRenderer md={
                t('content.aboutFSModeDialogContent') + '\n\n'
                + (FS_Mode === 'noFS' ? t('content.aboutFSModeDetectResult.noFS') :
                    FS_Mode === 'publicFS' ? t('content.aboutFSModeDetectResult.fullSupport') :
                        t('content.aboutFSModeDetectResult.privateFS'))
            } typographyProps={{ color: "text.secondary" }} />
        })
        setDialogOpen(true);
    }, []);

    const [clearSiteDataDialogOpen, setClearSiteDataDialogOpen] = useState(false);
    const closeClearSiteDataDialog = useCallback(() => setClearSiteDataDialogOpen(false), []);
    const clearSiteData = useCallback(() => {
        // site data: localStorage, privateFS
        setClearSiteDataDialogOpen(true);
    }, []);

    const [langDialogOpen, setLangDialogOpen] = useState(false);
    const openLangDialog = useCallback(() => setLangDialogOpen(true), []);
    const closeLangDialog = useCallback(() => setLangDialogOpen(false), []);

    return <SwipeableDrawer anchor="left" disableSwipeToOpen {...props}
        sx={{
            ...props.sx,
            transitionProperty: 'all',
            display: 'flex',
        }}
    >

        <QuickDialog open={dialogOpen} onClose={closeDialog} {...dialogData} keepCloseButton />

        <InspectSiteDataDialog open={clearSiteDataDialogOpen} onClose={closeClearSiteDataDialog} />

        <ChangeLanguageDialog open={langDialogOpen} onClose={closeLangDialog} />

        <BGTransitionBox flexGrow={1}>
            <Box display='flex' justifyContent='space-between' alignItems='center' px={2} py={1} >
                <Typography variant="h6" fontWeight='bolder'>
                    {t('commonWords.settings')}
                </Typography>
                <IconButton color="primary" size="small" aria-label="Close" onClick={props.onClose}>
                    <Close />
                </IconButton>
            </Box>
            <Divider />
            <List
                subheader={<ListSubheader>
                    <Typography variant="body1" fontWeight="bolder">
                        {t('ui.interfaceSettings')}
                    </Typography>
                </ListSubheader>}
            >
                <ListItem>
                    <ListItemText primary={t('menu.colorThemeFollowSystem')} />
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
                        <ListItemText primary={siteConfig.colorMode === 'dark' ? t('menu.darkMode') : t('menu.lightMode')} />
                    </ListItemButton>
                </Collapse>

                <ListItemButton onClick={openLangDialog}>
                    <ListItemText primary={t('menu.language')} />
                </ListItemButton>

            </List>

            <Divider />
            <List
                subheader={<ListSubheader>
                    <Typography variant="body1" fontWeight="bolder">
                        {t('ui.preferenceConfig')}
                    </Typography>
                </ListSubheader>}
            >
                <ListItemButton onClick={openResetTipsDialog}>
                    <ListItemText primary={t('menu.resetAllTipDisplayPreference')}
                        secondary={t('menu.resetAllTipDisplayPreferenceSecondary')}
                    />
                </ListItemButton>
            </List>

            <Divider />
            <List
                subheader={<ListSubheader>
                    <Typography variant="body1" fontWeight="bolder">
                        {t('ui.systemConfig')}
                    </Typography>
                </ListSubheader>}
            >
                <ListItemButton onClick={openFSDetailDialog} >
                    <ListItemText primary={t('menu.fsMode', {
                        text: (() => {
                            switch (FS_Mode) {
                                case 'noFS':
                                    return t('menu.fsModeText.noFS');
                                case 'privateFS':
                                    return t('menu.fsModeText.privateFS');
                                case 'publicFS':
                                    return t('menu.fsModeText.fullSupport');
                                default:
                                    return t('commonWords.unknown');
                            }
                        })()
                    })}
                        secondary={(() => {
                            switch (FS_Mode) {
                                case 'noFS':
                                    return t('menu.fsModeSecondaryText.noFS');
                                case 'privateFS':
                                    return t('menu.fsModeSecondaryText.privateFS');
                                case 'publicFS':
                                    return t('menu.fsModeSecondaryText.fullSupport');
                            }
                        })()}
                    />
                </ListItemButton>

                <ListItemButton onClick={clearSiteData}>
                    <ListItemText primary={t('menu.inspectSiteData')}
                        secondary={t('menu.inspectSiteDataSecondary')}
                    />
                </ListItemButton>

                <ListItem>
                    <ListItemText primary={VERSION_TEXT} secondary={VERSION_TEXT_SECONDARY} />
                </ListItem>

                <ListItemButton LinkComponent='a' href={GITHUB_REPO_URL} target="_blank">
                    <ListItemIcon>
                        <GitHub />
                    </ListItemIcon>
                    <ListItemText primary={<>
                        GitHub repository <ExternalLink fontSize="small" />
                    </>
                    } />
                </ListItemButton>

            </List>

        </BGTransitionBox>
    </SwipeableDrawer>
}