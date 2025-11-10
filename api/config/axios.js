import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const axiosCoinGeccko = axios.create({
  baseURL: process.env.API_URI,
  headers: {
    x_cg_demo_api_key: process.env.API_KEY,
  },
});

export default axiosCoinGeccko;
