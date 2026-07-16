import { motion } from "framer-motion";
import { Heart, Trash2, Plus, Minus } from "lucide-react";
import { useCart } from "../../context/card.context/useCartContext";
import { findFavroite } from "../../utils/findFavroite";

export const CartCard = ({ item }) => {
  const { cartDispatch, favourite } = useCart();
  const isFavorite = findFavroite(favourite, item?._id);
  const imageUrl = item?.images?.[0]?.url || item?.images?.url || "/no-image.png";

  const countInc = () => {
    cartDispatch({ type: "INCREMENT_QTY", payload: item._id });
  };

  const countDec = () => {
    cartDispatch({ type: "DECREMENT_QTY", payload: item._id });
  };

  const onRemoveClick = () => {
    cartDispatch({ type: "REMOVE_FROM_CART", payload: item._id });
  };

  const onFavoriteClick = () => {
    cartDispatch({
      type: isFavorite ? "REMOVE_FROM_FAVORITE" : "ADD_TO_FAVORITE",
      payload: isFavorite ? item._id : item,
    });
  };

  return (
    <article className="flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-all duration-300 hover:border-rose-100 hover:shadow-[0_12px_24px_rgba(244,63,94,0.03)] sm:flex-row sm:items-center">
      {/* Product Image */}
      <img
        src={imageUrl}
        alt={item?.name}
        className="h-24 w-full rounded-xl bg-gray-50/50 object-contain p-2.5 sm:w-24 shrink-0 border border-gray-50"
      />

      {/* Info Column */}
      <div className="min-w-0 flex-1 text-left">
        <span className="text-[9px] font-black uppercase tracking-[0.25em] text-rose-500">
          {item?.category || "FlowerKart"}
        </span>
        <h3 className="mt-1 line-clamp-1 text-base font-black text-gray-900 leading-tight">
          {item?.title || item?.name}
        </h3>
        <p className="mt-1 line-clamp-2 text-xs font-semibold leading-relaxed text-gray-400">
          {item?.description || "Fresh florist arrangements designed with love."}
        </p>
        
        {/* Actions (Wishlist & Remove) */}
        <div className="mt-3 flex gap-2">
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onFavoriteClick}
            className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[10px] font-black uppercase tracking-wider transition border ${
              isFavorite 
                ? "bg-rose-50 border-rose-100 text-rose-600" 
                : "bg-gray-50 border-transparent text-gray-500 hover:text-rose-600 hover:border-rose-100"
            }`}
          >
            <Heart className={`h-3.5 w-3.5 ${isFavorite ? "fill-rose-500 text-rose-500" : ""}`} />
            {isFavorite ? "Saved" : "Save"}
          </motion.button>
          
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onRemoveClick}
            className="inline-flex items-center gap-1.5 rounded-full bg-gray-50 border border-transparent hover:border-rose-100 hover:bg-rose-50 px-3.5 py-1.5 text-[10px] font-black uppercase tracking-wider text-gray-500 transition hover:text-rose-600"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Remove
          </motion.button>
        </div>
      </div>

      {/* Quantity Selector & Price Column */}
      <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end shrink-0 border-t border-gray-50 pt-3 sm:border-t-0 sm:pt-0">
        
        {/* Total Price */}
        <div className="text-right">
          <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400">Total Price</p>
          <p className="text-lg font-black text-gray-950 mt-0.5">
            ₹{(item?.price * item?.qty).toLocaleString()}
          </p>
        </div>

        {/* Adjust Qty */}
        <div className="flex items-center rounded-full bg-gray-50 border border-gray-100 p-0.5 shadow-sm">
          <motion.button
            type="button"
            whileTap={{ scale: 0.9 }}
            onClick={countDec}
            disabled={item.qty === 1}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-gray-600 shadow-sm transition disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Minus className="h-3.5 w-3.5" />
          </motion.button>
          
          <span className="min-w-9 text-center text-xs font-black text-gray-900">{item?.qty}</span>
          
          <motion.button
            type="button"
            whileTap={{ scale: 0.9 }}
            onClick={countInc}
            disabled={item.qty === 5}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-950 text-white shadow-sm transition hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Plus className="h-3.5 w-3.5" />
          </motion.button>
        </div>
        
        {item.qty === 5 && (
          <p className="text-[9px] font-black text-rose-500 uppercase tracking-wide">Max Order Limit</p>
        )}
      </div>
    </article>
  );
};
