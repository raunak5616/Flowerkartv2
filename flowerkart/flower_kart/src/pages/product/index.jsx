import { useEffect, useMemo, useState, Fragment } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sliders, 
  Search, 
  X, 
  Star, 
  ChevronDown, 
  RotateCcw,
  Check
} from "lucide-react";
import { Dialog, DialogPanel, DialogTitle, DialogBackdrop } from "@headlessui/react";
import { getProducts } from "../../apiCalls/productapi";
import RecipeReviewCard from "../../components/productCard";
import EmptyState from "../../components/ui/EmptyState";
import ProductSkeleton from "../../components/ui/ProductSkeleton";

const sortOptions = [
  { label: "Newest Arrivals", value: "newest" },
  { label: "Price: Low to High", value: "price-low" },
  { label: "Price: High to Low", value: "price-high" },
  { label: "Top Customer Rated", value: "rating-high" },
];

export default function Product() {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const searchTerm = searchParams.get("search") || "";
  
  // Custom Filter States
  const [priceRange, setPriceRange] = useState(5000);
  const [ratingFilter, setRatingFilter] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setError("");
        const response = await getProducts();
        setProducts(response || []);
      } catch (err) {
        console.error("FETCH PRODUCT ERROR", err);
        setError("We could not load products right now.");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, []);

  const categories = useMemo(() => ["All", ...new Set(products.map((p) => p.category).filter(Boolean))], [products]);

  // Combined Filters Logic
  const filteredProducts = useMemo(() => {
    const normalizedSearch = searchTerm.toLowerCase();
    const filtered = products.filter((product) => {
      const finalPrice = product.discount > 0
        ? Math.round(product.price - (product.price * product.discount) / 100)
        : product.price;

      const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
      const matchesSearch = !normalizedSearch ||
        product.name?.toLowerCase().includes(normalizedSearch) ||
        product.description?.toLowerCase().includes(normalizedSearch) ||
        product.category?.toLowerCase().includes(normalizedSearch);
      
      const matchesPrice = finalPrice <= priceRange;
      const matchesRating = ratingFilter === 0 || product.rating >= ratingFilter;
      const matchesStock = !inStockOnly || !(product.price > 1200); // price > 1200 simulates low stock

      return matchesCategory && matchesSearch && matchesPrice && matchesRating && matchesStock;
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === "price-low") return (a.price || 0) - (b.price || 0);
      if (sortBy === "price-high") return (b.price || 0) - (a.price || 0);
      if (sortBy === "rating-high") return (b.rating || 0) - (a.rating || 0);
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });
  }, [products, selectedCategory, searchTerm, sortBy, priceRange, ratingFilter, inStockOnly]);

  const resetFilters = () => {
    setSelectedCategory("All");
    setPriceRange(5000);
    setRatingFilter(0);
    setInStockOnly(false);
    setSortBy("newest");
    setSearchParams({});
  };

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedCategory !== "All") count++;
    if (priceRange < 5000) count++;
    if (ratingFilter > 0) count++;
    if (inStockOnly) count++;
    if (searchTerm) count++;
    return count;
  }, [selectedCategory, priceRange, ratingFilter, inStockOnly, searchTerm]);

  // Sidebar Filter Component Content
  const RenderFiltersContent = () => (
    <div className="space-y-6 text-left">
      {/* Categories */}
      <div>
        <h3 className="text-xs font-black uppercase tracking-widest text-gray-900 mb-3">Categories</h3>
        <div className="space-y-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs font-bold rounded-xl transition ${
                selectedCategory === cat
                  ? "bg-rose-50 text-rose-600"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <span>{cat}</span>
              {selectedCategory === cat && <Check className="h-3.5 w-3.5" />}
            </button>
          ))}
        </div>
      </div>

      <hr className="border-gray-100" />

      {/* Price Limit Slider */}
      <div>
        <div className="flex justify-between items-center mb-2.5">
          <h3 className="text-xs font-black uppercase tracking-widest text-gray-900">Max Budget</h3>
          <span className="text-xs font-black text-rose-600">₹{priceRange}</span>
        </div>
        <input
          type="range"
          min="100"
          max="5000"
          step="100"
          value={priceRange}
          onChange={(e) => setPriceRange(Number(e.target.value))}
          className="w-full accent-rose-600 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-[9px] text-gray-400 font-bold mt-1.5 uppercase">
          <span>Min ₹100</span>
          <span>Max ₹5,000</span>
        </div>
      </div>

      <hr className="border-gray-100" />

      {/* Star Rating Threshold */}
      <div>
        <h3 className="text-xs font-black uppercase tracking-widest text-gray-900 mb-3">Customer Review</h3>
        <div className="space-y-1">
          {[4, 3, 2].map((stars) => (
            <button
              key={stars}
              onClick={() => setRatingFilter(prev => prev === stars ? 0 : stars)}
              className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-bold rounded-xl transition ${
                ratingFilter === stars
                  ? "bg-rose-50 text-rose-600"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <div className="flex gap-0.5 text-orange-400">
                {[...Array(5)].map((_, idx) => (
                  <Star 
                    key={idx} 
                    className={`h-3.5 w-3.5 ${idx < stars ? "fill-orange-400 text-orange-400" : "text-gray-200"}`} 
                  />
                ))}
              </div>
              <span className="text-xs text-gray-500 font-bold mt-0.5">& Up</span>
            </button>
          ))}
        </div>
      </div>

      <hr className="border-gray-100" />

      {/* Stock Availability */}
      <div>
        <h3 className="text-xs font-black uppercase tracking-widest text-gray-900 mb-3">Stock Level</h3>
        <label className="flex items-center gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => setInStockOnly(e.target.checked)}
            className="rounded text-rose-600 focus:ring-rose-500 h-4 w-4 border-gray-300 accent-rose-600"
          />
          <span className="text-xs font-semibold text-gray-600">Exclude Low Stock / Limited Items</span>
        </label>
      </div>

      {activeFiltersCount > 0 && (
        <button
          onClick={resetFilters}
          className="w-full py-2.5 bg-gray-50 hover:bg-rose-50 hover:text-rose-600 text-gray-500 border border-gray-200 hover:border-rose-100 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Clear All Filters ({activeFiltersCount})
        </button>
      )}
    </div>
  );

  return (
    <main className="min-h-screen bg-gray-50/50">
      
      {/* Search and Header Section */}
      <section className="border-b border-gray-100 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-6 py-10 md:flex-row md:items-end md:justify-between">
          <div className="text-left">
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-rose-500">FlowerKart Catalog</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-gray-950 md:text-5xl">
              {searchTerm ? `Results for "${searchTerm}"` : "Explore fresh collections"}
            </h1>
            <p className="mt-3 max-w-2xl text-xs sm:text-sm leading-relaxed text-gray-400 font-semibold">
              Browse through premium bouquets and plants curated by our authorized local florist shops.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-gray-100 bg-gray-50 px-4 py-2.5 text-xs font-black uppercase tracking-wider text-gray-600 self-start md:self-auto">
            <Search className="h-4 w-4 text-rose-500 animate-pulse" />
            {filteredProducts.length} items found
          </div>
        </div>
      </section>

      {/* Main Catalog Layout */}
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 lg:grid-cols-[250px_1fr]">
        
        {/* DESKTOP FILTER SIDEBAR */}
        <aside className="hidden lg:block h-fit rounded-[2rem] border border-gray-100 bg-white p-5 shadow-sm sticky top-24">
          <div className="mb-5 flex items-center gap-2 border-b border-gray-50 pb-3">
            <Sliders className="h-4 w-4 text-rose-600" />
            <h2 className="text-xs font-black uppercase tracking-widest text-gray-950">Filters</h2>
          </div>
          {RenderFiltersContent()}
        </aside>

        {/* PRODUCTS AREA */}
        <section>
          
          {/* Controls Bar */}
          <div className="mb-6 flex items-center justify-between gap-4">
            <button
              onClick={() => setIsMobileFiltersOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-full border border-gray-200 bg-white text-xs font-black uppercase tracking-wider text-gray-700 shadow-sm hover:bg-gray-50 transition"
            >
              <Sliders className="h-3.5 w-3.5 text-rose-500" />
              <span>Filters ({activeFiltersCount})</span>
            </button>

            <p className="hidden sm:block text-xs font-black text-gray-400 uppercase tracking-widest text-left">
              Showing <span className="text-gray-950">{filteredProducts.length}</span> products
            </p>

            {/* Sort Select */}
            <div className="flex items-center gap-2 ml-auto">
              <label className="hidden md:block text-[10px] font-black text-gray-400 uppercase tracking-wider">Sort by</label>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value)}
                  className="appearance-none rounded-full border border-gray-200 bg-white pl-4 pr-10 py-2.5 text-xs font-bold text-gray-700 shadow-sm outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-50"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Catalog Grids */}
          {error ? (
            <EmptyState title="Products did not load" description={error} />
          ) : loading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              <ProductSkeleton count={9} />
            </div>
          ) : filteredProducts.length === 0 ? (
            <EmptyState
              title="No blooms match these parameters"
              description="Try adjusting your sliders, sorting settings, or resetting category selections."
              actionLabel="Show all categories"
              onAction={resetFilters}
            />
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filteredProducts.map((product) => (
                <RecipeReviewCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </section>
      </div>

      {/* MOBILE DRAWER FILTERS DIALOG */}
      <Dialog
        open={isMobileFiltersOpen}
        onClose={() => setIsMobileFiltersOpen(false)}
        className="relative z-50 lg:hidden"
      >
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-black/40 backdrop-blur-sm transition duration-300 ease-out data-[closed]:opacity-0"
        />

        {/* Bottom Sheet / Panel */}
        <div className="fixed inset-0 flex justify-end">
          <DialogPanel
            transition
            className="w-full max-w-[320px] bg-white h-full flex flex-col shadow-2xl p-6 relative overflow-y-auto transition duration-300 ease-out data-[closed]:translate-x-full"
          >
            {/* Header inside drawer */}
            <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-3">
              <DialogTitle className="text-base font-black text-gray-950 uppercase tracking-widest flex items-center gap-1.5">
                <Sliders className="h-4 w-4 text-rose-500" />
                Filter Settings
              </DialogTitle>
              <button
                onClick={() => setIsMobileFiltersOpen(false)}
                className="p-1.5 text-gray-500 hover:text-gray-900 rounded-full bg-gray-50 hover:bg-gray-100 transition"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Filters Content */}
            <div className="flex-1 pb-6">
              {RenderFiltersContent()}
            </div>

            {/* Confirm Action Button */}
            <button
              onClick={() => setIsMobileFiltersOpen(false)}
              className="w-full py-3 bg-rose-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-rose-700 shadow-md transition mt-auto"
            >
              Apply Filters
            </button>
          </DialogPanel>
        </div>
      </Dialog>
    </main>
  );
}
