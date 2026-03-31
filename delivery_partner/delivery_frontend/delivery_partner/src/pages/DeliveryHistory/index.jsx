import { useEffect, useState } from "react";
import axios from "axios";

const DeliveryHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/delivery/orders/history");
        setOrders(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (loading) return <div className="p-8 text-center bg-gray-50 min-h-screen">Loading Delivery History...</div>;

  return (
    <div className="p-4 sm:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Delivery History</h1>
          <p className="text-gray-500 mt-1">Review your successfully completed orders.</p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
            <p className="text-gray-500 text-lg">No past deliveries found.</p>
          </div>
        ) : (
          <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-sm tracking-wider text-gray-500 uppercase">
                    <th className="py-4 px-6 font-semibold">Order ID</th>
                    <th className="py-4 px-6 font-semibold">Delivery Address</th>
                    <th className="py-4 px-6 font-semibold">Date Completed</th>
                    <th className="py-4 px-6 font-semibold">Amount</th>
                    <th className="py-4 px-6 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6 text-sm font-medium text-gray-900">
                        #{order._id.slice(-6)}
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-600 max-w-[200px] truncate" title={order.deliveryAddress || "Not Provided"}>
                        {order.deliveryAddress || "Not Provided"}
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-600">
                        {new Date(order.updatedAt).toLocaleString()}
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-900 font-medium">
                        ₹{order.amount}
                      </td>
                      <td className="py-4 px-6 text-sm">
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full font-semibold text-xs uppercase tracking-wide">
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeliveryHistory;
