import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import products from "../data/products";
import productDescriptions from "../data/productDescription";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "./BuyNow.css";

const BuyNow = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const product = products.find((p) => p.id === productId);
  const descriptionData = productDescriptions[product?.id];
  const { addToCart } = useCart();
  const { login } = useAuth();

  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentId, setPaymentId] = useState("");

  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [showCustomerForm, setShowCustomerForm] = useState(false);

  const key =
    process.env.REACT_APP_RAZORPAY_KEY_ID ||
    (import.meta.env && import.meta.env.VITE_RAZORPAY_KEY_ID);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => document.body.removeChild(script);
  }, []);

  if (!product) return <div className="not-found">Product not found.</div>;

  const amountInRupees = product.price * quantity;

  const handleAddToCart = () => {
    addToCart({ ...product, quantity });
    alert("Item added to cart!");
  };

  const handleInitialBuyNowClick = () => {
    setShowCustomerForm(true);
  };

  const handleConfirmPayment = async () => {
    if (!customerName || !customerEmail || !customerPhone) {
      alert("Please fill all customer information fields.");
      return;
    }

    if (!key) {
      alert("❌ Razorpay key not found. Check your .env file.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: amountInRupees, name: product.name }),
      });

      const data = await response.json();

      if (!data.success || !data.order) {
        alert("❌ Payment initiation failed. Please try again.");
        setLoading(false);
        return;
      }

      const options = {
        key,
        amount: data.order.amount,
        currency: "INR",
        name: "Rohini Beauty Parlour",
        description: `${product.name} × ${quantity} - ₹${amountInRupees.toFixed(2)}`,
        image: "/images/logo.png",
        order_id: data.order.id,
        handler: async function (response) {
          setPaymentSuccess(true);
          setPaymentId(response.razorpay_payment_id);
          setLoading(false);

          login("dummy-token", { email: customerEmail, name: customerName });
          localStorage.setItem("userEmail", customerEmail);

          alert("✅ Payment successful!\nPayment ID: " + response.razorpay_payment_id);

          try {
            const orderRes = await fetch("http://localhost:5000/api/orders/create", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                productId: product.id,
                productName: product.name,
                quantity,
                amount: amountInRupees,
                paymentId: response.razorpay_payment_id,
                customerName,
                customerEmail,
                customerPhone,
              }),
            });

            const result = await orderRes.json();
            if (!orderRes.ok)
              console.error("❌ Order saving failed:", result.message || result);
            else console.log("✅ Order and email handled successfully.");
          } catch (err) {
            console.error("❌ Error saving order:", err);
          }
        },
        prefill: {
          name: customerName,
          email: customerEmail,
          contact: customerPhone,
        },
        method: {
          netbanking: true,
          card: true,
          upi: true,
          wallet: true,
        },
        theme: {
          color: "#F37254",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (response) {
        setLoading(false);
        alert("❌ Payment failed: " + response.error.description);
      });

      rzp.open();
    } catch (error) {
      setLoading(false);
      alert("❌ Something went wrong during payment.");
      console.error("❌ Razorpay error:", error);
    }
  };

  const generateInvoicePDF = () => {
    const doc = new jsPDF();
    const date = new Date().toLocaleString();

    doc.setFontSize(18);
    doc.text("Rohini Beauty Parlour - Invoice", 20, 20);
    doc.setFontSize(12);
    doc.text(`Invoice ID: ${paymentId}`, 20, 30);
    doc.text(`Date: ${date}`, 20, 38);
    doc.text(`Customer Name: ${customerName}`, 20, 46);
    doc.text(`Email: ${customerEmail}`, 20, 54);
    doc.text(`Phone: ${customerPhone}`, 20, 62);

    autoTable(doc, {
      startY: 70,
      head: [["Product", "Quantity", "Unit Price", "Total"]],
      body: [[product.name, quantity, `₹${product.price}`, `₹${amountInRupees.toFixed(2)}`]],
    });

    const finalY = doc.lastAutoTable?.finalY || 90;
    doc.text("Signed by Rohini Beauty Parlour", 20, finalY + 20);
    doc.save("invoice.pdf");
  };

  if (paymentSuccess) {
    return (
      <div className="thank-you-page">
        <h2>🎉 Thank You for Your Purchase!</h2>
        <p>
          Your order for <strong>{product.name}</strong> has been placed.
        </p>
        <p>You can collect your product from Rohini Beauty Parlour.</p>
        <p>A confirmation email with the invoice has been sent to your registered email ID.</p>

        <div className="invoice">
          <h3>Invoice / Receipt</h3>
          <p><strong>Customer Name:</strong> {customerName}</p>
          <p><strong>Email:</strong> {customerEmail}</p>
          <p><strong>Phone:</strong> {customerPhone}</p>
          <p><strong>Product:</strong> {product.name}</p>
          <p><strong>Quantity:</strong> {quantity}</p>
          <p><strong>Total Amount:</strong> ₹{amountInRupees.toFixed(2)}</p>

          <button onClick={generateInvoicePDF} className="download-invoice-btn">
            📄 Download Invoice
          </button>
          <button
            onClick={() => navigate("/order-history")}
            className="view-orders-button"
           style={{ marginTop: "10px" }}
          >
            📦 View Order History
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="buy-now-page">
      <div className="product-image-section">
        <img src={product.image} alt={product.name} />
      </div>

      <div className="product-details-section">
        <h2>{product.name}</h2>

        {/* Product Description Rendering */}
        {descriptionData ? (
          <div className="product-description amazon-style">
            <div className="features-box">
              <h3 className="section-heading">Key Features</h3>
              <ul className="feature-list">
                {(descriptionData.features || descriptionData.shortHighlights || []).map(
                  (feat, idx) => (
                    <li key={idx}>{feat}</li>
                  )
                )}
              </ul>
            </div>
            <div className="about-box">
              <h3 className="section-heading">About this item</h3>
              <p className="about-text">
                {descriptionData.about || descriptionData.detailed}
              </p>
            </div>
          </div>
        ) : (
          <p className="product-description">{product.description}</p>
        )}

        <div className="quantity-selector">
          <label>Quantity:</label>
          <div className="stepper">
            <button onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}>−</button>
            <span>{quantity}</span>
            <button onClick={() => setQuantity((prev) => prev + 1)}>+</button>
          </div>
        </div>

        {!showCustomerForm ? (
          <>
            <button
              className="buy-now-button"
              onClick={handleInitialBuyNowClick}
              disabled={loading}
            >
              Buy Now
            </button>
            <button className="add-to-cart-button" onClick={handleAddToCart}>
              Add to Cart
            </button>
          </>
        ) : (
          <div className="customer-info">
            <input
              type="text"
              placeholder="Your Name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Email Address"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              required
            />
            <input
              type="tel"
              placeholder="Phone Number"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              required
            />
            <button
              className="buy-now-button"
              onClick={handleConfirmPayment}
              disabled={loading}
              style={{ marginTop: "12px" }}
            >
              {loading ? "Processing..." : "Confirm & Pay"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BuyNow;
