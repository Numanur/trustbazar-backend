const router = require("express").Router();

const {
  signupAdmin,
  loginAdmin,
  getLoggedInAdmin,
} = require("../controllers/authController");

const { protectAdmin } = require("../middlewares/authMiddleware");

router.post("/signup", signupAdmin);
router.post("/login", loginAdmin);
router.get("/me", protectAdmin, getLoggedInAdmin);

module.exports = router;
