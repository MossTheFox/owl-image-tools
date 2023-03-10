Changelog
----

## Dev 0.1.5 - TBA

### Added (TODO)

[ ] Tasks can be paused and resumed, as well as retrying failed tasks.
[ ] Added support to convert single file or specific directory from input list from context menu.
[ ] Output file list can be kept without clearing now.

### Fixed (TODO)

[ ] OPFS file cache created 24h earlier will be automatically cleared on application launch.
[ ] Safari context menu calling via long touch.
[ ] JSZip will write to a file (in OPFS or directly to Public FS) when doing compression, rather than put the entire file in the memory.

## Dev 0.1.4d - 2023-03-10

### Fixed

- Fixed an issue caused the ZIP generation not renaming files correctly.
- Fixed performance issue when trying to rename files.

## Dev 0.1.4c - 2023-03-03

### Added

- Tip image for importing directories on iOS/iPadOS devices.

### Fixed

- Missing support for folder context menu long tap for Safari.
- `navigator.storage` not supported by safari will now give a proper error message to display.

## Dev 0.1.4b - 2023-02-21

### Added
- Tips for mobile browsers that doesn't support directory input ([ref](https://caniuse.com/input-file-directory)).

### Fixed
- Context menu fired by long tap for Safari mobile.

## Dev 0.1.4 - 2023-02-10

### Added

- Localization for English and Traditional Chinese.

### Changed

- Web workers moved to path `/worker`.
- Function paramater names of `libvipsConverter.ts` will now match the real argument names of vips.
- Code checked and modified with eslint (react-hooks plug-in).
- All CSS will be bundled by emotion now.

### Fixed

- SharedArrayBuffer API not detected properly for browser compatibility dialog.

## Dev 0.1.3b - 2023-01-30

### Added

- `opfs-file-saver.worker.js` now accepts `override` property in message data to override files in OPFS.
- WASM SIMD support will be checked on launch.

### Changed

- Comments in `opfs-file-saver.worker.js` to notice that Firefox Desktop and Chrome Android 109+ have both added support for OPFS.
- Text change for a few buttons: '明白了' ('understood') -> '好的' ('ok')

## Dev 0.1.3 - 2023-01-29

### Added

- wasm-vips will now run in a worker. (APIs unchanged)
- Service Worker can be removed in site data management dialog now.

### Fixed

- Zipping will now skip empty files.