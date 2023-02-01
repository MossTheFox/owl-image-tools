Changelog
----

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