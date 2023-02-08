import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Box, Checkbox, FormControlLabel } from "@mui/material";
import { t } from "i18next";
import { useCallback, useState, useMemo, useContext, useEffect } from "react";
import { simd } from "wasm-feature-detect";
import { appConfigContext } from "../../context/appConfigContext";
import useAsync from "../../hooks/useAsync";
import { clipboardSupport, compatibilityTestResult, FS_Mode, isMacOriOS, isWebkit, storageDisabled, isMobileBrowser } from "../../utils/browserCompability";
import { MarkdownRenderer } from "../../utils/mdRenderer";

/** Automatically open once on startup.
 * 
 * Not gonna do: when publicFS is supported, allow continue with storage API disabled
 */
export default function BrowserCompatibilityDetectionDialog() {

    const { siteConfig, setTipDisplay } = useContext(appConfigContext);

    const toggleShowNextTime = useCallback(() => {
        setTipDisplay('browserCompatibility', !siteConfig.tipDisplay['browserCompatibility']);
    }, [setTipDisplay, siteConfig.tipDisplay]);

    const severity = useMemo(() => {
        if (!compatibilityTestResult.WASM || !compatibilityTestResult.webWorker || !compatibilityTestResult.sharedArrayBuffer || storageDisabled) {
            return 'error';
        }
        return 'warning';
    }, []);

    const [open, setOpen] = useState(severity === 'error' ||
        (
            siteConfig.tipDisplay['browserCompatibility'] &&
            (!compatibilityTestResult.WASM || !compatibilityTestResult.webWorker
                || FS_Mode === 'noFS' || storageDisabled || !clipboardSupport)
        )
    );

    const userOSAndBrowser = useMemo(() => {
        const browser = 'whatever';
        return {
            isIOS: typeof navigator.standalone === 'boolean' && navigator.maxTouchPoints > 0,
            browser
        }
    }, []);

    const handleClose = useCallback(() => {
        if (severity !== 'error') {
            setOpen(false);
        }
    }, [severity]);

    // async check WASM SIMD Support

    const [shouldFireTip, _setShouldFireTip] = useState(siteConfig.tipDisplay.browserCompatibility);

    const [simdSupport, setSIMDSupport] = useState(true);
    const asyncCheckSIMDSupport = useCallback(async () => {
        return await simd();
    }, []);

    const simdCheckOnFinished = useCallback((result: boolean) => {
        if (!result) {
            setSIMDSupport(false);
            if (shouldFireTip) {
                setOpen(true);
            }
        }
    }, [shouldFireTip]);

    const fireSIMDCheck = useAsync(asyncCheckSIMDSupport, simdCheckOnFinished);

    useEffect(() => {
        fireSIMDCheck();
    }, [fireSIMDCheck]);



    return <Dialog open={open} onClose={handleClose}>
        <DialogTitle fontWeight='bolder'>
            {t('title.browserCompatibilityTip')}
        </DialogTitle>
        <DialogContent>
            {severity === 'error' ? (<>
                <DialogContentText gutterBottom>
                    {t('content.browserCompatibilityContent.unableToRun')}
                </DialogContentText>
                {storageDisabled &&
                    <MarkdownRenderer md={t('content.browserCompatibilityContent.unableToRunDueToStorageDisabled')}
                        typographyProps={{ color: 'text.secondary' }}
                    />
                }
                {!storageDisabled && <>
                    {userOSAndBrowser.isIOS ?
                        <MarkdownRenderer md={t('content.browserCompatibilityContent.unableToRunTip.iOS')}
                            typographyProps={{ color: 'text.secondary' }}
                        /> :
                        <>
                            {/* other devices */}
                            {isMacOriOS && <MarkdownRenderer md={t('content.browserCompatibilityContent.unableToRunTip.mac')}
                                typographyProps={{ color: 'text.secondary' }}
                            />}
                            {!isMacOriOS && <MarkdownRenderer md={t('content.browserCompatibilityContent.unableToRunTip.other')}
                                typographyProps={{ color: 'text.secondary' }}
                            />}

                        </>}
                    <DialogContentText gutterBottom>
                        {t('content.browserCompatibilityContent.issueDetected')}
                    </DialogContentText>

                    {!compatibilityTestResult.WASM &&
                        <Box p={1} mb={1} bgcolor={(theme) => theme.palette.action.hover} borderRadius={1}>
                            <MarkdownRenderer
                                md={t('content.browserCompatibilityContent.issues.noWASM')}
                                typographyProps={{ color: 'text.secondary' }}
                            />
                        </Box>}
                    {!compatibilityTestResult.webWorker && <Box p={1} mb={1} bgcolor={(theme) => theme.palette.action.hover} borderRadius={1}>
                        <MarkdownRenderer
                            md={t('content.browserCompatibilityContent.issues.noWebWorker')}
                            typographyProps={{ color: 'text.secondary' }}
                        />
                    </Box>}

                    {!compatibilityTestResult.sharedArrayBuffer && <Box p={1} mb={1} bgcolor={(theme) => theme.palette.action.hover} borderRadius={1}>
                        <MarkdownRenderer
                            md={t('content.browserCompatibilityContent.issues.noSharedArrayBuffer')}
                            typographyProps={{ color: 'text.secondary' }}
                        />
                    </Box>}
                </>}

            </>) : (<>
                <DialogContentText gutterBottom>
                    {t('content.browserCompatibilityContent.nonFatalIssueDetected')}
                </DialogContentText>

                {/* SIMD Support */}
                {!simdSupport && <Box p={1} mb={1} bgcolor={(theme) => theme.palette.action.hover} borderRadius={1}>
                    <MarkdownRenderer
                        md={t('content.browserCompatibilityContent.nonFatalIssues.SIMD')}
                        typographyProps={{ color: 'text.secondary' }}
                    />
                    {(isMobileBrowser && isWebkit) ?
                        <MarkdownRenderer
                            md={t('content.browserCompatibilityContent.nonFatalIssues.SIMDSafari')}
                            typographyProps={{ color: 'text.secondary' }}
                        /> :
                        <MarkdownRenderer
                            md={t('content.browserCompatibilityContent.nonFatalIssues.SIMDNon-Safari')}
                            typographyProps={{ color: 'text.secondary' }}
                        />
                    }
                </Box>}

                {/* noFS */}
                {FS_Mode === 'noFS' && <Box p={1} mb={1} bgcolor={(theme) => theme.palette.action.hover} borderRadius={1}>
                    <MarkdownRenderer
                        md={t('content.browserCompatibilityContent.nonFatalIssues.noFS')}
                        typographyProps={{ color: 'text.secondary' }}
                    />
                    {userOSAndBrowser.isIOS ?
                        <MarkdownRenderer
                            md={t('content.browserCompatibilityContent.nonFatalIssues.noFS_IOS')}
                            typographyProps={{ color: 'text.secondary' }}
                        />
                        : <>
                            {isMacOriOS && <MarkdownRenderer
                                md={t('content.browserCompatibilityContent.nonFatalIssues.noFS_Mac')}
                                typographyProps={{ color: 'text.secondary' }}
                            />}
                            {!isMacOriOS && <MarkdownRenderer
                                md={t('content.browserCompatibilityContent.nonFatalIssues.noFS_Other')}
                                typographyProps={{ color: 'text.secondary' }}
                            />}
                        </>}
                </Box>}
                {!clipboardSupport && <Box p={1} mb={1} bgcolor={(theme) => theme.palette.action.hover} borderRadius={1}>
                    <MarkdownRenderer
                        md={t('content.browserCompatibilityContent.nonFatalIssues.clipboardAPI')}
                        typographyProps={{ color: 'text.secondary' }}
                    />
                </Box>}
                {simdSupport && <DialogContentText gutterBottom>
                    {t('content.browserCompatibilityContent.nonFatalIssueFooter')}
                </DialogContentText>}

                <FormControlLabel control={
                    <Checkbox checked={!siteConfig.tipDisplay['browserCompatibility']} onClick={toggleShowNextTime} />
                } label={
                    <DialogContentText>
                        {t('button.dontShowAgain')}
                    </DialogContentText>
                } />

            </>)}
        </DialogContent>
        <DialogActions>
            {severity !== 'error' && (<>
                <Button onClick={handleClose}>
                    {t('button.ok')}
                </Button>
            </>)}
        </DialogActions>
    </Dialog>
}