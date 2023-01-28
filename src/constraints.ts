export const VERSION_TEXT = 'Dev 0.1.2';
export const VERSION_TEXT_SECONDARY = '2023-01-28, wasm-vibs version 0.0.4';

export const LOCALSTORAGE_KEYS = {
    siteConfig: 'siteConfig',
    outputConfig: 'outputConfig'
} as const;

// ↓ i18n
export const KNOWN_ISSUES = {
    'zh-CN': `已知问题:
- 对于 wasm-vips 无法直接解码的格式 (SVG, ICO 等)，会先借助浏览器的解码器来获取一个中间图片 (PNG 格式)，此过程会丢失元数据与透明度信息；
- 也因此，对于目前版本下的 AVIF 格式，如果当前浏览器无法解码源文件，则也无法进行转换；
- APNG 格式不受支持。`
};