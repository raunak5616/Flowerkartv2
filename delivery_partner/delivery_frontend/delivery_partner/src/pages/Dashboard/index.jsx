import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const Dashboard = () => {
  const [stats, setStats] = useState({ totalDeliveries: 0, activeOrders: 0, earnings: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/delivery/orders/stats`);
        setStats(response.data);
      } catch (err) {
        console.error("Error fetching stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="p-8 text-center bg-gray-50 min-h-screen">Loading Delivery Dashboard...</div>;

  return (
    <div className="p-4 sm:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Partner Dashboard</h1>
          <p className="text-gray-500 mt-1">Monitor your delivery performance and earnings.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          
          {/* Active Orders */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center gap-4 transition-transform hover:scale-[1.02]">
            <div className="p-4 bg-red-50 rounded-2xl text-red-500">
              <LocalShippingIcon fontSize="large" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Active Deliveries</p>
              <p className="text-3xl font-bold text-gray-900">{stats.activeOrders}</p>
            </div>
          </div>

          {/* Total Deliveries */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center gap-4 transition-transform hover:scale-[1.02]">
            <div className="p-4 bg-green-50 rounded-2xl text-green-600">
              <CheckCircleIcon fontSize="large" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Completed</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalDeliveries}</p>
            </div>
          </div>

          {/* Earnings */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center gap-4 transition-transform hover:scale-[1.02]">
            <div className="p-4 bg-yellow-50 rounded-2xl text-yellow-600">
              <AccountBalanceWalletIcon fontSize="large" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Estimated Earnings</p>
              <p className="text-3xl font-bold text-gray-900">₹{stats.earnings}</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <Link to="/live-orders" className="bg-red-gradient text-white px-6 py-3 rounded-2xl font-medium shadow-md hover:opacity-90 transition-opacity">
              View Active Orders
            </Link>
            <Link to="/delivery-history" className="bg-gray-100 text-gray-800 px-6 py-3 rounded-2xl font-medium hover:bg-gray-200 transition-colors">
              Past Deliveries
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
