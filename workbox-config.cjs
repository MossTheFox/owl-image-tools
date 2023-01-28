module.exports = {
    globDirectory: 'dist/',
    globPatterns: [
        '**/*.{js,css,ico,html,json,wasm}'
    ],
    swDest: 'dist/sw.js',
    ignoreURLParametersMatching: [
        /^utm_/,
        /^fbclid$/
    ],
    maximumFileSizeToCacheInBytes: 1024 * 1024 * 30
};