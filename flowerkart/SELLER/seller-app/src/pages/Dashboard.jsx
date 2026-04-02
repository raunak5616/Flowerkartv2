import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { 
  ShoppingBag, 
  Upload, 
  Settings, 
  FileText, 
  TrendingUp, 
  Users, 
  Package 
} from "lucide-react";

const cardsData = [
    {
        title: "Live Orders",
        icon: <ShoppingBag className="w-6 h-6" />,
        route: "/orders",
        description: "Track and manage live customer orders in real-time.",
        color: "from-rose-500 to-red-600",
    },
    {
        title: "Upload Products",
        icon: <Upload className="w-6 h-6" />,
        route: "/upload-products",
        description: "Expand your catalog by adding new floral products.",
        color: "from-red-500 to-rose-700",
    },
    {
        title: "Manage Products",
        icon: <Settings className="w-6 h-6" />,
        route: "/manage-products",
        description: "Quickly edit pricing, stock, or remove products.",
        color: "from-rose-600 to-red-800",
    },
    {
        title: "Bills & Invoices",
        icon: <FileText className="w-6 h-6" />,
        route: "/bills",
        description: "Detailed view of your earnings and transaction history.",
        color: "from-red-700 to-rose-900",
    },
];

const StatsCard = ({ title, value, icon, trend }) => (
    <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 shadow-sm border border-white/20 flex flex-col gap-2">
        <div className="flex items-center justify-between">
            <div className="p-3 bg-red-50 rounded-2xl text-red-600">
                {icon}
            </div>
            {trend && (
                <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                    {trend}
                </span>
            )}
        </div>
        <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
        </div>
    </div>
);

const Dashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalSales: 0,
        activeOrders: 0,
        totalCustomers: 0,
        productsLive: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const shopId = localStorage.getItem("shopId");
                if (!shopId) return;

                const response = await axios.get(`${import.meta.env.VITE_API_URL}/stats/${shopId}`);
                if (response.data.success) {
                    setStats(response.data.stats);
                }
            } catch (error) {
                console.error("Error fetching dashboard stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };
    
    return (
        <div className="min-h-screen bg-slate-50/50 p-4 md:p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                
                {/* HERO SECTION */}
                <div className="relative overflow-hidden rounded-[2.5rem] bg-red-gradient p-8 md:p-12 text-white shadow-2xl">
                    <div className="relative z-10 max-w-2xl">
                        <h1 className="text-3xl md:text-5xl font-bold mb-4">
                            Welcome back, Seller! 🌸
                        </h1>
                        <p className="text-red-100 text-lg mb-8">
                            Your flower shop is performing exceptionally well today. 
                            Manage your inventory and track orders with ease.
                        </p>
                        <button 
                            onClick={() => navigate('/upload-products')}
                            className="bg-white text-red-700 px-6 py-3 rounded-2xl font-semibold 
                                       hover:bg-red-50 transition-colors shadow-lg active:scale-95"
                        >
                            + Add New Product
                        </button>
                    </div>
                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 right-0 translate-y-24 w-96 h-96 bg-red-400/20 rounded-full blur-3xl"></div>
                </div>

                {/* STATS GRID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatsCard 
                        title="Total Sales" 
                        value={loading ? "..." : formatCurrency(stats.totalSales)} 
                        icon={<TrendingUp className="w-5 h-5" />} 
                        trend={stats.totalSales > 0 ? "+Live" : ""} 
                    />
                    <StatsCard 
                        title="Active Orders" 
                        value={loading ? "..." : stats.activeOrders} 
                        icon={<ShoppingBag className="w-5 h-5" />} 
                    />
                    <StatsCard 
                        title="Total Customers" 
                        value={loading ? "..." : stats.totalCustomers} 
                        icon={<Users className="w-5 h-5" />} 
                    />
                    <StatsCard 
                        title="Products Live" 
                        value={loading ? "..." : stats.productsLive} 
                        icon={<Package className="w-5 h-5" />} 
                    />
                </div>

                {/* QUICK ACTIONS SECTION */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900 px-2">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {cardsData.map((card, index) => (
                            <div
                                key={index}
                                onClick={() => navigate(card.route)}
                                className="group relative bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 
                                           cursor-pointer transition-all duration-300
                                           hover:shadow-2xl hover:-translate-y-2 hover:border-red-500/20"
                            >
                                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${card.color} 
                                               text-white flex items-center justify-center mb-6 
                                               shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                    {card.icon}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors">
                                    {card.title}
                                </h3>
                                <p className="text-gray-500 text-sm leading-relaxed">
                                    {card.description}
                                </p>
                                {/* Arrow on hover */}
                                <div className="absolute bottom-6 right-8 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <TrendingUp className="w-5 h-5 text-red-500 rotate-90" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Dashboard;
