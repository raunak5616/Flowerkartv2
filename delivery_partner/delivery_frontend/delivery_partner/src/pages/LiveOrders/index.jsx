import { useEffect, useState } from "react";
import axios from "axios";
import useDeliveryAuth from "../../context/DeliveryAuthContext";

const LiveOrders = () => {
  const { user } = useDeliveryAuth();
  const [liveOrders, setLiveOrders] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      if (!user?.id) return;
      
      // Fetch live orders assigned to this partner
      const liveRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/delivery/orders/live?partnerId=${user.id}`);
      if (Array.isArray(liveRes.data)) {
        setLiveOrders(liveRes.data);
      }

      // Fetch unassigned requests
      const reqRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/delivery/orders/requests`);
      if (Array.isArray(reqRes.data)) {
        setRequests(reqRes.data);
      }

    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000); // Poll every 10 seconds
    return () => clearInterval(interval);
  }, [user?.id]);

  const acceptOrder = async (orderId) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/delivery/orders/accept-order`, {
        orderId,
        partnerId: user.id
      });
      fetchData();
      alert("Order accepted! Refreshing your live list...");
    } catch (error) {
      alert(error.response?.data?.error || "Failed to accept order");
    }
  };

  const updateStatus = async (orderId, status) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/delivery/orders/update-status`, {
        orderId,
        status,
      });
      fetchData();
    } catch (error) {
      console.error("Status update error:", error);
    }
  };

  if (loading) return <div className="p-8 text-center bg-gray-50 min-h-screen">Loading orders...</div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-md mx-auto p-4 space-y-6">
        
        {/* NEW REQUESTS SECTION */}
        {requests.length > 0 && (
          <section className="animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex items-center gap-2 mb-3">
              <span className="flex h-2 w-2 rounded-full bg-red-500 animate-ping" />
              <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest">New Requests ({requests.length})</h2>
            </div>
            
            <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
              {requests.map(req => (
                <div key={req._id} className="min-w-[280px] bg-white rounded-3xl p-5 shadow-[0_10px_30px_rgba(0,0,0,0.05)] border border-red-100/50">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-xl font-black text-gray-900">₹{req.amount}</span>
                    <span className="text-[10px] bg-red-50 text-red-600 px-2 py-1 rounded-full font-bold uppercase tracking-wider">Pickup Nearby</span>
                  </div>
                  <p className="text-xs text-gray-500 font-bold truncate mb-4">
                    <span className="material-symbols-outlined text-[14px] align-middle mr-1">location_on</span>
                    {req.shopAddress || "Store Location"}
                  </p>
                  <button 
                    onClick={() => acceptOrder(req._id)}
                    className="w-full py-3 bg-red-600 text-white rounded-2xl font-black text-sm shadow-lg shadow-red-200 active:scale-95 transition-all"
                  >
                    Accept & View Details
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ACTIVE DELIVERIES */}
        <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest">My Active Deliveries</h2>
        
        {liveOrders.length === 0 ? (
          <div className="bg-white rounded-[2rem] p-10 text-center border-2 border-dashed border-gray-100">
            <span className="material-symbols-outlined text-[48px] text-gray-200 mb-4 italic">moped</span>
            <p className="text-gray-400 font-bold">No active orders. Accept a request above to get started!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {liveOrders.map((order) => (
              <div key={order._id} className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xs font-bold px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full uppercase tracking-wider">
                      {order.status}
                    </span>
                    <span className="text-sm text-gray-400 font-medium">#{order._id.slice(-6).toUpperCase()}</span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 mb-2">₹{order.amount}</h3>
                  <div className="text-sm text-gray-600 space-y-3 mb-6">
                    <div className="p-3 bg-red-50 rounded-xl border border-red-100">
                      <p className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-1">Pick up From (Shop)</p>
                      <p className="font-bold text-gray-800">{order.shopAddress || "Wait for shop address..."}</p>
                      {order.shopLocation && (
                        <a 
                          href={`https://www.google.com/maps?q=${order.shopLocation.lat},${order.shopLocation.lng}`}
                          target="_blank" rel="noopener noreferrer"
                          className="text-[10px] text-red-400 underline font-bold"
                        >
                          View Shop on Map
                        </a>
                      )}
                    </div>

                    <p><strong>Items:</strong> {order.items?.length || 0} packages</p>
                    
                    {/* CONFIDENTIAL DELIVERY ADDRESS - VISIBLE ONLY AFTER PICKUP */}
                    <div className={`transition-all duration-500 overflow-hidden ${["Out for delivery", "Delivered"].includes(order.status) ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}`}>
                      <div className="p-3 bg-green-50 rounded-xl border border-green-100 mt-2">
                         <p className="text-[10px] font-black text-green-600 uppercase tracking-widest mb-1">Deliver To (Customer)</p>
                         <p className="font-bold text-gray-800">{order.deliveryAddress || "Not Provided"}</p>
                      </div>
                    </div>

                    {!["Out for delivery", "Delivered"].includes(order.status) && (
                      <p className="text-[10px] text-gray-400 italic">⚠️ Delivery location will be revealed after pickup/marking Out for Delivery.</p>
                    )}

                    <p><strong>Ordered:</strong> {new Date(order.createdAt).toLocaleString()}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex flex-col gap-2">
                  {["Out for delivery", "Delivered"].includes(order.status) && order.coordinates && order.coordinates.lat && (
                    <a
                      href={`https://www.google.com/maps?q=${order.coordinates.lat},${order.coordinates.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 bg-green-50 text-green-700 rounded-xl font-medium hover:bg-green-100 transition-colors flex items-center justify-center gap-2 animate-in fade-in zoom-in duration-300"
                    >
                      <span className="material-symbols-outlined text-[20px]">directions</span>
                      Navigate to Customer
                    </a>
                  )}
                  {order.status !== "Out for delivery" && order.status !== "Delivered" && (
                    <button
                      onClick={() => updateStatus(order._id, "Out for delivery")}
                      className="w-full py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:opacity-90 transition-all shadow-md"
                    >
                      Pick Up & Start Delivery
                    </button>
                  )}
                  {order.status === "Out for delivery" && (
                    <button
                      onClick={() => updateStatus(order._id, "Delivered")}
                      className="w-full py-2.5 bg-red-gradient text-white rounded-xl font-bold hover:opacity-90 transition-opacity shadow-lg"
                    >
                      Mark as Delivered
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveOrders;
