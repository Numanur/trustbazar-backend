// const mongoose = require("mongoose");

// mongoose
//   .connect(process.env.MONGODB_URL)
//   .then(() =>
//     console.log("MongoDB connection successful", process.env.MONGODB_URL)
//   )
//   .catch((err) => console.error(err));

const mongoose = require("mongoose");

// Stop Mongoose from silently buffering queries when DB is not connected
mongoose.set("bufferCommands", false);

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URL) {
      throw new Error("MONGODB_URL is missing in environment variables");
    }

    await mongoose.connect(process.env.MONGODB_URL, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log("MongoDB connection successful");
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
