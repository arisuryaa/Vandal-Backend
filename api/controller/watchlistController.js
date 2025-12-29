import Watchlist from "../models/watchlist.js";
import Users from "../models/Users.js";
import axiosCoinGeccko from "../config/axios.js";

export const getAllWatchlist = async (req, res) => {
  try {
    const { uid } = req.user;

    // Ambil semua coinId dari DB
    const data = await Watchlist.find({ firebaseUid: uid });

    if (data.length === 0) {
      return res.status(200).json({
        status: "success",
        count: 0,
        data: [],
      });
    }

    // Gabungkan semua coinId jadi string comma-separated
    const coinIds = data.map((e) => e.coinId).join(",");

    // SATU request untuk semua coins
    const response = await axiosCoinGeccko.get("/coins/markets", {
      params: {
        vs_currency: "usd",
        ids: coinIds,
        order: "market_cap_desc",
        sparkline: true, // optional: untuk chart
        price_change_percentage: "24h",
      },
    });

    // console.log(response.data);

    res.status(200).json({
      status: "success",
      count: response.data.length,
      data: response.data,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
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

export const removeWatchlist = async (id, req, res) => {
  try {
    const { uid } = req.user;
    const coinId = id;
    console.log(`🔍 Attempting to remove:`);
    console.log(`   UID: ${uid}`);
    console.log(`   CoinID: ${id}`);

    // Cari SEMUA watchlist user ini untuk debug
    const allUserWatchlist = await Watchlist.find({ firebaseUid: uid });
    console.log(`📋 User's current watchlist:`, allUserWatchlist);

    // Cek apakah coin ada di watchlist (case-insensitive)
    const watchlistItem = await Watchlist.findOne({
      firebaseUid: uid,
      coinId: { $regex: new RegExp(`^${coinId}$`, "i") }, // ← CASE INSENSITIVE
    });

    if (!watchlistItem) {
      console.log(`❌ Coin "${coinId}" not found in user's watchlist`);
      return res.status(404).json({
        status: "error",
        message: "Coin not found in watchlist",
        debug: {
          searchedCoinId: coinId,
          availableCoins: allUserWatchlist.map((w) => w.coinId),
        },
      });
    }

    // Hapus dari watchlist
    await Watchlist.deleteOne({
      firebaseUid: uid,
      coinId: watchlistItem.coinId, // ← Gunakan coinId yang ditemukan
    });

    console.log(`✅ Successfully removed "${coinId}" from watchlist`);

    res.status(200).json({
      status: "success",
      message: "Coin removed from watchlist successfully",
    });
  } catch (error) {
    console.error("💥 Error removing from watchlist:", error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};
