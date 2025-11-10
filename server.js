import express from "express";
const app = express();
import dotenv from "dotenv";
dotenv.config();
const port = process.env.PORT;
import connectDB from "./config/db";
import cors from "cors";
connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

import registerRoutes from "./routes/registerRoutes.js";
import watchlistRoutes from "./routes/watchlistRoutes.js";
import portofolioRoutes from "./routes/portofolioRoutes.js";
import verifyToken from "./middleware/verifyToken.js";

app.use("/api/register", verifyToken, registerRoutes);
app.use("/api/watchlist", verifyToken, watchlistRoutes);
app.use("/api/portofolio", verifyToken, portofolioRoutes);

app.listen(port, () => {
  console.log(`API RUNNING ON localhost:${port} `);
});
