import type _Vips from 'wasm-vips';


declare global {
    interface Navigator {
        standalone?: boolean
    }
    // eslint-disable-next-line
    var Vips: typeof _Vips | undefined; // This has to be var.
}

