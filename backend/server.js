require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// ==============================
// ✅ Middleware
// ==============================
app.use(cors());
app.use(express.json());

// ==============================
// ✅ Connect to MongoDB
// ==============================
mongoose.set("strictQuery", false);

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ==============================
// ✅ Import Routes
// ==============================
const authRoutes = require("./routes/auth");
const chatbotRoutes = require("./routes/chat");
const paymentRoutes = require("./routes/paymentRoutes"); // <-- UPDATED here: use './routes/payment' assuming file is payment.js
const cartPaymentRoutes = require("./routes/payment");   // cart payment
const appointmentRoutes = require("./routes/appointments");
const orderRoutes = require("./routes/orderRoutes");
const confirmationEmailRoute = require("./routes/sendConfirmationEmail");

app.use("/api/auth", authRoutes);
app.use("/api/chatbot", chatbotRoutes);
app.use("/api/payment", paymentRoutes); // <-- Registered payment routes here
app.use("/api/appointments", appointmentRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api", confirmationEmailRoute); // For /api/send-confirmation-email

app.get("/api/orders/test", (req, res) => {
  res.json({ message: "Order routes test from server.js works!" });
});

app.get("/", (req, res) => {
  res.send("✅ Backend server is up and running!");
});

app.use((err, req, res, next) => {
  console.error("🔥 Global error:", err.stack);
  res.status(500).json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? "🔒 Hidden" : err.stack,
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
