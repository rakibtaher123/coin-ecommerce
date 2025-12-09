const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  try {
    // 1. Check Authorization Header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        error: "Access denied. No token provided."
      });
    }

    // 2. Extract Token
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        error: "Access denied. Token missing."
      });
    }

    // 3. Verify Token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");

    // 4. Store user info in req.user
    req.user = decoded;

    next();

  } catch (err) {
    console.error("JWT verification error:", err.message);
    return res.status(403).json({
      error: "Invalid or expired token."
    });
  }
};

module.exports = verifyToken;
