import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Contexts
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

// Components
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import AboutUs from "./components/AboutUs";
import Services from "./components/Services";
import Gallery from "./components/Gallery";
import Register from "./components/Register";
import Login from "./components/Login";
import BuyProducts from "./components/BuyProducts";
import BuyNow from "./components/BuyNow";
import Cart from "./components/Cart";
import Appointment from "./components/Appointment";
import OrderHistory from "./components/OrderHistory";
import PrivateRoute from "./components/PrivateRoute";
import ThankYou from "./components/ThankYou";
import Allproducts from "./components/Allproducts";

// Forgot Password Flow
import ForgotPassword from "./components/ForgotPassword";
import VerifyCode from "./components/VerifyCode";
import ResetPassword from "./components/ResetPassword";

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <Navbar />
          <Routes>
            {/* Public Routes */}
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/verify-code" element={<VerifyCode />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/thank-you" element={<ThankYou />} />
            <Route path="/order-history" element={<OrderHistory />} />
            <Route path="/products" element={<Allproducts />} />

            {/* Private Routes */}
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Home />
                </PrivateRoute>
              }
            />
            <Route
              path="/about"
              element={
                <PrivateRoute>
                  <AboutUs />
                </PrivateRoute>
              }
            />
            <Route
              path="/services/:serviceName"
              element={
                <PrivateRoute>
                  <Services />
                </PrivateRoute>
              }
            />
            <Route
              path="/gallery"
              element={
                <PrivateRoute>
                  <Gallery />
                </PrivateRoute>
              }
            />
            <Route
              path="/buy-products"
              element={
                <PrivateRoute>
                  <BuyProducts />
                </PrivateRoute>
              }
            />
            <Route
              path="/buynow/:productId"
              element={
                <PrivateRoute>
                  <BuyNow />
                </PrivateRoute>
              }
            />
            <Route
              path="/cart"
              element={
                <PrivateRoute>
                  <Cart />
                </PrivateRoute>
              }
            />
            <Route
              path="/appointment"
              element={
                <PrivateRoute>
                  <Appointment />
                </PrivateRoute>
              }
            />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
