// const JsBarcode = require('jsbarcode');
// const { createCanvas } = require("canvas");

// const barcodeGenerator = (serialNumber) => {
//     const canvas = createCanvas();

//     JsBarcode(canvas, serialNumber, {
//         format: 'CODE128',
//         displayValue: true,
//         fontSize: 16,
//     });

//     const barcodeImageBuffer = canvas.toBuffer();
//     return barcodeImageBuffer;
// }

// module.exports = barcodeGenerator;

const bwipjs = require("bwip-js");

const barcodeGenerator = async (serialNumber) => {
  return await bwipjs.toBuffer({
    bcid: "code128", // Barcode type
    text: serialNumber, // Text to encode
    scale: 3, // 3x scaling factor
    height: 10, // Bar height, in mm
    includetext: true, // Show human-readable text
    textxalign: "center", // Center text below barcode
  });
};

module.exports = barcodeGenerator;
