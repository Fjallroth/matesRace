const mongoose = require("mongoose");

require("dotenv").config({ path: "./config/.env" });

const connectDB = async () => {
  try {
    console.log("MONGODB_URI:", process.env.DB_STRING); // Add this line to print the value

    const conn = await mongoose.connect(process.env.DB_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1);
  }
};

module.exports = connectDB;
