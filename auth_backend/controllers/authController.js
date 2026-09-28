const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Helper: signs a JWT containing the user's id and role.
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
};

// @route   POST /api/auth/register
// @access  Public
// @desc    Create a new account. Public signup always creates a "citizen"
//          account — officer/worker/admin accounts must be created by an
//          existing admin (see registerStaff below), never self-assigned.
const register = async (req, res) => {
  try {
    const { name, email, password, phone, ward } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long.",
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      phone,
      ward,
      role: "citizen", // hard-coded: public registration can never grant elevated roles
    });

    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message: "Account created successfully.",
      token,
      user: user.toSafeObject(),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Registration failed.", error: error.message });
  }
};

// @route   POST /api/auth/register-staff
// @access  Private (admin only)
// @desc    Lets an admin create officer / field worker / admin accounts.
//          Protected by `protect` + `authorizeRoles("admin")` in the routes file.
const registerStaff = async (req, res) => {
  try {
    const { name, email, password, role, phone, ward } = req.body;
    const allowedStaffRoles = ["officer", "worker", "admin"];

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "Name, email, password, and role are required.",
      });
    }

    if (!allowedStaffRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: `Role must be one of: ${allowedStaffRoles.join(", ")}.`,
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    const user = await User.create({ name, email, password, role, phone, ward });

    res.status(201).json({
      success: true,
      message: `${role} account created successfully.`,
      user: user.toSafeObject(),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Staff registration failed.", error: error.message });
  }
};

// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    // password field has `select: false` in the schema, so it must be
    // explicitly requested here in order to compare it.
    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");

    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid email or password." });
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: "This account has been deactivated." });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid email or password." });
    }

    const token = generateToken(user);

    res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      user: user.toSafeObject(),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Login failed.", error: error.message });
  }
};

// @route   GET /api/auth/me
// @access  Private (any logged-in user)
const getProfile = async (req, res) => {
  // req.user is attached by the `protect` middleware
  res.status(200).json({ success: true, user: req.user.toSafeObject() });
};

// @route   PUT /api/auth/update-password
// @access  Private (any logged-in user)
const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password and new password are required.",
      });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters long.",
      });
    }

    const user = await User.findById(req.user._id).select("+password");
    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Current password is incorrect." });
    }

    user.password = newPassword; // pre("save") hook re-hashes it automatically
    await user.save();

    res.status(200).json({ success: true, message: "Password updated successfully." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Password update failed.", error: error.message });
  }
};

module.exports = { register, registerStaff, login, getProfile, updatePassword };
