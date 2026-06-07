// // const app = require("./app");
// const PORT = process.env.PORT || 5000;
// // external import
// require("dotenv").config();
// const express = require("express");
// const morgan = require("morgan");
// const cors = require("cors");
// const bodyParser = require("body-parser");
// require("./config/dbConn");

// // internal import
// const productRoute = require("./routers/productRoute");

// const app = express();

// // middlewares
// app.use(morgan("dev"));
// app.use(cors());
// app.use(express.json());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// app.use((req, res, next) => {
//   res.set("Cache-Control", "no-store");
//   next();
// });

// // default route
// app.get("/", (req, res) => {
//   res.status(200).json({
//     success: true,
//     message: "All are set perfectly!",
//   });
// });

// // routes
// app.use("/api/products", productRoute);

// // error handle
// app.use((err, req, res, next) => {
//   const errorStatus = err.status || 500;
//   const errorMessage = err.message || "Something went wrong!!";
//   return res.status(errorStatus).json({
//     success: false,
//     status: errorStatus,
//     message: errorMessage,
//     stack: err.stack,
//   });
// });

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

require("dotenv").config();

const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const connectDB = require("./config/dbConn");
const productRoute = require("./routers/productRoute");
const mobileProductRoute = require("./routers/mobileProductRoute");
const authRoute = require("./routers/authRoute");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "All are set perfectly!",
  });
});

app.get("/api/health", (req, res) => {
  const dbState = mongoose.connection.readyState;

  if (dbState !== 1) {
    return res.status(503).json({
      success: false,
      code: "DATABASE_DISCONNECTED",
    });
  }

  return res.status(200).json({
    success: true,
    code: "BACKEND_READY",
  });
});

app.get("/health/db", (req, res) => {
  const states = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting",
  };

  const dbState = mongoose.connection.readyState;

  res.status(dbState === 1 ? 200 : 503).json({
    success: dbState === 1,
    database: states[dbState] || "unknown",
  });
});

app.use("/api/products", productRoute);
app.use("/api/mobile", mobileProductRoute);
app.use("/api/auth", authRoute);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong!!";

  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
});

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
