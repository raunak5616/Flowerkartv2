import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AdjustmentsHorizontalIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { getProducts } from "../../apiCalls/productapi";
import RecipeReviewCard from "../../components/productCard";
import EmptyState from "../../components/ui/EmptyState";
import ProductSkeleton from "../../components/ui/ProductSkeleton";

const sortOptions = [
  { label: "Newest", value: "newest" },
  { label: "Price: Low to high", value: "price-low" },
  { label: "Price: High to low", value: "price-high" },
];

export default function Product() {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get("search") || "";

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setError("");
        const response = await getProducts();
        setProducts(response);
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

  const filteredProducts = useMemo(() => {
    const normalizedSearch = searchTerm.toLowerCase();
    const filtered = products.filter((product) => {
      const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
      const matchesSearch = !normalizedSearch ||
        product.name?.toLowerCase().includes(normalizedSearch) ||
        product.description?.toLowerCase().includes(normalizedSearch) ||
        product.category?.toLowerCase().includes(normalizedSearch);

      return matchesCategory && matchesSearch;
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === "price-low") return (a.price || 0) - (b.price || 0);
      if (sortBy === "price-high") return (b.price || 0) - (a.price || 0);
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });
  }, [products, selectedCategory, searchTerm, sortBy]);

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="border-b border-gray-100 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.3em] text-rose-500">FlowerKart catalog</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-gray-950 md:text-5xl">
              {searchTerm ? `Results for "${searchTerm}"` : "Fresh flowers, plants and gifts"}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-500">
              Browse curated blooms with quick filters, clear pricing, and doorstep delivery.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm font-bold text-gray-600">
            <MagnifyingGlassIcon className="h-5 w-5 text-rose-500" />
            {filteredProducts.length} items found
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 lg:grid-cols-[260px_1fr]">
        <aside className="h-fit rounded-3xl border border-gray-100 bg-white p-4 shadow-sm lg:sticky lg:top-24">
          <div className="mb-4 flex items-center gap-2">
            <AdjustmentsHorizontalIcon className="h-5 w-5 text-rose-600" />
            <h2 className="text-sm font-black uppercase tracking-widest text-gray-950">Filters</h2>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`whitespace-nowrap rounded-2xl px-4 py-3 text-left text-sm font-bold transition ${
                  selectedCategory === category
                    ? "bg-gray-950 text-white shadow-lg shadow-gray-200"
                    : "bg-gray-50 text-gray-600 hover:bg-rose-50 hover:text-rose-700"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </aside>

        <section>
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-bold text-gray-500">
              Showing <span className="text-gray-950">{filteredProducts.length}</span> products
            </p>
            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              className="rounded-2xl border border-gray-100 bg-white px-4 py-3 text-sm font-bold text-gray-700 shadow-sm outline-none focus:ring-4 focus:ring-rose-100"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          {error ? (
            <EmptyState title="Products did not load" description={error} />
          ) : loading ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              <ProductSkeleton count={9} />
            </div>
          ) : filteredProducts.length === 0 ? (
            <EmptyState
              title="No matching flowers"
              description="Try another category, remove your search term, or explore all products."
              actionLabel="Show all categories"
              onAction={() => setSelectedCategory("All")}
            />
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {filteredProducts.map((product) => (
                <RecipeReviewCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
