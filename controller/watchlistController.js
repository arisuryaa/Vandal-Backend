import Watchlist from "../models/watchlist.js";
import Users from "../models/Users.js";
import axiosCoinGeccko from "../config/axios.js";

export const getAllWatchlist = async (req, res) => {
  try {
    const { uid } = req.user;

    // Ambil semua data dari DB
    const data = await Watchlist.find({ firebaseUid: uid });

    // Lakukan request ke CoinGecko untuk tiap coinId
    const result = await Promise.all(data.map((e) => ax.get(`/coins/${e.coinId}`)));

    // Ambil hanya data yang dibutuhkan dari response API
    const coinDetails = result.map((r) => r.data);

    res.status(200).json({
      status: "success",
      count: coinDetails.length,
      data: coinDetails,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const addWatchlist = async (req, res) => {
  const { coinId } = req.body;
  const { uid } = req.user;
  console.log(uid);
  console.log(coinId);

  try {
    // Pastikan user valid
    const user = await Users.findOne({ firebaseUid: uid });
    if (!user) return res.status(404).json({ message: "User Not Found" });

    // Cek apakah coin sudah ada di watchlist
    const dupeCoin = await Watchlist.findOne({ firebaseUid: uid, coinId });

    if (dupeCoin) {
      await Watchlist.deleteOne({ firebaseUid: uid, coinId });
      return res.status(200).json({ message: "Coin removed from watchlist" });
    } else {
      await Watchlist.create({ firebaseUid: uid, coinId });
      return res.status(200).json({ message: "Coin added to watchlist" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
