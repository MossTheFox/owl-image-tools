module.exports = {
    globDirectory: 'dist/',
    globPatterns: [
        '**/*.{js,css,ico,png,html,json,txt,svg,wasm}'
    ],
    swDest: 'dist/sw.js',
    ignoreURLParametersMatching: [
        /^utm_/,
        /^fbclid$/
    ],
    maximumFileSizeToCacheInBytes: 1024 * 1024 * 30
};