require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const exampleProtectedRoutes = require("./routes/exampleProtectedRoutes");

const app = express();

// ---------- Middleware ----------
app.use(cors());
app.use(express.json());

// ---------- Routes ----------
app.use("/api/auth", authRoutes);
app.use("/api", exampleProtectedRoutes); // example only, safe to remove later

app.get("/", (req, res) => {
  res.json({ message: "Complaint Management System API is running." });
});

// ---------- 404 handler ----------
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found." });
});

// ---------- Global error handler ----------
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "Something went wrong on the server." });
});

const PORT = process.env.PORT || 5000;

// Connect to MongoDB, then start the server only once the connection succeeds.
connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
});
