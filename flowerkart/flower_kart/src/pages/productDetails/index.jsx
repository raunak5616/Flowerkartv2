import { useEffect, useMemo, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  Heart, 
  ShoppingBag, 
  Truck, 
  ShieldCheck, 
  Info, 
  Star, 
  Store,
  Calendar,
  Sparkles,
  ChevronRight,
  RefreshCcw,
  CheckCircle2
} from "lucide-react";
import { useCart } from "../../context/card.context/useCartContext";
import { findCart } from "../../utils/findCartitem";
import { findFavroite } from "../../utils/findFavroite";
import EmptyState from "../../components/ui/EmptyState";
import { getCachedProducts, getProducts } from "../../apiCalls/productapi";
import RecipeReviewCard from "../../components/productCard";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cart, favourite, cartDispatch } = useCart();
  const [catalogProducts, setCatalogProducts] = useState(getCachedProducts());
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [zoomStyle, setZoomStyle] = useState({ display: 'none', backgroundPosition: '0% 0%' });
  const [activeTab, setActiveTab] = useState("specifications");

  // Load products if cache is empty
  useEffect(() => {
    if (catalogProducts.length > 0) return;
    getProducts()
      .then((items) => setCatalogProducts(items || []))
      .catch((error) => console.error("Failed to load product details", error));
  }, [catalogProducts.length]);

  const products = useMemo(() => [...catalogProducts, ...cart, ...favourite], [catalogProducts, cart, favourite]);
  const product = useMemo(() => products.find((item) => item?._id === id || item?.id === id), [products, id]);

  const isInCart = findCart(cart, id);
  const isFavorite = findFavroite(favourite, id);

  // Store recently viewed products
  useEffect(() => {
    if (!product?._id) return;
    try {
      const recent = JSON.parse(localStorage.getItem("recentlyViewed") || "[]");
      const updated = [product._id, ...recent.filter(item => item !== product._id)].slice(0, 4);
      localStorage.setItem("recentlyViewed", JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  }, [product]);

  // Read recently viewed details
  const recentlyViewedProducts = useMemo(() => {
    try {
      const recentIds = JSON.parse(localStorage.getItem("recentlyViewed") || "[]");
      return catalogProducts.filter(p => recentIds.includes(p._id) && p._id !== id).slice(0, 4);
    } catch {
      return [];
    }
  }, [catalogProducts, id]);

  // Related products (same category or general)
  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return catalogProducts
      .filter(p => p._id !== product._id && (p.category === product.category || !product.category))
      .slice(0, 4);
  }, [catalogProducts, product]);

  if (!product) {
    return (
      <main className="min-h-[70vh] bg-gray-50 px-4 py-16">
        <EmptyState
          title="Bloom session empty"
          description="We couldn't locate this product details in your current session. Please select from catalog."
          actionLabel="Browse products"
          onAction={() => navigate("/products")}
        />
      </main>
    );
  }

  const images = product.images || [];
  const imageUrl = images[activeImageIndex]?.url || product.images?.[0]?.url || "/no-image.png";

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

  // Hover zoom handler
  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.target.getBoundingClientRect();
    const x = ((e.pageX - left - window.scrollX) / width) * 100;
    const y = ((e.pageY - top - window.scrollY) / height) * 100;
    setZoomStyle({
      display: 'block',
      backgroundImage: `url(${imageUrl})`,
      backgroundPosition: `${x}% ${y}%`,
      backgroundSize: '200%'
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({ display: 'none', backgroundPosition: '0% 0%' });
  };

  return (
    <main className="min-h-screen bg-gray-50/50 px-6 pt-20 sm:pt-28 pb-24 md:pb-16 text-left relative">
      <div className="mx-auto max-w-7xl">
        
        {/* Back Button */}
        <motion.button
          type="button"
          whileHover={{ x: -3 }}
          onClick={() => navigate(-1)}
          className="mb-8 inline-flex items-center gap-2 rounded-full bg-white border border-gray-100 px-4 py-2 text-xs font-black uppercase tracking-widest text-gray-500 shadow-sm hover:text-rose-600 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to list
        </motion.button>

        {/* Core Product Layout */}
        <section className="grid gap-12 rounded-[2.5rem] bg-white p-6 shadow-sm border border-gray-100 md:grid-cols-2 md:p-10">
          
          {/* LEFT: GALLERY & DISPLAY */}
          <div className="flex flex-col gap-4">
            
            {/* Main Interactive Zoom Image Box */}
            <div 
              className="relative rounded-[2rem] bg-gray-50/50 p-4 border border-gray-100/50 overflow-hidden flex items-center justify-center aspect-square group"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <img 
                src={imageUrl} 
                alt={product.name} 
                className="max-h-[500px] max-w-full object-contain rounded-xl transition duration-500"
              />
              
              {/* Floating Zoom Window */}
              <div 
                style={zoomStyle}
                className="absolute inset-0 pointer-events-none rounded-[2rem] border border-gray-100 z-10 hidden bg-no-repeat shadow-inner"
              />
            </div>

            {/* Thumbnail Selectors */}
            {images.length > 1 && (
              <div className="flex gap-3 justify-center">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImageIndex(index)}
                    className={`h-16 w-16 p-1.5 rounded-xl border-2 transition ${
                      activeImageIndex === index 
                        ? "border-rose-500 bg-rose-50/20" 
                        : "border-gray-100 bg-white hover:border-gray-200"
                    }`}
                  >
                    <img src={img.url} alt="thumbnail" className="h-full w-full object-cover rounded-lg" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: DETAILS & CONTROLS */}
          <div className="flex flex-col justify-center">
            
            {/* Badges & Category */}
            <div className="flex items-center gap-3.5 mb-3.5">
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-rose-500">{product.category}</span>
              <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
              <div className="flex items-center gap-1 rounded-full bg-amber-50 border border-amber-100/50 px-2 py-0.5 text-[9px] font-black text-gray-800">
                <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                <span>{product.rating > 0 ? product.rating.toFixed(1) : "New"} Rating</span>
              </div>
            </div>

            <h1 className="text-3.5xl sm:text-4.5xl font-black tracking-tight text-gray-900 leading-tight">
              {product.name}
            </h1>

            <p className="mt-4 max-w-xl text-xs sm:text-sm font-semibold leading-relaxed text-gray-400">
              {product.description || "Indulge in our carefully selected and premium floral arrangements, prepared fresh and locally wrapped by community flower shops to guarantee maximum freshness."}
            </p>

            {/* Price tags */}
            <div className="mt-6 flex items-baseline gap-2.5">
              <span className="text-3.5xl font-black text-gray-990">₹{finalPrice?.toLocaleString()}</span>
              {product.discount > 0 && (
                <>
                  <span className="text-sm font-bold text-gray-400 line-through">₹{product.price?.toLocaleString()}</span>
                  <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-emerald-700 border border-emerald-100">
                    {product.discount}% off
                  </span>
                </>
              )}
            </div>

            {/* Specifications & Tab details */}
            <div className="mt-8">
              <div className="flex border-b border-gray-100 text-xs font-black uppercase tracking-wider text-gray-400 gap-6">
                {[
                  { id: "specifications", label: "Specs" },
                  { id: "delivery", label: "Delivery" },
                  { id: "seller", label: "Seller info" }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`pb-3 relative transition-colors ${
                      activeTab === tab.id ? "text-gray-900 font-black" : "hover:text-gray-600"
                    }`}
                  >
                    {tab.label}
                    {activeTab === tab.id && (
                      <motion.div layoutId="detailsTabLine" className="absolute bottom-0 left-0 right-0 h-0.5 bg-rose-500" />
                    )}
                  </button>
                ))}
              </div>

              <div className="py-4 text-xs font-semibold leading-relaxed text-gray-500">
                <AnimatePresence mode="wait">
                  {activeTab === "specifications" && (
                    <motion.div
                      key="specs"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      transition={{ duration: 0.15 }}
                      className="space-y-2.5"
                    >
                      <div className="flex justify-between border-b border-gray-50 pb-1.5">
                        <span className="font-bold text-gray-400 uppercase tracking-wider text-[10px]">Occasion suitability</span>
                        <span className="font-black text-gray-800">Birthday, Anniversary, Romance</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-50 pb-1.5">
                        <span className="font-bold text-gray-400 uppercase tracking-wider text-[10px]">Stem Count / Pack</span>
                        <span className="font-black text-gray-800">12 Premium stems wrapped in linen</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-bold text-gray-400 uppercase tracking-wider text-[10px]">Vase Included</span>
                        <span className="font-black text-gray-800">No (wrapping only)</span>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === "delivery" && (
                    <motion.div
                      key="deliv"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      transition={{ duration: 0.15 }}
                      className="space-y-3"
                    >
                      <div className="flex gap-2.5 items-start">
                        <Truck className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-black text-gray-800">Same-Day Courier Delivery</p>
                          <p className="text-[10px] text-gray-400 leading-normal font-bold">Standard delivery takes 30-60 mins depending on florists proximity.</p>
                        </div>
                      </div>
                      <div className="flex gap-2.5 items-start">
                        <RefreshCcw className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-black text-gray-800">Easy Returns Policy</p>
                          <p className="text-[10px] text-gray-400 leading-normal font-bold">Flowers are perishable; please initiate support requests within 12 hours of delivery if unsatisfied.</p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === "seller" && (
                    <motion.div
                      key="sell"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      transition={{ duration: 0.15 }}
                      className="space-y-2.5"
                    >
                      <div className="flex gap-3 items-center bg-gray-50 border border-gray-100 p-3.5 rounded-2xl">
                        <Store className="h-5 w-5 text-rose-600" />
                        <div className="text-left">
                          <p className="font-black text-gray-800">Authorized FlowerKart Florist Shop</p>
                          <p className="text-[10px] text-gray-400 leading-tight font-bold">This local seller has passed our freshness check guidelines.</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Core Action triggers */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3.5">
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={toggleCart}
                className={`flex-1 rounded-2xl py-4 text-xs font-black uppercase tracking-widest text-white shadow-xl transition-all duration-300 flex items-center justify-center gap-2 ${
                  isInCart 
                    ? "bg-rose-600 hover:bg-rose-700 shadow-rose-200" 
                    : "bg-gray-950 hover:bg-rose-600 shadow-gray-200"
                }`}
              >
                <ShoppingBag className="h-4.5 w-4.5" />
                {isInCart ? "Remove from cart" : "Add to cart"}
              </motion.button>
              
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={toggleFavorite}
                className={`rounded-2xl border px-6 py-4 text-xs font-black uppercase tracking-widest transition flex items-center justify-center gap-2 ${
                  isFavorite 
                    ? "bg-rose-50 border-rose-100 text-rose-700 hover:bg-rose-100" 
                    : "bg-white border-gray-200 text-gray-500 hover:text-rose-600 hover:border-rose-100"
                }`}
              >
                <Heart className={`h-4.5 w-4.5 ${isFavorite ? "fill-rose-500 text-rose-500" : ""}`} />
                {isFavorite ? "Saved to Wishlist" : "Wishlist"}
              </motion.button>
            </div>

            {/* Micro guarantees */}
            <div className="mt-6 flex items-center justify-start gap-6 text-[10px] font-black uppercase tracking-widest text-gray-400">
              <div className="flex items-center gap-1.5">
                <Truck className="h-4 w-4 text-rose-600" />
                <span>30-60 mins delivery</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-rose-600" />
                <span>Secure payment guarantee</span>
              </div>
            </div>

          </div>
        </section>

        {/* BOTTOM SECTION: RELATED PRODUCTS */}
        {relatedProducts.length > 0 && (
          <section className="mt-20 border-t border-gray-100 pt-16">
            <h2 className="text-2xl font-black text-gray-990 mb-8">Related Blooms</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((p) => (
                <RecipeReviewCard key={p._id} product={p} />
              ))}
            </div>
          </section>
        )}

        {/* BOTTOM SECTION: RECENTLY VIEWED */}
        {recentlyViewedProducts.length > 0 && (
          <section className="mt-16 border-t border-gray-100 pt-12">
            <h2 className="text-2xl font-black text-gray-990 mb-8">Recently Viewed</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {recentlyViewedProducts.map((p) => (
                <RecipeReviewCard key={p._id} product={p} />
              ))}
            </div>
          </section>
        )}

      </div>

      {/* FIXED STICKY MOBILE BUY BAR */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-lg border-t border-gray-100 px-6 py-3.5 flex items-center justify-between gap-4 md:hidden shadow-2xl">
        <div className="min-w-0">
          <p className="text-[9px] font-black text-rose-500 uppercase tracking-wider">{product.category}</p>
          <h4 className="text-xs font-black text-gray-950 truncate max-w-[140px] leading-tight mt-0.5">{product.name}</h4>
          <p className="text-sm font-black text-gray-900 mt-0.5">₹{finalPrice?.toLocaleString()}</p>
        </div>
        
        <motion.button
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={toggleCart}
          className={`px-5 py-3 rounded-xl text-xs font-black uppercase tracking-widest text-white shadow-md flex items-center gap-1.5 ${
            isInCart ? "bg-rose-600 shadow-rose-200" : "bg-gray-950 shadow-gray-200"
          }`}
        >
          <ShoppingBag className="h-4 w-4" />
          {isInCart ? "Remove" : "Add to Cart"}
        </motion.button>
      </div>

    </main>
  );
}
