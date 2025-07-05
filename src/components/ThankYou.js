import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "./ThankYou.css";

const ThankYou = () => {
  const [searchParams] = useSearchParams();
  const source = searchParams.get("source"); // 'cart' or 'single'
  const navigate = useNavigate();
  const [invoiceData, setInvoiceData] = useState(null);

  useEffect(() => {
    let parsed = null;

    if (source === "cart") {
      const stored = localStorage.getItem("cartInvoiceData");
      if (stored) {
        parsed = JSON.parse(stored);
        console.log("🧾 Cart Invoice Data:", parsed);
        setInvoiceData(parsed);

        // Ensure customerEmail is saved to localStorage
        if (parsed?.customerEmail) {
          localStorage.setItem("userEmail", parsed.customerEmail);
        } else {
          console.warn("❌ Missing customerEmail in cart invoice data");
        }
      }
    } else if (source === "single") {
      const stored = localStorage.getItem("singleInvoiceData");
      if (stored) {
        parsed = JSON.parse(stored);
        console.log("🧾 Single Invoice Data:", parsed);
        setInvoiceData(parsed);

        // Ensure customerEmail is saved to localStorage
        if (parsed?.customerEmail) {
          localStorage.setItem("userEmail", parsed.customerEmail);
        } else {
          console.warn("❌ Missing customerEmail in single invoice data");
        }
      }
    } else {
      console.warn("⚠️ Unknown source type:", source);
    }
  }, [source]);

  const generateInvoicePDF = () => {
    if (!invoiceData) return;

    const doc = new jsPDF();
    const date = new Date().toLocaleString();
    const {
      customerName,
      customerEmail,
      customerPhone,
      paymentId,
      totalAmount,
      cartItems,
      productName,
      quantity,
      unitPrice,
    } = invoiceData;

    doc.setFontSize(18);
    doc.text("Rohini Beauty Parlour - Invoice", 20, 20);
    doc.setFontSize(12);
    doc.text(`Invoice ID: ${paymentId}`, 20, 30);
    doc.text(`Date: ${date}`, 20, 38);
    doc.text(`Customer Name: ${customerName}`, 20, 46);
    doc.text(`Email: ${customerEmail}`, 20, 54);
    doc.text(`Phone: ${customerPhone}`, 20, 62);

    // Table
    const startY = 70;
    if (source === "cart" && cartItems) {
      const tableBody = cartItems.map((item) => [
        item.name,
        item.quantity,
        `₹${item.price}`,
        `₹${item.price * item.quantity}`,
      ]);

      autoTable(doc, {
        startY,
        head: [["Product", "Quantity", "Unit Price", "Total"]],
        body: tableBody,
      });
    } else {
      autoTable(doc, {
        startY,
        head: [["Product", "Quantity", "Unit Price", "Total"]],
        body: [[productName, quantity, `₹${unitPrice}`, `₹${totalAmount}`]],
      });
    }

    const finalY = doc.lastAutoTable?.finalY || 90;
    doc.text("Signed by Rohini Beauty Parlour", 20, finalY + 20);
    doc.save("invoice.pdf");
  };

  if (!invoiceData) {
    return (
      <p style={{ textAlign: "center", marginTop: "50px" }}>
        🔄 Loading invoice details...
      </p>
    );
  }

  return (
    <div style={{ textAlign: "center", padding: "40px" }}>
      <h2>🎉 Thank You for Your Purchase!</h2>
      <p>You can collect your items from Rohini Beauty Parlour.</p>
      <p>An invoice has been sent to your email.</p>

      <div style={{ marginTop: "20px" }}>
        <button
          className="thankyou-btn download-btn"
          onClick={generateInvoicePDF}
        >
          📄 Download Invoice
        </button>

        <button
          className="thankyou-btn orderhistory-btn"
          onClick={() => navigate("/order-history")}
        >
          📦 View Order History
        </button>
      </div>
    </div>
  );
};

export default ThankYou;
