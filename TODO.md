TODOs
---

# Package Preparations

[ ] i18n
[ ] 

# Web APIs

Required when converting multiple files: File System API (either privateFS or publicFS)

[ ] Origin Private File System (iOS 15.2+)
    - https://webkit.org/blog/12257/the-file-system-access-api-with-origin-private-file-system/

    ```javascript
    const root = await navigator.storage.getDirectory();
    ```

[ ] Web Worker and WebAssembly

# Image Format Support

Source:

|From\to|JPG|PNG|BMP|GIF|WEBP|AVIF|SVG|TIFF|
|---|---|---|---|---|---|---|---|---|
|JPG||Canvas To PNG then pngcrush|
|PNG||pngcrush|
|BMP|
|GIF|
|WEBP|
|AVIF|
|SVG|Canvas Draw Image|Canvas Draw Image then pngcrush|
|TIFF|
|ICO|

Specially, GIF:

- gif.js
- Quality, frame skip, size, etc.
- from Video File (? check native video APIs to get frames)

# Details

- All (non-native) processing should be in Web Worker
    - Native: Canvas to png or similar (achieved by browser)
    - e.g. pngcrush in webworker

- **Fix file format** (real file ext)

- Canvas control: ☆ **PNG to JPG BACKGROUND COLOR on OPAQUE PLACES**