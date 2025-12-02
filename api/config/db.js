import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const URI = process.env.MONGO_URI;

const connectDB = async () => {
  try {
    await mongoose.connect(URI);
    console.log(URI);
    console.log("Koneksi Sukses");
  } catch (error) {
    console.log(`Koneksi Gagal : ${error}`);
  }
};

export default connectDB;
