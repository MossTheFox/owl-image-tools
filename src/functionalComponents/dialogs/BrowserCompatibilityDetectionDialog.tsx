import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Box, Checkbox, FormControlLabel } from "@mui/material";
import { useCallback, useState, useMemo, useContext } from "react";
import { appConfigContext } from "../../context/appConfigContext";
import { clipboardSupport, compabilityTestResult, FS_Mode, isMacOriOS, storageDisabled } from "../../utils/browserCompability";

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
        if (!compabilityTestResult.WASM || !compabilityTestResult.webWorker || storageDisabled) {
            return 'error';
        }
        return 'warning';
    }, []);

    const [open, setOpen] = useState(
        (siteConfig.tipDisplay['browserCompatibility'] || severity === 'error') &&
        (!compabilityTestResult.WASM || !compabilityTestResult.webWorker
            || FS_Mode === 'noFS' || storageDisabled || !clipboardSupport)
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

    return <Dialog open={open} onClose={handleClose}>
        <DialogTitle fontWeight='bolder'>浏览器兼容性提示</DialogTitle>
        <DialogContent>
            {severity === 'error' ? (<>
                <DialogContentText gutterBottom>当前浏览器无法正常运行此工具。</DialogContentText>
                {storageDisabled && <>
                    <DialogContentText gutterBottom fontWeight='bolder'>你的浏览器不允许网页应用在本地存储数据。</DialogContentText>
                    <DialogContentText gutterBottom><strong>这可能是禁用 Cookie 造成的。</strong>浏览器在禁用 Cookie 之后，同时会将一系列 Storage API 禁用，以阻止网页应用在本地存储信息。</DialogContentText>
                    <DialogContentText gutterBottom>为了保证程序的正常运行，请尝试将 Cookie 开关打开。</DialogContentText>
                    <DialogContentText>我们并不会用到 Cookie，此程序会用到的是一些 Storage API，以便在本地存储必要的设置信息与转换的图片缓存。</DialogContentText>

                </>}
                {!storageDisabled && <>
                    {userOSAndBrowser.isIOS ? <>
                        <DialogContentText gutterBottom>对于 iOS 设备，请尝试使用 <strong>Safari 浏览器</strong>，不要使用<strong>无痕浏览</strong>模式 (此模式下，无法使用 Storage API，程序功能会受到部分影响)</DialogContentText>
                    </> : <>
                        {/* other devices */}
                        {isMacOriOS && <DialogContentText gutterBottom>请尝试使用 Safari、Google Chrome 或 Microsoft Edge 浏览器。</DialogContentText>}
                        {!isMacOriOS && <DialogContentText gutterBottom>请尝试使用 Google Chrome 或 Microsoft Edge 浏览器。</DialogContentText>}

                    </>}
                    <DialogContentText gutterBottom>检测到的问题如下：</DialogContentText>
                    {!compabilityTestResult.WASM && <DialogContentText gutterBottom>
                        - (必要) 此浏览器不支持 WebAssembly
                    </DialogContentText>}
                    {!compabilityTestResult.webWorker && <DialogContentText gutterBottom>
                        - (必要) 此浏览器不支持 Web Worker
                    </DialogContentText>}
                    {!compabilityTestResult.sharedArrayBuffer && <DialogContentText gutterBottom>
                        - (几乎必要) 此浏览器不支持 SharedArrayBuffer API
                    </DialogContentText>}
                    {FS_Mode === 'noFS' && <DialogContentText gutterBottom>
                        - (可选) 此浏览器不支持 Storage API
                    </DialogContentText>}
                </>}

            </>) : (<>
                <DialogContentText gutterBottom>当前浏览器存在以下兼容性问题：</DialogContentText>

                {!compabilityTestResult.sharedArrayBuffer && <Box p={1} mb={1} bgcolor={(theme) => theme.palette.action.hover} borderRadius={1}>
                    <DialogContentText variant="h6" fontWeight='bolder' gutterBottom>不支持 SharedArrayBuffer API</DialogContentText>
                    <DialogContentText gutterBottom><strong>相当多的由 libvips 提供的功能将无法正常使用。</strong></DialogContentText>
                    <DialogContentText gutterBottom>只有少部分基础功能可以正常使用。</DialogContentText>
                </Box>}
                {/* noFS */}
                {FS_Mode === 'noFS' && <Box p={1} mb={1} bgcolor={(theme) => theme.palette.action.hover} borderRadius={1}>
                    <DialogContentText variant="h6" fontWeight='bolder' gutterBottom>不支持 File System API</DialogContentText>
                    <DialogContentText gutterBottom><strong>这会影响图片的批量转换功能。</strong>单次或少量的文件转换操作不会受到影响。</DialogContentText>
                    {userOSAndBrowser.isIOS ? <>
                        <DialogContentText gutterBottom>对于 iOS 设备，请尝试使用 Safari 浏览器，且<strong>不要使用无痕浏览</strong>模式 (此模式下，无法使用必要的 Storage API 来暂存批量转换的任务)</DialogContentText>
                        <DialogContentText gutterBottom>此应用程序不会追踪你的数据，所有图片转换均在你的设备上完成，不会被上传到云端。请放心。</DialogContentText>
                        <DialogContentText gutterBottom>你可以随时在 Safari 浏览器的设置中，清除此站点的数据。</DialogContentText>
                    </> : <>
                        {isMacOriOS && <DialogContentText gutterBottom>可以尝试使用 Safari、Google Chrome 或 Microsoft Edge 浏览器。</DialogContentText>}
                        {!isMacOriOS && <DialogContentText gutterBottom>可以尝试使用 Google Chrome 或 Microsoft Edge 浏览器。</DialogContentText>}
                    </>}
                </Box>}
                {!clipboardSupport && <Box p={1} mb={1} bgcolor={(theme) => theme.palette.action.hover} borderRadius={1}>
                    <DialogContentText variant="h6" fontWeight='bolder' gutterBottom>不支持剪切板文件访问 API (Clipboard API)</DialogContentText>
                    <DialogContentText gutterBottom><strong>快速读取和写入剪切板文件的操作将不可用。</strong>你会需要在粘贴和存储图片时进行一些额外的操作。</DialogContentText>
                </Box>}
                <DialogContentText gutterBottom>这些问题不会影响部分核心功能的使用。</DialogContentText>

                <FormControlLabel control={
                    <Checkbox checked={!siteConfig.tipDisplay['browserCompatibility']} onClick={toggleShowNextTime} />
                } label={
                    <DialogContentText>
                        下次不再提示
                    </DialogContentText>
                } />

            </>)}
        </DialogContent>
        <DialogActions>
            {severity !== 'error' && (<>
                <Button onClick={handleClose}>好的</Button>
            </>)}
        </DialogActions>
    </Dialog>
}