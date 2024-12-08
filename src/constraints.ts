export const VERSION_TEXT = 'Dev 0.1.4f';    // <-- Change this when building for prod.
export const VERSION_TEXT_SECONDARY = '2023-09-04, wasm-vibs version 0.0.5';
export const GITHUB_REPO_URL = 'https://github.com/MossTheFox/owl-image-tools';

export const LOCALSTORAGE_KEYS = {
    siteConfig: 'siteConfig',
    outputConfig: 'outputConfig',
    languageOverride: 'lang'
} as const;

export const IDB_KEYVAL_LAST_OUTPUT_DIRECTORY_KEY = 'lastOutputDir' as const;

export const VIPS_WORKER_PATH = '/worker/vips-loader-0.0.11.worker.js' as const;
export const OPFS_FILE_SAVER_WORKER_PATH = '/worker/opfs-file-saver-v2.worker.js' as const;