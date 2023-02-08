const zhCN = {
    "document": {
        "title": "图片工具箱"
    },
    "global": {
        "knownIssues": `已知问题:
- 对于 wasm-vips 无法直接解码的格式 (SVG, ICO 等)，会先借助浏览器的解码器来获取一个中间图片 (PNG 格式)，此过程会丢失元数据与透明度信息；
- 也因此，对于目前版本下的 AVIF 格式，如果当前浏览器无法解码源文件，则也无法进行转换；
- APNG 格式不受支持。`
    },
    "lang": {
        "followSystem": "跟随系统",
        "zh": "中文",
        "zh-CN": "简体中文 (zh-CN)",
        "zh-TW": "繁体中文 (zh-TW)",
        "en": "英语 (en)"
    },
    // Upper case on first letter
    "commonWords": {
        "tips": "提示",
        "type": "类型",
        "count": "数量",
        "total": "合计",
        "open": "打开",
        "close": "关闭",
        "file": "文件",
        "folder": "文件夹",
        "directory": "目录",
        "delete": "删除",
        "remove": "移除",
        "download": "下载",
        "progress": "进度",
        "settings": "设置",
        "options": "选项",
        "details": "详情",
        "unknown": "未知",
    },
    "button": {
        "ok": "好的",
        "okAndDontShowAgain": "好的，不再提示",
        "dontShowAgain": "下次不再提示",
        "readFromClipboard": "从剪切板读取",
        "selectFiles": "选择文件",
        "selectDirectory": "选择文件夹",
        "selectWebkitDirectory": "导入文件夹",
        "denseList": "紧凑列表",
        "showPreview": "显示预览",
        "confirmReset": "确认重置",
        "applyAndReloadPage": "应用设置并刷新页面"
    },
    "ui": {
        "topBar": {
            "storageDiabledError": " Storage API 被拒绝",
            "FSMode": "文件系统: ",
            "noFS": "受限模式",
            "privateFS": "Private FS",
            "publicFS": "完整支持"
        },
        "sourceFiles": "源文件",
        "outputSettings": "输出设置",
        "output": "输出",
        "targetFormat": "目标格式",
        "advancedOutputSettings": "高级输出设置",
        "fileListEmpty": "文件列表为空",
        "outputListEmpty": "输出列表为空",
        "interfaceSettings": "界面设置",
        "preferenceConfig": "偏好设置",
        "systemConfig": "系统",
        "readFromClipboardInputPopup": "请在输入框中粘贴图片："
    },
    "logger": {
        "readFromClipboard": "从剪切板读取了 {{length}} 张图片。",
        "failToLoadFile": "读取文件时发生错误。",
        "notSupportedByVipsThenDoCanvasConverting": "文件 {{name}} 不受当前版本的 libvips 支持，将借助浏览器进行第一次转换。元数据和透明度信息会丢失。",
        "startProcessingFile": "开始处理文件：{{name}}，目标类型: {{ext}}",
        "taskFinished": "转换任务已完成，耗时 {{time}}。",
        "taskBegin": "开始转换任务。队列长度：{{length}}",
        "fileSavedPublicFS": "已保存文件：{{name}}",
        "fileSavedOPFS": "已在临时存储中保存文件：{{name}}"
    },
    // No period (?)
    "errorMessage": {
        "failToReadClipboard": "读取剪切板出错",
        "clipboardEmpty": "剪切板为空",
        "noImageFoundFromClipboard": "剪切板中没有有效的图片数据",

    },
    "menu": {
        // --- Config Drawer Menu --- //
        "colorThemeFollowSystem": "主题跟随系统",
        "language": "语言 (Language)",
        "lightMode": "亮色模式",
        "darkMode": "暗色模式",
        "resetAllTipDisplayPreference": "重置提示信息显示状态",
        "resetAllTipDisplayPreferenceSecondary": "移除所有勾选过的“不再提示”选项",
        "fsMode": "文件系统模式：{{text}}",
        "fsModeText": {
            "fullSupport": "完整支持",
            "privateFS": "OPFS",
            "noFS": "不支持文件系统访问"
        },
        "fsModeSecondaryText": {
            "fullSupport": "对于取得访问权限的目录有着完整的读写支持",
            "privateFS": "批量转换的任务会在 Origin Private File System 中暂存",
            "noFS": "批量转换的任务结果将存储在内存中，可能造成程序崩溃"
        },
        "inspectSiteData": "检查站点数据",
        "inspectSiteDataSecondary": "查看和清除保存的配置信息与文件缓存",

        // --- End of Config Drawer Menu --- //

        // --- Context Menu --- //
        "contextMenu": {
            "deleteDirectory": "移除目录 ({{count}} 个子项)",
            "showDetail": "详情",
            "outputDirectoryFileCount": "文件数量: {{count}}",
            "outputDirectoryErrorCount": "有 {{count}} 个子项发生错误。",
            "downloadZip": "打包下载",
            "saveToLocal": "保存到本地",
            "progress": "进度: {{progress}}%",
            "errMsg": "错误信息: {{msg}}"
        }
        // --- End of Context Menu //
    },

    "tooltip": {

    },
    // No period, and keep the title syntax
    "title": {
        "failToImportDirectory": "添加文件夹失败",
        "failToImportFile": "添加文件失败",
        "dragAndDropFileListIntergrityTip": "Drag and Drop 文件列表完整性问题",
        "aboutFSMode": "关于文件系统访问模式",
        "resetTipDisplayPreference": "将重置所有提示信息",
        "browserCompatibilityTip": "浏览器兼容性提示",
        "changeLanguage": "语言设置",
        "inputFileListInfo": "文件列表信息",
    },
    // Keep the period unless it's like "error message: {{msg}}".
    // For Dialog Content, Markdown Parser will be used. Use markdown syntax for formatting.
    "content": {
        "failToLoadFile": "读取文件时发生错误。",
        "failToLoadDirectory": "读取文件夹时发生错误。",
        "failToImportFile": "添加文件时发生错误。",
        "errorMessage": "错误信息: {{msg}}",
        "failToClearOPFS": "清理私有文件系统缓存目录时遇到问题。",

        "dragAndDropFileListIntegrityDialogContent": `检测到潜在的文件列表完整性问题: 

**你的浏览器可能限制了单个文件夹内的项目数量** (限制为 100)，超过此限制的文件在导入时会被跳过。

可以尝试使用文件夹选择按钮，或者手动进行多次的导入。`,


        // --- Config Drawer Menu --- //
        "aboutFSModeDialogContent": `不同浏览器对于网页应用的文件系统访问有着不同的支持程度。

此应用对于不同的浏览器支持程度进行了三种划分，如下: 

- 完整支持: 浏览器支持 Public File System Access API，此模式下，应用程序可以在请求授权目录访问之后，直接将输出的文件写入指定目录；

- Private FS: 浏览器支持 Origin Private File System，此模式下，转换完成的图片会在私有文件系统中暂存，并提供打包下载；

- 受限模式: 浏览器不支持上述两种文件系统访问，此模式下，输出的文件会被暂存在内存中，同时转换较多的文件可能会造成页面内存占用过多而崩溃。`,

        "aboutFSModeDetectResult": {
            "fullSupport": "你的浏览器有着完整的文件系统访问支持。",
            "privateFS": "你的浏览器支持 Private FS (私有文件系统)。",
            "noFS": "你的浏览器不支持文件系统访问。"
        },
        "resetTipDisplayPreference": "被选择过“不再提示”的提示信息将会恢复正常显示。",

        "languageDialogTipContent": '更换应用的显示语言。\n\n**语言设置更新后，页面将会刷新。请确保您的数据已保存完毕再进行操作。**',

        // --- End of Config Drawer Menu --- //

        // --- Browser Compatibility Dialog --- //
        "browserCompatibilityContent": {
            "unableToRun": "当前浏览器无法正常运行此工具。",

            "unableToRunDueToStorageDisabled": `
**你的浏览器不允许网页应用在本地存储数据。**

**这可能是禁用 Cookie 造成的。**浏览器在禁用 Cookie 之后，同时会将一系列 Storage API 禁用，以阻止网页应用在本地存储信息。

为了保证程序的正常运行，请尝试将 Cookie 开关打开。

我们并不会用到 Cookie，此程序会用到的是一些 Storage API，以便在本地存储必要的设置信息与转换的图片缓存。`,


            "unableToRunTip": {
                "iOS": `对于 iOS 设备，请尝试使用 **Safari 浏览器**，不要使用**无痕浏览**模式 (此模式下，无法使用 Storage API，程序功能会受到部分影响)`,

                "mac": `请尝试使用 Safari、Google Chrome 或 Microsoft Edge 浏览器。`,

                "other": `请尝试使用 Google Chrome 或 Microsoft Edge 浏览器。`,
            },

            "issueDetected": "检测到的问题如下：",

            "issues": {
                "noWASM": `###### 不支持 WebAssembly

图像处理内核 wasm-vips 将无法正常运行。`,

                "noWebWorker": `###### 不支持 Web Worker

WebAssembly 模块将不可以在主线程以外加载、且多线程不可用。`,

                "noSharedArrayBuffer": `###### 不支持 SharedArrayBuffer API
                
wasm-vips 将无法正常运行。

如果当前浏览器本身支持此 API，请检查应用的托管页面是否有正确设置 \` Cross-Origin-Embedder-Policy\` 与 \`Cross-Origin-Opener-Policy\` 响应头。([参考](https://caniuse.com/?search=sharedArrayBuffer))`,
            },

            "nonFatalIssueDetected": "当前浏览器存在以下兼容性问题：",
            "nonFatalIssueFooter": "这些问题不会影响核心功能的使用。",
            "nonFatalIssues": {
                // This one was supposed to be fatal issue but many non-latest browsers still not fully supported.
                "SIMD": `###### (重要) 图像处理引擎 wasm-vips 无法正常运行

当前浏览器对于 WebAssembly SIMD 的支持存在问题。`,
                "SIMDSafari": `对于 Safari 浏览器，截至此程序当前版本发布时，此问题仅在 Safari 预览版本中得到解决。请在桌面设备中从 Chorme 或 Firefox 浏览器来使用此应用吧。`,
                "SIMDNon-Safari": `请尝试在版本较新的 Google Chorme、Microsoft Edge 或 Firefox 浏览器来使用此应用吧。`,

                "noFS": `###### 不支持 File System API

**这可能会影响图片的批量转换功能。**单次或少量的文件转换操作不会受到影响。

由于输出的文件会存储在内存中，大批量的文件操作可能会遇到问题。`,

                "noFS_IOS": `对于 iOS 设备，请尝试使用 Safari 浏览器，且**不要使用无痕浏览**模式 (此模式下，无法使用必要的 Storage API 来暂存批量转换的任务)

此应用程序不会追踪你的数据，所有图片转换均在你的设备上完成，不会被上传到云端。请放心。

你可以随时在 Safari 浏览器的设置中，清除此站点的数据。`,

                "noFS_Mac": `可以尝试使用 Safari、Google Chrome 或 Microsoft Edge 浏览器。`,
                "noFS_Other": `可以尝试使用 Google Chrome 或 Microsoft Edge 浏览器。`,

                "clipboardAPI": `###### 不支持剪切板文件访问 API (Clipboard API)

**快速读取和写入剪切板文件的操作会受到影响。**

当进行剪切板操作时，可能会需要额外的手动操作。`,
            }
            // --- End of Browser Compatibility Dialog --- //


        }

    },
} as const;

export default zhCN;