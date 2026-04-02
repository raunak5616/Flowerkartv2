import axios from "axios";
import { CartCard } from "../../components/cartCard";
import { useCart } from "../../context/card.context/useCartContext.js";
import { useState } from "react";
import { useAuth } from "../../context/auth.context";
import { useLocationContext } from "../../context/locationContext/useLocationContext";

export const Cart = () => {
  const { cart } = useCart();
  const { user } = useAuth();
  const { address, coordinates } = useLocationContext();
  const [loading, setLoading] = useState(false);
  const subtotal = cart.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  console.log("Cart Items:", cart);
  const handlePayment = async () => {
    if (cart.length === 0) {
      alert("Cart is empty");
      return;
    }
    setLoading(true);

    if (!address || address === "Select Location") {
      alert("Please provide a delivery address by setting your location in the top menu.");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/create-order`,
        { amount: subtotal, userId: user?._id, cartItems: cart, deliveryAddress: address, coordinates },
        { headers: { "Content-Type": "application/json" } }
      );

      const order = res.data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: "INR",
        name: "My E-Commerce",
        description: "Order Payment",
        order_id: order.id,

        handler: async function (response) {
          setLoading(false);
          const verifyRes = await axios.post(
            `${import.meta.env.VITE_API_URL}/verify-payment`,
            { ...response },
            { headers: { "Content-Type": "application/json" } }
          );

          if (verifyRes.data.success) {
            alert("Payment Successful ✅");
          } else {
            alert("Payment Failed ❌");
          }
        },

        theme: {
          color: "#3399cc"
        },
        modal: {
          ondismiss: async function () {
            setLoading(false);
            try {
              await axios.post(
                `${import.meta.env.VITE_API_URL}/update-payment-status`,
                { razorpay_order_id: order.id, status: "Cancelled" },
                { headers: { "Content-Type": "application/json" } }
              );
            } catch (err) { }
            alert("Payment Cancelled ❌");
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment Error:", error);
      alert("Something went wrong");
    }
  };


  return (
    <>
      <style>
        {`
.pay-btn.loading {
  position: relative;
  pointer-events: none;
}

.pay-btn.loading::after {
  content: "";
  width: 18px;
  height: 18px;
  border: 3px solid white;
  border-top: 3px solid transparent;
  border-radius: 50%;
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  from {
    transform: translateY(-50%) rotate(0deg);
  }
  to {
    transform: translateY(-50%) rotate(360deg);
  }
}
`}
      </style>
      <div className="cart-page">
        <div className="cart-left">
          <h2 className="section-title">Your Cart</h2>
          <div className="cart-items">
            {cart.length > 0 ? (
              cart.map((item) => (
                <CartCard key={item._id} item={item} />
              ))
            ) : (
              <p>Your cart is empty</p>
            )}
          </div>
        </div>
        <div className="cart-right">
          <h2 className="section-title">Order Summary</h2>
          <div className="summary-card">
            {cart.map((item) => (
              <div className="summary-row" key={item._id}>
                <span>
                  ({item.title} × {item.qty})
                </span>
                <span>₹{item.price * item.qty}</span>
              </div>
            ))}
            <hr />
            <div className="summary-row">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>
            <div className="summary-row">
              <span>Delivery</span>
              <span className="green">FREE</span>
            </div>
            <div className="summary-row">
              <span>Discount</span>
              <span className="green">− ₹0</span>
            </div>
            <hr />
            <div className="summary-row total">
              <span>Total Amount</span>
              <span>₹{subtotal}</span>
            </div>
            <button
              className={`pay-btn ${loading ? "loading" : ""}`}
              onClick={handlePayment}
              disabled={loading}
            >{loading ? "Processing" : "Proceed to Payment"}</button>
          </div>
        </div>
      </div>
    </>
  );
};
