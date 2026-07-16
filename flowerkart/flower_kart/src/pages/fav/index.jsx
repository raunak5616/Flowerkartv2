import { Heart, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import RecipeReviewCard from "../../components/productCard";
import { useCart } from "../../context/card.context/useCartContext";
import EmptyState from "../../components/ui/EmptyState";

const Favorite = () => {
  const navigate = useNavigate();
  const { favourite } = useCart();

  return (
    <main className="min-h-screen bg-gray-50/50 px-6 pt-20 sm:pt-28 pb-10 text-left">
      <div className="mx-auto max-w-7xl space-y-8">
        
        {/* Header Section */}
        <div className="max-w-xl text-left">
          <div className="inline-flex items-center gap-2 rounded-full bg-rose-50 px-3.5 py-1.5 text-[9px] font-black uppercase tracking-widest text-rose-700 border border-rose-100/50 mb-3.5">
            <Sparkles className="h-3.5 w-3.5 animate-pulse" />
            Curated list
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-gray-950 leading-tight">
            Your Wishlist
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 font-semibold leading-relaxed mt-2.5">
            Review your saved premium flower arrangements, botanical bundles, and vases, and check out whenever you are ready.
          </p>
        </div>

        {/* Favorite Grid / Empty state */}
        {favourite.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {favourite.map((item) => (
              <RecipeReviewCard key={item._id || item.id} product={item} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Heart}
            title="Your wishlist is empty"
            description="Save flowers you love from our catalog and they will appear here instantly."
            actionLabel="Explore catalog"
            onAction={() => navigate("/products")}
          />
        )}
      </div>
    </main>
  );
};

export default Favorite;
