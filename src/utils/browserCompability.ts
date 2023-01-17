/**
 * necessary APIs only.
 */
function compabilityTest() {
    const TEST_KEYS = ['privateFS', 'publicFS', 'webWorker', 'WASM'] as const;
    const testRecords: { [key in typeof TEST_KEYS[number]]: boolean } = {

        // Safari 15.2+, with all other browsers ok (https://developer.mozilla.org/en-US/docs/Web/API/Navigator/storage)
        privateFS: !!navigator.storage?.getDirectory,

        // Local filesystem access, Chrome (Desktop) 86+
        publicFS: !!window.showDirectoryPicker,

        webWorker: typeof Worker !== 'undefined',

        WASM: typeof WebAssembly !== 'undefined',

        // Browsers will disable localStorage when cookie is disabled. 
    };

    return testRecords;
}

export const compabilityTestResult = compabilityTest();

export const FS_Mode = (() => {
    if (compabilityTestResult.publicFS) return 'publicFS';
    if (compabilityTestResult.privateFS) return 'privateFS';
    return 'noFS';
})();

export const storageDisabled = (() => {
    try {
        let tryAccess = typeof localStorage.length === 'number';
        return false;
    } catch (err) {
        return true;
    }
})();

export const clipboardSupport = (!!navigator.clipboard?.read && typeof ClipboardItem !== 'undefined') as boolean;

export const isWebkit = typeof navigator.standalone === 'boolean';

export const isMacOriOS = /iPad|iPhone|iPod|Mac/.test(navigator.userAgent);