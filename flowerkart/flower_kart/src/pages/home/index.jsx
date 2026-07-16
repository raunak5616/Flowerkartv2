import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowRight, 
  Sparkles, 
  Truck, 
  ShieldCheck, 
  Heart, 
  Star, 
  Store, 
  MessageSquare,
  Gift,
  Smile,
  Globe,
  ChevronRight
} from "lucide-react";
import { getProducts } from "../../apiCalls/productapi";
import RecipeReviewCard from "../../components/productCard";
import ProductSkeleton from "../../components/ui/ProductSkeleton";

const occasionChips = [
  { name: "Birthday", label: "Celebrations", bg: "from-amber-500/10 to-orange-500/10", border: "border-orange-100", text: "text-orange-700" },
  { name: "Anniversary", label: "Romance", bg: "from-pink-500/10 to-rose-500/10", border: "border-rose-100", text: "text-rose-700" },
  { name: "Roses", label: "Premium Blooms", bg: "from-red-500/10 to-rose-600/10", border: "border-red-100", text: "text-red-700" },
  { name: "Plants", label: "Greenery", bg: "from-emerald-500/10 to-teal-500/10", border: "border-emerald-100", text: "text-emerald-700" },
  { name: "Bouquets", label: "Curated Packs", bg: "from-blue-500/10 to-indigo-500/10", border: "border-blue-100", text: "text-blue-700" },
];

const testimonials = [
  {
    name: "Aisha Sharma",
    role: "Verified Buyer",
    rating: 5,
    text: "The bouquet arrived looking exactly like the picture, perfectly fresh and beautifully wrapped. Same-day delivery saved my anniversary!",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80"
  },
  {
    name: "Vikram Malhotra",
    role: "Event Organizer",
    rating: 5,
    text: "flowerKart connects me with local boutique florist shops. The order details are transparent and coordinates details are very precise.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80"
  },
  {
    name: "Riya Sen",
    role: "Gift Sender",
    rating: 5,
    text: "Excellent service! The price was completely transparent, free delivery was included, and support handled my custom request immediately.",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=80&q=80"
  }
];

const brands = ["Scent & Co", "Urban Flora", "Rosewood Farms", "The Greenery", "Bloom Society"];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
};

const Home = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProducts();
        setProducts(response || []);
      } catch (err) {
        console.error("FETCH PRODUCTS ERROR", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const featuredProducts = useMemo(() => products.slice(0, 8), [products]);

  return (
    <main className="bg-gray-50/50 min-h-screen custom-scrollbar">
      
      {/* 1. HERO SECTION */}
      <section className="bg-white border-b border-gray-100 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-rose-50 rounded-full blur-3xl opacity-60 translate-x-1/3 -translate-y-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-amber-50 rounded-full blur-3xl opacity-40 -translate-x-1/3 translate-y-1/3 pointer-events-none" />
        
        <div className="mx-auto max-w-7xl grid gap-12 px-6 py-12 md:grid-cols-[1.1fr_0.9fr] items-center md:py-20 relative z-10">
          
          {/* Left Text */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-rose-50 px-4 py-2 text-xs font-black uppercase tracking-widest text-rose-700 border border-rose-100/50">
              <Sparkles className="h-3.5 w-3.5 text-rose-500 animate-spin" style={{ animationDuration: '3s' }} />
              Fresh arrivals daily
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6.5xl font-black tracking-tight text-gray-950 leading-[1.08]">
              Blooms that make the moment feel <span className="text-rose-600">considered.</span>
            </h1>
            
            <p className="mt-6 max-w-xl text-sm sm:text-base leading-relaxed text-gray-500 font-medium">
              Experience the finest handpicked floral bouquets, lush house plants, and custom floral packages sourced directly from top local florists.
            </p>
            
            <div className="mt-10 flex flex-col sm:flex-row gap-3.5">
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/products")}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gray-950 px-7 py-4 text-xs font-black uppercase tracking-widest text-white shadow-xl shadow-gray-200 hover:bg-rose-600 transition"
              >
                Shop flowers
                <ArrowRight className="h-4 w-4" />
              </motion.button>
              
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/shop")}
                className="rounded-2xl border border-gray-200 bg-white px-7 py-4 text-xs font-black uppercase tracking-widest text-gray-700 shadow-sm hover:border-rose-200 hover:text-rose-700 transition"
              >
                Explore sellers
              </motion.button>
            </div>
          </motion.div>

          {/* Right Image/Card Showcase */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-rose-50 via-white to-amber-50 p-6 border border-gray-100 shadow-inner"
          >
            <div className="absolute top-4 right-4 z-20 rounded-full bg-white/80 backdrop-blur px-3 py-1 text-[9px] font-black uppercase tracking-widest text-rose-600 border border-rose-100/50">
              Bloom of the Day
            </div>
            
            <img
              src={featuredProducts[0]?.images?.[0]?.url || "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=600&q=80"}
              alt="Featured flowers"
              className="aspect-[4/3] w-full rounded-[1.75rem] object-cover shadow-sm hover:scale-103 transition-transform duration-700"
            />
            
            <div className="absolute bottom-10 left-10 right-10 rounded-2xl bg-white/80 backdrop-blur p-4 shadow-2xl border border-white/50">
              <div className="flex items-center gap-3.5">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-600 text-white shadow-md shadow-rose-200">
                  <Truck className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-black text-gray-950 uppercase tracking-wider">Same-day delivery</p>
                  <p className="text-[10px] font-bold text-gray-400">Available across select partner shops</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. OCCASION CATEGORIES GRID */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-10 text-center max-w-xl mx-auto">
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-rose-500">Occasion Guides</p>
          <h2 className="mt-2 text-2xl sm:text-3.5xl font-black tracking-tight text-gray-950">Shop by Categories</h2>
          <p className="mt-2 text-xs text-gray-400 font-bold">Curated selections designed to spark joy and convey exact sentiments.</p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
        >
          {occasionChips.map((chip) => (
            <motion.div
              key={chip.name}
              variants={itemVariants}
              onClick={() => navigate(`/products?search=${encodeURIComponent(chip.name)}`)}
              className={`group flex flex-col p-5 rounded-[2rem] border bg-gradient-to-br ${chip.bg} ${chip.border} cursor-pointer hover:shadow-xl hover:shadow-gray-100 transition-all duration-300 relative overflow-hidden`}
            >
              <div className="mb-8 flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm border border-gray-100/50 group-hover:scale-110 transition-transform">
                <Gift className={`h-4 w-4 ${chip.text}`} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">{chip.label}</span>
              <span className="text-base font-black text-gray-950 group-hover:text-rose-600 transition-colors mt-0.5">{chip.name}</span>
              <ChevronRight className="absolute bottom-5 right-5 h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 group-hover:translate-x-1 duration-300" />
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* 3. FEATURED PRODUCTS SECTION */}
      <section className="mx-auto max-w-7xl px-6 py-10 border-t border-gray-100">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="text-left">
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-rose-500">Popular items</p>
            <h2 className="mt-1 text-2xl sm:text-3.5xl font-black tracking-tight text-gray-950">Trending Collections</h2>
          </div>
          <motion.button
            whileHover={{ x: 3 }}
            onClick={() => navigate("/products")}
            className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-rose-600 hover:text-rose-700 self-start sm:self-auto"
          >
            View Full Catalog
            <ArrowRight className="h-4 w-4" />
          </motion.button>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {loading ? (
            <ProductSkeleton count={8} />
          ) : (
            featuredProducts.map((product) => (
              <RecipeReviewCard key={product._id || product.id} product={product} />
            ))
          )}
        </div>
      </section>

      {/* 4. SELLER HIGHLIGHT BANNER */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="rounded-[2.5rem] bg-gray-950 text-white p-8 md:p-12 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="max-w-2xl relative z-10 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/5 px-3 py-1.5 text-[9px] font-black uppercase tracking-widest text-rose-400">
              <Store className="h-3.5 w-3.5" />
              FlowerKart Local Partner Network
            </div>
            <h2 className="text-3xl sm:text-4.5xl font-black tracking-tight leading-tight">
              Support local florists in your community.
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed max-w-xl">
              We partner directly with hand-picked local florists to ensure your bouquets are crafted with premium local ingredients, wrapped with care, and shipped quickly.
            </p>
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/shop")}
              className="inline-flex items-center gap-2 bg-white text-gray-950 font-black text-xs uppercase tracking-widest px-6 py-3.5 rounded-xl shadow-md hover:bg-rose-50 transition"
            >
              Browse partner shops
              <ArrowRight className="h-4 w-4" />
            </motion.button>
          </div>
        </div>
      </section>

      {/* 5. BRAND VALUE PROPOSITION */}
      <section className="mx-auto max-w-7xl px-6 py-10 border-y border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: ShieldCheck, title: "Freshness Assured", text: "Every bloom is carefully curated, chilled, and delivered fresh to maximize vase lifespan." },
            { icon: Smile, title: "Happiness Guarantee", text: "If your order doesn't look stunning, simply reach out to our 24/7 support. We'll make it right." },
            { icon: Globe, title: "Eco-Friendly Wrapping", text: "Our wrappers, strings, and boxes are biodegradable, compostable, and plastic-free." }
          ].map((item, idx) => (
            <div key={idx} className="flex gap-4 items-start text-left p-2">
              <div className="h-10 w-10 shrink-0 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center border border-rose-100/50 shadow-inner">
                <item.icon className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-black text-gray-900 text-sm">{item.title}</h4>
                <p className="text-xs text-gray-400 font-medium leading-relaxed mt-1">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. BRANDS BAR */}
      <section className="bg-gray-50 py-8 border-t border-gray-100">
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-[9px] font-black uppercase tracking-[0.25em] text-gray-400 text-center mb-6">In Partnership with Premium Farms</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-40 grayscale hover:opacity-60 transition duration-300">
            {brands.map((b) => (
              <span key={b} className="text-sm font-black tracking-widest uppercase">{b}</span>
            ))}
          </div>
        </div>
      </section>

    </main>
  );
};

export default Home;
