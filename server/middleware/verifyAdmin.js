const jwt = require("jsonwebtoken");

const verifyAdmin = (req, res, next) => {
  try {
    // 1. Authorization header check
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        error: "Access denied. No token provided."
      });
    }

    // 2. Extract token
    const token = authHeader.split(" ")[1];

    // 3. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");

    // 4. Check admin role
    if (!decoded.role || decoded.role !== "admin") {
      return res.status(403).json({
        error: "Access denied. Admin only."
      });
    }

    // 5. Save user in req for next middlewares
    req.user = decoded;

    next();

  } catch (err) {
    console.error("JWT verification error:", err.message);
    return res.status(403).json({
      error: "Invalid or expired token."
    });
  }
};

module.exports = verifyAdmin;
