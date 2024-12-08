const en = {
    "document": {
        "title": "Owl Image Tools"
    },
    "global": {
        "knownIssues": ''
//         `Known Issues:
// - For file types that cannot be decoded by wasm-vips (e.g. SVG, ICO), a PNG file will be generated with the HTML canvas before passing to vips for further processing. Meta data and alpha channel will be lost during this process.
// - APNG is not supported.`
    },
    "lang": {
        "followSystem": "Follow System",
        "zh": "Chinese",
        "zh-CN": "Simplified Chinese (zh-CN)",
        "zh-TW": "Traditional Chinese (zh-TW)",
        "en": "English (en)"
    },
    // Upper case on first letter
    "commonWords": {
        "tips": "Tips",
        "type": "Type",
        "count": "Count",
        "total": "Total",
        "open": "Open",
        "close": "Close",
        "file": "File",
        "folder": "Folder",
        "directory": "Directory",
        "delete": "Delete",
        "remove": "Remove",
        "download": "Download",
        "progress": "Progress",
        "settings": "Settings",
        "options": "Options",
        "details": "Details",
        "unknown": "Unknown",
        "retry": "Retry",
        "error": "Error",
        "abort": "Abort",
        "cancel": "Cancel",
        "finished": "Finished",
        "auto": "Auto",
    },
    "button": {
        "ok": "OK",
        "okAndDontShowAgain": "OK, don't show again",
        "dontShowAgain": "Don't show again",
        "readFromClipboard": "Read From Clipboard",
        "selectFiles": "Files",
        "selectDirectory": "Directory",
        "selectWebkitDirectory": "Directory",
        "denseList": "Dense List",
        "showPreview": "Show Preview",
        "confirmReset": "Comfirm Resetting",
        "applyAndReloadPage": "Apply and Reload Page",

        "downloadZip": "Download ZIP",
        "selectDirAndStartTask": "Select Output Dir and Start",
        "startNextTask": "Start Next Task",
        "startTask": "Start Task",
        "useLastOutputDirectoryAndContinue": "Continue with last output directory",
        "pickNewDirectoryAndContinue": "Select new directory",
        "continue": "Continue"
    },
    "ui": {
        "topBar": {
            "storageDiabledError": " Storage Access Denied",
            "FSMode": "FS Mode: ",
            "noFS": "Restricted",
            "privateFS": "Private FS",
            "publicFS": "Full Support",

            "loggerOutput": "Log Output",
            "clear": "Clear",
            "noLogs": "No logs."
        },
        "fileDetailDialog": {
            "failToGetData": "Failed to get data",
            "output": "Output",
            "original": "Original",
            "comparison": "Compare",
            "fileBufferUnreadableError": "Cannot read file. Source file might have been modified or removed.",
            "browserFailToDecodeImageError": "The browser cannot decode this image due to format being unsupported or file being broken.",
            "imageResolution": "Resolution",
            "imageFormat": "Format",
            "imageSize": "Size",
            "imageLastModified": "Last Modified",
            "originalImageSize": "Original File Size",
            "originalImageLastModified": "Original File Last Modified",
            "originalImageFormat": "Original File Format",
            "pending": "Pending",
            "downloadOutputFileButton": "Download Output",
            "downloadOriginalFileButton": "Download Original",
            "downloadOutputFileButtonError": "Cannot read output file",
            "downloadOriginalFileButtonError": "Cannot read origibal file",
            "downloadButtonError": "Cannot read file",
        },
        "fileSaverDialog": {
            "skipInvalidFile": "Invalid file skipped: {{name}}",
            "savedFile": "File saved: {{name}}",
            "failToLoadFileWithError": "Cannot read file: {{name}}. Error message: {{msg}}",
            "titleSavingFile": "Saving Files",
            "titleGeneratingZip": "Generating ZIP",
            "titleErrorOccurred": "Error Occurred",
            "titleSaveFinished": "File Saving Done",
            "titleZipFinished": "ZIP Ready",
            "holdAWhile": "Hold a while...",
            "zipFileName": "File Name",
            "zipFileSize": "Size",
            "skippedSomeFiles": "Skipped {{count}} file(s) with error"
        },
        "inputPanel": {
            "sourceFiles": "Source Files",
            "fileList": "File List",
            "fileListEmpty": "File List Empty",
            "dragFilesHereToImport": "Drag and drop files to import.",
            "readFromClipboardInputPopup": "Paste image files in the input:",
            "checkFileListDetail": "Show Details",
            "fileCount": "{{count}} File(s)",
            "filesInTotal": "{{count}} File(s) in total",
            "clearAll": "Clear Files",
            "options": "Options",
            "webkitDirectoryPickerTip": "The browser may show the file picker dialog with button labeled \"upload\". \n\nYour files won't leave your browser.",
            "webkitDirectoryPickerTipMobile": "Notice that **mobile browsers** may not support picking directories.\n\nIf supported, you may try to **drag file and folders** to this page from Files app.",
        },
        "configPanel": {
            "outputSettings": "Output Settings",
            "pleaseImportFiles": "Please import files.",
            "sourceFileFormat": "Source File Format",
            "targetFormat": "Target Format",
            "outputFormat": "Output Format",
            "advancedOutputSettings": "Advanced Settings",
            "png8NotSupported": "PNG8 is not supported.",
            "JPEG": "JPEG Settings",
            "PNG": "PNG Settings",
            "GIF": "GIF Settings",
            "WEBP": "WEBP Settings",
            "AVIF": "AVIF Settings",
            "AVIF_notAvailable": "AVIF Settings (Not available yet)",
            "resetToDefault": "Reset to Default",
            "options": "Options",
            "setAllTo": "All set to:",
        },
        "outputPanel": {
            "output": "Output",
            "outputListEmpty": "Output List Empty",
            "menuAbortTask": "Abort Task",
            "menuAbortTaskSecondary": "You'll need to re-import files later to continue the converting (if needed).",
            "menuReloadWorker": "Reload Image Process Engine",
            "menuReloadWorkerSecondary": "Reload the Web Worker running wasm-vips.",
            "workerReloaded": "Wasm-vips worker Reloaded.",
            "errorSnackbarWithMessage": "Error occurred. Message: {{msg}}",
            "progress": "Progress",
            "fileTotal": "Total Files",
            "displayConfigLabel": "Show",
            "displayFileSize": "Size",
            "displaySizeChange": "Change",
            "fileOutput": "Output Files",
            "options": "Options",
            "filesInTotal": "{{count}} Files",
            "menuClearFiles": "Clear Files",
            "menuClearFilesSecondary": "Make sure you've saved your files.",

            "errorWhenStartingTask": "Error when starting the task",
            "startNextTaskTip": `All the finished tasks will be cleared.\n\n`
                + '**Pleace make sure your files are saved properly** before continue.',
            "startNextTaskLastOutputDirectoryName": "Last output directory",
        },

        "navigateButton": {
            "input": "Import",
            "config": "Settings",
            "output": "Start"
        },

        "interfaceSettings": "Interface Settings",
        "preferenceConfig": "Preference",
        "systemConfig": "System",
    },
    "logger": {
        "readFromClipboard": "Loaded {{length}} image(s) from clipboard.",
        "failToLoadFile": "Error when reading file(s).",
        "notSupportedByVipsThenDoCanvasConverting": "File {{name}} is not supported by current version of libvips. Will do a first converting with the browser. Meta data and alpha channel will be lost.",
        "startProcessingFile": "Start processing file: {{name}}. Target format: {{ext}}",
        "taskFinished": "Task finished in {{time}}.",
        "taskBegin": "Task begin. Queue length: {{length}}.",
        "fileSavedPublicFS": "File Saved: {{name}}",
        "fileSavedOPFS": "File Saved in OPFS: {{name}}"
    },
    // No period (?)
    "errorMessage": {
        "errorOccurred": "Error",
        "unknownError": "Unknown Error",
        "errorOccurredWithMsg": "Unknown error. Error message: {{msg}}",
        "failToReadClipboard": "Error when reading clipboard",
        "clipboardEmpty": "Clipboard Empty",
        "noImageFoundFromClipboard": "No valid image data found from Clipboard",
        "cannotReadFileBuffer": "Cannot read file. Source file might have been modified or removed.",
        "imageLoadFailed": "Cannot load image",
        "browserDecodingFailed": "The browser cannot decode this image due to format being unsupported or file being broken.",
        "canvasConverter": {
            "invalidImageSize": "Invalid file size",
            "imageSizeTooLarge": "Image too large.",
            "canvasError": "Canvas Error.",
            "canvasFailToExport": "Canvas error when outputing file blob."
        }
    },
    "menu": {
        // --- Config Drawer Menu --- //
        "colorThemeFollowSystem": "Color Theme Follow System",
        "language": "Language",
        "lightMode": "Light Mode",
        "darkMode": "Dark Mode",
        "resetAllTipDisplayPreference": "Reset Tip Display Status",
        "resetAllTipDisplayPreferenceSecondary": "Undo all \"don't show again\" for the tips",
        "fsMode": "File System Mode: {{text}}",
        "fsModeText": {
            "fullSupport": "Full Support",
            "privateFS": "OPFS",
            "noFS": "Not supported"
        },
        "fsModeSecondaryText": {
            "fullSupport": "Files can be directly written to user permitted directories",
            "privateFS": "Output files will be cached in Origin Private File System",
            "noFS": "Output files will stay in memory"
        },
        "inspectSiteData": "Inspect Site Data",
        "inspectSiteDataSecondary": "Check and clear site data",

        // --- End of Config Drawer Menu --- //

        // --- Context Menu --- //
        "contextMenu": {
            "deleteDirectory": "Remove Directory ({{count}} image(s))",
            "showDetail": "Details",
            "outputDirectoryFileCount": "Image Files: {{count}}",
            "outputDirectoryErrorCount": "{{count}} Error(s).",
            "downloadZip": "Download ZIP",
            "saveToLocal": "Save to Local",
            "progress": "Progress: {{progress}}%",
            "errMsg": "Error Message: {{msg}}"
        }
        // --- End of Context Menu //
    },

    "label": {
        "imageBaseColor": "Base Color",
        "keepMetaData": "Keep Metadata",
        "JPEG_quality": "JPEG Quality",
        "JPEG_interlace": "Interlace",
        "PNG_interlace": "Interlace",
        "GIF_interlace": "Interlace",
        "PNG_strip": "Remove Alpha Channel",
        "PNG_compressionLevel": "Compression Level",
        "PNG_bitdepth": "Bit Depth",
        "PNG_quantisationQuality": "Quantisation Quality",
        "PNG_dithering": "Dithering",
        "GIF_keepAlphaChannel": "Keep Alpha Channel",
        "GIF_bitdepth": "Bitdepth",
        "GIF_dithering": "GIF Dithering",
        "GIF_interframeMaxerror": "Interframe Max Error",
        "GIF_interpaletteMaxerror": "Interpalette Max Error",
        "WEBP_quality": "Quality",
        "WEBP_alphaQuality": "Alpha Quality (Lossy Mode)",
        "WEBP_encodeMode": "Encode Mode",
        "WEBP_lossy": "Lossy",
        "WEBP_loseless": "Loseless",
        "WEBP_keepAlphaChannel": "Keep Alpha Channel",
        "WEBP_lossyCompressionPresets": "Lossy Compression Presets",
        "WEBP_compressionPresets": {
            "default": "Default",
            "picture": "Picture",
            "photo": "Photo",
            "drawing": "Drawing",
            "icon": "Icon",
            "text": "Text"
        }
    },

    // Tooltips, mostly in the config panel. Will be rendered with markdown format.
    "tooltip": {
        "imageBaseColor": `Default base color when alpha channel is lost. Won't affect formats that support alpha channel, unless manually specified to remove alpha channel.`,
        "keepMetaData": `Exif meta data will be kept for supported formats if checked.\n
For photos, these data may contains ISO data, location data etc.\n
Notice that some browsers may remove metadata when importing images.`,
        "JPEG_interlace": "Image will be able to display in a lower resolution when not fully loaded.",
        "PNG_interlace": "Image will be able to display in a lower resolution when not fully loaded.",
        "PNG_strip": `Image base color settings will be applied if checked. For RGB (truecolor) PNGs, they will be changed from  \`PNG32\` to \`PNG24\`.`,
        "PNG_compressionLevel": "Won't affect image quality. Processing will be slower if set higher.",

        // https://stackoverflow.com/questions/6278159/find-out-if-png-is-8-or-24
        "PNG_bitdepth": `The 24th bit of a PNG file's hex buffer.\n\n` +
            'RGB (truecolor) PNGs are supported in only two depths: 8 and 16 bits per sample, corresponding to 24 and 48 bits per pixe.\n\n' +
            'In addition, the 25th bit marked the color type of a PNG. It could be:\n\n' +
            '\\> Grayscale (0), RGB (2), Indexed (colormapped) (3), Gray + Alpha (4), RGBA (6).\n\n' +
            'Common PNG names are defined as the following:\n\n' +
            '- PNG8: bit depth = 8, color type = 3\n\n' +
            '- PNG24: bit depth = 8, color type = 2\n\n' +
            '- PNG32: bit depth = 8, color type = 6\n\n' +
            'When seeing "bit depth" data (8, 24, 32) in places like Windows File Explorer, that data would mean that a PNG is PNG8, PNG24 or PNG32.',
        "PNG_quantisationQuality": "For non-RGB PNGs, quality of the colors picked.",
        "PNG_dithering": `For missing colors, creating gradient-like patterns with cross-layered pixels.`,
        "GIF_keepAlphaChannel": `GIF supports transparency, but with every pixel either fully transparent or solid.`,
        "GIF_interlace": "Image will be able to display in a lower resolution when not fully loaded. Decoding these kind of images uses more memory.",
        "GIF_bitdepth": `Bits per pixel.\n\ndefault {{default}}.`,
        "GIF_dithering": `For missing colors, creating gradient-like patterns with cross-layered pixels. \n\ndefault {{default}}.`,
        "GIF_interframeMaxerror": `Pixels between frams that changed below this threadhold will be seen as unchanged to reduce file size.\n\ndefault {{default}}.`,
        "GIF_interpaletteMaxerror": `Decide whether to reuse generated patterns. \n\nDefault {{default}}.`,
        "WEBP_keepAlphaChannel": "WEBP supports transparency for both lossy and lossless mode.",



    },
    // No period, and keep the title syntax
    "title": {
        "failToImportDirectory": "Fail to Import Directory",
        "failToImportFile": "Fail to Import File",
        "dragAndDropFileListIntergrityTip": "Drag and Drop File List Integrity Issue",
        "aboutFSMode": "About File System Mode",
        "resetTipDisplayPreference": "Reset All Tips",
        "browserCompatibilityTip": "Browser Compatibility Notice",
        "changeLanguage": "Language Settings",
        "inputFileListInfo": "File List Info",
        "fileDetail": "File Info",
        "inspectSiteData": "Manage Site Data",
        "directoryPickerNotSupported": "Directory Picker Not Supported",
    },
    // Keep the period unless it's like "error message: {{msg}}".
    // For Dialog Content, Markdown Parser will be used. Use markdown syntax for formatting.
    "content": {
        "failToLoadFile": "Error occurred when loading file(s). ",
        "failToLoadDirectory": "Error occurred when loading the directory. ",
        "failToImportFile": "Error occurred when importing file(s). ",
        "errorMessage": "Error message: {{msg}}",
        "failToClearOPFS": "Error occurred when clearing OPFS. ",

        "dragAndDropFileListIntegrityDialogContent": `Potential file list integrity issue detected: \n
**Your browser seems to be limiting the max entries that can be read from a directory** (limited to 100). Directories with more than 100 files (or folders) will not be fully imported.\n
May try to use the directory picker button, or do manually imports for several times.`,

        // --- Tip on Panels --- // 
        "inputPanelTip": `**Right click** or **touch hold** on the files in the list to show more actions.\n
The same action is avalible for the output file list on the right.`,

        "outputPanelTip": `**Right click** or **touch hold** on the files or directories in the list to show download actions.\n
Notice that if converting is failed for a file, it will be skipped and will not be saved here. Make sure to keep your original files.\n
**This list will be cleared when a new task is fired.** Make sure your files are saved properly before starting the next task.`,

        // --- Config Drawer Menu --- //
        "aboutFSModeDialogContent": `Different browsers have different support level for File System Access.\n
This app will run in these three modes depend on the browser it runs on: \n
- Full Support: Public File System Access API is available. Output files will be written directly into user authorized direcrories.
- Private FS: Origin Private File System (OPFS) is available. Output files will be put into OPFS. You can download as a ZIP file when finished.
- Restricted: No File System API is supported. The output files will stay in the memory. Too many files may trigger an OOM error.`,
        "aboutFSModeDetectResult": {
            "fullSupport": "Your browser has full support for Public File System.",
            "privateFS": "Your browser supports OPFS.",
            "noFS": "Your browser doesn't support File System API."
        },
        "resetTipDisplayPreference": "Tip display status will be reset for those selected \"don't show again\".",
        "languageDialogTipContent": 'Change the language. \n\n**Page will need to reload when language is changed. Make sure to save your files before continue.**',

        // --- End of Config Drawer Menu --- //

        // --- Browser Compatibility Dialog --- //
        "browserCompatibilityContent": {
            "unableToRun": "The app cannot run in current browser.",
            "unableToRunDueToStorageDisabled": `**Your browser does not allow Web Apps to store data.**\n\n` +
                `**This might be caused by disabling Cookie.** Browsers will disable many Storage APIs as well when cookie is disabled in order to stop Web Apps from storing data locally.\n\n` +
                `To run the app, enable Cookies in the browser settings.\n\n` +
                `We are not actually using Cookies. What this app needs is a series of Storage APIs to store configuration data and image file cache.`,
            "unableToRunTip": {
                "iOS": `For iOS devices, try to use **Safari** without **Private Browsing** (since some Storage APIs are disabled in this mode)`,
                "mac": `Try to use Safari, Google Chrome, Microsoft Edge to run this app.`,
                "other": `Try to use Google Chrome or Microsoft Edge to run this app.`,
            },
            "issueDetected": "Issues Detected:",
            "issues": {
                "noWASM": `###### Missing WebAssembly Support\n\n` +
                    `Image processing engine \`wasm-vips\` will not run.`,
                "noWebWorker": `###### Missing Web Worker Support\n\n` +
                    `This is necessary for the image processing engine to run.`,
                "noSharedArrayBuffer": `###### Missing SharedArrayBuffer API\n\n` +
                    `Wasm-vips will not be able to run without this browser API\n\n` +
                    `If the browser itself supports this API, may check whether the request headers is set properly for \` Cross-Origin-Embedder-Policy\` and \`Cross-Origin-Opener-Policy\` . ([Ref](https://caniuse.com/?search=sharedArrayBuffer))`,
            },
            "nonFatalIssueDetected": "Some browser compatibility issues are detected: ",
            "nonFatalIssueFooter": "These will not affect the core functions of this app.",
            "nonFatalIssues": {
                // This one was supposed to be fatal issue but many non-latest browsers still not fully supported.
                "SIMD": `###### (IMPORTANT) Image processing engine \`wasm-vips\` will not run\n\n` +
                    `Current browser is missing support for [WebAssembly SIMD](https://webassembly.org/roadmap/) `,
                "SIMDSafari": `For Safari, please use Safari on iOS/iPadOS 16.4+. For desktop devices, try using this app in Chormium-based browsers or Firefox on desktop devices then.`,
                "SIMDNon-Safari": `Try to run this app in the latest version of Google Chorme, Microsoft Edge or Firefox on desktop devices.`,
                "noFS": `###### File System API Not Supported\n\n` +
                    `**This might make it unstable to processing large number of file.s** Doesn't matter much for small amount of files though.\n\n` +
                    `Output files can only be cached inside memory.`,

                "noFS_IOS": `For iOS devices, try to use Safari without **Private Browsing** mode (Since some Storage APIs are disabled in this mode)\n\n` +
                    `This app won't trace any of your data. All your files are processed on your local machine.\n\n` +
                    `You can clear the site data on anytime in the settings menu of Safari.`,

                "noFS_Mac": `May try to use Safari, Google Chrome or Microsoft Edge.`,
                "noFS_Other": `May try to use Google Chrome or Microsoft Edge.`,

                "clipboardAPI": `###### Missing Clipboard API with Files Support\n\n` +
                    `**Quick loading from or writing to clipboard will be affected.**\n\n` +
                    `You may need to do some extra tasks when interacting with the clipboard.`,
            },
            // --- End of Browser Compatibility Dialog --- //
        },
        // --- Site Data Manager Dialog --- //
        "inspectSiteDataDialog": {
            "main": `Here is the overview of the site data status.`,
            "secondary": `This data is from \`navigator.storage.estimate()\`.\n
Browsers may calculate this number differently. Clear the site data in the browser settings if needed.\n
Sometimes this data may look weird. Any data that is created and manageable for the app can be cleared below.\n
Your local files will not be affected.`,
            "available": "Available",
            "used": "Used",
            "notSupportError": "Storage Estimation not supported by current browser.",

            "clearLocalStorage": "Clear Saved Configuration Data",
            "localStorageEmpty": "No Configuration Data Saved",
            "clearLocalStorageTip": "Preference settings and output settings included. Won't apply immediately to current running app page(s). Reload the page to apply immediately.",

            "clearCacheStorage": "Clear App Cache from Service Worker",
            "cleatCacheStorageTip": "Service Worker caches the app data, allowing this Web App to run offline. Upon clearing these cahced data, the static files for this app will need to be re-downloaded on next start-up.",
            "unregisterSW": "Unregister Service Worker",
            "unregisterSWTip": "Remove all actived Service Workers. Clear the App Cache above too if you are going to do this.",

            "clearOPFS": "Clear OPFS Cache (For Caching Output Files)",
            "clearOPFSTip": "Be careful. If there are some non-empty output file lists that have not been downloaded, clearing OPFS will cause losing access to those files if FS Mode is PrivateFS. \n\nTo check the file structure inside OPFS, you may run `await window.__OPFS_DEBUG()` in the browser console."
        },
        // --- End Site Data Dialog --- //

        "directoryPickerNotSupported": "Mobile browsers does not support directory picker. See: [Directory Input Compatibility](https://caniuse.com/input-file-directory).\n\n"
            + "The file picker dialog will still be called later, while the app may fail to access the files you picked.\n\n"
            + "Try to use the regular import button, or, use Drag and Drop to import files.\n\n",

        "directoryPickerNotSupportedIOS": "**For iOS/iPadOS, you can import directories by dragging them from the Files app and drop them here.**\n\n![Example on dragging from Files App to import directory](/image/drag-and-drop-tip.webp)"

    }
} as const;

export default en;