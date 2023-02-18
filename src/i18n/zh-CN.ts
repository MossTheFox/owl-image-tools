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
        "retry": "重试",
        "error": "错误",
        "abort": "终止",
        "cancel": "取消",
        "finished": "完成",
        "auto": "自动",
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
        "applyAndReloadPage": "应用设置并刷新页面",

        "downloadZip": "打包下载",
        "selectDirAndStartTask": "选择输出目录并开始转换",
        "startNextTask": "开始下一组任务",
        "startTask": "开始转换",
        "useLastOutputDirectoryAndContinue": "使用上一次的输出目录继续",
        "pickNewDirectoryAndContinue": "选择输出目录并继续",
        "continue": "继续"
    },
    "ui": {
        "topBar": {
            "storageDiabledError": " Storage API 被拒绝",
            "FSMode": "文件系统: ",
            "noFS": "受限模式",
            "privateFS": "Private FS",
            "publicFS": "完整支持",

            "loggerOutput": "日志输出",
            "clear": "清空",
            "noLogs": "当前没有日志输出。"
        },
        "fileDetailDialog": {
            "failToGetData": "获取失败",
            "output": "输出",
            "original": "原图",
            "comparison": "对比",
            "fileBufferUnreadableError": "无法读取文件。目标文件可能已被修改、移动或删除。",
            "browserFailToDecodeImageError": "当前浏览器无法解码此图片。可能是格式不支持或文件损坏。",
            "imageResolution": "尺寸",
            "imageFormat": "类型",
            "imageSize": "大小",
            "imageLastModified": "修改日期",
            "originalImageSize": "源文件大小",
            "originalImageLastModified": "源文件修改日期",
            "originalImageFormat": "源文件类型",
            "pending": "正在确认",
            "downloadOutputFileButton": "下载输出文件",
            "downloadOriginalFileButton": "下载原始文件",
            "downloadOutputFileButtonError": "无法读取输出文件",
            "downloadOriginalFileButtonError": "无法读取原始文件",
            "downloadButtonError": "无法读取文件",
        },
        "fileSaverDialog": {
            "skipInvalidFile": "跳过无效的文件: {{name}}",
            "savedFile": "已保存文件: {{name}}",
            "failToLoadFileWithError": "无法读取文件: {{name}}，错误信息: {{msg}}",
            "titleSavingFile": "正在保存文件",
            "titleGeneratingZip": "正在生成压缩包文件",
            "titleErrorOccurred": "发生错误",
            "titleSaveFinished": "文件存储完毕",
            "titleZipFinished": "压缩完毕",
            "holdAWhile": "请稍等片刻……",
            "zipFileName": "文件名",
            "zipFileSize": "大小",
            "skippedSomeFiles": "{{count}} 个出错的文件被跳过"
        },
        "inputPanel": {
            "sourceFiles": "源文件",
            "fileList": "文件列表",
            "fileListEmpty": "文件列表为空",
            "dragFilesHereToImport": "将文件拖动至此处以快速导入图片。",
            "readFromClipboardInputPopup": "请在输入框中粘贴图片：",
            "checkFileListDetail": "查看详细信息",
            "fileCount": "{{count}} 个文件",
            "filesInTotal": "共 {{count}} 个文件",
            "clearAll": "清空文件",
            "options": "选项",
            "webkitDirectoryPickerTip": "选择文件夹时，浏览器的对话框可能会将此操作写作 \"上传\"。\n\n请放心，你的文件不会离开此设备。",
            "webkitDirectoryPickerTipMobile": "此外，**移动端浏览器** 可能会不支持文件夹选择。\n\n如果设备支持，你可以尝试在文件管理器中，将文件夹 **拖拽进入此页面**。",
        },
        "configPanel": {
            "outputSettings": "输出设置",
            "sourceFileFormat": "源文件格式",
            "pleaseImportFiles": "请先导入文件。",
            "targetFormat": "目标格式",
            "outputFormat": "输出格式",
            "advancedOutputSettings": "高级输出设置",
            "png8NotSupported": "不支持导出 PNG8。",
            "JPEG": "JPEG 设置",
            "PNG": "PNG 设置",
            "GIF": "GIF 设置",
            "WEBP": "WEBP 设置",
            "AVIF_notAvailable": "AVIF 设置 (暂时不可用)",
            "resetToDefault": "重置为默认值",
            "options": "选项",
            "setAllTo": "全部设置为:",
        },
        "outputPanel": {
            "output": "输出",
            "outputListEmpty": "输出列表为空",
            "menuAbortTask": "终止任务",
            "menuAbortTaskSecondary": "任务终止后，你会需要重新导入文件来继续任务。",
            "menuReloadWorker": "重启处理程序",
            "menuReloadWorkerSecondary": "重新启动运行 wasm-vips 的 Web Worker。",
            "workerReloaded": "已重置运行 wasm-vips 的 Worker。",
            "errorSnackbarWithMessage": "发生错误。错误信息：{{msg}}",
            "progress": "进度",
            "fileTotal": "文件总数",
            "displayConfigLabel": "显示",
            "displayFileSize": "文件大小",
            "displaySizeChange": "变化量",
            "fileOutput": "文件输出",
            "options": "选项",
            "filesInTotal": "共 {{count}} 个文件",
            "menuClearFiles": "清空列表",
            "menuClearFilesSecondary": "请要确保你的文件已被正确保存。",

            "errorWhenStartingTask": "开始任务时出错",
            "startNextTaskTip": `已完成的任务将会被清空。\n\n`
                + '**请确定文件已经被正确保存**，然后，点击继续来从开始下一组任务。',
            "startNextTaskLastOutputDirectoryName": "上一次的输出目录名称",
        },

        "navigateButton": {
            "input": "导入文件",
            "config": "输出设置",
            "output": "开始任务"
        },

        "interfaceSettings": "界面设置",
        "preferenceConfig": "偏好设置",
        "systemConfig": "系统",
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
        "errorOccurred": "出错",
        "unknownError": "未知错误",
        "errorOccurredWithMsg": "发生错误，错误信息: {{msg}}",
        "failToReadClipboard": "读取剪切板出错",
        "clipboardEmpty": "剪切板为空",
        "noImageFoundFromClipboard": "剪切板中没有有效的图片数据",
        "cannotReadFileBuffer": "无法读取文件，原文件可能已被修改、移动或删除",
        "imageLoadFailed": "无法载入图片",
        "browserDecodingFailed": "浏览器无法解析此图片。可能是由于格式不受支持或图片文件损坏",
        "canvasConverter": {
            "invalidImageSize": "无效的图形大小",
            "imageSizeTooLarge": "图片尺寸过大",
            "canvasError": "Canvas 出错",
            "canvasFailToExport": "Canvas 导出图形时出错"
        }
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

    "label": {
        "imageBaseColor": "图片底色",
        "keepMetaData": "保留图像元数据",
        "JPEG_quality": "JPEG 质量",
        "JPEG_interlace": "交错 (Interlace)",
        "PNG_interlace": "交错 (Interlace)",
        "GIF_interlace": "交错 (渐进式 GIF)",
        "PNG_strip": "丢弃透明度信息",
        "PNG_compressionLevel": "压缩等级",
        "PNG_bitdepth": "位深 (Bit Depth)",
        "PNG_quantisationQuality": "色彩量化质量",
        "PNG_dithering": "Dithering",
        "GIF_keepAlphaChannel": "保留透明度信息",
        "GIF_bitdepth": "位深 (Bitdepth)",
        "GIF_dithering": "GIF Dithering",
        "GIF_interframeMaxerror": "帧间最大误差",
        "GIF_interpaletteMaxerror": "纹理最大误差",
        "WEBP_quality": "图像质量",
        "WEBP_alphaQuality": "有损压缩透明度信息保真度",
        "WEBP_encodeMode": "编码模式",
        "WEBP_lossy": "有损压缩",
        "WEBP_loseless": "无损编码",
        "WEBP_keepAlphaChannel": "保留透明度信息",
        "WEBP_lossyCompressionPresets": "有损压缩方式预设",
        "WEBP_compressionPresets": {
            "default": "默认",
            "picture": "图片",
            "photo": "照片",
            "drawing": "绘画",
            "icon": "图标",
            "text": "文本"
        }
    },

    // Tooltips, mostly in the config panel. Will be rendered with markdown format.
    "tooltip": {
        "imageBaseColor": `丢失透明度信息时，默认的图像底色。不会影响支持透明通道的图像格式，除非手动指定丢弃透明度信息。`,
        "keepMetaData": `如果勾选，对于支持的格式将会保留原始图片的 Exif meta data。\n
对于照片，这些数据可以包含图片的拍摄曝光信息、拍摄地点等信息。\n
请留意，一些浏览器可能会在导入图片时默认抹去元数据。`,
        "JPEG_interlace": "启用交错，可以让图片在没有被加载完成时也可以有低分辨率的预览。",
        "PNG_interlace": "启用交错，可以让图片在没有被加载完成时也可以有低分辨率的预览。",
        "PNG_strip": `如果丢弃透明度信息，输出的图像将会应用设置的图片底色。对于真彩色 (RGB) 图像，则由 \`PNG32\` 变为 \`PNG24\`。`,
        "PNG_compressionLevel": "压缩等级的变化不会影响图像质量。等级越高，文件体积越小，处理速度越慢。",
        "PNG_bitdepth": `这里指的是 PNG 图像第 24 字节的标记。\n\n` +
            'RGB (真彩色) PNGs 只支持两种位深: 8 和 16，分别对应每像素 24 和 48 位。\n\n' +
            '另外，顺便补充一下其他的内容。图像的第 25 字节是色彩类型，可能的的值为：\n\n' +
            '\\> 灰度 (0)、RGB (2)、映射 (3)、灰度 + 透明 (4)、RGBA (6)。\n\n' +
            '由此，常见的 PNG 类型称呼与这些数据的对应关系是这样的：\n\n' +
            '- PNG8: bit depth = 8, color type = 3\n\n' +
            '- PNG24: bit depth = 8, color type = 2\n\n' +
            '- PNG32: bit depth = 8, color type = 6\n\n' +
            '在例如 Windows 资源管理器中查看的图像 "位深度" 信息 (8, 24, 32)，指的就是 PNG8、PNG24、PNG32。',
        "PNG_quantisationQuality": "(Quantisation quality)\n\n对于非真彩色图像，色彩的选择质量。",
        "PNG_dithering": `Dithering，对于输出图片包含的可用色彩中缺失的色彩，采用例如栅格状像素布局来近似地表示目标颜色。`,
        "GIF_keepAlphaChannel": `GIF 支持携带透明度信息，但是不支持半透明像素。即，每一个像素只可以是全透明或完全不透明。`,
        "GIF_interlace": "启用交错，可以让图片在没有被加载完成时也可以有低分辨率的预览。解码这类图像会使用更多的内存。",
        "GIF_bitdepth": `每像素的比特数。\n\n默认 {{default}}。`,
        "GIF_dithering": `Dithering，对于输出图片包含的可用色彩中缺失的色彩，采用例如栅格状像素布局来近似地表示目标颜色。\n\n默认 {{default}}。`,
        "GIF_interframeMaxerror": `Interframe Maxerror, 帧与帧之间低于这个阈值的像素变化会被视为未改变，因此可以将这些像素视作透明。\n\n
可以提高图像压缩率。默认 {{default}}。`,
        "GIF_interpaletteMaxerror": `Interpalette Maxerror, 用于决定是否重用已生成的纹理。\n\n默认 {{default}}。`,
        "WEBP_keepAlphaChannel": "对于有损压缩和无所压缩，WEBP 格式均支持携带透明度信息",



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
        "fileDetail": "文件信息",
        "inspectSiteData": "站点数据管理",
        "directoryPickerNotSupported": "文件夹选择不受支持",
    },
    // Keep the period unless it's like "error message: {{msg}}".
    // For Dialog Content, Markdown Parser will be used. Use markdown syntax for formatting.
    "content": {
        "failToLoadFile": "读取文件时发生错误。",
        "failToLoadDirectory": "读取文件夹时发生错误。",
        "failToImportFile": "添加文件时发生错误。",
        "errorMessage": "错误信息: {{msg}}",
        "failToClearOPFS": "清理私有文件系统缓存目录时遇到问题。",

        "dragAndDropFileListIntegrityDialogContent": `检测到潜在的文件列表完整性问题: \n
**你的浏览器可能限制了单个文件夹内的项目数量** (限制为 100)，超过此限制的文件在导入时会被跳过。\n
可以尝试使用文件夹选择按钮，或者手动进行多次的导入。`,

        // --- Tip on Panels --- // 
        "inputPanelTip": `在文件列表的文件上，**鼠标右击** 或 **触摸长按** 以显示更多操作。\n
此操作同样适用于右侧输出面板上的文件列表。`,
        "outputPanelTip": `在文件列表的文件上，可以通过 **鼠标右击** 或 **触摸长按** 来对于单个 文件/文件夹 打开下载菜单。\n
请留意，转换出错的文件会在批量保存时被跳过。请一定要保留好自己源文件的备份。\n
**开始新的转换任务之后，此列表将会被清空。**确定文件已经正确保存完成之后，再开始下一组转换任务吧。`,

        // --- Config Drawer Menu --- //
        "aboutFSModeDialogContent": `不同浏览器对于网页应用的文件系统访问有着不同的支持程度。\n
此应用对于不同的浏览器支持程度进行了三种划分，如下: \n
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
            "unableToRunDueToStorageDisabled": `**你的浏览器不允许网页应用在本地存储数据。**\n\n` +
                `**这可能是禁用 Cookie 造成的。**浏览器在禁用 Cookie 之后，同时会将一系列 Storage API 禁用，以阻止网页应用在本地存储信息。\n\n` +
                `为了保证程序的正常运行，请尝试将 Cookie 开关打开。\n\n` +
                `我们并不会用到 Cookie，此程序会用到的是一些 Storage API，以便在本地存储必要的设置信息与转换的图片缓存。`,
            "unableToRunTip": {
                "iOS": `对于 iOS 设备，请尝试使用 **Safari 浏览器**，不要使用**无痕浏览**模式 (此模式下，无法使用 Storage API，程序功能会受到部分影响)`,
                "mac": `请尝试使用 Safari、Google Chrome 或 Microsoft Edge 浏览器。`,
                "other": `请尝试使用 Google Chrome 或 Microsoft Edge 浏览器。`,
            },
            "issueDetected": "检测到的问题如下：",
            "issues": {
                "noWASM": `###### 不支持 WebAssembly\n\n` +
                    `图像处理内核 wasm-vips 将无法正常运行。`,
                "noWebWorker": `###### 不支持 Web Worker\n\n` +
                    `WebAssembly 模块将不可以在主线程以外加载、且多线程不可用。`,
                "noSharedArrayBuffer": `###### 不支持 SharedArrayBuffer API\n\n` +
                    `wasm-vips 将无法正常运行。\n\n` +
                    `如果当前浏览器本身支持此 API，请检查应用的托管页面是否有正确设置 \` Cross-Origin-Embedder-Policy\` 与 \`Cross-Origin-Opener-Policy\` 响应头。([参考](https://caniuse.com/?search=sharedArrayBuffer))`,
            },
            "nonFatalIssueDetected": "当前浏览器存在以下兼容性问题：",
            "nonFatalIssueFooter": "这些问题不会影响核心功能的使用。",
            "nonFatalIssues": {
                // This one was supposed to be fatal issue but many non-latest browsers still not fully supported.
                "SIMD": `###### (重要) 图像处理引擎 wasm-vips 无法正常运行\n\n` +
                    `当前浏览器对于 WebAssembly SIMD 的支持存在问题。`,
                "SIMDSafari": `对于 Safari 浏览器，请使用 Safari 16.4+。如果是桌面设备，请用 Chorme 或 Firefox 浏览器来使用此应用吧。`,
                "SIMDNon-Safari": `请尝试在版本较新的 Google Chorme、Microsoft Edge 或 Firefox 浏览器来使用此应用吧。`,
                "noFS": `###### 不支持 File System API\n\n` +
                    `**这可能会影响图片的批量转换功能。**单次或少量的文件转换操作不会受到影响。\n\n` +
                    `由于输出的文件会存储在内存中，大批量的文件操作可能会遇到问题。`,

                "noFS_IOS": `对于 iOS 设备，请尝试使用 Safari 浏览器，且**不要使用无痕浏览**模式 (此模式下，无法使用必要的 Storage API 来暂存批量转换的任务)\n\n` +
                    `此应用程序不会追踪你的数据，所有图片转换均在你的设备上完成，不会被上传到云端。请放心。\n\n` +
                    `你可以随时在 Safari 浏览器的设置中，清除此站点的数据。`,

                "noFS_Mac": `可以尝试使用 Safari、Google Chrome 或 Microsoft Edge 浏览器。`,
                "noFS_Other": `可以尝试使用 Google Chrome 或 Microsoft Edge 浏览器。`,

                "clipboardAPI": `###### 不支持剪切板文件访问 API (Clipboard API)\n\n` +
                    `**快速读取和写入剪切板文件的操作会受到影响。**\n\n` +
                    `当进行剪切板操作时，可能会需要额外的手动操作。`,
            },
            // --- End of Browser Compatibility Dialog --- //
        },
        // --- Site Data Manager Dialog --- //
        "inspectSiteDataDialog": {
            "main": `以下是站点的数据占用情况。你可以手动执行需要的清除操作。`,
            "secondary": `此数据来源于 \`navigator.storage.estimate()\`。\n
一些浏览器可能会将浏览器本身的缓存行为也计入存储占用量中。这些内容会需要你在浏览器设置中进行清除。\n
要查看详细信息，请打开浏览器的开发者工具。一些未知问题可能导致这个数据不是很正常，此应用程序 **主动** 存储的所有信息都可以在下方被清除。\n
对于这里的所有操作，你的本地文件不会受到任何影响。`,
            "available": "可用",
            "used": "已用",
            "notSupportError": "你的浏览器不支持获取存储占用的详细信息。",

            "clearLocalStorage": "清除存储的设置信息",
            "localStorageEmpty": "没有保存的设置信息",
            "clearLocalStorageTip": "设置信息包含偏好设置和输出设置。清除设置不会立即重置当前页面正在使用的设置项。要立即应用，可以手动刷新页面。",

            "clearCacheStorage": "清除 Service Worker 缓存的静态文件",
            "cleatCacheStorageTip": "Service Worker 提供的缓存可以给予网页应用离线运行的能力。清除后，下一次进入页面将会需要重新下载程序所需要的数据。",
            "unregisterSW": "移除 Service Worker",
            "unregisterSWTip": "将取消注册所有运行中的 Service Worker。如果要这么做，建议同步进行一下上方的缓存清除。",

            "clearOPFS": "清空私有文件系统 (用于输出缓存)",
            "clearOPFSTip": "请小心，若当前或者其他窗口有在进行转换任务，如果有使用到私有文件系统作为缓存的话，进行清理可能会导致正在进行的任务出错。未保存的文件也将被清除。\n\n如果要查看私有文件系统的内容，可以在浏览器控制台调用 `await window.__OPFS_DEBUG()`。"
        },
        // --- End Site Data Dialog --- //

        "directoryPickerNotSupported": "移动端浏览器可能不支持导入文件夹，可能是受限于系统文件选择器。参考：[文件夹选择兼容性](https://caniuse.com/input-file-directory)。\n\n"
            + "稍后依然会尝试呼出一下文件选择窗口。请留意，选择的文件可能无法被程序获取到。\n\n" 
            + "请尝试用普通的文件导入按钮，或者通过 Drag and Drop 来将文件拖入页面吧。\n\n",

        "directoryPickerNotSupportedIOS": "**iOS/iPadOS 下，可以从“文件”应用中，将文件夹拖入页面来进行导入。**"

    },
} as const;

export default zhCN;