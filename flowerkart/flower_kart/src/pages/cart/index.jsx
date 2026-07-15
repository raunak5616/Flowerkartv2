import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreditCardIcon, MapPinIcon, ShoppingBagIcon, ShieldCheckIcon, TruckIcon } from "@heroicons/react/24/outline";
import { CartCard } from "../../components/cartCard";
import { useCart } from "../../context/card.context/useCartContext.js";
import { useAuth } from "../../context/auth.context";
import { useLocationContext } from "../../context/locationContext/useLocationContext";
import EmptyState from "../../components/ui/EmptyState";
import Toast from "../../components/ui/Toast";

export const Cart = () => {
  const navigate = useNavigate();
  const { cart } = useCart();
  const { user } = useAuth();
  const { address, coordinates } = useLocationContext();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type }), 2800);
  };

  const handlePayment = async () => {
    if (cart.length === 0) {
      showToast("Your cart is empty.", "error");
      return;
    }

    if (!address || address === "Select Location") {
      showToast("Please set your delivery location from the navbar.", "error");
      return;
    }

    setLoading(true);

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
        name: "FlowerKart",
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
            showToast("Payment successful. Your order is confirmed.");
          } else {
            showToast("Payment failed. Please try again.", "error");
          }
        },
        theme: { color: "#e11d48" },
        modal: {
          ondismiss: async function () {
            setLoading(false);
            try {
              await axios.post(
                `${import.meta.env.VITE_API_URL}/update-payment-status`,
                { razorpay_order_id: order.id, status: "Cancelled" },
                { headers: { "Content-Type": "application/json" } }
              );
            } catch (err) {
              console.error(err);
            }
            showToast("Payment cancelled.", "error");
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment Error:", error);
      setLoading(false);
      showToast("Something went wrong while starting payment.", "error");
    }
  };

  if (cart.length === 0) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-16">
        <EmptyState
          icon={ShoppingBagIcon}
          title="Your cart is empty"
          description="Add fresh flowers, plants, or gifts to start your checkout."
          actionLabel="Browse products"
          onAction={() => navigate("/products")}
        />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8">
      <Toast {...toast} />
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.3em] text-rose-500">Secure checkout</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-gray-950">Review your cart</h1>
          </div>
          <div className="flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-bold text-gray-600 shadow-sm">
            <ShieldCheckIcon className="h-5 w-5 text-emerald-600" />
            Razorpay secure payment
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_390px]">
          <section className="rounded-3xl border border-gray-100 bg-white p-4 shadow-sm md:p-6">
            <div className="mb-5 flex items-center justify-between border-b border-gray-100 pb-4">
              <h2 className="text-lg font-black text-gray-950">Items ({cart.length})</h2>
              <button
                type="button"
                onClick={() => navigate("/products")}
                className="text-sm font-bold text-rose-600 hover:text-rose-700"
              >
                Add more
              </button>
            </div>
            <div className="space-y-4">
              {cart.map((item) => (
                <CartCard key={item._id} item={item} />
              ))}
            </div>
          </section>

          <aside className="h-fit rounded-3xl border border-gray-100 bg-white p-5 shadow-sm lg:sticky lg:top-24">
            <h2 className="text-lg font-black text-gray-950">Order summary</h2>

            <div className="mt-5 rounded-2xl bg-gray-50 p-4">
              <div className="flex gap-3">
                <MapPinIcon className="mt-0.5 h-5 w-5 flex-none text-rose-600" />
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-gray-400">Deliver to</p>
                  <p className="mt-1 text-sm font-bold leading-6 text-gray-700">{address || "Select Location"}</p>
                </div>
              </div>
            </div>

            <div className="mt-5 space-y-3 text-sm font-bold text-gray-600">
              {cart.map((item) => (
                <div className="flex justify-between gap-4" key={item._id}>
                  <span className="line-clamp-1">{item.name || item.title} x {item.qty}</span>
                  <span className="text-gray-950">₹{item.price * item.qty}</span>
                </div>
              ))}
              <div className="border-t border-gray-100 pt-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-gray-950">₹{subtotal}</span>
                </div>
              </div>
              <div className="flex justify-between text-emerald-600">
                <span>Delivery</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between border-t border-gray-100 pt-3 text-lg text-gray-950">
                <span>Total</span>
                <span>₹{subtotal}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handlePayment}
              disabled={loading}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-gray-950 px-6 py-4 text-sm font-black text-white shadow-xl shadow-gray-200 transition hover:-translate-y-0.5 hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <CreditCardIcon className="h-5 w-5" />
              {loading ? "Processing..." : "Proceed to payment"}
            </button>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-rose-50 p-3 text-xs font-bold text-rose-700">
                <TruckIcon className="mb-2 h-5 w-5" />
                Fast local delivery
              </div>
              <div className="rounded-2xl bg-emerald-50 p-3 text-xs font-bold text-emerald-700">
                <ShieldCheckIcon className="mb-2 h-5 w-5" />
                Protected checkout
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
};
