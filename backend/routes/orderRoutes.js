const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const sendGroupedInvoiceEmail = require("../utils/sendGroupedInvoiceEmail");
const sendPaymentConfirmationEmail = require("../utils/sendPaymentConfirmationEmail");
const path = require("path");
const fs = require("fs");

// POST single product order
router.post("/create", async (req, res) => {
  try {
    const {
      productId,
      productName,
      quantity,
      amount,
      paymentId,
      customerName,
      customerEmail,
      customerPhone,
    } = req.body;

    if (
      !productId ||
      !productName ||
      !quantity ||
      !amount ||
      !paymentId ||
      !customerName ||
      !customerEmail ||
      !customerPhone
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const unitPrice = amount / quantity;

    const newOrder = new Order({
      products: [
        {
          productId,
          productName,
          quantity,
          unitPrice,
          totalPrice: amount,
        },
      ],
      amount,
      paymentId,
      customerName,
      customerEmail,
      customerPhone,
      source: "single",
    });

    const savedOrder = await newOrder.save();

    await sendPaymentConfirmationEmail({
      email: customerEmail,
      bookingId: paymentId,
      productName,
      customerName,
      customerPhone,
      quantity,
      unitPrice,
      totalAmount: amount,
    });

    console.log("✅ Email sent for single product order.");

    res.status(200).json({
      message: "Single product order saved and email sent",
      orderId: savedOrder._id,
    });
  } catch (error) {
    console.error("❌ Error in /create:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

// POST complete-cart
router.post("/complete-cart", async (req, res) => {
  try {
    const { email, name: customerName, phone: customerPhone, paymentId, cartItems } = req.body;

    if (
      !email ||
      !customerName ||
      !customerPhone ||
      !paymentId ||
      !Array.isArray(cartItems) ||
      cartItems.length === 0
    ) {
      return res.status(400).json({ message: "Missing or invalid required fields" });
    }

    const products = cartItems.map((item) => ({
      productId: item.id || "",
      productName: item.name,
      quantity: item.quantity || 1,
      unitPrice: item.price,
      totalPrice: item.price * (item.quantity || 1),
    }));

    const totalAmount = products.reduce((sum, p) => sum + p.totalPrice, 0);

    const newOrder = new Order({
      products,
      amount: totalAmount,
      paymentId,
      customerName,
      customerEmail: email,
      customerPhone,
      source: "cart",
    });

    const savedOrder = await newOrder.save();

    await sendGroupedInvoiceEmail({
      recipientEmail: email,
      invoiceId: paymentId,
      customerName,
      customerEmail: email,
      customerPhone,
      products,
      totalAmount,
    });

    console.log("✅ Grouped email sent from /complete-cart route.");

    res.status(200).json({
      message: "Grouped order saved and email sent",
      orderId: savedOrder._id,
    });
  } catch (error) {
    console.error("❌ Error in /complete-cart:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

// GET invoice download
router.get("/invoices/download/:invoiceId", (req, res) => {
  const invoiceId = req.params.invoiceId;
  const filePath = path.join(__dirname, `../utils/grouped_invoice_${invoiceId}.pdf`);

  if (fs.existsSync(filePath)) {
    res.download(filePath);
  } else {
    res.status(404).send("Invoice not found");
  }
});

// FIXED: GET order history (correct HTTP method and route)
router.get("/history/:email", async (req, res) => {
  try {
    const email = req.params.email;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const orders = await Order.find({ customerEmail: email }).sort({ date: -1 });
    res.status(200).json({ orders });
  } catch (err) {
    console.error("❌ Error fetching order history:", err);
    res.status(500).json({ message: "Server error while fetching orders" });
  }
});

module.exports = router;
