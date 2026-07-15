import { HeartIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useCart } from "../../context/card.context/useCartContext";
import { findFavroite } from "../../utils/findFavroite";

export const CartCard = ({ item }) => {
  const { cartDispatch, favourite } = useCart();
  const isFavorite = findFavroite(favourite, item?._id);
  const {
    images: [{ url } = {}] = [],
  } = item || {};

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
    <article className="flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition hover:border-rose-100 hover:shadow-md sm:flex-row sm:items-center">
      <img
        src={url || "/no-image.png"}
        alt={item?.name}
        className="h-28 w-full rounded-2xl bg-gray-50 object-contain p-3 sm:w-28"
      />

      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-black uppercase tracking-[0.25em] text-rose-500">{item?.category || "FlowerKart"}</p>
        <h3 className="mt-1 line-clamp-1 text-lg font-black text-gray-950">{item?.title || item?.name}</h3>
        <p className="mt-1 line-clamp-2 text-sm leading-6 text-gray-500">{item?.description || "Freshly packed for delivery."}</p>
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={onFavoriteClick}
            className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-bold transition ${
              isFavorite ? "bg-rose-50 text-rose-700" : "bg-gray-50 text-gray-500 hover:text-rose-600"
            }`}
          >
            <HeartIcon className="h-4 w-4" />
            {isFavorite ? "Saved" : "Save"}
          </button>
          <button
            type="button"
            onClick={onRemoveClick}
            className="inline-flex items-center gap-1 rounded-full bg-gray-50 px-3 py-1.5 text-xs font-bold text-gray-500 transition hover:bg-rose-50 hover:text-rose-700"
          >
            <TrashIcon className="h-4 w-4" />
            Remove
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
        <p className="text-xl font-black text-gray-950">₹{(item?.price * item?.qty).toFixed(2)}</p>
        <div className="flex items-center rounded-full bg-gray-50 p-1">
          <button
            type="button"
            onClick={countDec}
            disabled={item.qty === 1}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-lg font-black text-gray-700 shadow-sm transition hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-40"
          >
            -
          </button>
          <span className="min-w-10 text-center text-sm font-black text-gray-950">{item?.qty}</span>
          <button
            type="button"
            onClick={countInc}
            disabled={item.qty === 5}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-950 text-lg font-black text-white shadow-sm transition hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-40"
          >
            +
          </button>
        </div>
        {item.qty === 5 && <p className="text-xs font-bold text-rose-500">Maximum quantity reached</p>}
      </div>
    </article>
  );
};
