import { HeartIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import RecipeReviewCard from "../../components/productCard";
import { useCart } from "../../context/card.context/useCartContext";
import EmptyState from "../../components/ui/EmptyState";

const Favorite = () => {
  const navigate = useNavigate();
  const { favourite } = useCart();

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-rose-500">Saved for later</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-gray-950">Wishlist</h1>
        </div>

        {favourite.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {favourite.map((item) => (
              <RecipeReviewCard key={item._id || item.id} product={item} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={HeartIcon}
            title="Your wishlist is empty"
            description="Save flowers you love and come back when the moment is right."
            actionLabel="Explore products"
            onAction={() => navigate("/products")}
          />
        )}
      </div>
    </main>
  );
};

export default Favorite;
