const express = require("express");
const app = express();
const port = 3000;
const connectDB = require("./config/db");
const cors = require("cors");
connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: [
      "http://localhost:3000", // ← Development lokal
      "https://vandal.vercel.app", // ← Production (nanti diisi)
    ],
  })
);

const registerRoutes = require("./routes/registerRoutes");
const watchlistRoutes = require("./routes/watchlistRoutes");
const portofolioRoutes = require("./routes/portofolioRoutes");
const verifyToken = require("./middleware/verifyToken");

app.use("/api/register", verifyToken, registerRoutes);
app.use("/api/watchlist", verifyToken, watchlistRoutes);
app.use("/api/portofolio", verifyToken, portofolioRoutes);

app.listen(port, () => {
  console.log(`API RUNNING ON `);
});
