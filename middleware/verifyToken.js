const admin = require("../config/firebaseAdmin");

const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authorization header missing or invalid" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = decoded;
    console.log(req.user);
    next();
  } catch (error) {
    console.error("Token verification error:", error.code || error.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = verifyToken;
