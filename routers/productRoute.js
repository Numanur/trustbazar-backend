// const router = require("express").Router();
// const {
//   createProduct,
//   deleteProduct,
//   updateProduct,
//   undoProduct,
//   getAllProduct,
//   getSingleProduct,
//   verifyProduct,
// } = require("../controllers/productController");

// router.post("/create", createProduct);
// router.put("/:id", updateProduct);
// router.put("/undo/:id", undoProduct);
// router.delete("/:id", deleteProduct);
// router.get("/single/:id", getSingleProduct);
// router.get("/all", getAllProduct);
// router.post("/verify", verifyProduct);

// module.exports = router;

const router = require("express").Router();
const multer = require("multer");
const cloudinary = require("../config/cloudinary");

const {
  createProduct,
  deleteProduct,
  updateProduct,
  undoProduct,
  getAllProduct,
  getSingleProduct,
  verifyProduct,
} = require("../controllers/productController");

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "trustbazar/products",
        resource_type: "image",
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      },
    );

    stream.end(fileBuffer);
  });
};

router.post("/upload-image", upload.single("image"), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image file uploaded",
      });
    }

    const result = await uploadToCloudinary(req.file.buffer);

    return res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      imageUrl: result.secure_url,
      publicId: result.public_id,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/create", createProduct);
router.put("/undo/:id", undoProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);
router.get("/single/:id", getSingleProduct);
router.get("/all", getAllProduct);
router.post("/verify", verifyProduct);

module.exports = router;
