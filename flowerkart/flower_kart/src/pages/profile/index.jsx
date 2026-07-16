import { useState, useEffect, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User as UserIcon, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  CreditCard, 
  ShoppingBag, 
  Edit3, 
  LogOut, 
  X, 
  CheckCircle2, 
  AlertTriangle,
  ArrowUpRight,
  Upload,
  Clock,
  Sparkles
} from "lucide-react";
import axios from "axios";
import { useAuth } from "../../context/auth.context";
import { getProfile, updateProfile } from "../../apiCalls/productapi";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";

export default function Profile() {
  const { logout, user: authUser } = useAuth();
  const navigate = useNavigate();

  const [popup, setpopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ message: "", type: "", show: false });
  const [image, setimage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

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
        const token = localStorage.getItem("token");
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/orders/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(response.data || []);
      } catch (err) {
        console.error("Error fetching orders:", err);
      }
    };

    fetchProfile(userId);
    fetchOrders(userId);
  }, [authUser]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setimage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

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
        navigate("/login");
      } else {
        setNotification({ message: err.response?.data?.message || err.message || "Failed to update profile.", type: "error", show: true });
      }
      setTimeout(() => setNotification({ message: "", type: "", show: false }), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseDetails = () => {
    setShowOrderDetails(false);
    setSelectedOrder(null);
  };

  return (
    <div className="min-h-screen bg-gray-50/50 pt-20 sm:pt-28 pb-16 px-6 text-left relative">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* PROFILE HEADER PANEL */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 relative overflow-hidden">
          {/* Subtle background blob */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-rose-50/40 rounded-full blur-3xl pointer-events-none" />

          <div className="relative group shrink-0">
            <div className="w-24 h-24 rounded-full bg-rose-50 border border-rose-100/50 flex items-center justify-center text-rose-600 text-3xl font-black overflow-hidden shadow-inner">
              {user?.images?.url ? (
                <img src={user.images.url} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                user?.name?.charAt(0)?.toUpperCase() || "U"
              )}
            </div>
          </div>

          <div className="text-center sm:text-left flex-1 space-y-1.5 min-w-0">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h2 className="text-2xl font-black text-gray-950 truncate leading-none">{user.name || "Guest Account"}</h2>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse mt-1" />
            </div>
            <p className="text-xs text-gray-400 font-bold truncate">{user.email}</p>
            <div className="pt-2 flex flex-wrap gap-2.5 justify-center sm:justify-start">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-1.5 bg-gray-950 text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest shadow-md hover:bg-rose-600 transition"
                onClick={() => {
                  setimage(null);
                  setImagePreview(null);
                  setpopup(true);
                }}
              >
                <Edit3 className="h-3.5 w-3.5" />
                Edit Profile
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
                className="inline-flex items-center gap-1.5 bg-red-50 text-red-600 border border-red-100/30 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-red-100/60 transition"
              >
                <LogOut className="h-3.5 w-3.5" />
                Log out
              </motion.button>
            </div>
          </div>
        </div>

        {/* DETAILS GRID */}
        <div className="grid md:grid-cols-2 gap-8">
          
          {/* Personal info & settings */}
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-6">
            <h3 className="text-sm font-black uppercase tracking-widest text-gray-900 flex items-center gap-2">
              <UserIcon className="h-4.5 w-4.5 text-rose-500" />
              Account Settings
            </h3>
            
            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Email Address</span>
                <div className="flex items-center gap-2.5 p-3 rounded-xl border border-gray-50 bg-gray-50/50 text-xs font-bold text-gray-800">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span>{user?.email || "No email linked"}</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Phone number</span>
                <div className="flex items-center gap-2.5 p-3 rounded-xl border border-gray-50 bg-gray-50/50 text-xs font-bold text-gray-800">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span>{user?.phone || "No phone added"}</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Default Location Address</span>
                <div className="flex items-start gap-2.5 p-3 rounded-xl border border-gray-50 bg-gray-50/50 text-xs font-bold text-gray-800 leading-relaxed min-h-[90px]">
                  <MapPin className="h-4.5 w-4.5 text-rose-500 shrink-0 mt-0.5" />
                  <span>{user?.address || "No address added yet. Use cart options to confirm shipping settings."}</span>
                </div>
              </div>
            </div>
          </div>

          {/* ORDER HISTORY */}
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-5">
            <h3 className="text-sm font-black uppercase tracking-widest text-gray-900 flex items-center gap-2">
              <ShoppingBag className="h-4.5 w-4.5 text-rose-500" />
              Order History
            </h3>

            <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1 custom-scrollbar">
              {orders.length > 0 ? (
                orders.map((order) => (
                  <div 
                    key={order._id} 
                    className="flex justify-between items-center border border-gray-50 p-3.5 rounded-2xl hover:bg-rose-50/20 hover:border-rose-100 transition duration-300"
                  >
                    <div className="text-left space-y-1">
                      <p className="text-xs font-black text-gray-900 flex items-center gap-1.5">
                        Order #{order.razorpay_order_id?.slice(-6).toUpperCase() || "N/A"}
                        <ArrowUpRight className="h-3 w-3 text-gray-400" />
                      </p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-gray-400" />
                        {new Date(order.createdAt).toLocaleDateString()} • ₹{order.amount}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className={`text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${
                        order.status === "Success" 
                          ? "bg-emerald-50 text-emerald-700 border-emerald-100" 
                          : order.status === "Pending" 
                          ? "bg-amber-50 text-amber-700 border-amber-100" 
                          : "bg-red-50 text-red-700 border-red-100"
                      }`}>
                        {order.status}
                      </span>
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowOrderDetails(true);
                        }}
                        className="text-rose-500 text-[10px] font-black uppercase tracking-widest hover:text-rose-600 transition"
                      >
                        Details
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-xs font-bold text-gray-400 italic">No transactions found.</div>
              )}
            </div>
          </div>

        </div>

      </div>

      {/* EDIT PROFILE MODAL */}
      <AnimatePresence>
        {popup && (
          <Dialog
            static
            open={popup}
            onClose={() => setpopup(false)}
            className="relative z-50"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            />

            <div className="fixed inset-0 flex items-center justify-center p-4">
              <DialogPanel as={motion.div} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full max-w-md bg-white rounded-3xl p-6 border border-gray-100 shadow-2xl relative text-left">
                <div className="flex items-center justify-between mb-5 border-b border-gray-50 pb-2">
                  <DialogTitle className="text-sm font-black uppercase tracking-widest text-gray-950">Update Profile Details</DialogTitle>
                  <button onClick={() => setpopup(false)} className="p-1 rounded-full text-gray-400 hover:bg-gray-50">
                    <X className="h-4.5 w-4.5" />
                  </button>
                </div>

                <form onSubmit={handleSave} className="space-y-4">
                  {/* Name */}
                  <div className="space-y-1">
                    <label className="block text-[9px] font-black text-gray-400 uppercase tracking-wider">Full Name</label>
                    <input
                      type="text"
                      placeholder="Name"
                      value={user?.name || ""}
                      onChange={(e) => setUser({ ...user, name: e.target.value })}
                      required
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-semibold focus:outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-50"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-1">
                    <label className="block text-[9px] font-black text-gray-400 uppercase tracking-wider">Email Address</label>
                    <input
                      type="email"
                      placeholder="Email"
                      value={user?.email || ""}
                      onChange={(e) => setUser({ ...user, email: e.target.value })}
                      required
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-semibold focus:outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-50"
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-1">
                    <label className="block text-[9px] font-black text-gray-400 uppercase tracking-wider">Phone number</label>
                    <input
                      type="text"
                      placeholder="Phone"
                      value={user?.phone || ""}
                      onChange={(e) => setUser({ ...user, phone: e.target.value })}
                      required
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-semibold focus:outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-50"
                    />
                  </div>

                  {/* Address */}
                  <div className="space-y-1">
                    <label className="block text-[9px] font-black text-gray-400 uppercase tracking-wider">Delivery Address</label>
                    <textarea
                      placeholder="Address details"
                      value={user?.address || ""}
                      onChange={(e) => setUser({ ...user, address: e.target.value })}
                      required
                      rows="3"
                      className="w-full border border-gray-200 rounded-xl p-3 text-xs font-semibold focus:outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-50"
                    />
                  </div>

                  {/* Avatar upload wrapper */}
                  <div className="space-y-1">
                    <label className="block text-[9px] font-black text-gray-400 uppercase tracking-wider">Profile Avatar Photo</label>
                    <div className="flex items-center gap-3 mt-1">
                      <div className="h-10 w-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden shrink-0">
                        {imagePreview ? (
                          <img src={imagePreview} alt="preview" className="h-full w-full object-cover" />
                        ) : user?.images?.url ? (
                          <img src={user.images.url} alt="profile" className="h-full w-full object-cover" />
                        ) : (
                          <UserIcon className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                      <label className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 border border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 transition text-xs font-bold text-gray-600">
                        <Upload className="h-4 w-4 text-gray-400" />
                        <span>Upload photo</span>
                        <input type="file" onChange={handleFileChange} className="hidden" accept="image/*" />
                      </label>
                    </div>
                  </div>

                  {/* Submit actions */}
                  <div className="flex justify-end gap-2.5 pt-3">
                    <button 
                      type="button"
                      onClick={() => setpopup(false)} 
                      disabled={loading}
                      className="px-4 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-500 rounded-xl text-xs font-bold transition border border-gray-200 disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <motion.button 
                      type="submit"
                      disabled={loading}
                      whileTap={{ scale: 0.98 }}
                      className="px-5 py-2.5 bg-rose-600 text-white rounded-xl text-xs font-black uppercase tracking-wider hover:bg-rose-700 transition flex items-center justify-center min-w-[90px] shadow-md shadow-rose-100 disabled:opacity-75"
                    >
                      {loading ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        "Save Info"
                      )}
                    </motion.button>
                  </div>
                </form>
              </DialogPanel>
            </div>
          </Dialog>
        )}
      </AnimatePresence>

      {/* NOTIFICATION TOAST */}
      <AnimatePresence>
        {notification.show && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.95 }}
            animate={{ opacity: 1, y: 20, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.95 }}
            className={`fixed top-4 left-1/2 -translate-x-1/2 z-[100] px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 backdrop-blur-md border text-xs font-bold ${
              notification.type === "success" 
                ? "bg-emerald-600/95 text-white border-emerald-500 shadow-emerald-100" 
                : "bg-red-600/95 text-white border-red-500 shadow-red-100"
            }`}
          >
            {notification.type === "success" ? <CheckCircle2 className="h-4.5 w-4.5" /> : <AlertTriangle className="h-4.5 w-4.5" />}
            <span>{notification.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ORDER DETAILS MODAL */}
      <AnimatePresence>
        {showOrderDetails && selectedOrder && (
          <Dialog
            static
            open={showOrderDetails}
            onClose={handleCloseDetails}
            className="relative z-50"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            />

            <div className="fixed inset-0 flex items-center justify-center p-4">
              <DialogPanel as={motion.div} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl transition-all border border-gray-100 text-left">
                
                {/* Header */}
                <div className="flex items-center justify-between mb-5 border-b border-gray-50 pb-3">
                  <div>
                    <DialogTitle className="text-sm font-black uppercase tracking-wider text-gray-900">Order Invoice Summary</DialogTitle>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">#{selectedOrder.razorpay_order_id || "N/A"}</p>
                  </div>
                  <button onClick={handleCloseDetails} className="p-1 rounded-full text-gray-400 hover:bg-gray-50">
                    <X className="h-4.5 w-4.5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-gray-500">
                    <div>
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-wider">Transaction Date</p>
                      <p className="text-gray-800 font-bold mt-0.5">{new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-wider">Payment Status</p>
                      <span className={`inline-block text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md border mt-1 ${
                        selectedOrder.status === "Success" 
                          ? "bg-emerald-50 text-emerald-700 border-emerald-100" 
                          : "bg-amber-50 text-amber-700 border-amber-100"
                      }`}>
                        {selectedOrder.status}
                      </span>
                    </div>
                  </div>

                  {selectedOrder.razorpay_payment_id && (
                    <div>
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-wider">Razorpay Payment ID</p>
                      <p className="font-mono text-xs text-gray-800 font-bold mt-0.5">{selectedOrder.razorpay_payment_id}</p>
                    </div>
                  )}

                  <hr className="border-gray-100" />

                  {/* Items list */}
                  <div className="space-y-2">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-wider">Bloom items purchased</p>
                    <div className="space-y-1.5 max-h-[140px] overflow-y-auto pr-1 custom-scrollbar">
                      {selectedOrder.items?.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center text-xs bg-gray-50 p-2.5 rounded-xl border border-gray-100/50">
                          <span className="font-bold text-gray-700 truncate max-w-[200px]">{item.name || item.title} (x{item.quantity || 1})</span>
                          <span className="font-black text-gray-950">₹{item.price?.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <hr className="border-gray-100" />

                  <div className="flex justify-between items-center text-xs font-bold text-gray-500">
                    <span className="uppercase tracking-wider">Paid Total</span>
                    <span className="text-xl font-black text-rose-600">₹{selectedOrder.amount?.toLocaleString()}</span>
                  </div>
                </div>

                <div className="mt-6 pt-3 border-t border-gray-50 flex justify-end">
                  <button onClick={handleCloseDetails} className="w-full py-3 bg-gray-950 hover:bg-rose-600 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-md transition">
                    Close summary
                  </button>
                </div>

              </DialogPanel>
            </div>
          </Dialog>
        )}
      </AnimatePresence>

    </div>
  );
}
