const jwt = require("jsonwebtoken");
const AdminUser = require("../models/AdminUser");

const protectAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        code: "NOT_AUTHENTICATED",
        message: "Authentication token is missing.",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const admin = await AdminUser.findById(decoded.id);

    if (!admin) {
      return res.status(401).json({
        success: false,
        code: "ADMIN_NOT_FOUND",
        message: "Admin account no longer exists.",
      });
    }

    req.admin = admin;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      code: "INVALID_TOKEN",
      message: "Invalid or expired authentication token.",
    });
  }
};

module.exports = {
  protectAdmin,
};
