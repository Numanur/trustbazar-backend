const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const AdminUser = require("../models/AdminUser");

const createToken = (admin) => {
  return jwt.sign(
    {
      id: admin._id,
      email: admin.email,
      username: admin.username,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    },
  );
};

const sanitizeAdmin = (admin) => {
  return {
    id: admin._id,
    email: admin.email,
    username: admin.username,
    createdAt: admin.createdAt,
  };
};

const signupAdmin = async (req, res, next) => {
  try {
    const { email, username, password, confirmPassword } = req.body;

    if (!email || !username || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        code: "FIELDS_REQUIRED",
        message:
          "Email, username, password, and confirm password are required.",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        code: "PASSWORD_MISMATCH",
        message: "Password and confirm password do not match.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        code: "WEAK_PASSWORD",
        message: "Password must be at least 6 characters long.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedUsername = username.trim().toLowerCase();

    const existingAdmin = await AdminUser.findOne({
      $or: [{ email: normalizedEmail }, { username: normalizedUsername }],
    });

    if (existingAdmin) {
      return res.status(409).json({
        success: false,
        code: "ADMIN_EXISTS",
        message: "An admin with this email or username already exists.",
      });
    }

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    const admin = await AdminUser.create({
      email: normalizedEmail,
      username: normalizedUsername,
      passwordHash,
    });

    return res.status(201).json({
      success: true,
      code: "SIGNUP_SUCCESS",
      message: "Admin account created successfully. Please login to continue.",
      admin: sanitizeAdmin(admin),
    });
  } catch (err) {
    next(err);
  }
};

const loginAdmin = async (req, res, next) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        code: "FIELDS_REQUIRED",
        message: "Email/username and password are required.",
      });
    }

    const normalizedIdentifier = identifier.trim().toLowerCase();

    const admin = await AdminUser.findOne({
      $or: [
        { email: normalizedIdentifier },
        { username: normalizedIdentifier },
      ],
    });

    if (!admin) {
      return res.status(401).json({
        success: false,
        code: "INVALID_CREDENTIALS",
        message: "Invalid email/username or password.",
      });
    }

    const passwordMatched = await bcrypt.compare(password, admin.passwordHash);

    if (!passwordMatched) {
      return res.status(401).json({
        success: false,
        code: "INVALID_CREDENTIALS",
        message: "Invalid email/username or password.",
      });
    }

    const token = createToken(admin);

    return res.status(200).json({
      success: true,
      code: "LOGIN_SUCCESS",
      message: "Login successful.",
      token,
      admin: sanitizeAdmin(admin),
    });
  } catch (err) {
    next(err);
  }
};

const getLoggedInAdmin = async (req, res) => {
  return res.status(200).json({
    success: true,
    code: "ADMIN_AUTHENTICATED",
    admin: sanitizeAdmin(req.admin),
  });
};

module.exports = {
  signupAdmin,
  loginAdmin,
  getLoggedInAdmin,
};
