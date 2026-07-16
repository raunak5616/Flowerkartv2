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
    <article className="flex gap-4 rounded-2xl border border-gray-100 bg-white p-3 sm:p-4 shadow-sm transition-all duration-300 hover:border-rose-100 hover:shadow-[0_12px_24px_rgba(244,63,94,0.03)]">
      {/* Product Image */}
      <img
        src={imageUrl}
        alt={item?.name}
        className="h-20 w-20 sm:h-24 sm:w-24 rounded-xl bg-gray-50/50 object-contain p-2 shrink-0 border border-gray-50"
      />

      {/* Info Column */}
      <div className="min-w-0 flex-1 flex flex-col justify-between">
        
        {/* Title row */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
          <div className="min-w-0 text-left">
            <span className="text-[9px] font-black uppercase tracking-[0.25em] text-rose-500">
              {item?.category || "FlowerKart"}
            </span>
            <h3 className="mt-0.5 line-clamp-1 text-sm sm:text-base font-black text-gray-900 leading-tight">
              {item?.title || item?.name}
            </h3>
            <p className="mt-1 line-clamp-1 sm:line-clamp-2 text-[11px] sm:text-xs font-semibold leading-relaxed text-gray-400">
              {item?.description || "Fresh florist arrangements designed with love."}
            </p>
          </div>
          
          {/* Total Price (Desktop/Tablet) */}
          <div className="hidden sm:block text-right shrink-0">
            <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400">Total Price</p>
            <p className="text-base font-black text-gray-950 mt-0.5">
              ₹{(item?.price * item?.qty).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Action buttons and Quantity selectors row */}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-gray-50 pt-3">
          
          {/* Actions */}
          <div className="flex gap-2">
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onFavoriteClick}
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[9px] sm:text-[10px] font-black uppercase tracking-wider transition border ${
                isFavorite 
                  ? "bg-rose-50 border-rose-100 text-rose-600" 
                  : "bg-gray-50 border-transparent text-gray-500 hover:text-rose-600 hover:border-rose-100"
              }`}
            >
              <Heart className={`h-3 w-3 ${isFavorite ? "fill-rose-500 text-rose-500" : ""}`} />
              <span className="hidden xs:inline">{isFavorite ? "Saved" : "Save"}</span>
            </motion.button>
            
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onRemoveClick}
              className="inline-flex items-center gap-1.5 rounded-full bg-gray-50 border border-transparent hover:border-rose-100 hover:bg-rose-50 px-2.5 py-1 text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-gray-500 transition hover:text-rose-600"
            >
              <Trash2 className="h-3 w-3" />
              <span className="hidden xs:inline">Remove</span>
            </motion.button>
          </div>

          {/* Quantity and Price */}
          <div className="flex items-center gap-3.5">
            {/* Total Price (Mobile only) */}
            <div className="sm:hidden text-right">
              <p className="text-[8px] font-bold uppercase tracking-wider text-gray-400 leading-none">Price</p>
              <p className="text-sm font-black text-gray-950 mt-0.5">
                ₹{(item?.price * item?.qty).toLocaleString()}
              </p>
            </div>

            {/* Adjust Qty */}
            <div className="flex items-center rounded-full bg-gray-50 border border-gray-100 p-0.5 shadow-sm">
              <button
                type="button"
                onClick={countDec}
                disabled={item.qty === 1}
                className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-gray-600 shadow-sm transition disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Minus className="h-3 w-3" />
              </button>
              
              <span className="min-w-6 text-center text-xs font-black text-gray-900">{item?.qty}</span>
              
              <button
                type="button"
                onClick={countInc}
                disabled={item.qty === 5}
                className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-950 text-white shadow-sm transition hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Plus className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </article>
  );
};
