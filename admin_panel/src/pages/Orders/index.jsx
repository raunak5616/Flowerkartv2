import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, RefreshCw, ShoppingBag, CreditCard, Clock, ChevronDown, ChevronUp, Package, MapPin } from 'lucide-react';

export const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredOrders = orders.filter(order => 
    order._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.deliveryAddress?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.razorpay_payment_id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/orders`);
      setOrders(res.data);
    } catch (error) {
      console.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const deleteOrder = async (id) => {
    if (!window.confirm("Remove this order record from history?")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/admin/orders/${id}`);
      fetchOrders();
    } catch (error) {
      alert("Failed to delete order");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Success': return 'bg-green-100 text-green-600 border-green-200';
      case 'Accepted': return 'bg-blue-100 text-blue-600 border-blue-200';
      case 'Shipped': return 'bg-purple-100 text-purple-600 border-purple-200';
      case 'Out for delivery': return 'bg-orange-100 text-orange-600 border-orange-200';
      case 'Failed': return 'bg-red-100 text-red-600 border-red-200';
      default: return 'bg-gray-100 text-gray-500 border-gray-200';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">Order Logs</h2>
          <p className="text-gray-500 text-sm">View and manage global transaction history. Tap an order for breakdown.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative group flex-1 md:w-64">
            <input 
              type="text"
              placeholder="Search logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-100 rounded-2xl text-sm font-bold shadow-sm focus:ring-4 focus:ring-red-500/10 focus:border-red-500 outline-none transition-all placeholder:text-gray-300"
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-red-500 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </div>
          </div>
          
          <button 
            onClick={fetchOrders}
            className="p-3 bg-white border border-gray-100 rounded-2xl hover:bg-gray-50 transition-colors shadow-sm text-gray-400 hover:text-red-500"
          >
            <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100 text-[10px] items-center font-black uppercase text-gray-400 tracking-widest">
            <tr>
              <th className="px-6 py-4">Order ID</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 font-medium text-sm">
            {filteredOrders.map((order) => (
              <React.Fragment key={order._id}>
                <tr 
                  onClick={() => setExpandedId(expandedId === order._id ? null : order._id)}
                  className={`cursor-pointer transition-colors ${expandedId === order._id ? 'bg-red-50/20' : 'hover:bg-gray-50/50'}`}
                >
                  <td className="px-6 py-4 text-gray-900">
                    <div>
                      <span className="font-mono text-xs font-bold text-gray-400">#ORD-{order?._id?.slice(-8).toUpperCase()}</span>
                      <div className="flex items-center gap-1 text-[10px] text-gray-400 font-bold uppercase tracking-tighter mt-1">
                        {expandedId === order._id ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
                        {expandedId === order._id ? 'Hide Details' : 'View Breakdown'}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-black text-gray-900">₹{order.amount?.toLocaleString()}</td>
                  <td className="px-6 py-4">
                     <div className={`px-3 py-1 rounded-full text-[10px] border font-black uppercase inline-flex items-center gap-1 ${getStatusColor(order.status)}`}>
                       {order.status}
                     </div>
                  </td>
                  <td className="px-6 py-4 text-gray-400 text-xs">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                      <button 
                        onClick={(e) => { e.stopPropagation(); deleteOrder(order._id); }}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                  </td>
                </tr>
                {expandedId === order._id && (
                  <tr className="bg-gray-50/20">
                    <td colSpan="5" className="px-10 py-8">
                       <div className="animate-in slide-in-from-top-2 duration-300 grid grid-cols-1 md:grid-cols-2 gap-10">
                          <div>
                            <div className="flex items-center gap-2 mb-4">
                               <Package className="text-red-500" size={16} />
                               <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Ordered Items ({order.items?.length || 0})</h4>
                            </div>
                            <div className="space-y-3">
                               {order.items?.map((item, idx) => (
                                 <div key={idx} className="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                       <div className="h-10 w-10 bg-gray-50 rounded-lg flex items-center justify-center text-red-500 text-xs font-black">
                                         {item.qty}x
                                       </div>
                                       <span className="text-xs font-black text-gray-700">{item.name}</span>
                                    </div>
                                    <p className="text-xs font-bold text-gray-400">₹{item.price}</p>
                                 </div>
                               ))}
                            </div>
                          </div>

                          <div className="space-y-6">
                             <div>
                                <div className="flex items-center gap-2 mb-4">
                                   <MapPin className="text-red-500" size={16} />
                                   <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Fulfillment Address</h4>
                                </div>
                                <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
                                   <p className="text-xs font-bold text-gray-600 italic leading-relaxed">
                                      {order.deliveryAddress || "Address details not provided."}
                                   </p>
                                   <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between items-center">
                                      <span className="text-[10px] font-black uppercase text-gray-400">Payment ID</span>
                                      <span className="text-[10px] font-mono font-bold text-blue-500">{order.razorpay_payment_id || "PENDING"}</span>
                                   </div>
                                </div>
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
        {orders.length === 0 && !loading && (
          <div className="p-20 text-center text-gray-400 flex flex-col items-center">
            <ShoppingBag size={48} className="text-gray-100 mb-4" />
            <p className="font-bold text-xs uppercase tracking-widest">No order history available</p>
          </div>
        )}
      </div>
    </div>
  );
};
