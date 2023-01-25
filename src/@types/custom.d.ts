import type _Vips from 'wasm-vips';


declare global {
    interface Navigator {
        standalone?: boolean
    };
    var Vips: typeof _Vips | undefined;
}

