import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, RefreshCw, Truck, MapPin, ChevronDown, ChevronUp, User, Shield, CreditCard } from 'lucide-react';

export const DeliveryPartners = () => {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_DELIVERY_API_URL}/api/admin/delivery-partners`);
      setPartners(res.data);
    } catch (error) {
      console.error("Failed to fetch delivery partners");
    } finally {
      setLoading(false);
    }
  };

  const deletePartner = async (id) => {
    if (!window.confirm("Delete this delivery partner?")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_DELIVERY_API_URL}/api/admin/delivery-partners/${id}`);
      fetchPartners();
    } catch (error) {
      alert("Failed to delete partner");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">Delivery Fleet</h2>
          <p className="text-gray-500 text-sm">Monitor and manage your active delivery agents. Tap for full profile.</p>
        </div>
        <button 
          onClick={fetchPartners}
          className="p-3 bg-white border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
        >
          <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100 text-[10px] items-center font-black uppercase text-gray-400 tracking-widest">
            <tr>
              <th className="px-6 py-4">Agent Name</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Phone</th>
              <th className="px-6 py-4">Vehicle</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 font-medium text-sm">
            {partners.map((partner) => (
              <React.Fragment key={partner._id}>
                <tr 
                  onClick={() => setExpandedId(expandedId === partner._id ? null : partner._id)}
                  className={`cursor-pointer transition-colors ${expandedId === partner._id ? 'bg-green-50/30' : 'hover:bg-gray-50/50'}`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-green-100 text-green-600 rounded-xl flex items-center justify-center font-black">
                        <Truck size={20} />
                      </div>
                      <div>
                        <span className="font-bold text-gray-800 block">{partner.name}</span>
                        <div className="flex items-center gap-1 text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
                          {expandedId === partner._id ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
                          {expandedId === partner._id ? 'Hide Profile' : 'View Details'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{partner.email}</td>
                  <td className="px-6 py-4 text-gray-600">{partner.phone}</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-[10px] items-center font-black uppercase">
                      {partner.vehicleType || "Fleet Agent"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                      <button 
                        onClick={(e) => { e.stopPropagation(); deletePartner(partner._id); }}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                  </td>
                </tr>
                {expandedId === partner._id && (
                   <tr className="bg-green-50/5">
                      <td colSpan="5" className="px-8 py-8">
                         <div className="animate-in slide-in-from-top-2 duration-300 grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
                               <div className="flex justify-between items-center">
                                  <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Personal Identification</h4>
                                  <User size={16} className="text-green-500" />
                               </div>
                               <div className="space-y-2">
                                  <p className="text-xs font-bold text-gray-500 uppercase tracking-tighter">Full Name</p>
                                  <p className="text-sm font-black text-gray-900">{partner.name}</p>
                               </div>
                               <div className="space-y-2">
                                  <p className="text-xs font-bold text-gray-500 uppercase tracking-tighter">Contact Email</p>
                                  <p className="text-sm font-black text-gray-900">{partner.email}</p>
                               </div>
                            </div>
                            
                            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
                               <div className="flex justify-between items-center">
                                  <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Work Credentials</h4>
                                  <Shield size={16} className="text-green-500" />
                               </div>
                               <div className="space-y-2">
                                  <p className="text-xs font-bold text-gray-500 uppercase tracking-tighter">Phone Number</p>
                                  <p className="text-sm font-black text-gray-900">{partner.phone}</p>
                               </div>
                               <div className="space-y-2">
                                  <p className="text-xs font-bold text-gray-500 uppercase tracking-tighter">Verification ID</p>
                                  <p className="text-sm font-black text-gray-900 font-mono tracking-tighter">FP-DP-{partner._id.slice(-6).toUpperCase()}</p>
                               </div>
                            </div>

                            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-center items-center text-center space-y-3">
                               <div className="h-16 w-16 bg-green-gradient rounded-3xl flex items-center justify-center text-white shadow-lg shadow-green-200">
                                  <CreditCard size={32} />
                               </div>
                               <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mt-2">Active Wallet Status</p>
                               <p className="text-2xl font-black text-gray-900 tracking-tight">Healthy</p>
                            </div>
                         </div>
                      </td>
                   </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
        {partners.length === 0 && !loading && (
          <div className="p-24 text-center">
            <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
               <Truck className="text-gray-300" size={32} />
            </div>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Fleet is currently empty</p>
          </div>
        )}
      </div>
    </div>
  );
};
