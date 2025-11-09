const mongoose = require("mongoose");

const URI = "mongodb://localhost:27017/vandal";

const connectDB = async () => {
  try {
    await mongoose.connect(URI);
    console.log("Koneksi Sukses");
  } catch (error) {
    console.log(`Koneksi Gagal : ${error}`);
  }
};

module.exports = connectDB;
