import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Store, 
  Truck, 
  ShoppingBag,
  LogOut,
  ShieldCheck
} from 'lucide-react';

export const Sidebar = ({ onLogout }) => {
  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { name: 'Sellers', icon: Store, path: '/sellers' },
    { name: 'Users', icon: Users, path: '/users' },
    { name: 'Delivery Partners', icon: Truck, path: '/delivery' },
    { name: 'Orders', icon: ShoppingBag, path: '/orders' },
  ];

  return (
    <aside className="w-72 bg-white border-r border-gray-100 flex flex-col h-screen sticky top-0 shadow-sm">
      <div className="p-8 flex items-center gap-3">
        <div className="h-10 w-10 bg-red-gradient rounded-xl flex items-center justify-center text-white shadow-lg">
          <ShieldCheck size={24} />
        </div>
        <div>
          <h1 className="text-xl font-black text-gray-900 leading-none">FlowerKart</h1>
          <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest mt-1">Admin Panel</p>
        </div>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                isActive
                  ? 'bg-red-50 text-red-600 shadow-sm'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <item.icon size={20} />
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <button 
          onClick={onLogout}
          className="flex items-center gap-3 px-4 py-3 w-full text-left rounded-xl text-sm font-bold text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
        >
          <LogOut size={20} />
          Sign Out
        </button>
      </div>
    </aside>
  );
};
