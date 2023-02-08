const en = {
    "document": {
        "title": "Owl Image Tools"
    },
    "global": {
        "knownIssues": `Known Issues:
- For file types that cannot be decoded by wasm-vips (e.g. SVG, ICO), a PNG file will be generated with the HTML canvas before passing to vips for further processing. Meta data and alpha channel will be lost during this process.
- APNG is not supported.`
    },
    "lang": {
        "followSystem": "Follow System",
        "zh": "Chinese",
        "zh-CN": "Simplified Chinese (zh-CN)",
        "zh-TW": "Traditional Chinese (zh-TW)",
        "en": "English (en)"
    },
    "commonWords": {
        "tips": "Tips",
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
    },
    "button": {
        "okAndDontShowAgain": "OK, don't show again",
        "readFromClipboard": "Read From Clipboard",
        "selectFiles": "Select Files",
        "selectDirectory": "Select Directory",
        "selectWebkitDirectory": "Import Directory",
        "denseList": "Dense",
        "showPreview": "Preview",
        "confirmReset": "Confirm to reset",
        "applyAndReloadPage": "Apply settings and reload"
    },
} as const;

export default en;