import Vips from "wasm-vips";


const vips = await Vips({
    // local file ** important **
});

const img = vips.Image.newFromFile('what', {

});

// ok what the