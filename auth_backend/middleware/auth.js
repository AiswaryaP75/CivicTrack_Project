const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * protect
 * Verifies the JWT sent in the Authorization header ("Bearer <token>").
 * If valid, attaches the logged-in user's document to req.user and
 * lets the request continue. Otherwise responds 401 Unauthorized.
 */
const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Not authorized. No token provided.",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch the user fresh from the DB (not just trust the token payload),
    // so a deactivated or deleted account is rejected immediately.
    const user = await User.findById(decoded.id);

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: "Not authorized. User no longer exists or is inactive.",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ success: false, message: "Session expired. Please log in again." });
    }
    return res.status(401).json({ success: false, message: "Not authorized. Invalid token." });
  }
};

/**
 * authorizeRoles
 * Usage: authorizeRoles("officer", "admin")
 * Must be used AFTER `protect`, since it relies on req.user being set.
 * Blocks the request with 403 Forbidden if the logged-in user's role
 * is not in the allowed list.
 */
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Not authorized." });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. This action requires one of these roles: ${allowedRoles.join(", ")}.`,
      });
    }
    next();
  };
};

module.exports = { protect, authorizeRoles };
