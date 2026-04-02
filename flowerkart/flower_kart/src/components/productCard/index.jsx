import { useCart } from "../../context/card.context/useCartContext";
import { findFavroite } from "../../utils/findFavroite";
import { findCart } from "../../utils/findCartitem";

export default function RecipeReviewCard({ product }) {
  const { cartDispatch, cart, favourite } = useCart();
  const isFavorite = findFavroite(favourite, product?._id);
  const isInCart = findCart(cart, product?._id);
  const {
    images: [{ url } = {}] = [],
  } = product || {};

  const onFavoriteClick = () => {
    cartDispatch({
      type: isFavorite ? "REMOVE_FROM_FAVORITE" : "ADD_TO_FAVORITE",
      payload: isFavorite ? product._id : product,
    })
  };

  const onCartClick = () => {
    cartDispatch({
      type: isInCart ? "REMOVE_FROM_CART" : "ADD_TO_CART",
      payload: isInCart ? product._id : product,
    })
  };

  return (
    <div className="group relative bg-white rounded-[2rem] p-4 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(244,63,94,0.15)] hover:-translate-y-2 border border-gray-100 flex flex-col h-[480px] w-full overflow-hidden">
      
      {/* Favorite Button Overlay */}
      <button 
        onClick={onFavoriteClick}
        className={`absolute top-6 right-6 z-30 h-10 w-10 rounded-full flex items-center justify-center transition-all duration-300 ${
          isFavorite 
          ? "bg-red-500 text-white shadow-lg shadow-red-200" 
          : "bg-white/80 backdrop-blur-sm text-gray-400 hover:text-red-500 hover:scale-110 shadow-sm"
        }`}
      >
        <span className="material-symbols-outlined text-lg">
          {isFavorite ? "favorite" : "favorite"}
        </span>
      </button>

      {/* Image Section */}
      <div className="relative aspect-square w-full rounded-[1.5rem] overflow-hidden bg-gray-50 mb-6 group-hover:bg-red-50/30 transition-colors pointer-events-none">
        <img 
          src={url || "/no-image.png"} 
          alt={product?.name}
          className="h-full w-full object-contain p-4 group-hover:scale-110 transition-transform duration-700 ease-out"
        />
        {product?.price < 500 && (
          <div className="absolute bottom-4 left-4 bg-black text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
            Best Value
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="flex flex-col flex-1 px-2 pointer-events-none">
        <div className="mb-2">
          <p className="text-[10px] font-black text-red-500 uppercase tracking-[0.2em] mb-1">
            Premium Bloom
          </p>
          <h3 className="text-lg font-black text-gray-900 leading-tight line-clamp-1 group-hover:text-red-600 transition-colors">
            {product?.name}
          </h3>
        </div>

        <p className="text-xs text-gray-500 font-medium line-clamp-2 leading-relaxed mb-4">
          {product?.description || "Experience the fresh fragrance and vibrant colors of our handpicked floral selection."}
        </p>

        <div className="mt-auto flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1 mb-1">
              <span className="material-symbols-outlined text-orange-400 text-xs">star</span>
              <span className="text-[10px] font-black text-gray-900">
                {product?.rating > 0 ? product.rating.toFixed(1) : "New"}
              </span>
              {product?.numReviews > 0 && (
                <span className="text-[9px] text-gray-400 font-bold">
                  ({product.numReviews})
                </span>
              )}
            </div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Price</p>
            <p className="text-2xl font-black text-gray-900 line-height-[1.1]">
              ₹{product?.price?.toLocaleString()}
            </p>
          </div>

          <button 
            onClick={onCartClick}
            className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-all duration-300 pointer-events-auto z-30 ${
              isInCart 
              ? "bg-red-600 text-white shadow-lg shadow-red-200" 
              : "bg-gray-900 text-white hover:bg-red-500 hover:scale-110 shadow-lg"
            }`}
          >
            <span className="material-symbols-outlined">
              {isInCart ? "shopping_bag" : "add_shopping_cart"}
            </span>
          </button>
        </div>
      </div>

      {/* Subtle Background Glow */}
      <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-red-100 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10" />
    </div>
  );
}
