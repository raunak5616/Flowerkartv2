import { useState, useEffect } from "react";
import axios from "axios";

export const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("All");

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    const shopId = localStorage.getItem("shopId");
    try {
      const response = await axios.get(`http://localhost:8080/api/products/orders/${shopId}`);
      // Filter out Delivered/Cancelled if they exist from legacy, only show relevant for seller
      const relevantOrders = response.data.filter(o => 
        ["Success", "Accepted", "Shipped", "Delivered"].includes(o.status)
      );
      setOrders(relevantOrders);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      await axios.patch(`http://localhost:8080/api/products/orders/${orderId}/status`, { status: newStatus });
      fetchOrders();
    } catch (error) {
      alert("Failed to update status");
    }
  };

  const filteredOrders = orders.filter(order => 
    filterStatus === "All" ? true : 
    (filterStatus === "New" ? order.status === "Success" : order.status === filterStatus)
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Order Processing</h1>
            <p className="text-gray-500 text-sm mt-1">Accept and ship your live customer orders</p>
          </div>
          
          <div className="flex gap-2 bg-white p-1 rounded-xl shadow-sm border overflow-x-auto">
            {["All", "New", "Accepted", "Shipped", "Delivered"].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  filterStatus === status 
                  ? "bg-red-gradient text-white shadow-md" 
                  : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-3xl p-20 text-center shadow-sm border border-dashed border-gray-200">
            <div className="text-gray-300 text-7xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-gray-800">No {filterStatus.toLowerCase()} orders</h3>
            <p className="text-gray-500 mt-2">New incoming orders will appear here.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredOrders.map((order) => (
              <div 
                key={order._id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-gray-100"
              >
                {/* ORDER HEADER */}
                <div className="bg-gray-50 px-6 py-4 flex flex-wrap justify-between items-center gap-4 border-b">
                  <div className="flex items-center gap-3">
                    <div className={`h-3 w-3 rounded-full ${
                      order.status === "Success" ? "bg-green-500 animate-pulse" : 
                      order.status === "Accepted" ? "bg-orange-500" : "bg-blue-500"
                    }`}></div>
                    <span className="font-bold text-gray-700">Order #{order.razorpay_order_id.slice(-8).toUpperCase()}</span>
                    <span className="text-xs text-gray-400">| {new Date(order.createdAt).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      order.status === "Success" ? "bg-green-100 text-green-700" :
                      order.status === "Accepted" ? "bg-orange-100 text-orange-700" :
                      "bg-blue-100 text-blue-700"
                    }`}>
                      {order.status === "Success" ? "New Order" : order.status}
                    </span>
                  </div>
                </div>

                {/* ORDER CONTENT */}
                <div className="p-6">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-gray-400 mb-3 tracking-widest">Order Items</p>
                      <div className="space-y-4">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-4">
                            <img 
                              src={item.images?.[0]?.url || item.image || "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab"} 
                              className="h-12 w-12 rounded-lg object-cover border"
                              alt=""
                            />
                            <div className="flex-1">
                              <h4 className="text-sm font-bold text-gray-800">{item.name || item.title}</h4>
                              <p className="text-xs text-gray-500">Qty: {item.qty || 1} • ₹{item.price}</p>
                            </div>
                            <div className="text-sm font-bold text-gray-700">₹{(item.price * (item.qty || 1))}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col justify-between border-t md:border-t-0 md:border-l pt-6 md:pt-0 md:pl-8">
                      <div className="flex justify-between items-end mb-6">
                        <div>
                          <p className="text-[10px] uppercase font-bold text-gray-400 mb-1 tracking-widest">Total Settlement</p>
                          <p className="text-3xl font-black text-gray-900">₹{order.shopAmount}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] uppercase font-bold text-gray-400 mb-1 tracking-widest">Cust. Ref</p>
                          <p className="text-xs font-mono text-gray-600">USR-{order.userId.slice(-6).toUpperCase()}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {order.status === "Success" && (
                          <button 
                            onClick={() => updateStatus(order.razorpay_order_id, "Accepted")}
                            className="flex-1 bg-black text-white py-3 rounded-xl text-sm font-bold shadow-lg hover:bg-gray-800 transition-all flex items-center justify-center gap-2"
                          >
                            <span className="material-symbols-outlined text-lg">check_circle</span>
                            Accept Order
                          </button>
                        )}
                        {order.status === "Accepted" && (
                          <button 
                            onClick={() => updateStatus(order.razorpay_order_id, "Shipped")}
                            className="flex-1 bg-red-gradient text-white py-3 rounded-xl text-sm font-bold shadow-lg hover:opacity-90 transition-all flex items-center justify-center gap-2"
                          >
                            <span className="material-symbols-outlined text-lg">local_shipping</span>
                            Handover to Ship
                          </button>
                        )}
                        {order.status === "Shipped" && (
                          <div className="flex-1 bg-blue-50 text-blue-700 py-3 rounded-xl text-sm font-bold border border-blue-100 flex items-center justify-center gap-2">
                            <span className="material-symbols-outlined text-lg">info</span>
                            Awaiting Delivery App
                          </div>
                        )}
                        {order.status === "Delivered" && (
                          <div className="flex-1 bg-green-50 text-green-700 py-3 rounded-xl text-sm font-bold border border-green-100 flex items-center justify-center gap-2">
                            <span className="material-symbols-outlined text-lg">verified</span>
                            Order Sold & Delivered
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
