const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const connectToDB = require("./config/connectToDB");

dotenv.config();
connectToDB();

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Serve uploaded files statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/user", require("./routes/userRoutes"));
app.use("/api/doctor", require("./routes/doctorRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Something went wrong", success: false });
});

const PORT = process.env.PORT || 8001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});