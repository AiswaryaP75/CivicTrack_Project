// This file is NOT required for authentication to work — it's included
// purely as a working example of how the rest of the team will use
// `protect` and `authorizeRoles` when building the complaint routes later.

const express = require("express");
const router = express.Router();
const { protect, authorizeRoles } = require("../middleware/auth");

// Any logged-in user (citizen, officer, worker, or admin) can view this.
router.get("/complaints/mine", protect, (req, res) => {
  res.json({
    success: true,
    message: `Complaints belonging to ${req.user.name} (${req.user.role})`,
  });
});

// Only officers and admins can verify a complaint.
router.put(
  "/complaints/:id/verify",
  protect,
  authorizeRoles("officer", "admin"),
  (req, res) => {
    res.json({ success: true, message: `Complaint ${req.params.id} verified by ${req.user.name}` });
  }
);

// Only field workers can mark a complaint resolved.
router.put(
  "/complaints/:id/resolve",
  protect,
  authorizeRoles("worker"),
  (req, res) => {
    res.json({ success: true, message: `Complaint ${req.params.id} resolved by ${req.user.name}` });
  }
);

// Only admins can access system-wide settings.
router.get("/admin/settings", protect, authorizeRoles("admin"), (req, res) => {
  res.json({ success: true, message: "System settings (admin only)" });
});

module.exports = router;
