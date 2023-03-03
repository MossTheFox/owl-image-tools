<p align="center">
    <img src="public/image/icon-512.png" width="256px" alt="App logo">
</p>

# Owl Image Tools (图片工具箱)

A simple image conversion tool that runs in your browser, powered by [wasm-vibs](https://github.com/kleisauke/wasm-vips).

[Live Demo Here](https://img.mowl.cc/).

Language Support: `zh-CN`, `zh-TW` (via Google Translation), `en`.

<sub>If you've visited this page before, you will need to wait for the Service Worker to update itself before accessing to the newer version of the page (if any) since Service Worker will always serve the local cached version to you. Do a page refresh to check if the newer version is loaded.</sub>

## Browser compatibility

Image processing engine requires WebAssembly SIMD support. For Safari, it's not available until iOS 16.4+.

Recommended: latest version of Google Chrome or Microsoft Edge.

Also works on: latest Firefox, Safari on iOS 16.4+.


## Intro

A experimental Web App built with React. No back-end. No analysis scripts. A pure client-side app.

(The screenshots are not the latest version, but the look is mostly the same)

<p>
    <img src="public/image/screenshot1.png" width="66%">
    <img src="public/image/screenshot2.png" width="33%">
</p>

All the image processing will be done done **locally** in your browser, thanks to the powerful [wasm-vibs](https://github.com/kleisauke/wasm-vips). It's currently based on wasm-vips 0.0.4 (vips version 8.13.3).

The code base is a bit messy and needs some optimization. Do it later (I guess).

## Features

- Runs in the browser, with PWA and Service Worker caching support (runs offline);
- Many convenient ways of importing files:
    - From Clipboard;
    - Drag and drop (file or folder);
        - <sub>Chromium-based browsers may limit the maximun entries to 100 for each directory. You'll see a notification if the app detected this;</sub>
    - Select files or directories (Desktop browsers only);
- Preview and compare output files if needed;
- Detailed help text for the options;
- Won't crash the page with large amount of images to process, if the browser supports File System Access API (or OPFS);
- Zip the output folders and download them (with [JSZip](https://stuk.github.io/jszip/));
- File list won't be laggy even with thousands of files.

## Notes

- It's recommended to use a browser that support Public File System Access (Chrome for example) in case the app runs into trouble before converting finished;
    - <sub>(since with the API support, files are written in your local directory immediately when one is finished. For browsers that doesn't support Public FS, you'll only be able to download manually on finished)</sub>
- For privateFS mode (browsers that only support OPFS), the files inside OPFS won't be deleted automatically if the app is closed with the output file list non-empty. You can clear them in the storage management dialog in the config menu.
    - This behavior may change in the future version.
    - In privateFS mode, app may not work as expected if OPFS is full.

## Build

This is a React project created with [Vite](https://vitejs.dev/).

```sh
npm install         # Install dependences
npm run dev         # Start Dev Server
npm run build       # Build
```

The Service Worker (`sw.js`) is generated with [Workbox](https://developer.chrome.com/docs/workbox/the-ways-of-workbox/). The config files are `workbox-config.cjs` for production build, and `workbox-config-dev.cjs` for development.

```sh
workbox generateSW workbox-config.cjs
```

## TODOs

> <sub>or, never-to-be-done(s)</sub>

- [x] Modify the hardcoded text to support localization.
    - [x] zh-CN and zh-TW
    - [x] English 
- [ ] Copy image to clipboard in the context menu.
    - [ ] Test for different browsers:
        - Safari: [Allow `image/png` Only](https://webkit.org/blog/10855/async-clipboard-api/);
        - [Chrome](https://stackoverflow.com/questions/68897154/list-of-supported-mime-types-for-clipboard-write) and [Firefox](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/write) are mostly the same.
        - Which means it might need to use the canvas to do a convertion first for non-PNGs.
- [ ] Quick convertion for a single file/directory in the source file list context menu.
- [ ] 'Retry' for the errored tasks.
- [ ] 'Pause' and 'Resume' for the tasks, rather than only allowing aborting.
- [ ] Allow skipping tasks that seems to freeze the worker.
    - [ ] Vips loader Worker should be able to response to a signal call to indicate that it's not blocked. 
- [ ] Save the output directory handle in the indexedDB (with [idb-keyval](https://www.npmjs.com/package/idb-keyval)) for supported browsers.
- [ ] More image tools other than converting.
    - [ ] Image Filters (Greyscale, etc.) ([doc](https://www.libvips.org/API/current/libvips-colour.html))
    - [ ] Resize Images ([doc](https://www.libvips.org/API/current/libvips-resample.html#vips-resize) and [wiki](https://github.com/libvips/libvips/wiki/HOWTO----Image-shrinking)) 
- [ ] A simpler Settings panel for processing filters or changing resolution for images.
    - To save the final result, show menus like "Save As" rather than using the verbose converttion config panel. 
- [ ]  Add page loading background when static files are loading (the bundle size is now larger than 800 KB, which is probably unfriendly for slow networks).
- [ ] Update to wasm-vips 0.0.5 with AVIF support when it's ready.

## License

MIT
