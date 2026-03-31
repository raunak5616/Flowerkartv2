import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { Users } from './pages/Users';
import { Sellers } from './pages/Sellers';
import { DeliveryPartners } from './pages/DeliveryPartners';
import { Orders } from './pages/Orders';
import { Sidebar } from './components/Sidebar';
import { AdminLogin } from './pages/AdminLogin';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('adminAuth') === 'true';
  });

  const handleLogin = (status) => {
    setIsAuthenticated(status);
    localStorage.setItem('adminAuth', 'true');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('adminAuth');
  };

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-gray-50 font-sans selection:bg-red-100 selection:text-red-900">
        <Sidebar onLogout={handleLogout} />
        <main className="flex-1 p-10 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/users" element={<Users />} />
            <Route path="/sellers" element={<Sellers />} />
            <Route path="/delivery" element={<DeliveryPartners />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
