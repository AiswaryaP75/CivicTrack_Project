const express = require("express");
const router = express.Router();

const {
  register,
  registerStaff,
  login,
  getProfile,
  updatePassword,
} = require("../controllers/authController");

const { protect, authorizeRoles } = require("../middleware/auth");

// ---------- Public routes ----------
router.post("/register", register);       // citizen self-signup
router.post("/login", login);              // login for any role

// ---------- Private routes (any logged-in user) ----------
router.get("/me", protect, getProfile);
router.put("/update-password", protect, updatePassword);

// ---------- Admin-only routes ----------
// Only an admin can create officer / field worker / admin accounts.
router.post("/register-staff", protect, authorizeRoles("admin"), registerStaff);

module.exports = router;
