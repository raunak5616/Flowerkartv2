import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Users, 
  Store, 
  Truck, 
  ShoppingBag,
  TrendingUp,
  ArrowUpRight
} from 'lucide-react';

export const Dashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    sellers: 0,
    delivery: 0,
    orders: 0,
    revenue: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [userRes, shopRes, orderRes, partnerRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/api/admin/users`),
        axios.get(`${import.meta.env.VITE_API_URL}/api/admin/shops`),
        axios.get(`${import.meta.env.VITE_API_URL}/api/admin/orders`),
        axios.get(`${import.meta.env.VITE_DELIVERY_API_URL}/api/admin/delivery-partners`)
      ]);

      const revenue = orderRes.data.reduce((acc, order) => acc + (order.amount || 0), 0);

      setStats({
        users: userRes.data.length,
        sellers: shopRes.data.length,
        delivery: partnerRes.data.length,
        orders: orderRes.data.length,
        revenue
      });
    } catch (error) {
      console.error("Failed to fetch dashboard stats", error);
    }
  };

  const statCards = [
    { name: 'Total Users', value: stats.users, icon: Users, color: 'bg-blue-500', trend: '+12%' },
    { name: 'Active Sellers', value: stats.sellers, icon: Store, color: 'bg-red-500', trend: '+5%' },
    { name: 'Delivery Fleet', value: stats.delivery, icon: Truck, color: 'bg-green-500', trend: '+2%' },
    { name: 'Total Orders', value: stats.orders, icon: ShoppingBag, color: 'bg-purple-500', trend: '+18%' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Admin Overview</h2>
          <p className="text-gray-500 mt-1">Welcome back, Owner. Here's what's happening today.</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Revenue</p>
              <p className="text-xl font-black text-gray-900">₹{stats.revenue.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => (
          <div key={card.name} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 group hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className={`h-12 w-12 rounded-2xl ${card.color} text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                <card.icon size={24} />
              </div>
              <span className="text-xs font-bold text-green-500 flex items-center gap-1 bg-green-50 px-2 py-1 rounded-full">
                {card.trend} <ArrowUpRight size={12} />
              </span>
            </div>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">{card.name}</p>
            <p className="text-3xl font-black text-gray-900 mt-1">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-gray-100 h-96 flex flex-col items-center justify-center text-gray-400 border-dashed">
          <h3 className="text-lg font-bold text-gray-800 mb-2">Revenue Analytics Map</h3>
          <p className="text-sm text-center max-w-xs">Detailed visualization of sales and heatmap of delivery locations in development.</p>
        </div>
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 h-96 flex flex-col">
          <h3 className="text-lg font-bold text-gray-800 mb-6">System Health</h3>
          <div className="space-y-6 flex-1">
             {[
               { name: 'Customer API', status: 'Healthy', color: 'bg-green-500' },
               { name: 'Delivery API', status: 'Healthy', color: 'bg-green-500' },
               { name: 'Database Persistence', status: 'Connected', color: 'bg-blue-500' },
               { name: 'Razorpay Gateway', status: 'Operational', color: 'bg-green-500' }
             ].map(sys => (
               <div key={sys.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                 <span className="text-sm font-bold text-gray-700">{sys.name}</span>
                 <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase text-white ${sys.color}`}>{sys.status}</span>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
};
