import axios from "axios";
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  CreditCard, 
  MapPin, 
  ShoppingBag, 
  ShieldCheck, 
  Truck, 
  Trash2, 
  Percent, 
  ChevronRight, 
  Sparkles,
  ArrowRight,
  RefreshCcw,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";
import { CartCard } from "../../components/cartCard";
import { useCart } from "../../context/card.context/useCartContext.js";
import { useAuth } from "../../context/auth.context";
import { useLocationContext } from "../../context/locationContext/useLocationContext";
import EmptyState from "../../components/ui/EmptyState";
import Toast from "../../components/ui/Toast";
import { getProducts } from "../../apiCalls/productapi";
import RecipeReviewCard from "../../components/productCard";

export const Cart = () => {
  const navigate = useNavigate();
  const { cart } = useCart();
  const { user } = useAuth();
  const { address, coordinates } = useLocationContext();
  
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  
  // Custom states for premium UX
  const [couponCode, setCouponCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");
  const [currentStep, setCurrentStep] = useState(1); // 1: Cart, 2: Delivery, 3: Payment
  const [recommended, setRecommended] = useState([]);

  // Fetch recommendations
  useEffect(() => {
    getProducts()
      .then((data) => {
        // Recommend items not in cart
        const cartIds = cart.map(i => i._id);
        const filtered = (data || []).filter(p => !cartIds.includes(p._id)).slice(0, 4);
        setRecommended(filtered);
      })
      .catch((err) => console.error("Error loading recommendations", err));
  }, [cart]);

  const subtotal = useMemo(() => cart.reduce((acc, item) => acc + item.price * item.qty, 0), [cart]);
  const discountAmount = useMemo(() => Math.round((subtotal * discountPercent) / 100), [subtotal, discountPercent]);
  const finalTotal = useMemo(() => subtotal - discountAmount, [subtotal, discountAmount]);

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type }), 2800);
  };

  // Simulate coupon validation
  const handleApplyCoupon = () => {
    setCouponError("");
    setCouponSuccess("");
    if (!couponCode.trim()) return;

    if (couponCode.toUpperCase() === "FRESH10") {
      setDiscountPercent(10);
      setCouponSuccess("Promo code 'FRESH10' applied! 10% discount subtracted.");
    } else if (couponCode.toUpperCase() === "BLOOM20") {
      setDiscountPercent(20);
      setCouponSuccess("Promo code 'BLOOM20' applied! 20% discount subtracted.");
    } else {
      setCouponError("Invalid coupon code. Try 'FRESH10' or 'BLOOM20'.");
    }
  };

  const handlePayment = async () => {
    if (cart.length === 0) {
      showToast("Your cart is empty.", "error");
      return;
    }

    if (!address || address === "Select Location") {
      showToast("Please set your delivery location in the navbar.", "error");
      return;
    }

    setLoading(true);

    try {
      // Keep exact parameters and API endpoints as backend expects them
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/create-order`,
        { 
          amount: finalTotal, // pass computed total
          userId: user?._id, 
          cartItems: cart, 
          deliveryAddress: address, 
          coordinates 
        },
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
            showToast("Payment successful! Your order has been confirmed.");
            // Navigate to profile or dashboard after small delay to let user realize success
            setTimeout(() => navigate("/profile"), 2500);
          } else {
            showToast("Payment verification failed. Please check with bank.", "error");
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
      <main className="min-h-screen bg-gray-50/50 px-6 py-16 text-center">
        <EmptyState
          icon={ShoppingBag}
          title="Your cart is empty"
          description="Add premium local florist flowers, live plants, or customized vases to start your checkout."
          actionLabel="Browse Catalog"
          onAction={() => navigate("/products")}
        />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50/50 px-6 py-10 text-left">
      <Toast {...toast} />
      <div className="mx-auto max-w-7xl">
        
        {/* Step-by-Step Progress Bar */}
        <div className="max-w-xl mx-auto mb-10 flex items-center justify-between text-xs font-black uppercase tracking-widest text-gray-400">
          <div className="flex flex-col items-center gap-2">
            <div className={`h-8 w-8 rounded-full flex items-center justify-center border font-bold ${
              currentStep >= 1 ? "bg-gray-950 text-white border-gray-950 shadow-md shadow-gray-200" : "bg-white border-gray-200"
            }`}>
              1
            </div>
            <span className={currentStep >= 1 ? "text-gray-900 font-black" : ""}>Cart Review</span>
          </div>

          <div className="flex-1 h-0.5 bg-gray-200 mx-4" />

          <div className="flex flex-col items-center gap-2">
            <div className={`h-8 w-8 rounded-full flex items-center justify-center border font-bold ${
              currentStep >= 2 ? "bg-gray-950 text-white border-gray-950 shadow-md shadow-gray-200" : "bg-white border-gray-200"
            }`}>
              2
            </div>
            <span className={currentStep >= 2 ? "text-gray-900 font-black" : ""}>Delivery</span>
          </div>

          <div className="flex-1 h-0.5 bg-gray-200 mx-4" />

          <div className="flex flex-col items-center gap-2">
            <div className={`h-8 w-8 rounded-full flex items-center justify-center border font-bold ${
              currentStep >= 3 ? "bg-gray-950 text-white border-gray-950 shadow-md shadow-gray-200" : "bg-white border-gray-200"
            }`}>
              3
            </div>
            <span className={currentStep >= 3 ? "text-gray-900 font-black" : ""}>Payment</span>
          </div>
        </div>

        {/* Header summary */}
        <div className="mb-8 flex flex-col gap-3.5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-rose-500">Secure transaction</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-gray-950">Review Your Cart</h1>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50/50 px-4 py-2 text-xs font-black uppercase tracking-wider text-emerald-700 shadow-sm">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            Razorpay Secure Checkout
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid gap-8 lg:grid-cols-[1fr_390px]">
          
          {/* LEFT: CART ITEMS */}
          <section className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm md:p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-gray-50 pb-4">
              <h2 className="text-base font-black text-gray-900">Blooms Selection ({cart.length})</h2>
              <button
                type="button"
                onClick={() => navigate("/products")}
                className="text-xs font-black uppercase tracking-wider text-rose-600 hover:text-rose-700"
              >
                Add more items
              </button>
            </div>
            
            <div className="space-y-4">
              {cart.map((item) => (
                <CartCard key={item._id} item={item} />
              ))}
            </div>
          </section>

          {/* RIGHT: ORDER BREAKDOWN SIDEBAR */}
          <aside className="h-fit rounded-3xl border border-gray-100 bg-white p-6 shadow-sm lg:sticky lg:top-24 space-y-6">
            
            {/* Delivery address panel */}
            <div>
              <h3 className="text-xs font-black uppercase tracking-widest text-gray-900 mb-3">Delivery Destination</h3>
              <div className="rounded-2xl bg-gray-50 border border-gray-100 p-4">
                <div className="flex gap-3">
                  <MapPin className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">Address Details</p>
                    <p className="mt-1 text-xs font-bold leading-relaxed text-gray-700 truncate">
                      {address && address !== "Select Location" ? address : "Please set delivery location in navbar."}
                    </p>
                    {(!address || address === "Select Location") && (
                      <p className="text-[10px] font-black text-amber-600 mt-1 flex items-center gap-1">
                        <AlertTriangle className="h-3.5 w-3.5" />
                        Location required for payment.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* Promo coupon input */}
            <div>
              <h3 className="text-xs font-black uppercase tracking-widest text-gray-900 mb-3">Promo / Coupon Code</h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Code (e.g. FRESH10)"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-50 flex-1 font-semibold uppercase placeholder:text-gray-400"
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  className="bg-gray-950 hover:bg-rose-600 text-white px-4 rounded-xl text-xs font-black uppercase tracking-widest transition"
                >
                  Apply
                </button>
              </div>
              {couponError && <p className="text-[10px] font-black text-red-500 mt-2">{couponError}</p>}
              {couponSuccess && <p className="text-[10px] font-black text-emerald-600 mt-2">{couponSuccess}</p>}
            </div>

            <hr className="border-gray-100" />

            {/* Price Calculator details */}
            <div className="space-y-3.5 text-xs font-bold text-gray-500">
              {cart.map((item) => (
                <div className="flex justify-between gap-4" key={item._id}>
                  <span className="line-clamp-1 text-gray-600 font-semibold">{item.name || item.title} (x{item.qty})</span>
                  <span className="font-black text-gray-950">₹{(item.price * item.qty).toLocaleString()}</span>
                </div>
              ))}
              
              <div className="border-t border-gray-100 pt-3.5 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400 font-black uppercase tracking-wider text-[10px]">Cart Subtotal</span>
                  <span className="font-black text-gray-950">₹{subtotal.toLocaleString()}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span className="font-black uppercase tracking-wider text-[10px]">Coupon Discount ({discountPercent}%)</span>
                    <span className="font-black">- ₹{discountAmount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-emerald-600">
                  <span className="font-black uppercase tracking-wider text-[10px]">Local Florist Delivery</span>
                  <span className="font-black uppercase tracking-widest text-[9px] bg-emerald-50 px-2 py-0.5 border border-emerald-100 rounded-md">Free</span>
                </div>
              </div>

              <div className="flex justify-between border-t border-gray-100 pt-3.5 text-base text-gray-950 font-black">
                <span className="uppercase tracking-widest text-xs">Total Amount</span>
                <span className="text-lg font-black text-rose-600">₹{finalTotal.toLocaleString()}</span>
              </div>
            </div>

            {/* Checkout Action Button */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handlePayment}
              disabled={loading || !address || address === "Select Location"}
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gray-950 px-6 py-4 text-xs font-black uppercase tracking-widest text-white shadow-xl shadow-gray-200 transition hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <CreditCard className="h-4.5 w-4.5" />
              {loading ? "Initializing Razorpay..." : "Pay securely now"}
            </motion.button>

            {/* Guarantee metrics */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="rounded-2xl bg-rose-50/50 border border-rose-100/30 p-3 text-[10px] font-black text-rose-700 text-center flex flex-col items-center justify-center gap-1.5 shadow-sm">
                <Truck className="h-5 w-5 text-rose-600" />
                <span>30-60m fresh delivery</span>
              </div>
              <div className="rounded-2xl bg-emerald-50/50 border border-emerald-100/30 p-3 text-[10px] font-black text-emerald-700 text-center flex flex-col items-center justify-center gap-1.5 shadow-sm">
                <ShieldCheck className="h-5 w-5 text-emerald-600" />
                <span>Encrypted payments</span>
              </div>
            </div>

          </aside>
        </div>

        {/* BOTTOM: RECOMMENDATIONS SECTION */}
        {recommended.length > 0 && (
          <section className="mt-20 border-t border-gray-100 pt-16">
            <div className="mb-8 text-left">
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-rose-500">Gifts suggestion</p>
              <h2 className="text-2xl font-black text-gray-950">Add flowers to order</h2>
            </div>
            
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {recommended.map((item) => (
                <RecipeReviewCard key={item._id} product={item} />
              ))}
            </div>
          </section>
        )}

      </div>
    </main>
  );
};
