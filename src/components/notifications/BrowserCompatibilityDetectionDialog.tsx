import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Typography } from "@mui/material";
import { useCallback, useState, useMemo } from "react";
import { compabilityTestResult, FS_Mode, storageDisabled } from "../../utils/browserCompability";

/** Automatically open once on startup.
 * 
 * TODO: For firefox, allow (don't notify me next time)
 * TODO: when publicFS is supported, allow continue with storage API disabled
 */
export default function BrowserCompatibilityDetectionDialog() {

    const [open, setOpen] = useState(
        !compabilityTestResult.WASM || !compabilityTestResult.webWorker
        || FS_Mode === 'noFS' || storageDisabled
    );

    const [severity, setSeverity] = useState(() => {
        if (!compabilityTestResult.WASM || !compabilityTestResult.webWorker || storageDisabled) {
            return 'error';
        }
        return 'warning';
    });

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
                        <DialogContentText gutterBottom>请尝试使用 Chrome, Firefox 或 Microsoft Edge 浏览器。</DialogContentText>

                    </>}
                    <DialogContentText gutterBottom>检测到的问题如下：</DialogContentText>
                    {!compabilityTestResult.WASM && <DialogContentText gutterBottom>
                        - (必要) 此浏览器不支持 WebAssembly
                    </DialogContentText>}
                    {!compabilityTestResult.webWorker && <DialogContentText gutterBottom>
                        - (必要) 此浏览器不支持 Web Worker
                    </DialogContentText>}
                    {FS_Mode === 'noFS' && <DialogContentText gutterBottom>
                        - (可选) 此浏览器不支持 Storage API
                    </DialogContentText>}
                </>}

            </>) : (<>
                {/* noFS */}
                <DialogContentText gutterBottom>当前浏览器存在兼容性问题: 不支持 File System API。</DialogContentText>
                <DialogContentText gutterBottom><strong>这会影响图片的批量转换功能。</strong>单次的文件转换操作不会受到影响。</DialogContentText>
                {userOSAndBrowser.isIOS ? <>
                    <DialogContentText gutterBottom>对于 iOS 设备，请尝试使用 Safari 浏览器，且<strong>不要使用无痕浏览</strong>模式 (此模式下，无法使用必要的 Storage API 来暂存批量转换的任务)</DialogContentText>
                    <DialogContentText>此应用程序不会追踪你的数据，所有图片转换均在你的设备上完成，不会被上传到云端。请放心。</DialogContentText>
                    <DialogContentText>你可以随时在 Safari 浏览器的设置中，清除此站点的数据。</DialogContentText>
                </> : <>
                    <DialogContentText gutterBottom>可以尝试使用 Google Chrome 或 Microsoft Edge 浏览器。</DialogContentText>
                </>}

            </>)}
        </DialogContent>
        <DialogActions>
            {severity !== 'error' && (<>
                <Button onClick={handleClose}>了解了</Button>
            </>)}
        </DialogActions>
    </Dialog>
}