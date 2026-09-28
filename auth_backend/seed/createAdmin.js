// One-off script to create the very first admin account.
// Needed because /api/auth/register-staff itself requires an admin to
// already be logged in — this script is how you bootstrap that first one.
//
// Usage (from the auth_backend folder):
//   node seed/createAdmin.js
//
// It uses the real User model, so the password gets hashed exactly the
// same way a normal signup would. Safe to run once; if the email already
// exists, it just tells you and exits.

require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");

// --- Edit these before running ---
const ADMIN_NAME = "System Admin";
const ADMIN_EMAIL = "admin@civictrack.com";
const ADMIN_PASSWORD = "admin123"; // change this to something real, then change it again after first login
// ----------------------------------

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB.");

  const existing = await User.findOne({ email: ADMIN_EMAIL.toLowerCase() });
  if (existing) {
    console.log(`An account with ${ADMIN_EMAIL} already exists (role: ${existing.role}). Nothing to do.`);
    await mongoose.disconnect();
    return;
  }

  const admin = await User.create({
    name: ADMIN_NAME,
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD, // pre("save") hook in User.js hashes this automatically
    role: "admin",
  });

  console.log("Admin account created successfully:");
  console.log(`  Email:    ${admin.email}`);
  console.log(`  Password: ${ADMIN_PASSWORD}`);
  console.log("You can now log in with these credentials on the frontend.");

  await mongoose.disconnect();
}

run().catch((err) => {
  console.error("Failed to create admin:", err.message);
  process.exit(1);
});