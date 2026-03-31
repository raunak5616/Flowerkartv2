import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, RefreshCw, UserCheck, ChevronDown, ChevronUp, Mail, Phone, Calendar, ShoppingBag, MapPin } from 'lucide-react';

export const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [userOrders, setUserOrders] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone?.includes(searchTerm)
  );

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/users`);
      setUsers(res.data);
    } catch (error) {
      console.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = async (id) => {
    if (expandedId === id) {
      setExpandedId(null);
      return;
    }
    setExpandedId(id);
    if (!userOrders[id]) {
        try {
          const res = await axios.get(`${import.meta.env.VITE_API_URL}/orders/${id}`);
          setUserOrders(prev => ({ ...prev, [id]: res.data }));
        } catch (error) {
          console.error("Failed to fetch user orders");
        }
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to remove this user?")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/admin/users/${id}`);
      fetchUsers();
    } catch (error) {
      alert("Failed to delete user");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">Customer Management</h2>
          <p className="text-gray-500 text-sm">Manage all registered customer accounts. Tap a customer for deep details.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative group flex-1 md:w-64">
            <input 
              type="text"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-100 rounded-2xl text-sm font-bold shadow-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder:text-gray-300"
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-500 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </div>
          </div>
          
          <button 
            onClick={fetchUsers}
            className="p-3 bg-white border border-gray-100 rounded-2xl hover:bg-gray-50 transition-colors shadow-sm text-gray-400 hover:text-blue-500"
          >
            <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100 text-[10px] items-center font-black uppercase text-gray-400 tracking-widest">
            <tr>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Phone</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 font-medium text-sm">
            {filteredUsers.map((user) => (
              <React.Fragment key={user._id}>
                <tr 
                  onClick={() => toggleExpand(user._id)}
                  className={`cursor-pointer transition-colors ${expandedId === user._id ? 'bg-blue-50/30' : 'hover:bg-gray-50/50'}`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-black shadow-sm">
                        {user.name ? user.name[0].toUpperCase() : 'U'}
                      </div>
                      <div>
                        <span className="font-bold text-gray-800 block">{user.name}</span>
                        <div className="flex items-center gap-1 text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
                          {expandedId === user._id ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
                          {expandedId === user._id ? 'Hide Profile' : 'View Orders'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{user.email}</td>
                  <td className="px-6 py-4 text-gray-600">{user.phone}</td>
                  <td className="px-6 py-4">
                     <div className="flex items-center gap-2 text-[10px] font-black uppercase text-green-500">
                       <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></div>
                       Active
                     </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                      <button 
                        onClick={(e) => { e.stopPropagation(); deleteUser(user._id); }}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                  </td>
                </tr>
                {expandedId === user._id && (
                  <tr className="bg-blue-50/5 text-gray-700">
                    <td colSpan="5" className="px-8 py-8">
                       <div className="animate-in slide-in-from-top-2 duration-300 grid grid-cols-1 md:grid-cols-3 gap-8">
                          <div className="space-y-4">
                             <div className="flex items-center gap-2 mb-2">
                               <ShieldCheck className="text-blue-500" size={18} />
                               <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Account Details</h4>
                             </div>
                             <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-3">
                                <div className="flex items-center gap-3">
                                   <Mail size={14} className="text-gray-400" />
                                   <span className="text-xs font-bold text-gray-600">{user.email}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                   <Phone size={14} className="text-gray-400" />
                                   <span className="text-xs font-bold text-gray-600">{user.phone}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                   <Calendar size={14} className="text-gray-400" />
                                   <span className="text-xs font-bold text-gray-600 italic">Member since {new Date(user.createdAt).toLocaleDateString()}</span>
                                </div>
                             </div>
                          </div>
                          
                          <div className="md:col-span-2">
                             <div className="flex items-center gap-2 mb-4">
                               <ShoppingBag className="text-blue-500" size={18} />
                               <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Recent Orders ({userOrders[user._id]?.length || 0})</h4>
                             </div>
                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {userOrders[user._id] ? (
                                   userOrders[user._id].slice(0, 4).map(order => (
                                     <div 
                                       key={order._id} 
                                       onClick={() => setSelectedOrder(order)}
                                       className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-center cursor-pointer hover:border-blue-500 hover:shadow-md transition-all group"
                                     >
                                        <div>
                                           <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter group-hover:text-blue-500 transition-colors">#ORD-{order._id.slice(-6).toUpperCase()}</p>
                                           <p className="text-sm font-black text-gray-800">₹{order.amount}</p>
                                        </div>
                                        <div className="text-[8px] font-black uppercase px-2 py-1 bg-gray-100 rounded-full text-gray-500">{order.status}</div>
                                     </div>
                                   ))
                                ) : (
                                   <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm italic text-xs text-gray-400">Loading orders...</div>
                                )}
                                {userOrders[user._id]?.length === 0 && (
                                   <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm italic text-xs text-gray-400">No payment records found</div>
                                )}
                             </div>
                          </div>
                       </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
        {users.length === 0 && !loading && (
          <div className="p-20 text-center">
            <p className="text-gray-400 font-bold tracking-widest uppercase text-xs">No customers registered yet</p>
          </div>
        )}
      </div>

      {/* ORDER DETAILS MODAL */}
      {selectedOrder && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300"
          onClick={() => setSelectedOrder(null)}
        >
          <div 
            className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-8 duration-500"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gray-50 p-8 border-b border-gray-100 flex justify-between items-start">
              <div>
                <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] mb-1">Detailed Breakdown</p>
                <h3 className="text-2xl font-black text-gray-900 tracking-tighter">Order #ORD-{selectedOrder._id.slice(-8).toUpperCase()}</h3>
              </div>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="h-10 w-10 bg-white shadow-sm border border-gray-100 rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:scale-110 transition-all"
              >
                 <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>

            <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto">
              {/* Product List */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                   <div className="h-1.5 w-5 bg-blue-500 rounded-full"></div>
                   <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Cart Summary</h4>
                </div>
                <div className="space-y-2">
                  {selectedOrder.items?.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center py-3 border-b border-gray-50 last:border-0 hover:px-2 transition-all rounded-xl hover:bg-gray-50/50">
                       <div className="flex items-center gap-4">
                          <div className="h-12 w-12 bg-gray-100 rounded-2xl flex items-center justify-center font-black text-blue-600">
                             {item.qty}x
                          </div>
                          <div>
                             <p className="text-sm font-bold text-gray-800">{item.name}</p>
                             <p className="text-[10px] font-bold text-gray-400 uppercase">Unit: ₹{item.price}</p>
                          </div>
                       </div>
                       <p className="font-black text-gray-900">₹{item.price * item.qty}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Info */}
              <div className="bg-blue-50/30 p-6 rounded-3xl border border-blue-50 space-y-3">
                 <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-blue-500" />
                    <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-widest leading-none">Shipping Destination</h4>
                 </div>
                 <p className="text-sm font-bold text-gray-700 leading-relaxed italic pr-4">
                    {selectedOrder.deliveryAddress || "Standard Priority Delivery Selected"}
                 </p>
              </div>

              {/* Payment Summary */}
              <div className="space-y-4">
                 <div className="flex justify-between items-center text-gray-400 font-bold text-xs uppercase">
                    <span>Subtotal</span>
                    <span>₹{selectedOrder.amount}</span>
                 </div>
                 <div className="flex justify-between items-center text-gray-400 font-bold text-xs uppercase">
                    <span>Processing Fee</span>
                    <span>₹0</span>
                 </div>
                 <div className="h-px bg-gray-100 w-full mt-4"></div>
                 <div className="flex justify-between items-center bg-gray-900 text-white p-6 rounded-2xl shadow-xl shadow-gray-200">
                    <div>
                       <p className="text-[8px] font-black uppercase tracking-[0.3em] opacity-50">Grand Total Paid</p>
                       <p className="text-2xl font-black tabular-nums">₹{selectedOrder.amount}</p>
                    </div>
                    <div className="text-right">
                       <p className="text-[8px] font-black uppercase tracking-widest opacity-50 mb-1">Transaction</p>
                       <span className="text-[10px] font-mono px-2 py-1 bg-white/10 rounded-lg">{selectedOrder.razorpay_payment_id || "BANK_VERIFIED"}</span>
                    </div>
                 </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-gray-50 text-center">
               <p className="text-[8px] font-black uppercase text-gray-400 tracking-widest italic opacity-50">End of Order Breakdown - flowerKart Admin Portal</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Add missing icon
const ShieldCheck = ({ size, className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);
