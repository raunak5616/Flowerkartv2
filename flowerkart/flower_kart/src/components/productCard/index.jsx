import { useState, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Heart, 
  ShoppingBag, 
  Plus, 
  Check, 
  Star, 
  Eye, 
  X,
  Truck,
  ShieldCheck,
  PackageCheck
} from "lucide-react";
import { Dialog, DialogPanel, DialogTitle, Transition } from "@headlessui/react";
import { useCart } from "../../context/card.context/useCartContext";
import { findCart } from "../../utils/findCartitem";
import { findFavroite } from "../../utils/findFavroite";

export default function RecipeReviewCard({ product }) {
  const navigate = useNavigate();
  const { cartDispatch, cart, favourite } = useCart();
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  const isFavorite = findFavroite(favourite, product?._id);
  const isInCart = findCart(cart, product?._id);

  // Safe image parsing
  const imageUrl = product?.images?.[0]?.url || product?.images?.url || "/no-image.png";

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

  // Simulated Stock Level based on name length or product rating
  const isLowStock = product?.price > 1200;

  return (
    <>
      <article
        onClick={() => navigate(`/products/${product?._id}`)}
        className="group relative flex h-[440px] w-full cursor-pointer flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white p-3.5 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-rose-100 hover:shadow-[0_20px_40px_rgba(244,63,94,0.06)]"
      >
        {/* Wishlist Icon */}
        <motion.button
          type="button"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onFavoriteClick}
          aria-label={isFavorite ? "Remove from wishlist" : "Add to wishlist"}
          className={`absolute right-5 top-5 z-20 flex h-9 w-9 items-center justify-center rounded-full backdrop-blur-md transition-colors ${
            isFavorite
              ? "bg-rose-600 text-white shadow-md shadow-rose-200"
              : "bg-white/80 text-gray-400 hover:text-rose-500 shadow-sm border border-gray-100"
          }`}
        >
          <Heart className={`h-4.5 w-4.5 ${isFavorite ? "fill-white" : ""}`} />
        </motion.button>

        {/* Badges */}
        <div className="absolute left-5 top-5 z-20 flex flex-col gap-1.5 items-start">
          {product?.discount > 0 && (
            <span className="rounded-full bg-gray-950 px-2.5 py-1 text-[9px] font-black uppercase tracking-widest text-white">
              {product.discount}% off
            </span>
          )}
          {isLowStock ? (
            <span className="rounded-full bg-amber-500/90 text-white px-2.5 py-1 text-[9px] font-black uppercase tracking-widest">
              Low Stock
            </span>
          ) : (
            <span className="rounded-full bg-emerald-500/10 text-emerald-700 border border-emerald-100 px-2.5 py-1 text-[9px] font-black uppercase tracking-widest">
              In Stock
            </span>
          )}
        </div>

        {/* Image Showcase */}
        <div className="relative mb-4 aspect-square w-full overflow-hidden rounded-2xl bg-gray-50/50 flex items-center justify-center">
          <img
            src={imageUrl}
            alt={product?.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />

          {/* Quick View trigger button (Desktop only, visible on hover) */}
          <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation();
                setIsQuickViewOpen(true);
              }}
              className="px-4 py-2 bg-white/95 backdrop-blur-md rounded-full shadow-lg border border-gray-100 flex items-center gap-1.5 text-xs font-black text-gray-800 uppercase tracking-wider scale-95 group-hover:scale-100 transition duration-300"
            >
              <Eye className="h-3.5 w-3.5" />
              Quick View
            </motion.button>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col px-1 text-left">
          <div className="mb-2 flex items-center justify-between gap-3">
            <p className="truncate text-[9px] font-black uppercase tracking-[0.2em] text-rose-500">
              {product?.category || "Premium Bloom"}
            </p>
            <div className="flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[9px] font-black text-gray-900 border border-amber-100/50">
              <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
              <span>{product?.rating > 0 ? product.rating.toFixed(1) : "New"}</span>
            </div>
          </div>

          <h3 className="line-clamp-1 text-base font-black leading-tight text-gray-950 transition-colors group-hover:text-rose-600">
            {product?.name}
          </h3>

          <p className="mb-4 mt-1.5 line-clamp-2 text-xs font-medium leading-normal text-gray-400">
            {product?.description || "Fresh, handpicked florals prepared for doorstep delivery."}
          </p>

          {/* Price & Cart Add Button */}
          <div className="mt-auto flex items-end justify-between gap-3">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400">Price</p>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-xl font-black leading-none text-gray-950">
                  ₹{finalPrice?.toLocaleString()}
                </span>
                {product?.discount > 0 && (
                  <span className="text-[10px] font-bold text-gray-400 line-through">
                    ₹{product?.price?.toLocaleString()}
                  </span>
                )}
              </div>
            </div>

            {/* Cart Trigger */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onCartClick}
              aria-label={isInCart ? "Remove from cart" : "Add to cart"}
              className={`z-20 flex h-11 w-11 items-center justify-center rounded-xl shadow-md transition-all duration-300 ${
                isInCart
                  ? "bg-rose-600 text-white shadow-rose-200"
                  : "bg-gray-950 text-white hover:bg-rose-600 shadow-gray-200"
              }`}
            >
              <AnimatePresence mode="wait" initial={false}>
                {isInCart ? (
                  <motion.div
                    key="check"
                    initial={{ scale: 0.5, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0.5, rotate: 45 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Check className="h-4.5 w-4.5 text-white" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="plus"
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0.5 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center"
                  >
                    <ShoppingBag className="h-4 w-4" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </article>

      {/* QUICK VIEW DIALOG DIALOG */}
      <Transition appear show={isQuickViewOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setIsQuickViewOpen(false)}>
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" aria-hidden="true" />
          
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <DialogPanel as={motion.div} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-2xl transform overflow-hidden rounded-[2.5rem] bg-white p-6 shadow-2xl transition-all border border-gray-100 grid md:grid-cols-2 gap-6 relative">
              <button
                onClick={() => setIsQuickViewOpen(false)}
                className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-900 bg-gray-50 rounded-full hover:bg-gray-100 transition z-10"
              >
                <X className="h-4.5 w-4.5" />
              </button>

              {/* Left Image Column */}
              <div className="rounded-2xl bg-gray-50/50 p-4 flex items-center justify-center aspect-square">
                <img
                  src={imageUrl}
                  alt={product?.name}
                  className="max-h-full max-w-full object-contain rounded-xl"
                />
              </div>

              {/* Right Content Column */}
              <div className="flex flex-col text-left justify-center py-2">
                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-rose-500">{product?.category}</span>
                <DialogTitle as="h3" className="text-xl sm:text-2xl font-black text-gray-950 mt-1.5 leading-tight">
                  {product?.name}
                </DialogTitle>

                <div className="flex items-center gap-1.5 mt-2 bg-amber-50 border border-amber-100/50 rounded-full px-2.5 py-0.5 w-fit">
                  <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                  <span className="text-[10px] font-black text-gray-800">{product?.rating?.toFixed(1) || "New"} Rating</span>
                </div>

                <p className="text-xs text-gray-500 font-semibold leading-relaxed mt-4">
                  {product?.description || "Curated and handcrafted premium floral designs sourced from boutique local farms, delivered in premium protective wrappers."}
                </p>

                <div className="flex items-baseline gap-2 mt-5">
                  <span className="text-2xl font-black text-gray-990">₹{finalPrice?.toLocaleString()}</span>
                  {product?.discount > 0 && (
                    <span className="text-xs font-bold text-gray-400 line-through">₹{product?.price?.toLocaleString()}</span>
                  )}
                </div>

                {/* Badges and actions */}
                <div className="grid grid-cols-2 gap-2 mt-5 text-[10px] font-black text-gray-700">
                  <div className="flex items-center gap-2 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                    <Truck className="h-4 w-4 text-rose-600" />
                    <span>Same-Day Delivery</span>
                  </div>
                  <div className="flex items-center gap-2 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                    <ShieldCheck className="h-4 w-4 text-rose-600" />
                    <span>Secure Checkout</span>
                  </div>
                </div>

                <div className="mt-6 flex gap-2.5">
                  <button
                    onClick={onCartClick}
                    className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest text-white shadow-md transition-colors flex items-center justify-center gap-2 ${
                      isInCart ? "bg-rose-600 hover:bg-rose-700 shadow-rose-100" : "bg-gray-950 hover:bg-rose-600 shadow-gray-100"
                    }`}
                  >
                    <ShoppingBag className="h-4 w-4" />
                    {isInCart ? "In Cart (Remove)" : "Add to Cart"}
                  </button>
                  <button
                    onClick={onFavoriteClick}
                    className={`px-4 py-3 rounded-xl border transition flex items-center justify-center ${
                      isFavorite 
                        ? "bg-rose-50 border-rose-100 text-rose-600 hover:bg-rose-100" 
                        : "bg-white border-gray-200 text-gray-400 hover:text-rose-500 hover:border-rose-100"
                    }`}
                  >
                    <Heart className={`h-4.5 w-4.5 ${isFavorite ? "fill-rose-500 text-rose-500" : ""}`} />
                  </button>
                </div>
              </div>
            </DialogPanel>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
