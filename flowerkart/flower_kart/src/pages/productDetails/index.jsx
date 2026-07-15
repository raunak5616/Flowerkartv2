import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeftIcon, HeartIcon, ShieldCheckIcon, TruckIcon } from "@heroicons/react/24/outline";
import { useCart } from "../../context/card.context/useCartContext";
import { findCart } from "../../utils/findCartitem";
import { findFavroite } from "../../utils/findFavroite";
import EmptyState from "../../components/ui/EmptyState";
import { getCachedProducts, getProducts } from "../../apiCalls/productapi";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cart, favourite, cartDispatch } = useCart();
  const [catalogProducts, setCatalogProducts] = useState(getCachedProducts());
  const products = useMemo(() => [...catalogProducts, ...cart, ...favourite], [catalogProducts, cart, favourite]);
  const product = products.find((item) => item?._id === id || item?.id === id);
  const isInCart = findCart(cart, id);
  const isFavorite = findFavroite(favourite, id);

  useEffect(() => {
    if (catalogProducts.length > 0) return;
    getProducts()
      .then((items) => setCatalogProducts(items || []))
      .catch((error) => console.error("Failed to load product details", error));
  }, [catalogProducts.length]);

  if (!product) {
    return (
      <main className="min-h-[70vh] bg-gray-50 px-4 py-16">
        <EmptyState
          title="Open this product from a listing"
          description="Product details use the item already loaded in your browsing session. Head back to products and choose a flower."
          actionLabel="Browse products"
          onAction={() => navigate("/products")}
        />
      </main>
    );
  }

  const imageUrl = product.images?.[0]?.url || "/no-image.png";
  const finalPrice = product.discount > 0
    ? Math.round(product.price - (product.price * product.discount) / 100)
    : product.price;

  const toggleCart = () => {
    cartDispatch({
      type: isInCart ? "REMOVE_FROM_CART" : "ADD_TO_CART",
      payload: isInCart ? product._id : product,
    });
  };

  const toggleFavorite = () => {
    cartDispatch({
      type: isFavorite ? "REMOVE_FROM_FAVORITE" : "ADD_TO_FAVORITE",
      payload: isFavorite ? product._id : product,
    });
  };

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-7xl">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-gray-600 shadow-sm transition hover:text-rose-600 focus:outline-none focus:ring-4 focus:ring-rose-100"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back
        </button>

        <section className="grid gap-8 rounded-[2rem] bg-white p-4 shadow-sm md:grid-cols-2 md:p-8">
          <div className="rounded-[1.75rem] bg-gradient-to-br from-rose-50 via-white to-gray-50 p-6">
            <img src={imageUrl} alt={product.name} className="mx-auto aspect-square h-full max-h-[520px] w-full object-contain" />
          </div>

          <div className="flex flex-col justify-center py-4">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-rose-500">{product.category}</p>
            <h1 className="mt-3 text-3xl font-black tracking-tight text-gray-950 md:text-5xl">{product.name}</h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-gray-500">{product.description}</p>

            <div className="mt-6 flex flex-wrap items-end gap-3">
              <span className="text-4xl font-black text-gray-950">₹{finalPrice?.toLocaleString()}</span>
              {product.discount > 0 && (
                <>
                  <span className="pb-1 text-lg font-bold text-gray-400 line-through">₹{product.price?.toLocaleString()}</span>
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black uppercase text-emerald-700">{product.discount}% saved</span>
                </>
              )}
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {[
                { icon: TruckIcon, label: "Same day delivery" },
                { icon: ShieldCheckIcon, label: "Secure payment" },
                { icon: HeartIcon, label: "Freshness assured" },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl border border-gray-100 bg-gray-50 p-4 text-sm font-bold text-gray-700">
                  <item.icon className="mb-2 h-5 w-5 text-rose-600" />
                  {item.label}
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={toggleCart}
                className="flex-1 rounded-2xl bg-gray-950 px-6 py-4 text-sm font-black text-white shadow-xl shadow-gray-200 transition hover:-translate-y-0.5 hover:bg-rose-600 focus:outline-none focus:ring-4 focus:ring-rose-200"
              >
                {isInCart ? "Remove from cart" : "Add to cart"}
              </button>
              <button
                type="button"
                onClick={toggleFavorite}
                className="rounded-2xl border border-rose-100 bg-rose-50 px-6 py-4 text-sm font-black text-rose-700 transition hover:bg-rose-100 focus:outline-none focus:ring-4 focus:ring-rose-100"
              >
                {isFavorite ? "Wishlisted" : "Add to wishlist"}
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
