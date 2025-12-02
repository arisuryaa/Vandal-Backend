import Portofolio from "../models/portofolio.js";
import Transaction from "../models/transaction.js";

export const createTransaction = async (req, res) => {
  try {
    const { uid } = req.user;
    const { coinId, type, quantity, pricePerCoin, totalValue, transactedAt, note } = req.body;

    // 1️⃣ Simpan transaksi baru
    await Transaction.create({
      firebaseUid: uid,
      coinId,
      type,
      quantity,
      pricePerCoin,
      totalValue,
      transactedAt,
      note,
    });

    // 2️⃣ Ambil semua transaksi user untuk coin ini
    const allTransactions = await Transaction.find({
      firebaseUid: uid,
      coinId: coinId,
    });

    // 3️⃣ Hitung total quantity dan total spend
    let calculatedQuantity = 0;
    let calculatedSpend = 0;

    allTransactions.forEach((tx) => {
      const multiplier = tx.type === "sell" ? -1 : 1;
      calculatedQuantity += tx.quantity * multiplier;
      calculatedSpend += tx.totalValue * multiplier;
    });

    // Hitung average price
    const calculatedAveragePrice = calculatedQuantity > 0 ? (calculatedSpend / calculatedQuantity).toFixed(2) : "0";

    console.log("Calculated values:", {
      coinId,
      quantity: calculatedQuantity,
      totalSpend: calculatedSpend,
      averagePrice: calculatedAveragePrice,
    });

    // 4️⃣ Update atau buat data di portofolio
    if (calculatedQuantity > 0) {
      // Cek apakah portfolio sudah ada
      const existingPortfolio = await Portofolio.findOne({
        firebaseUid: uid,
        coinId: coinId,
      });

      if (existingPortfolio) {
        // Update jika sudah ada
        existingPortfolio.quantity = calculatedQuantity.toString();
        existingPortfolio.totalSpend = calculatedSpend.toString();
        existingPortfolio.averagePrice = calculatedAveragePrice;
        await existingPortfolio.save();
        console.log("Portfolio updated:", existingPortfolio);
      } else {
        // Buat baru jika belum ada
        const newPortfolio = await Portofolio.create({
          firebaseUid: uid,
          coinId: coinId,
          quantity: calculatedQuantity.toString(),
          totalSpend: calculatedSpend.toString(),
          averagePrice: calculatedAveragePrice,
        });
        console.log("Portfolio created:", newPortfolio);
      }
    } else {
      // Hapus dari portofolio jika quantity 0 atau negatif
      await Portofolio.findOneAndDelete({
        firebaseUid: uid,
        coinId: coinId,
      });
      console.log("Portfolio deleted (quantity <= 0)");
    }

    // 5️⃣ Kirim response ke client
    res.status(201).json({
      success: true,
      message: "Transaction created and portfolio updated",
      portfolioData: {
        coinId,
        quantity: calculatedQuantity.toString(),
        totalSpend: calculatedSpend.toString(),
        averagePrice: calculatedAveragePrice,
      },
    });
  } catch (error) {
    console.error("Error details:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getPortofolio = async (req, res) => {
  try {
    const { uid } = req.user;
    const result = await Portofolio.find({ firebaseUid: uid });

    res.status(200).json({
      success: true,
      message: "Success",
      portfolioData: {
        result,
      },
    });
  } catch (error) {
    console.log(error);
  }
};

export const getAllTransaction = async (req, res) => {
  try {
    const { uid } = req.user;
    const result = await Transaction.find({ firebaseUid: uid });

    res.status(200).json({
      success: true,
      message: "Success",
      portfolioData: {
        result,
      },
    });
  } catch (error) {
    console.log(error);
  }
};

export const deleteTransaction = async (id, req, res) => {
  try {
    const { uid } = req.user;
    const result = await Portofolio.findOneAndDelete({ firebaseUid: uid, coinId: id });

    const allTransactionByThatCoin = await Transaction.deleteMany({ firebaseUid: uid, coinId: id });

    res.status(200).json({
      success: true,
      message: "Success",
      portfolioData: {
        result,
      },
    });
  } catch (error) {
    console.log(error);
  }
};
