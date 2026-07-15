import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/card.context/useCartContext";
import { findCart } from "../../utils/findCartitem";
import { findFavroite } from "../../utils/findFavroite";

export default function RecipeReviewCard({ product }) {
  const navigate = useNavigate();
  const { cartDispatch, cart, favourite } = useCart();
  const isFavorite = findFavroite(favourite, product?._id);
  const isInCart = findCart(cart, product?._id);
  const {
    images: [{ url } = {}] = [],
  } = product || {};

  const finalPrice = product?.discount > 0
    ? Math.round(product.price - (product.price * product.discount) / 100)
    : product?.price;

  const onFavoriteClick = (event) => {
    event.stopPropagation();
    cartDispatch({
      type: isFavorite ? "REMOVE_FROM_FAVORITE" : "ADD_TO_FAVORITE",
      payload: isFavorite ? product._id : product,
    });
  };

  const onCartClick = (event) => {
    event.stopPropagation();
    cartDispatch({
      type: isInCart ? "REMOVE_FROM_CART" : "ADD_TO_CART",
      payload: isInCart ? product._id : product,
    });
  };

  return (
    <article
      onClick={() => navigate(`/products/${product?._id}`)}
      className="group relative flex h-[440px] w-full cursor-pointer flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-rose-100 hover:shadow-2xl hover:shadow-rose-100/70"
    >
      <button
        type="button"
        onClick={onFavoriteClick}
        aria-label={isFavorite ? "Remove from wishlist" : "Add to wishlist"}
        className={`absolute right-6 top-6 z-30 flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 ${
          isFavorite
            ? "bg-rose-600 text-white shadow-lg shadow-rose-200"
            : "bg-white/90 text-gray-400 shadow-sm backdrop-blur hover:scale-110 hover:text-rose-600"
        }`}
      >
        <span className="material-symbols-outlined text-lg" aria-hidden="true">favorite</span>
      </button>

      {product?.discount > 0 && (
        <div className="absolute left-6 top-6 z-20 rounded-full bg-gray-950 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white">
          {product.discount}% off
        </div>
      )}

      <div className="relative mb-5 aspect-square w-full overflow-hidden rounded-2xl bg-gradient-to-br from-rose-50 via-white to-gray-50">
        <img
          src={url || "/no-image.png"}
          alt={product?.name}
          loading="lazy"
          className="h-full w-full object-contain p-5 transition-transform duration-700 ease-out group-hover:scale-105"
        />
      </div>

      <div className="flex flex-1 flex-col px-1">
        <div className="mb-2 flex items-center justify-between gap-3">
          <p className="truncate text-[10px] font-black uppercase tracking-[0.2em] text-rose-500">
            {product?.category || "Premium Bloom"}
          </p>
          <div className="flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-[10px] font-black text-gray-900">
            <span className="material-symbols-outlined text-xs text-amber-400" aria-hidden="true">star</span>
            {product?.rating > 0 ? product.rating.toFixed(1) : "New"}
          </div>
        </div>

        <h3 className="line-clamp-1 text-lg font-black leading-tight text-gray-950 transition-colors group-hover:text-rose-600">
          {product?.name}
        </h3>

        <p className="mb-4 mt-2 line-clamp-2 text-sm font-medium leading-6 text-gray-500">
          {product?.description || "Fresh, handpicked florals prepared for doorstep delivery."}
        </p>

        <div className="mt-auto flex items-end justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Delivered fresh</p>
            <p className="text-2xl font-black leading-tight text-gray-950">
              ₹{finalPrice?.toLocaleString()}
            </p>
            {product?.discount > 0 && (
              <p className="text-xs font-bold text-gray-400 line-through">₹{product?.price?.toLocaleString()}</p>
            )}
          </div>

          <button
            type="button"
            onClick={onCartClick}
            aria-label={isInCart ? "Remove from cart" : "Add to cart"}
            className={`z-30 flex h-12 w-12 items-center justify-center rounded-2xl transition-all duration-300 ${
              isInCart
                ? "bg-rose-600 text-white shadow-lg shadow-rose-200"
                : "bg-gray-950 text-white shadow-lg shadow-gray-200 hover:scale-110 hover:bg-rose-600"
            }`}
          >
            <span className="material-symbols-outlined" aria-hidden="true">
              {isInCart ? "shopping_bag" : "add_shopping_cart"}
            </span>
          </button>
        </div>
      </div>
    </article>
  );
}
