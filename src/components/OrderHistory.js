import React, { useEffect, useState } from "react";
import axios from "axios";
import "./OrderHistory.css";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get email ONLY from localStorage (from payment)
  const email = localStorage.getItem("userEmail");

  useEffect(() => {
    const fetchOrders = async () => {
      if (!email) {
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`http://localhost:5000/api/orders/history/${email}`);
        setOrders(res.data.orders || []);
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [email]);

  if (!email) {
    return <p>🔐 No email found. Please complete a purchase first.</p>;
  }

  if (loading) {
    return <p>🔄 Fetching your orders...</p>;
  }

  if (orders.length === 0) {
    return <p>🫤 You haven't ordered anything yet.</p>;
  }

  return (
    <div className="order-history">
      <h2>📦 Your Order History</h2>
      {orders.map((order) => (
        <div className="order-card" key={order._id}>
          <p><strong>🧾 Order ID:</strong> {order._id}</p>
          <p><strong>📅 Ordered On:</strong> {new Date(order.date).toLocaleString()}</p>
          <p><strong>💰 Total Amount:</strong> ₹{order.amount}</p>
          <p><strong>🆔 Payment ID:</strong> {order.paymentId}</p>

          <h4>🛒 Products:</h4>
          <ul>
            {order.products && Array.isArray(order.products) ? (
              order.products.map((product, i) => (
                <li key={i}>
                  {product.productName} — {product.quantity} × ₹{product.unitPrice} = ₹{product.totalPrice}
                </li>
              ))
            ) : (
              <li>No products found</li>
            )}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default OrderHistory;
