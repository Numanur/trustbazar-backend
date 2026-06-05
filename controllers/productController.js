const Product = require("../models/BlockchainProduct");
const barcodeGenerator = require("../utils/barcodeGenerator");
const { v4: uuidv4 } = require("uuid");

const createProduct = async (req, res, next) => {
  try {
    const {
      productName,
      description,
      category,
      brand,
      price,
      weight,
      origin,
      manufacturingDate,
      expirationDate,
      productImg,
    } = req.body;

    let serialNumber;
    if (req.body.serialNumber) {
      serialNumber = req.body.serialNumber;
    } else {
      let id = uuidv4();
      let arr = id.split("-");
      serialNumber = arr[arr.length - 1];
    }

    const barcodeImageBuffer = await barcodeGenerator(serialNumber);

    const newProductObj = {
      basicDetails: {
        productName,
        description,
        category,
        brand,
        price,
        weight,
        productImg,
        origin,
      },
      tracking: {
        barcode: barcodeImageBuffer.toString("base64"),
        serialNumber,
      },
      expiration: {
        manufacturingDate,
        expirationDate,
      },
      // vendorDetails: {
      //     vendorName, vendorCode,
      //     vendorContactInfo: {
      //         address, phone
      //     }
      // },
      // compilanceInfo: {
      //     compilanceCertificate, safetyInfo
      // }
    };

    const newProduct = new Product(newProductObj);
    const product = await newProduct.save();

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (err) {
    next(err);
  }
};

const updateProduct = async (req, res, next) => {
  const id = req.params.id;

  try {
    await Product.updateMany(
      { "tracking.serialNumber": id },
      {
        $set: { sellStatus: "sold" },
      },
      { new: true },
    );
    res.status(200).json({
      success: true,
      message: "Product updated successfully",
    });
  } catch (err) {
    next(err);
  }
};

const undoProduct = async (req, res, next) => {
  const id = req.params.id;

  try {
    await Product.updateMany(
      { "tracking.serialNumber": id },
      {
        $set: { sellStatus: "available" },
      },
      { new: true },
    );
    res.status(200).json({
      success: true,
      message: "Product updated successfully",
    });
  } catch (err) {
    next(err);
  }
};

const deleteProduct = async (req, res, next) => {
  const id = req.params.id;

  try {
    await Product.deleteOne({ "tracking.serialNumber": id });
    res.status(200).json({
      success: true,
      message: "Product has been deleted!",
    });
  } catch (err) {
    next(err);
  }
};

const getSingleProduct = async (req, res, next) => {
  try {
    const id = req.params.id;
    const product = await Product.findOne({ "tracking.serialNumber": id });

    res.status(200).json({
      success: true,
      product,
    });
  } catch (err) {
    next(err);
  }
};

// const getAllProduct = async (req, res, next) => {
//   try {
//     const products = await Product.find({}).sort({ createdAt: -1 });
//     res.status(200).json({
//       success: true,
//       products,
//     });
//   } catch (err) {
//     next(err);
//   }
// };

const getAllProduct = async (req, res, next) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 });

    if (!products || products.length === 0) {
      return res.status(200).json({
        success: true,
        statusCode: 200,
        code: "EMPTY_PRODUCTS",
        isEmpty: true,
        message: "No products are available in the database.",
        count: 0,
        products: [],
      });
    }

    return res.status(200).json({
      success: true,
      statusCode: 200,
      code: "PRODUCTS_FOUND",
      isEmpty: false,
      message: "Products fetched successfully.",
      count: products.length,
      products,
    });
  } catch (err) {
    next(err);
  }
};

const verifyProduct = async (req, res, next) => {
  try {
    const serial = req.body.serialNumber;
    const product = await Product.findOne({ "tracking.serialNumber": serial });

    if (product) {
      res.status(200).json({
        success: true,
        product,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createProduct,
  deleteProduct,
  updateProduct,
  undoProduct,
  getAllProduct,
  getSingleProduct,
  verifyProduct,
};
