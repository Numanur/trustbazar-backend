const router = require("express").Router();

const {
  verifyProductMobile,
} = require("../controllers/mobileProductController");

router.post("/products/verify", verifyProductMobile);

module.exports = router;
