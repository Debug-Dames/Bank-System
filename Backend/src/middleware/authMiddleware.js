const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // no token
  if (!authHeader) {
    return res.status(401).json({ message: "Access denied. No token provided" });
  }

  try {
    // format: Bearer TOKEN
    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, "SECRET_KEY");

    req.user = decoded; // attach user data
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = authMiddleware;