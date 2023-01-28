module.exports = {
    globDirectory: 'public/',
    globPatterns: [
        '**/*.{js,ico,wasm}'
    ],
    swDest: 'public/sw.js',
    ignoreURLParametersMatching: [
        /^utm_/,
        /^fbclid$/
    ],
    maximumFileSizeToCacheInBytes: 1024 * 1024 * 30
};