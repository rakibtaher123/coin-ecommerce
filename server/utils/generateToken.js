const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  try {
    // 🛑 Validate user object
    if (!user || !user._id) {
      throw new Error("Invalid user object: _id is missing");
    }

    // (Optional) যদি role থাকে → যোগ করবে, না থাকলে বাদ দেবে
    const payload = {
      id: user._id,
    };

    if (user.role) {
      payload.role = user.role;
    }

    // 🛑 Validate JWT Secret
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in the .env file");
    }

    // 🔐 Generate token
    return jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

  } catch (err) {
    console.error("Token Generation Error:", err.message);
    throw new Error("Failed to generate token");
  }
};

module.exports = generateToken;
