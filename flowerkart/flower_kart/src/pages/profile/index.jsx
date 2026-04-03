import { useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/auth.context";
import { useEffect } from "react";
import { getProfile, updateProfile } from "../../apiCalls/productapi";
import { motion, AnimatePresence } from "framer-motion";
export default function Profile() {
  const { logout, user: authUser } = useAuth();
  const navigater = useNavigate();
  const [popup, setpopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ message: "", type: "", show: false });
  const [image, setimage] = useState(null);
  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  useEffect(() => {
    const userId = authUser?._id;
    if (!userId) return;

    const fetchProfile = async (id) => {
      const data = await getProfile(id);
      setUser(data || { name: "", email: "", phone: "", address: "" });
    };
    const fetchOrders = async (id) => {
      try {
        console.log("Fetching orders for userId:", id);
        const token = localStorage.getItem("token");
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/orders/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log("Orders received:", response.data);
        setOrders(response.data);
      } catch (err) {
        console.error("Error fetching orders:", err);
      }
    };

    fetchProfile(userId);
    fetchOrders(userId);
  }, [authUser]);
  const handleSave = async (e) => {
    e.preventDefault();
    const formdata = new FormData();
    formdata.append("name", user.name);
    formdata.append("email", user.email);
    formdata.append("phone", user.phone);
    formdata.append("address", user.address);

    if (image) {
      formdata.append("images", image);
    }
    try {
      setLoading(true);
      const response = await updateProfile(authUser._id, formdata);
      setNotification({ message: response.message || "Profile updated successfully!", type: "success", show: true });
      setpopup(false);

      // Refresh profile data
      const updatedData = await getProfile(authUser._id);
      setUser(updatedData || user);

      // Auto-hide notification after 3s
      setTimeout(() => setNotification({ message: "", type: "", show: false }), 3000);
    } catch (err) {
      if (err.response?.status === 401) {
        setNotification({ message: "Session expired. Please login again.", type: "error", show: true });
        logout();
        navigater("/login");
        console.log("error updating profile❌❌:", err);
      } else {
        setNotification({ message: err.response?.data?.message || err.message || "Failed to update profile.", type: "error", show: true });
      }
      setTimeout(() => setNotification({ message: "", type: "", show: false }), 3000);
    } finally {
      setLoading(false);
    }
  }
  const handleCloseDetails = () => {
    setShowOrderDetails(false);
    setSelectedOrder(null);
  }
  return (
    <div className="relative">
      {/* MAIN CONTENT (Blurred when any popup is open) */}
      <div className={`min-h-screen bg-gray-50 p-6 transition-all duration-300 ${showOrderDetails || popup ? "pointer-events-none" : ""}`}>
        <div className="max-w-5xl mx-auto">
          {/* PROFILE HEADER */}
          <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col md:flex-row items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-red-100 flex items-center justify-center text-red-600 text-3xl font-bold overflow-hidden">
              {user?.images?.url ? (
                <img src={user.images.url} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                user?.name?.charAt(0) || "U"
              )}
            </div>

            <div className="text-center md:text-left">
              <h2 className="text-2xl font-semibold text-gray-800">{user.name}</h2>
              <p className="text-gray-500">{user.email}</p>
              <button
                className="mt-3 bg-red-gradient text-white px-4 py-1 rounded-md hover:opacity-90 transition"
                onClick={() => setpopup(true)}
              >
                Edit Profile
              </button>
            </div>
          </div>

          {/* PROFILE DETAILS */}
          <div className="grid md:grid-cols-2 gap-6 mt-8">
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-500">Full Name</label>
                  <input type="text" value={user?.name || ""} className="w-full border rounded-md p-2 mt-1 bg-gray-50" readOnly />
                </div>
                <div>
                  <label className="text-sm text-gray-500">Email</label>
                  <input type="email" value={user?.email || ""} className="w-full border rounded-md p-2 mt-1 bg-gray-50" readOnly />
                </div>
                <div>
                  <label className="text-sm text-gray-500">Phone</label>
                  <input type="text" value={user?.phone || ""} className="w-full border rounded-md p-2 mt-1 bg-gray-50" readOnly />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Delivery Address</h3>
              <textarea rows="5" value={user?.address || ""} className="w-full border rounded-md p-3 bg-gray-50" readOnly />
              <button className="mt-4 bg-red-gradient text-white px-4 py-2 rounded-md hover:opacity-90 transition">
                Change Address
              </button>
            </div>
          </div>

          {/* ORDER HISTORY */}
          <div className="bg-white rounded-2xl shadow-md p-6 mt-8">
            <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>
            <div className="space-y-3">
              {orders.length > 0 ? (
                orders.map((order) => (
                  <div key={order._id} className="flex justify-between items-center border-b pb-3 hover:bg-gray-50 p-2 rounded-lg transition">
                    <div>
                      <p className="font-medium text-gray-800">Order #{order.razorpay_order_id?.slice(-6).toUpperCase() || "N/A"}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()} • ₹{order.amount}
                      </p>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full ${order.status === "Success" ? "bg-green-100 text-green-700" :
                        order.status === "Pending" ? "bg-yellow-100 text-yellow-700" :
                          "bg-red-100 text-red-700"
                        }`}>
                        {order.status}
                      </span>
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowOrderDetails(true);
                        }}
                        className="text-red-500 text-xs mt-1 hover:underline"
                      >
                        Details
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-gray-500 italic">No orders found yet.</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* EDIT PROFILE POPUP (OUTSIDE BLUR) */}
      {popup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex justify-center items-center z-[60] p-4">
          <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
            <input
              type="text"
              placeholder="Name"
              value={user?.name || ""}
              onChange={(e) => setUser({ ...user, name: e.target.value })}
              className="w-full border p-2 mb-3 rounded focus:ring-2 focus:ring-red-500 outline-none"
            />
            <input
              type="email"
              placeholder="Email"
              value={user?.email || ""}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              className="w-full border p-2 mb-3 rounded focus:ring-2 focus:ring-red-500 outline-none"
            />
            <input
              type="text"
              placeholder="Phone"
              value={user?.phone || ""}
              onChange={(e) => setUser({ ...user, phone: e.target.value })}
              className="w-full border p-2 mb-3 rounded focus:ring-2 focus:ring-red-500 outline-none"
            />
            <textarea
              placeholder="Address"
              value={user?.address || ""}
              onChange={(e) => setUser({ ...user, address: e.target.value })}
              className="w-full border p-2 mb-3 rounded focus:ring-2 focus:ring-red-500 outline-none"
            />
            <input
              type="file"
              onChange={(e) => setimage(e.target.files[0])}
              className="block w-full text-sm text-red-600 mb-4 cursor-pointer"
            />
            <div className="flex justify-end gap-2">
              <button 
                onClick={() => setpopup(false)} 
                disabled={loading}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave} 
                disabled={loading}
                className="px-4 py-2 bg-red-gradient text-white rounded-lg hover:opacity-90 transition min-w-[80px] flex items-center justify-center disabled:opacity-75"
              >
                {loading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                  />
                ) : (
                  "Save"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NOTIFICATION TOAST */}
      <AnimatePresence>
        {notification.show && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 20, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            className={`fixed top-4 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 backdrop-blur-md border ${
              notification.type === "success" 
                ? "bg-green-500/90 text-white border-green-400" 
                : "bg-red-500/90 text-white border-red-400"
            }`}
          >
            <span className="material-symbols-outlined">
              {notification.type === "success" ? "check_circle" : "error"}
            </span>
            <span className="font-semibold">{notification.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ORDER DETAILS POPUP (OUTSIDE BLUR) */}
      {showOrderDetails && selectedOrder && (
        <div className="fixed inset-0 flex justify-center items-center z-[70] p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-md" onClick={handleCloseDetails}></div>
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl relative z-10 overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="bg-red-gradient p-6 text-white flex justify-between items-center">
              <h3 className="text-xl font-bold">Order Summary</h3>
              <button onClick={handleCloseDetails} className="text-white hover:rotate-90 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold">Order ID</p>
                  <p className="font-mono text-xs">{selectedOrder.razorpay_order_id}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold">Status</p>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${selectedOrder.status === "Success" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                    }`}>
                    {selectedOrder.status}
                  </span>
                </div>
              </div>

              {selectedOrder.razorpay_payment_id && (
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold">Payment ID</p>
                  <p className="font-mono text-xs">{selectedOrder.razorpay_payment_id}</p>
                </div>
              )}

              <div className="border-t pt-4">
                <p className="text-xs text-gray-500 uppercase font-bold mb-2">Items</p>
                <div className="space-y-2">
                  {selectedOrder.items?.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm bg-gray-50 p-2 rounded">
                      <span>{item.name || item.title} (x{item.quantity || 1})</span>
                      <span className="font-bold">₹{item.price}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4 flex justify-between items-center">
                <p className="text-lg font-bold">Total</p>
                <p className="text-2xl font-black text-red-600">₹{selectedOrder.amount}</p>
              </div>
            </div>

            <div className="p-4 bg-gray-50 border-t flex justify-end">
              <button onClick={handleCloseDetails} className="bg-red-gradient text-white px-6 py-2 rounded-lg font-bold">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
