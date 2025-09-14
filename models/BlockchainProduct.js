const mongoose = require("mongoose");

const BlockchainProductSchema = mongoose.Schema(
  {
    basicDetails: {
      productName: { type: String },
      description: { type: String },
      category: { type: String },
      brand: { type: String },
      price: { type: Number },
      weight: { type: String },
      productImg: { type: String },
      origin: { type: String },
    },
    tracking: {
      barcode: { type: String },
      serialNumber: { type: String },
    },
    sellStatus: {
      type: String,
      enum: ["available", "sold"],
      default: "available",
    },
    expiration: {
      manufacturingDate: { type: String },
      expirationDate: { type: String },
    },
    vendorDetails: {
      vendorName: { type: String, default: "vendor name" },
      vendorCode: { type: String, default: "vendor code" },
      vendorContactInfo: {
        address: { type: String, default: "vendor address" },
        phone: { type: String, default: "contact number" },
      },
    },
    compilanceInfo: {
      compilanceCertificate: {
        type: String,
        default: "compilance certificate",
      },
      safetyInfo: { type: String, default: "safety info" },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("products", BlockchainProductSchema);
