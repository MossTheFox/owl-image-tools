export const VERSION_TEXT = 'Dev 0.1.4';    // <-- um if I forget to increase this number then just ignore this.
export const VERSION_TEXT_SECONDARY = '2023-02-10, wasm-vibs version 0.0.4';
export const GITHUB_REPO_URL = 'https://github.com/MossTheFox/owl-image-tools';

export const LOCALSTORAGE_KEYS = {
    siteConfig: 'siteConfig',
    outputConfig: 'outputConfig',
    languageOverride: 'lang'
} as const;

export const VIPS_WORKER_PATH = '/worker/vips-loader.worker.js' as const;
export const OPFS_FILE_SAVER_WORKER_PATH = '/worker/opfs-file-saver.worker.js' as const;