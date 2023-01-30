import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Box, Checkbox, FormControlLabel } from "@mui/material";
import { useCallback, useState, useMemo, useContext, useEffect } from "react";
import { simd } from "wasm-feature-detect";
import { appConfigContext } from "../../context/appConfigContext";
import useAsync from "../../hooks/useAsync";
import { clipboardSupport, compatibilityTestResult, FS_Mode, isMacOriOS, isWebkit, storageDisabled, isMobileBrowser } from "../../utils/browserCompability";

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

    const [open, setOpen] = useState(
        (siteConfig.tipDisplay['browserCompatibility'] || severity === 'error') &&
        (!compatibilityTestResult.WASM || !compatibilityTestResult.webWorker
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
    }, []);



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
                    {!compatibilityTestResult.WASM && <Box p={1} mb={1} bgcolor={(theme) => theme.palette.action.hover} borderRadius={1}>
                        <DialogContentText variant="h6" fontWeight='bolder' gutterBottom>
                            不支持 WebAssembly
                        </DialogContentText>
                        <DialogContentText gutterBottom>
                            图像处理内核 wasm-vips 将无法正常运行。
                        </DialogContentText>
                    </Box>}
                    {!compatibilityTestResult.webWorker && <Box p={1} mb={1} bgcolor={(theme) => theme.palette.action.hover} borderRadius={1}>
                        <DialogContentText variant="h6" fontWeight='bolder' gutterBottom>
                            不支持 Web Worker
                        </DialogContentText>
                        <DialogContentText gutterBottom>
                            WebAssembly 模块将不可以在主线程以外加载。
                        </DialogContentText>
                    </Box>}
                    {!compatibilityTestResult.webWorker && <DialogContentText gutterBottom>
                        - (必要) 此浏览器不支持 Web Worker
                    </DialogContentText>}
                    {!compatibilityTestResult.sharedArrayBuffer && <Box p={1} mb={1} bgcolor={(theme) => theme.palette.action.hover} borderRadius={1}>
                        <DialogContentText variant="h6" fontWeight='bolder' gutterBottom>不支持 SharedArrayBuffer API</DialogContentText>
                        <DialogContentText gutterBottom>这是驱动 WebAssembly 多线程任务的必要 API。由 libvips 提供的功能将无法正常使用。</DialogContentText>
                    </Box>}
                    {FS_Mode === 'noFS' && <DialogContentText gutterBottom>
                        - (可选) 此浏览器不支持 Storage API
                    </DialogContentText>}
                </>}

            </>) : (<>
                <DialogContentText gutterBottom>当前浏览器存在以下兼容性问题：</DialogContentText>

                {/* SIMD Support */}
                {!simdSupport && <Box p={1} mb={1} bgcolor={(theme) => theme.palette.action.hover} borderRadius={1}>
                    <DialogContentText variant="h6" fontWeight='bolder' gutterBottom>
                        (重要) 图像处理引擎 wasm-vips 无法正常运行
                    </DialogContentText>
                    <DialogContentText gutterBottom>
                        当前浏览器对于 WebAssembly SIMD 的支持存在问题。
                    </DialogContentText>
                    {(isMobileBrowser && isWebkit) ?
                        <DialogContentText gutterBottom>
                            对于 Safari 浏览器，截至此程序当前版本发布时，此问题仅在 Safari 预览版本中得到解决。请在桌面设备中从 Chorme 或 Firefox 浏览器来使用此应用吧。
                        </DialogContentText> :
                        <DialogContentText gutterBottom>
                            请尝试在 Google Chorme、Microsoft Edge 或 Firefox 浏览器来使用此应用吧。
                        </DialogContentText>
                    }
                </Box>}

                {/* noFS */}
                {FS_Mode === 'noFS' && <Box p={1} mb={1} bgcolor={(theme) => theme.palette.action.hover} borderRadius={1}>
                    <DialogContentText variant="h6" fontWeight='bolder' gutterBottom>不支持 File System API</DialogContentText>
                    <DialogContentText gutterBottom><strong>这可能会影响图片的批量转换功能。</strong>单次或少量的文件转换操作不会受到影响。</DialogContentText>
                    <DialogContentText gutterBottom>由于输出的文件会存储在内存中，大批量的文件操作可能会遇到问题。</DialogContentText>
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
                    <DialogContentText gutterBottom><strong>快速读取和写入剪切板文件的操作会受到影响。</strong></DialogContentText>
                    <DialogContentText gutterBottom>当进行剪切板操作时，可能会需要额外的手动操作。</DialogContentText>
                </Box>}
                {simdSupport && <DialogContentText gutterBottom>这些问题不会影响核心功能的使用。</DialogContentText>}

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