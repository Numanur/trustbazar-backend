const Product = require("../models/BlockchainProduct");

const verifyProductMobile = async (req, res, next) => {
  try {
    const scannedCode =
      req.body.serialNumber || req.body.barcode || req.body.code;

    if (!scannedCode || !scannedCode.trim()) {
      return res.status(400).json({
        success: false,
        verified: false,
        code: "SERIAL_REQUIRED",
      });
    }

    const product = await Product.findOne({
      "tracking.serialNumber": scannedCode.trim(),
    }).lean();

    if (!product) {
      return res.status(200).json({
        success: true,
        verified: false,
        code: "PRODUCT_NOT_VERIFIED",
      });
    }

    return res.status(200).json({
      success: true,
      verified: true,
      code: "PRODUCT_VERIFIED",
      product: {
        id: product._id,
        productName: product.basicDetails?.productName,
        description: product.basicDetails?.description,
        category: product.basicDetails?.category,
        brand: product.basicDetails?.brand,
        price: product.basicDetails?.price,
        weight: product.basicDetails?.weight,
        origin: product.basicDetails?.origin,
        productImg: product.basicDetails?.productImg,
        manufacturingDate: product.basicDetails?.manufacturingDate,
        expirationDate: product.basicDetails?.expirationDate,
        serialNumber: product.tracking?.serialNumber,
        sellStatus: product.sellStatus,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  verifyProductMobile,
};
