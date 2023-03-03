const zhCN = {
    "document": {
        "title": "圖片工具箱"
    },
    "global": {
        "knownIssues": `已知問題:
- 對於 wasm-vips 無法直接解碼的格式 (SVG, ICO 等)，會先借助瀏覽器的解碼器來獲取一個中間圖片 (PNG 格式)，此過程會丟失元數據與透明度信息；
- 也因此，對於目前版本下的 AVIF 格式，如果當前瀏覽器無法解碼源文件，則也無法進行轉換；
- APNG 格式不受支持。 `
    },
    "lang": {
        "followSystem": "跟隨系統",
        "zh": "中文",
        "zh-CN": "簡體中文 (zh-CN)",
        "zh-TW": "繁體中文 (zh-TW)",
        "en": "英語 (en)"
    },
    // Upper case on first letter
    "commonWords": {
        "tips": "提示",
        "type": "類型",
        "count": "數量",
        "total": "合計",
        "open": "打開",
        "close": "關閉",
        "file": "文件",
        "folder": "文件夾",
        "directory": "目錄",
        "delete": "刪除",
        "remove": "移除",
        "download": "下載",
        "progress": "進度",
        "settings": "設置",
        "options": "選項",
        "details": "詳情",
        "unknown": "未知",
        "retry": "重試",
        "error": "錯誤",
        "abort": "終止",
        "cancel": "取消",
        "finished": "完成",
        "auto": "自動",
    },
    "button": {
        "ok": "好的",
        "okAndDontShowAgain": "好的，不再提示",
        "dontShowAgain": "下次不再提示",
        "readFromClipboard": "從剪切板讀取",
        "selectFiles": "選擇文件",
        "selectDirectory": "選擇文件夾",
        "selectWebkitDirectory": "導入文件夾",
        "denseList": "緊湊列表",
        "showPreview": "顯示預覽",
        "confirmReset": "確認重置",
        "applyAndReloadPage": "應用設置並刷新頁面",

        "downloadZip": "打包下載",
        "selectDirAndStartTask": "選擇輸出目錄並開始轉換",
        "startNextTask": "開始下一組任務",
        "startTask": "開始轉換",
        "useLastOutputDirectoryAndContinue": "使用上一次的輸出目錄繼續",
        "pickNewDirectoryAndContinue": "選擇輸出目錄並繼續",
        "continue": "繼續"
    },
    "ui": {
        "topBar": {
            "storageDiabledError": " Storage API 被拒絕",
            "FSMode": "文件系統: ",
            "noFS": "受限模式",
            "privateFS": "Private FS",
            "publicFS": "完整支持",

            "loggerOutput": "日誌輸出",
            "clear": "清空",
            "noLogs": "當前沒有日誌輸出。"
        },
        "fileDetailDialog": {
            "failToGetData": "獲取失敗",
            "output": "輸出",
            "original": "原圖",
            "comparison": "對比",
            "fileBufferUnreadableError": "無法讀取文件。目標文件可能已被修改、移動或刪除。",
            "browserFailToDecodeImageError": "當前瀏覽器無法解碼此圖片。可能是格式不支持或文件損壞。",
            "imageResolution": "尺寸",
            "imageFormat": "類型",
            "imageSize": "大小",
            "imageLastModified": "修改日期",
            "originalImageSize": "源文件大小",
            "originalImageLastModified": "源文件修改日期",
            "originalImageFormat": "源文件類型",
            "pending": "正在確認",
            "downloadOutputFileButton": "下載輸出文件",
            "downloadOriginalFileButton": "下載原始文件",
            "downloadOutputFileButtonError": "無法讀取輸出文件",
            "downloadOriginalFileButtonError": "無法讀取原始文件",
            "downloadButtonError": "無法讀取文件",
        },
        "fileSaverDialog": {
            "skipInvalidFile": "跳過無效的文件: {{name}}",
            "savedFile": "已保存文件: {{name}}",
            "failToLoadFileWithError": "無法讀取文件: {{name}}，錯誤信息: {{msg}}",
            "titleSavingFile": "正在保存文件",
            "titleGeneratingZip": "正在生成壓縮包文件",
            "titleErrorOccurred": "發生錯誤",
            "titleSaveFinished": "文件存儲完畢",
            "titleZipFinished": "壓縮完畢",
            "holdAWhile": "請稍等片刻……",
            "zipFileName": "文件名",
            "zipFileSize": "大小",
            "skippedSomeFiles": "{{count}} 個出錯的文件被跳過"
        },
        "inputPanel": {
            "sourceFiles": "源文件",
            "fileList": "文件列表",
            "fileListEmpty": "文件列表為空",
            "dragFilesHereToImport": "將文件拖動至此處以快速導入圖片。",
            "readFromClipboardInputPopup": "請在輸入框中粘貼圖片：",
            "checkFileListDetail": "查看詳細信息",
            "fileCount": "{{count}} 個文件",
            "filesInTotal": "共 {{count}} 個文件",
            "clearAll": "清空文件",
            "options": "選項",
            "webkitDirectoryPickerTip": "選擇文件夾時，瀏覽器的對話框可能會將此操作寫作 \"上傳\"。\n\n請放心，你的文件不會離開此設備。",
            "webkitDirectoryPickerTipMobile": "此外，**移動端瀏覽器** 可能會不支持文件夾選擇。\n\n如果設備支持，你可以嘗試在文件管理器中，將文件夾 **拖拽進入此頁面**。",
        },
        "configPanel": {
            "outputSettings": "輸出設置",
            "sourceFileFormat": "源文件格式",
            "pleaseImportFiles": "請先導入文件。",
            "targetFormat": "目標格式",
            "outputFormat": "輸出格式",
            "advancedOutputSettings": "高級輸出設置",
            "png8NotSupported": "不支持導出 PNG8。",
            "JPEG": "JPEG 設置",
            "PNG": "PNG 設置",
            "GIF": "GIF 設置",
            "WEBP": "WEBP 設置",
            "AVIF_notAvailable": "AVIF 設置 (暫時不可用)",
            "resetToDefault": "重置為默認值",
            "options": "選項",
            "setAllTo": "全部設置為:",
        },
        "outputPanel": {
            "output": "輸出",
            "outputListEmpty": "輸出列表為空",
            "menuAbortTask": "終止任務",
            "menuAbortTaskSecondary": "任務終止後，你會需要重新導入文件來繼續任務。",
            "menuReloadWorker": "重啟處理程序",
            "menuReloadWorkerSecondary": "重新啟動運行 wasm-vips 的 Web Worker。",
            "workerReloaded": "已重置運行 wasm-vips 的 Worker。",
            "errorSnackbarWithMessage": "發生錯誤。錯誤信息：{{msg}}",
            "progress": "進度",
            "fileTotal": "文件總數",
            "displayConfigLabel": "顯示",
            "displayFileSize": "文件大小",
            "displaySizeChange": "變化量",
            "fileOutput": "文件輸出",
            "options": "選項",
            "filesInTotal": "共 {{count}} 個文件",
            "menuClearFiles": "清空列表",
            "menuClearFilesSecondary": "請要確保你的文件已被正確保存。",

            "errorWhenStartingTask": "開始任務時出錯",
            "startNextTaskTip": `已完成的任務將會被清空。 \n\n`
                + '**請確定文件已經被正確保存**，然後，點擊繼續來從開始下一組任務。 ',
            "startNextTaskLastOutputDirectoryName": "上一次的輸出目錄名稱",
        },

        "navigateButton": {
            "input": "導入文件",
            "config": "輸出設置",
            "output": "開始任務"
        },

        "interfaceSettings": "界面設置",
        "preferenceConfig": "偏好設置",
        "systemConfig": "系統",
    },
    "logger": {
        "readFromClipboard": "從剪切板讀取了 {{length}} 張圖片。",
        "failToLoadFile": "讀取文件時發生錯誤。",
        "notSupportedByVipsThenDoCanvasConverting": "文件 {{name}} 不受當前版本的 libvips 支持，將藉助瀏覽器進行第一次轉換。元數據和透明度信息會丟失。",
        "startProcessingFile": "開始處理文件：{{name}}，目標類型: {{ext}}",
        "taskFinished": "轉換任務已完成，耗時 {{time}}。",
        "taskBegin": "開始轉換任務。隊列長度：{{length}}",
        "fileSavedPublicFS": "已保存文件：{{name}}",
        "fileSavedOPFS": "已在臨時存儲中保存文件：{{name}}"
    },
    // No period (?)
    "errorMessage": {
        "errorOccurred": "出錯",
        "unknownError": "未知錯誤",
        "errorOccurredWithMsg": "發生錯誤，錯誤信息: {{msg}}",
        "failToReadClipboard": "讀取剪切板出錯",
        "clipboardEmpty": "剪切板為空",
        "noImageFoundFromClipboard": "剪切板中沒有有效的圖片數據",
        "cannotReadFileBuffer": "無法讀取文件，原文件可能已被修改、移動或刪除",
        "imageLoadFailed": "無法載入圖片",
        "browserDecodingFailed": "瀏覽器無法解析此圖片。可能是由於格式不受支持或圖片文件損壞",
        "canvasConverter": {
            "invalidImageSize": "無效的圖形大小",
            "imageSizeTooLarge": "圖片尺寸過大",
            "canvasError": "Canvas 出錯",
            "canvasFailToExport": "Canvas 導出圖形時出錯"
        }
    },
    "menu": {
        // --- Config Drawer Menu --- //
        "colorThemeFollowSystem": "主題跟隨系統",
        "language": "語言 (Language)",
        "lightMode": "亮色模式",
        "darkMode": "暗色模式",
        "resetAllTipDisplayPreference": "重置提示信息顯示狀態",
        "resetAllTipDisplayPreferenceSecondary": "移除所有勾選過的“不再提示”選項",
        "fsMode": "文件系統模式：{{text}}",
        "fsModeText": {
            "fullSupport": "完整支持",
            "privateFS": "OPFS",
            "noFS": "不支持文件系統訪問"
        },
        "fsModeSecondaryText": {
            "fullSupport": "對於取得訪問權限的目錄有著完整的讀寫支持",
            "privateFS": "批量轉換的任務會在 Origin Private File System 中暫存",
            "noFS": "批量轉換的任務結果將存儲在內存中，可能造成程序崩潰"
        },
        "inspectSiteData": "檢查站點數據",
        "inspectSiteDataSecondary": "查看和清除保存的配置信息與文件緩存",

        // --- End of Config Drawer Menu --- //

        // --- Context Menu --- //
        "contextMenu": {
            "deleteDirectory": "移除目錄 ({{count}} 個子項)",
            "showDetail": "詳情",
            "outputDirectoryFileCount": "文件數量: {{count}}",
            "outputDirectoryErrorCount": "有 {{count}} 個子項發生錯誤。",
            "downloadZip": "打包下載",
            "saveToLocal": "保存到本地",
            "progress": "進度: {{progress}}%",
            "errMsg": "錯誤信息: {{msg}}"
        }
        // --- End of Context Menu //
    },

    "label": {
        "imageBaseColor": "圖片底色",
        "keepMetaData": "保留圖像元數據",
        "JPEG_quality": "JPEG 質量",
        "JPEG_interlace": "交錯 (Interlace)",
        "PNG_interlace": "交錯 (Interlace)",
        "GIF_interlace": "交錯 (漸進式 GIF)",
        "PNG_strip": "丟棄透明度信息",
        "PNG_compressionLevel": "壓縮等級",
        "PNG_bitdepth": "位深 (Bit Depth)",
        "PNG_quantisationQuality": "色彩量化質量",
        "PNG_dithering": "Dithering",
        "GIF_keepAlphaChannel": "保留透明度信息",
        "GIF_bitdepth": "位深 (Bitdepth)",
        "GIF_dithering": "GIF Dithering",
        "GIF_interframeMaxerror": "幀間最大誤差",
        "GIF_interpaletteMaxerror": "紋理最大誤差",
        "WEBP_quality": "圖像質量",
        "WEBP_alphaQuality": "有損壓縮透明度信息保真度",
        "WEBP_encodeMode": "編碼模式",
        "WEBP_lossy": "有損壓縮",
        "WEBP_loseless": "無損編碼",
        "WEBP_keepAlphaChannel": "保留透明度信息",
        "WEBP_lossyCompressionPresets": "有損壓縮方式預設",
        "WEBP_compressionPresets": {
            "default": "默認",
            "picture": "圖片",
            "photo": "照片",
            "drawing": "繪畫",
            "icon": "圖標",
            "text": "文本"
        }
    },

    // Tooltips, mostly in the config panel. Will be rendered with markdown format.
    "tooltip": {
        "imageBaseColor": `丟失透明度信息時，默認的圖像底色。不會影響支持透明通道的圖像格式，除非手動指定丟棄透明度信息。 `,
        "keepMetaData": `如果勾選，對於支持的格式將會保留原始圖片的 Exif meta data。 \n
對於照片，這些數據可以包含圖片的拍攝曝光信息、拍攝地點等信息。 \n
請留意，一些瀏覽器可能會在導入圖片時默認抹去元數據。 `,
        "JPEG_interlace": "啟用交錯，可以讓圖片在沒有被加載完成時也可以有低分辨率的預覽。",
        "PNG_interlace": "啟用交錯，可以讓圖片在沒有被加載完成時也可以有低分辨率的預覽。",
        "PNG_strip": `如果丟棄透明度信息，輸出的圖像將會應用設置的圖片底色。對於真彩色 (RGB) 圖像，則由 \`PNG32\` 變為 \`PNG24\`。 `,
        "PNG_compressionLevel": "壓縮等級的變化不會影響圖像質量。等級越高，文件體積越小，處理速度越慢。",
        "PNG_bitdepth": `這裡指的是 PNG 圖像第 24 字節的標記。 \n\n` +
            'RGB (真彩色) PNGs 只支持兩種位深: 8 和 16，分別對應每像素 24 和 48 位。 \n\n' +
            '另外，順便補充一下其他的內容。圖像的第 25 字節是色彩類型，可能的的值為：\n\n' +
            '\\> 灰度 (0)、RGB (2)、映射 (3)、灰度 + 透明 (4)、RGBA (6)。 \n\n' +
            '由此，常見的 PNG 類型稱呼與這些數據的對應關係是這樣的：\n\n' +
            '- PNG8: bit depth = 8, color type = 3\n\n' +
            '- PNG24: bit depth = 8, color type = 2\n\n' +
            '- PNG32: bit depth = 8, color type = 6\n\n' +
            '在例如 Windows 資源管理器中查看的圖像 "位深度" 信息 (8, 24, 32)，指的就是 PNG8、PNG24、PNG32。 ',
        "PNG_quantisationQuality": "(Quantisation quality)\n\n對於非真彩色圖像，色彩的選擇質量。",
        "PNG_dithering": `Dithering，對於輸出圖片包含的可用色彩中缺失的色彩，採用例如柵格狀像素佈局來近似地表示目標顏色。 `,
        "GIF_keepAlphaChannel": `GIF 支持攜帶透明度信息，但是不支持半透明像素。即，每一個像素只可以是全透明或完全不透明。 `,
        "GIF_interlace": "啟用交錯，可以讓圖片在沒有被加載完成時也可以有低分辨率的預覽。解碼這類圖像會使用更多的內存。",
        "GIF_bitdepth": `每像素的比特數。 \n\n默認 {{default}}。 `,
        "GIF_dithering": `Dithering，對於輸出圖片包含的可用色彩中缺失的色彩，採用例如柵格狀像素佈局來近似地表示目標顏色。 \n\n默認 {{default}}。 `,
        "GIF_interframeMaxerror": `Interframe Maxerror, 幀與幀之間低於這個閾值的像素變化會被視為未改變，因此可以將這些像素視作透明。 \n\n
可以提高圖像壓縮率。默認 {{default}}。 `,
        "GIF_interpaletteMaxerror": `Interpalette Maxerror, 用於決定是否重用已生成的紋理。 \n\n默認 {{default}}。 `,
        "WEBP_keepAlphaChannel": "對於有損壓縮和無所壓縮，WEBP 格式均支持攜帶透明度信息",



    },
    // No period, and keep the title syntax
    "title": {
        "failToImportDirectory": "添加文件夾失敗",
        "failToImportFile": "添加文件失敗",
        "dragAndDropFileListIntergrityTip": "Drag and Drop 文件列表完整性問題",
        "aboutFSMode": "關於文件系統訪問模式",
        "resetTipDisplayPreference": "將重置所有提示信息",
        "browserCompatibilityTip": "瀏覽器兼容性提示",
        "changeLanguage": "語言設置",
        "inputFileListInfo": "文件列表信息",
        "fileDetail": "文件信息",
        "inspectSiteData": "站點數據管理",
        "directoryPickerNotSupported": "文件夾選擇不受支持",
    },
    // Keep the period unless it's like "error message: {{msg}}".
    // For Dialog Content, Markdown Parser will be used. Use markdown syntax for formatting.
    "content": {
        "failToLoadFile": "讀取文件時發生錯誤。",
        "failToLoadDirectory": "讀取文件夾時發生錯誤。",
        "failToImportFile": "添加文件時發生錯誤。",
        "errorMessage": "錯誤信息: {{msg}}",
        "failToClearOPFS": "清理私有文件系統緩存目錄時遇到問題。",

        "dragAndDropFileListIntegrityDialogContent": `檢測到潛在的文件列表完整性問題: \n
**你的瀏覽器可能限制了單個文件夾內的項目數量** (限制為 100)，超過此限制的文件在導入時會被跳過。 \n
可以嘗試使用文件夾選擇按鈕，或者手動進行多次的導入。 `,

        // --- Tip on Panels --- // 
        "inputPanelTip": `在文件列表的文件上，**鼠標右擊** 或 **觸摸長按** 以顯示更多操作。 \n
此操作同樣適用於右側輸出面板上的文件列表。 `,
        "outputPanelTip": `在文件列表的文件上，可以通過 **鼠標右擊** 或 **觸摸長按** 來對於單個 文件/文件夾 打開下載菜單。 \n
請留意，轉換出錯的文件會在批量保存時被跳過。請一定要保留好自己源文件的備份。 \n
**開始新的轉換任務之後，此列表將會被清空。**確定文件已經正確保存完成之後，再開始下一組轉換任務吧。 `,

        // --- Config Drawer Menu --- //
        "aboutFSModeDialogContent": `不同瀏覽器對於網頁應用的文件系統訪問有著不同的支持程度。 \n
此應用對於不同的瀏覽器支持程度進行了三種劃分，如下: \n
- 完整支持: 瀏覽器支持 Public File System Access API，此模式下，應用程序可以在請求授權目錄訪問之後，直接將輸出的文件寫入指定目錄；
- Private FS: 瀏覽器支持 Origin Private File System，此模式下，轉換完成的圖片會在私有文件系統中暫存，並提供打包下載；
- 受限模式: 瀏覽器不支持上述兩種文件系統訪問，此模式下，輸出的文件會被暫存在內存中，同時轉換較多的文件可能會造成頁面內存佔用過多而崩潰。 `,
        "aboutFSModeDetectResult": {
            "fullSupport": "你的瀏覽器有著完整的文件系統訪問支持。",
            "privateFS": "你的瀏覽器支持 Private FS (私有文件系統)。",
            "noFS": "你的瀏覽器不支持文件系統訪問。"
        },
        "resetTipDisplayPreference": "被選擇過“不再提示”的提示信息將會恢復正常顯示。",
        "languageDialogTipContent": '更換應用的顯示語言。 \n\n**語言設置更新後，頁面將會刷新。請確保您的數據已保存完畢再進行操作。**',

        // --- End of Config Drawer Menu --- //

        // --- Browser Compatibility Dialog --- //
        "browserCompatibilityContent": {
            "unableToRun": "當前瀏覽器無法正常運行此工具。",
            "unableToRunDueToStorageDisabled": `**你的瀏覽器不允許網頁應用在本地存儲數據。**\n\n` +
                `**這可能是禁用 Cookie 造成的。**瀏覽器在禁用 Cookie 之後，同時會將一系列 Storage API 禁用，以阻止網頁應用在本地存儲信息。 \n\n` +
                `為了保證程序的正常運行，請嘗試將 Cookie 開關打開。 \n\n` +
                `我們並不會用到 Cookie，此程序會用到的是一些 Storage API，以便在本地存儲必要的設置信息與轉換的圖片緩存。 `,
            "unableToRunTip": {
                "iOS": `對於 iOS 設備，請嘗試使用 **Safari 瀏覽器**，不要使用**無痕瀏覽**模式 (此模式下，無法使用 Storage API，程序功能會受到部分影響)`,
                "mac": `請嘗試使用 Safari、Google Chrome 或 Microsoft Edge 瀏覽器。 `,
                "other": `請嘗試使用 Google Chrome 或 Microsoft Edge 瀏覽器。 `,
            },
            "issueDetected": "檢測到的問題如下：",
            "issues": {
                "noWASM": `###### 不支持 WebAssembly\n\n` +
                    `圖像處理內核 wasm-vips 將無法正常運行。 `,
                "noWebWorker": `###### 不支持 Web Worker\n\n` +
                    `WebAssembly 模塊將不可以在主線程以外加載、且多線程不可用。 `,
                "noSharedArrayBuffer": `###### 不支持 SharedArrayBuffer API\n\n` +
                    `wasm-vips 將無法正常運行。 \n\n` +
                    `如果當前瀏覽器本身支持此 API，請檢查應用的託管頁面是否有正確設置 \` Cross-Origin-Embedder-Policy\` 與 \`Cross-Origin-Opener-Policy\` 響應頭。 ([參考](https://caniuse.com/?search=sharedArrayBuffer))`,
            },
            "nonFatalIssueDetected": "當前瀏覽器存在以下兼容性問題：",
            "nonFatalIssueFooter": "這些問題不會影響核心功能的使用。",
            "nonFatalIssues": {
                // This one was supposed to be fatal issue but many non-latest browsers still not fully supported.
                "SIMD": `###### (重要) 圖像處理引擎 wasm-vips 無法正常運行\n\n` +
                    `當前瀏覽器對於 WebAssembly SIMD 的支持存在問題。 `,
                "SIMDSafari": `對於 Safari 瀏覽器，請使用 iOS/iPadOS 16.4+。如果是桌面設備，請用 Chorme 或 Firefox 瀏覽器來使用此應用吧。`,
                "SIMDNon-Safari": `請嘗試在版本較新的 Google Chorme、Microsoft Edge 或 Firefox 瀏覽器來使用此應用吧。 `,
                "noFS": `###### 不支持 File System API\n\n` +
                    `**這可能會影響圖片的批量轉換功能。**單次或少量的文件轉換操作不會受到影響。\n\n` +
                    `由於輸出的文件會存儲在內存中，大批量的文件操作可能會遇到問題。 `,

                "noFS_IOS": `對於 iOS 設備，請嘗試使用 Safari 瀏覽器，且**不要使用無痕瀏覽**模式 (此模式下，無法使用必要的 Storage API 來暫存批量轉換的任務)\n\n` +
                    `此應用程序不會追踪你的數據，所有圖片轉換均在你的設備上完成，不會被上傳到雲端。請放心。 \n\n` +
                    `你可以隨時在 Safari 瀏覽器的設置中，清除此站點的數據。 `,

                "noFS_Mac": `可以嘗試使用 Safari、Google Chrome 或 Microsoft Edge 瀏覽器。 `,
                "noFS_Other": `可以嘗試使用 Google Chrome 或 Microsoft Edge 瀏覽器。 `,

                "clipboardAPI": `###### 不支持剪切板文件訪問 API (Clipboard API)\n\n` +
                    `**快速讀取和寫入剪切板文件的操作會受到影響。**\n\n` +
                    `當進行剪切板操作時，可能會需要額外的手動操作。 `,
            },
            // --- End of Browser Compatibility Dialog --- //
        },
        // --- Site Data Manager Dialog --- //
        "inspectSiteDataDialog": {
            "main": `以下是站點的數據佔用情況。你可以手動執行需要的清除操作。 `,
            "secondary": `此數據來源於 \`navigator.storage.estimate()\`。 \n
一些瀏覽器可能會將瀏覽器本身的緩存行為也計入存儲佔用量中。這些內容會需要你在瀏覽器設置中進行清除。 \n
要查看詳細信息，請打開瀏覽器的開發者工具。一些未知問題可能導致這個數據不是很正常，此應用程序 **主動** 存儲的所有信息都可以在下方被清除。 \n
對於這裡的所有操作，你的本地文件不會受到任何影響。 `,
            "available": "可用",
            "used": "已用",
            "notSupportError": "你的瀏覽器不支持獲取存儲佔用的詳細信息。",

            "clearLocalStorage": "清除存儲的設置信息",
            "localStorageEmpty": "沒有保存的設置信息",
            "clearLocalStorageTip": "設置信息包含偏好設置和輸出設置。清除設置不會立即重置當前頁面正在使用的設置項。要立即應用，可以手動刷新頁面。",

            "clearCacheStorage": "清除 Service Worker 緩存的靜態文件",
            "cleatCacheStorageTip": "Service Worker 提供的緩存可以給予網頁應用離線運行的能力。清除後，下一次進入頁面將會需要重新下載程序所需要的數據。",
            "unregisterSW": "移除 Service Worker",
            "unregisterSWTip": "將取消註冊所有運行中的 Service Worker。如果要這麼做，建議同步進行一下上方的緩存清除。",

            "clearOPFS": "清空私有文件系統 (用於輸出緩存)",
            "clearOPFSTip": "請小心，若當前或者其他窗口有在進行轉換任務，如果有使用到私有文件系統作為緩存的話，進行清理可能會導致正在進行的任務出錯。未保存的文件也將被清除。\n\n如果要查看私有文件系統的內容，可以在瀏覽器控制台調用 `await window.__OPFS_DEBUG()`。"
        },
        // --- End Site Data Dialog --- //
        "directoryPickerNotSupported": "移動端瀏覽器可能不支持導入文件夾，可能是受限於系統文件選擇器。參考：[文件夾選擇兼容性](https://caniuse.com/input-file-directory)。\n\n"
            + "稍後依然會嘗試呼出一下文件選擇窗口。請留意，選擇的文件可能無法被程序獲取到。\n\n"
            + "請嘗試用普通的文件導入按鈕，或者通過 Drag and Drop 來將文件拖入頁面吧。\n\n",

        "directoryPickerNotSupportedIOS": "**iOS/iPadOS 下，可以從“文件”應用中，將文件夾拖入頁面來進行導入。**\n\n![拖拽目錄導入示例示例圖片](/image/drag-and-drop-tip.webp)"
    },
} as const;

export default zhCN;