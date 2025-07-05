import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import "./Cart.css";

const Cart = () => {
  const { cartItems, removeFromCart, clearCart } = useCart();
  const { login, user } = useAuth();

  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const totalAmountInRupees = cartItems.reduce(
    (acc, item) => acc + item.price * (item.quantity || 1),
    0
  );

  const openPaymentForm = () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    setShowPaymentForm(true);
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !phone.trim()) {
      alert("Please enter your name, email, and phone number.");
      return;
    }

    if (!window.Razorpay) {
      alert("Razorpay SDK not loaded. Please try again later.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartItems }),
      });

      const data = await res.json();

      if (!res.ok || !data.order) {
        alert("Failed to create payment order. Please try again.");
        setLoading(false);
        return;
      }

      const options = {
        key:
          process.env.REACT_APP_RAZORPAY_KEY_ID ||
          window.env?.REACT_APP_RAZORPAY_KEY_ID ||
          import.meta.env?.VITE_RAZORPAY_KEY_ID,
        amount: data.order.amount,
        currency: data.order.currency,
        name: "Rohini Beauty Parlour",
        description: `Payment for ${cartItems.length} products`,
        order_id: data.order.id,
        handler: async function (response) {
          try {
            const payload = {
              email,
              name,
              phone,
              paymentId: response.razorpay_payment_id,
              cartItems: cartItems.map((item) => ({
                id: item.id || "",
                name: item.name,
                price: item.price,
                quantity: item.quantity || 1,
              })),
            };

            const completeRes = await fetch(
              "http://localhost:5000/api/orders/complete-cart",
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
              }
            );

            const result = await completeRes.json();

            if (!completeRes.ok) {
              alert(
                "Payment succeeded but failed to send confirmation email or save orders."
              );
              console.error("Failed grouped invoice or DB save:", result);
              setLoading(false);
              return;
            }

            alert("✅ Payment successful! Confirmation email sent.");

            login("dummy-token", { email, name });

            localStorage.setItem(
              "cartInvoiceData",
              JSON.stringify({
                customerName: name,
                customerEmail: email,
                customerPhone: phone,
                paymentId: response.razorpay_payment_id,
                cartItems: cartItems.map((item) => ({
                  name: item.name,
                  price: item.price,
                  quantity: item.quantity || 1,
                })),
                totalAmount: totalAmountInRupees,
              })
            );

            localStorage.setItem("userEmail", email);

            clearCart();
            setShowPaymentForm(false);
            setLoading(false);
            window.location.href = "/thank-you?source=cart";
          } catch (err) {
            console.error("Error completing payment:", err);
            alert("Payment succeeded but something went wrong.");
            setLoading(false);
          }
        },
        prefill: {
          name,
          email,
          contact: phone,
        },
        theme: { color: "#F37254" },
      };

      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", function (response) {
        alert("❌ Payment failed: " + response.error.description);
        setLoading(false);
      });

      rzp.open();
    } catch (err) {
      console.error("Error in payment flow:", err);
      alert("Something went wrong during payment.");
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div style={{ padding: "10rem", textAlign: "center" }}>
        <h2>Your cart is empty.</h2>
        <a href="/buy-products" className="go-shopping-btn">
          Go Shopping
        </a>
      </div>
    );
  }

  const buyNowLabel =
    cartItems.length === 1
      ? "Buy 1 Product"
      : `Buy All ${cartItems.length} Products`;

  return (
    <div className="cart-page">
      <h2 className="cart-heading">Your Shopping Cart</h2>

      <div className="cart-items">
        {cartItems.map((item) => (
          <div key={item.id} className="cart-item">
            <img src={item.image} alt={item.name} className="cart-item-image" />
            <div className="cart-item-info">
              <h3 className="cart-item-name">{item.name}</h3>
              <p className="cart-item-price">₹{item.price}</p>
              <p>Quantity: {item.quantity || 1}</p>
              <button
                onClick={() => removeFromCart(item.id)}
                className="remove-btn"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <p>Total: ₹{totalAmountInRupees.toFixed(2)}</p>
        <button className="buy-now-btn" onClick={openPaymentForm} disabled={loading}>
          {loading ? "Processing..." : buyNowLabel}
        </button>
      </div>

      {showPaymentForm && (
        <div className="payment-form-overlay">
          <form onSubmit={handlePaymentSubmit} className="payment-form">
            <h3>Enter Your Details</h3>
            <input
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={loading}
            />
            <input
              type="email"
              placeholder="Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
            <input
              type="tel"
              placeholder="Your Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              disabled={loading}
            />
            <div className="buttons">
              <button className="pay-btn" type="submit" disabled={loading}>
                {loading ? "Processing..." : "Pay Now"}
              </button>
              <button
                className="cancel-btn"
                type="button"
                onClick={() => {
                  setShowPaymentForm(false);
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Cart;
