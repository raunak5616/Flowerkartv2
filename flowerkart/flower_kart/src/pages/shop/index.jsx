import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Store, Star, ArrowRight, Sparkles } from "lucide-react";
import { getShop } from "../../apiCalls/shopApi";
import ShopCard from "../../components/shopCard";

export default function Shop() {
  const navigate = useNavigate();
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleShopClick = (id) => {
    navigate(`/shop/${id}`);
  };

  useEffect(() => {
    const fetchShop = async () => {
      try {
        const response = await getShop();
        setShops(response || []);
      } catch (error) {
        console.error("🔥 FETCH SHOP ERROR 🔥", error);
      } finally {
        setLoading(false);
      }
    };
    fetchShop();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50/50 pt-20 sm:pt-28 pb-16 px-6 text-left">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header Section */}
        <div className="max-w-xl text-left">
          <div className="inline-flex items-center gap-2 rounded-full bg-rose-50 px-3.5 py-1.5 text-[9px] font-black uppercase tracking-widest text-rose-700 border border-rose-100/50 mb-3.5">
            <Sparkles className="h-3.5 w-3.5" />
            Verified Partners
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-gray-950 leading-tight">
            Our Florist Shops
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 font-semibold leading-relaxed mt-2.5">
            Discover and buy arrangements crafted directly by boutique local florists nearby. Freshness is guaranteed for every transaction.
          </p>
        </div>

        {/* List Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(4)].map((_, idx) => (
              <div key={idx} className="bg-white rounded-[2rem] border border-gray-100 p-5 space-y-4 animate-pulse">
                <div className="h-44 bg-gray-100 rounded-2xl w-full" />
                <div className="space-y-2.5">
                  <div className="h-3 bg-gray-100 rounded w-1/3" />
                  <div className="h-4.5 bg-gray-100 rounded w-3/4" />
                  <div className="h-3.5 bg-gray-100 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : !shops || shops.length === 0 ? (
          <div className="text-center py-20 bg-white border border-gray-100 rounded-[2.5rem]">
            <Store className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-sm font-black text-gray-700 uppercase tracking-wider">No Partner Shops Listed</p>
            <p className="text-xs text-gray-400 mt-1">Please check back later or contact support.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-center">
            {shops.map((shop) => (
              <ShopCard
                key={shop._id}
                shop={shop}
                onClick={handleShopClick}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}