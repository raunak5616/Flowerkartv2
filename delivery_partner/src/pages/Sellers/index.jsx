import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, RefreshCw, Store, ChevronDown, ChevronUp, Package } from 'lucide-react';

export const Sellers = () => {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [shopProducts, setShopProducts] = useState({});

  useEffect(() => {
    fetchSellers();
  }, []);

  const fetchSellers = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/admin/shops');
      setSellers(res.data);
    } catch (error) {
      console.error("Failed to fetch sellers");
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = async (id) => {
    if (expandedId === id) {
      setExpandedId(null);
      return;
    }
    setExpandedId(id);
    if (!shopProducts[id]) {
      try {
        const res = await axios.get(`http://localhost:5000/api/auth/productsById/${id}`);
        setShopProducts(prev => ({ ...prev, [id]: res.data }));
      } catch (error) {
        console.error("Failed to fetch shop products");
      }
    }
  };

  const deleteSeller = async (id) => {
    if (!window.confirm("Are you sure you want to remove this seller? This action is irreversible.")) return;
    try {
      await axios.delete(`http://localhost:5000/api/admin/shops/${id}`);
      fetchSellers();
    } catch (error) {
      alert("Failed to delete seller");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">Seller Management</h2>
          <p className="text-gray-500 text-sm">Review and manage all registered flower shops. Tap a shop to view products.</p>
        </div>
        <button 
          onClick={fetchSellers}
          className="p-3 bg-white border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
        >
          <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b border-gray-100 text-[10px] items-center font-black uppercase text-gray-400 tracking-widest">
            <tr>
              <th className="px-6 py-4">Shop Name</th>
              <th className="px-6 py-4">Owner</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Phone</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 font-medium">
            {sellers.map((seller) => (
              <React.Fragment key={seller._id}>
                <tr 
                  onClick={() => toggleExpand(seller._id)}
                  className={`cursor-pointer transition-colors ${expandedId === seller._id ? 'bg-red-50/30' : 'hover:bg-gray-50/50'}`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-red-gradient rounded-lg flex items-center justify-center text-white text-xs font-black">
                        {seller.shop ? seller.shop[0].toUpperCase() : 'S'}
                      </div>
                      <div>
                        <span className="font-bold text-gray-800 block">{seller.shop}</span>
                        <div className="flex items-center gap-1 text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
                          {expandedId === seller._id ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
                          {expandedId === seller._id ? 'Hide Details' : 'View Products'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{seller.name}</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-gray-100 rounded-full text-[10px] font-black uppercase text-gray-500">
                      {seller.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{seller.phone}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                      <button 
                        onClick={() => deleteSeller(seller._id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
                {expandedId === seller._id && (
                  <tr className="bg-gray-50/30">
                    <td colSpan="5" className="px-8 py-6">
                      <div className="animate-in slide-in-from-top-2 duration-300">
                        <div className="flex items-center gap-2 mb-6">
                           <Package className="text-red-500" size={20} />
                           <h4 className="text-sm font-black text-gray-800 uppercase tracking-widest">Inventory ({shopProducts[seller._id]?.length || 0})</h4>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {shopProducts[seller._id] ? (
                            shopProducts[seller._id].map(product => (
                              <div key={product._id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                                <img src={product.images[0]?.url} alt="" className="h-16 w-16 object-cover rounded-xl bg-gray-100" />
                                <div>
                                  <p className="font-bold text-gray-800">{product.name}</p>
                                  <div className="flex gap-2 items-center mt-1">
                                    <p className="text-xs font-black text-red-500">₹{product.price}</p>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase">Stock: {product.stock}</p>
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="col-span-3 text-center py-4 text-gray-400">Loading products...</div>
                          )}
                          {shopProducts[seller._id]?.length === 0 && (
                             <div className="col-span-3 py-10 text-center border-2 border-dashed border-gray-100 rounded-3xl">
                               <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">No products uploaded by this seller</p>
                             </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
        {sellers.length === 0 && !loading && (
          <div className="p-20 text-center">
            <Store size={48} className="mx-auto text-gray-200 mb-4" />
            <p className="text-gray-400 font-bold">No sellers found</p>
          </div>
        )}
      </div>
    </div>
  );
};
