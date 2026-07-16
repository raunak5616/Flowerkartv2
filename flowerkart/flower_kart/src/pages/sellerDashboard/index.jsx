import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  FileText, 
  Bell, 
  TrendingUp, 
  Package, 
  Users, 
  DollarSign, 
  Plus, 
  Search, 
  Trash2, 
  Edit3, 
  ExternalLink,
  ChevronRight,
  Sparkles,
  ArrowUpRight,
  TrendingDown
} from "lucide-react";

// Mock Statistics data
const stats = [
  { label: "Gross Sales", value: "₹1,42,850", growth: "+14.2%", trend: "up", icon: DollarSign, color: "text-emerald-600 bg-emerald-50 border-emerald-100" },
  { label: "Orders Fulfilled", value: "342", growth: "+9.1%", trend: "up", icon: ShoppingBag, color: "text-rose-600 bg-rose-50 border-rose-100" },
  { label: "Avg Order Value", value: "₹4,170", growth: "-1.5%", trend: "down", icon: TrendingUp, color: "text-amber-600 bg-amber-50 border-amber-100" },
  { label: "Total Products", value: "24", growth: "+4 new", trend: "up", icon: Package, color: "text-blue-600 bg-blue-50 border-blue-100" }
];

// Mock products database
const initialProducts = [
  { id: "1", name: "Premium Red Roses Bouquet", category: "Roses", price: 1499, stock: 15, rating: 4.8 },
  { id: "2", name: "Lush Green Snake Plant", category: "Plants", price: 899, stock: 24, rating: 4.5 },
  { id: "3", name: "Romantic Anniversary Lily Pack", category: "Bouquets", price: 2199, stock: 8, rating: 4.9 },
  { id: "4", name: "Cheerful Birthday Daisy Arrangement", category: "Bouquets", price: 1299, stock: 12, rating: 4.2 },
  { id: "5", name: "Elegant White Orchid Pot", category: "Plants", price: 3499, stock: 4, rating: 4.7 }
];

// Mock orders database
const initialOrders = [
  { id: "ORD-9842", customer: "Amrita Nair", date: "2026-07-15", items: "Red Roses x 1", amount: 1499, status: "Delivered", method: "Razorpay" },
  { id: "ORD-9831", customer: "Devendra Patil", date: "2026-07-15", items: "Snake Plant x 2", amount: 1798, status: "Preparing", method: "Razorpay" },
  { id: "ORD-9828", customer: "Karan Johar", date: "2026-07-14", items: "Anniversary Lily x 1", amount: 2199, status: "Delivered", method: "Razorpay" },
  { id: "ORD-9819", customer: "Pooja Hegde", date: "2026-07-13", items: "White Orchid x 1", amount: 3499, status: "Cancelled", method: "Refunded" }
];

// Mock notifications database
const systemNotifications = [
  { id: 1, title: "New order received", text: "Order #ORD-9842 needs packaging details.", time: "5 mins ago", unread: true },
  { id: 2, title: "Low inventory warning", text: "Romantic Anniversary Lily Pack is down to 8 stems.", time: "1 hour ago", unread: true },
  { id: 3, title: "Razorpay payout complete", text: "Payout of ₹34,200 transferred to account.", time: "1 day ago", unread: false }
];

export default function SellerDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [productsList, setProductsList] = useState(initialProducts);
  const [ordersList, setOrdersList] = useState(initialOrders);
  const [notifications, setNotifications] = useState(systemNotifications);
  
  // Search parameters for filters inside tables
  const [productSearch, setProductSearch] = useState("");
  const [orderSearch, setOrderSearch] = useState("");

  const filteredProducts = useMemo(() => {
    return productsList.filter(p => p.name.toLowerCase().includes(productSearch.toLowerCase()) || p.category.toLowerCase().includes(productSearch.toLowerCase()));
  }, [productsList, productSearch]);

  const filteredOrders = useMemo(() => {
    return ordersList.filter(o => o.customer.toLowerCase().includes(orderSearch.toLowerCase()) || o.id.toLowerCase().includes(orderSearch.toLowerCase()));
  }, [ordersList, orderSearch]);

  const handleDeleteProduct = (id) => {
    if (confirm("Are you sure you want to delete this listing?")) {
      setProductsList(productsList.filter(p => p.id !== id));
    }
  };

  const handleAddProduct = () => {
    const name = prompt("Enter product name:");
    if (!name) return;
    const category = prompt("Enter product category (Roses, Plants, Bouquets):", "Roses");
    const price = Number(prompt("Enter price in INR:", "999"));
    const stock = Number(prompt("Enter inventory stock quantity:", "10"));
    
    if (name && price) {
      const newProd = {
        id: String(productsList.length + 1),
        name,
        category,
        price,
        stock,
        rating: 5.0
      };
      setProductsList([newProd, ...productsList]);
    }
  };

  const handleUpdateOrderStatus = (orderId) => {
    setOrdersList(ordersList.map(o => {
      if (o.id === orderId) {
        const nextStatus = o.status === "Preparing" ? "Delivered" : "Preparing";
        return { ...o, status: nextStatus };
      }
      return o;
    }));
  };

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col lg:flex-row text-left">
      
      {/* SIDEBAR TABS LAYOUT */}
      <aside className="w-full lg:w-64 bg-white border-b lg:border-b-0 lg:border-r border-gray-100 p-6 shrink-0 sticky top-16 z-30">
        <div className="flex flex-col gap-5 h-full">
          <div className="hidden lg:flex items-center gap-2 pb-4 border-b border-gray-50">
            <Sparkles className="h-4.5 w-4.5 text-rose-500 animate-pulse" />
            <h2 className="text-sm font-black uppercase tracking-widest text-gray-900">Partner Console</h2>
          </div>

          <nav className="flex flex-row lg:flex-col gap-1.5 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 scrollbar-none">
            {[
              { id: "overview", label: "Overview", icon: LayoutDashboard },
              { id: "products", label: "Products Catalog", icon: Package },
              { id: "orders", label: "Orders Log", icon: FileText },
              { id: "notifications", label: "Alerts Center", icon: Bell }
            ].map(tab => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition whitespace-nowrap ${
                    activeTab === tab.id 
                      ? "bg-rose-50 text-rose-600 border border-rose-100/50" 
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-800 border border-transparent"
                  }`}
                >
                  <IconComponent className="h-4 w-4 shrink-0" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* DASHBOARD CONTENT BODY */}
      <main className="flex-1 p-6 sm:p-10 space-y-8 overflow-x-hidden">
        
        {/* Title Area */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="text-left">
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-rose-500">Console summary</p>
            <h1 className="text-2xl sm:text-3.5xl font-black tracking-tight text-gray-950 mt-1">Seller Console</h1>
          </div>
          {activeTab === "products" && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAddProduct}
              className="inline-flex items-center gap-1.5 bg-gray-950 hover:bg-rose-600 text-white px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition self-start sm:self-auto shadow-md"
            >
              <Plus className="h-4 w-4" />
              Add Product
            </motion.button>
          )}
        </div>

        <AnimatePresence mode="wait">
          
          {/* TAB 1: OVERVIEW & ANALYTICS */}
          {activeTab === "overview" && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="space-y-8 text-left"
            >
              {/* Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, idx) => {
                  const Icon = stat.icon;
                  const isUp = stat.trend === "up";
                  return (
                    <div key={idx} className="bg-white rounded-3xl border border-gray-100 p-5 shadow-sm space-y-4">
                      <div className={`h-9 w-9 rounded-xl border flex items-center justify-center shrink-0 ${stat.color}`}>
                        <Icon className="h-4.5 w-4.5" />
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">{stat.label}</span>
                        <p className="text-xl sm:text-2xl font-black text-gray-950">{stat.value}</p>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] font-bold">
                        {isUp ? (
                          <span className="text-emerald-600 flex items-center"><ArrowUpRight className="h-3.5 w-3.5" /> {stat.growth}</span>
                        ) : (
                          <span className="text-amber-600 flex items-center"><TrendingDown className="h-3.5 w-3.5" /> {stat.growth}</span>
                        )}
                        <span className="text-gray-400">vs last month</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Graphic Placeholder chart */}
              <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-gray-50 pb-4">
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-widest text-gray-900">Gross Sales Analytics</h3>
                    <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Live graphic representation of sales trends.</p>
                  </div>
                  <span className="text-xs font-black text-rose-500 bg-rose-50 px-3 py-1 rounded-full border border-rose-100/50">Weekly Growth</span>
                </div>

                {/* SVG Line Graph */}
                <div className="relative h-64 w-full">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 600 240" preserveAspectRatio="none">
                    {/* Grid lines */}
                    <line x1="0" y1="40" x2="600" y2="40" stroke="#f3f4f6" strokeWidth="1" />
                    <line x1="0" y1="100" x2="600" y2="100" stroke="#f3f4f6" strokeWidth="1" />
                    <line x1="0" y1="160" x2="600" y2="160" stroke="#f3f4f6" strokeWidth="1" />
                    <line x1="0" y1="220" x2="600" y2="220" stroke="#f3f4f6" strokeWidth="1" />

                    {/* Gradient area */}
                    <defs>
                      <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M0 220 L100 160 L200 180 L300 100 L400 140 L500 60 L600 80 L600 220 Z"
                      fill="url(#chartGradient)"
                    />

                    {/* Sales Trend Line */}
                    <path
                      d="M0 220 L100 160 L200 180 L300 100 L400 140 L500 60 L600 80"
                      fill="none"
                      stroke="#f43f5e"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />

                    {/* Interactive dots */}
                    <circle cx="100" cy="160" r="5" fill="#f43f5e" stroke="white" strokeWidth="2" />
                    <circle cx="300" cy="100" r="5" fill="#f43f5e" stroke="white" strokeWidth="2" />
                    <circle cx="500" cy="60" r="5" fill="#f43f5e" stroke="white" strokeWidth="2" />
                  </svg>
                </div>
                <div className="flex justify-between text-[9px] text-gray-400 font-bold uppercase tracking-wider pt-2 px-1">
                  <span>Mon</span>
                  <span>Tue</span>
                  <span>Wed</span>
                  <span>Thu</span>
                  <span>Fri</span>
                  <span>Sat</span>
                  <span>Sun</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 2: PRODUCTS MANAGER */}
          {activeTab === "products" && (
            <motion.div
              key="products"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-6 text-left"
            >
              {/* Filter controls */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="relative w-full sm:max-w-xs">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Search product inventory..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 text-xs font-semibold focus:outline-none focus:border-rose-500"
                  />
                </div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Showing {filteredProducts.length} items
                </p>
              </div>

              {/* Products Table */}
              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left text-xs font-semibold border-collapse">
                  <thead>
                    <tr className="border-b border-gray-50 text-[10px] text-gray-400 uppercase tracking-widest font-black">
                      <th className="pb-3.5 pl-2">Product Name</th>
                      <th className="pb-3.5">Category</th>
                      <th className="pb-3.5">Price</th>
                      <th className="pb-3.5">Inventory</th>
                      <th className="pb-3.5">Rating</th>
                      <th className="pb-3.5 pr-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredProducts.map(p => (
                      <tr key={p.id} className="hover:bg-gray-50/50 transition">
                        <td className="py-4 pl-2 font-black text-gray-900">{p.name}</td>
                        <td className="py-4 text-gray-500 font-bold">{p.category}</td>
                        <td className="py-4 text-gray-950 font-bold">₹{p.price}</td>
                        <td className="py-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            p.stock <= 8 ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700"
                          }`}>
                            {p.stock} units
                          </span>
                        </td>
                        <td className="py-4 flex items-center gap-1.5 mt-2.5">
                          <Star className="h-3.5 w-3.5 text-orange-400 fill-orange-400" />
                          <span>{p.rating.toFixed(1)}</span>
                        </td>
                        <td className="py-4 pr-2 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => alert(`Simulated edit for product ID: ${p.id}`)}
                              className="p-1.5 text-gray-400 hover:text-gray-900 transition hover:bg-gray-50 rounded-lg"
                              title="Edit listing"
                            >
                              <Edit3 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(p.id)}
                              className="p-1.5 text-gray-400 hover:text-red-600 transition hover:bg-red-50 rounded-lg"
                              title="Delete listing"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* TAB 3: ORDERS LOG */}
          {activeTab === "orders" && (
            <motion.div
              key="orders"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-6 text-left"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="relative w-full sm:max-w-xs">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Search buyer name or Order ID..."
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 text-xs font-semibold focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              {/* Orders Table */}
              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left text-xs font-semibold border-collapse">
                  <thead>
                    <tr className="border-b border-gray-50 text-[10px] text-gray-400 uppercase tracking-widest font-black">
                      <th className="pb-3.5 pl-2">Order ID</th>
                      <th className="pb-3.5">Customer</th>
                      <th className="pb-3.5">Order Items</th>
                      <th className="pb-3.5">Transaction Paid</th>
                      <th className="pb-3.5">Status</th>
                      <th className="pb-3.5">Method</th>
                      <th className="pb-3.5 pr-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredOrders.map(o => (
                      <tr key={o.id} className="hover:bg-gray-50/50 transition">
                        <td className="py-4 pl-2 font-mono font-black text-gray-900">{o.id}</td>
                        <td className="py-4 text-gray-800 font-bold">{o.customer}</td>
                        <td className="py-4 text-gray-500 font-bold truncate max-w-[150px]">{o.items}</td>
                        <td className="py-4 text-gray-950 font-black">₹{o.amount.toLocaleString()}</td>
                        <td className="py-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            o.status === "Delivered" 
                              ? "bg-emerald-50 text-emerald-700" 
                              : o.status === "Preparing"
                              ? "bg-amber-50 text-amber-700 animate-pulse"
                              : "bg-red-50 text-red-700"
                          }`}>
                            {o.status}
                          </span>
                        </td>
                        <td className="py-4 text-gray-400 font-bold text-[10px] uppercase tracking-wider">{o.method}</td>
                        <td className="py-4 pr-2 text-right">
                          <button
                            onClick={() => handleUpdateOrderStatus(o.id)}
                            disabled={o.status === "Cancelled"}
                            className="text-rose-500 hover:text-rose-600 text-[10px] font-black uppercase tracking-wider disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            Toggle Status
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* TAB 4: NOTIFICATIONS CENTER */}
          {activeTab === "notifications" && (
            <motion.div
              key="notifications"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-6 text-left"
            >
              <div className="flex items-center justify-between border-b border-gray-50 pb-4">
                <h3 className="text-xs font-black uppercase tracking-widest text-gray-950">System Notifications</h3>
                {notifications.some(n => n.unread) && (
                  <button 
                    onClick={markAllRead}
                    className="text-[10px] font-black uppercase tracking-widest text-rose-500 hover:text-rose-600"
                  >
                    Mark all as read
                  </button>
                )}
              </div>

              <div className="space-y-3.5">
                {notifications.map(n => (
                  <div 
                    key={n.id} 
                    className={`flex items-start gap-4 p-4 rounded-2xl border transition duration-300 ${
                      n.unread 
                        ? "bg-rose-50/20 border-rose-100" 
                        : "bg-white border-gray-50"
                    }`}
                  >
                    <div className={`h-8 w-8 rounded-full shrink-0 flex items-center justify-center ${
                      n.unread ? "bg-rose-100 text-rose-600" : "bg-gray-100 text-gray-400"
                    }`}>
                      <Bell className="h-4 w-4" />
                    </div>
                    <div className="flex-1 space-y-1 text-left min-w-0">
                      <div className="flex justify-between items-center gap-4">
                        <p className="text-xs font-black text-gray-900 truncate">{n.title}</p>
                        <span className="text-[9px] text-gray-400 font-bold whitespace-nowrap">{n.time}</span>
                      </div>
                      <p className="text-xs text-gray-500 font-semibold leading-relaxed">{n.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

    </div>
  );
}
