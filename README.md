<p align="center">
    <img src="public/image/icon-512.png" width="256px" alt="App logo">
</p>

# Owl Image Tools (图片工具箱)

A simple image conversion tool that runs in your browser, powered by [wasm-vibs](https://github.com/kleisauke/wasm-vips).

[Live Demo Here](https://img.mowl.cc/).

(Currently with zh-CN only. Localization in the to-do list.)

**IMPORTANT NOTES for browser compatibility**

The latest stable version of Safari (current iOS 16.3) is still not supported yet due to its missing the WebAssembly SIMD support (which is fixed in a preview version). Wasm-vips will fail to initialize.

Recommended: latest version of Google Chrome or Microsoft Edge.

<sub>Firefox will be ok, but it doesn't provide support for File System Access API (as well as Origin Private File System). The output files will have to be put in the memory.</sub>

## Intro


A experimental Web App built with React. No back-end.

(The screenshots are not the latest version, but the look is mostly the same)

<p>
    <img src="public/image/screenshot1.png" width="66%">
    <img src="public/image/screenshot2.png" width="33%">
</p>

All the image processing will be done done **locally** in your browser, thanks to the powerful [wasm-vibs](https://github.com/kleisauke/wasm-vips). It's currently based on wasm-vips 0.0.4 (vips version 8.13.3).

The code base is a bit messy and needs some optimization. Do it later (I guess).

## Features

- Runs in the browser, with PWA and Service Worker caching support (runs offline)
- Many convenient ways of importing files:
    - From Clipboard;
    - Drag and drop (file or folder);
        - <sub>Chromium-based browsers may limit the maximun entries to 100 for each directory. You'll see a notification if the app detected this;</sub>
    - Select files or folders;
- Compare output files if needed;
- Site storage can be managed in the top-left settings menu;
    - Clear the Cache Storage used by Service Worker;
    - Clear cache inside Origin Private File System;
- Won't crash the page with large amount of images to process, if the browser supports File System Access API (or Origin Private File System <sub>that has an adaptation specially made for Safari but sadly the app cannot run on it for now :( </sub>)
- Zip the output folders and download them (with the lovely APIs from [JSZip](https://stuk.github.io/jszip/))
- File list won't be laggy even with thousands of files
    - Make sure to use a browser that support Public File System Access (Chrome for example) in case the app run into trouble before converting finished 
        - <sub>(since with the API support, files are written in your local directory immediately when one is finished. For browsers that doesn't support Public FS, you'll only be able to download manually on finished)</sub>

## Build

It's a React project created with [Vite](https://vitejs.dev/). Not much eslint plugins was installed for a quicker development step (...and a lower code quality. I know.)

```sh
npm run dev         # Start Dev Server
npm run build       # Build
```

The Service Worker (`sw.js`) is generated with [Workbox](https://developer.chrome.com/docs/workbox/the-ways-of-workbox/). The config files are `workbox-config.cjs` for production build, and `workbox-config-dev.cjs` for development.

```sh
workbox generateSW workbox-config.cjs
```

## TODOs

> <sub>or, never-to-be-done(s)</sub>

- Localization (if there's someone using it);
- Update to wasm-vips 0.0.5 with AVIF support when it's ready;
- More image tools other than converting.

## License

MIT.