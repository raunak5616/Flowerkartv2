import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Store, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { getProductById } from "../../apiCalls/productapi";
import RecipeReviewCard from "../../components/productCard";
import ProductSkeleton from "../../components/ui/ProductSkeleton";

export const ShopByProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [productsbyshop, setProductsByShop] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductByShop = async () => {
      try {
        const data = await getProductById(id);
        setProductsByShop(data || []);
      } catch (error) {
        console.error("🔥 FETCH PRODUCTS BY SHOP ERROR 🔥", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProductByShop();
  }, [id]);

  return (
    <main className="min-h-screen bg-gray-50/50 pt-20 sm:pt-28 pb-16 px-6 text-left">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Back navigation */}
        <motion.button
          type="button"
          whileHover={{ x: -3 }}
          onClick={() => navigate("/shop")}
          className="inline-flex items-center gap-2 rounded-full bg-white border border-gray-100 px-4 py-2 text-xs font-black uppercase tracking-widest text-gray-500 shadow-sm hover:text-rose-600 transition animate-in fade-in"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Shops
        </motion.button>

        {/* Shop banner header */}
        <div className="rounded-[2.5rem] bg-gray-950 text-white p-8 sm:p-10 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="max-w-xl relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/5 px-3 py-1.5 text-[9px] font-black uppercase tracking-widest text-rose-400">
              <Store className="h-3.5 w-3.5" />
              Verified Florist Shop Menu
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
              {productsbyshop?.[0]?.shop || "Local Florist Selection"}
            </h1>
            <p className="text-xs text-gray-400 leading-relaxed font-semibold">
              Browse through this seller's specific daily inventory. All blooms are cut, wrapped, and prepared locally on ordering.
            </p>
          </div>
        </div>

        {/* Products lists grid */}
        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <ProductSkeleton count={4} />
          </div>
        ) : !productsbyshop || productsbyshop.length === 0 ? (
          <div className="text-center py-20 bg-white border border-gray-100 rounded-[2.5rem]">
            <Store className="h-10 w-10 text-gray-300 mx-auto mb-4" />
            <p className="text-sm font-black text-gray-700 uppercase tracking-wider">No Products Found</p>
            <p className="text-xs text-gray-400 mt-1">This florist hasn't listed any floral inventory today.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {productsbyshop.map((product) => (
              <RecipeReviewCard key={product._id || product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
};
export default ShopByProduct;