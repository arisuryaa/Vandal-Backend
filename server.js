const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const port = process.env.PORT;
const connectDB = require("./config/db");
const cors = require("cors");
connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const registerRoutes = require("./routes/registerRoutes");
const watchlistRoutes = require("./routes/watchlistRoutes");
const portofolioRoutes = require("./routes/portofolioRoutes");
const verifyToken = require("./middleware/verifyToken");

app.use("/api/register", verifyToken, registerRoutes);
app.use("/api/watchlist", verifyToken, watchlistRoutes);
app.use("/api/portofolio", verifyToken, portofolioRoutes);

app.listen(port, () => {
  console.log(`API RUNNING ON localhost:${port} `);
});
