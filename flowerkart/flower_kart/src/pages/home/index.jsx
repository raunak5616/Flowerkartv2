import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRightIcon, SparklesIcon, TruckIcon } from "@heroicons/react/24/outline";
import { getProducts } from "../../apiCalls/productapi";
import RecipeReviewCard from "../../components/productCard";
import ProductSkeleton from "../../components/ui/ProductSkeleton";

const occasionChips = ["Birthday", "Anniversary", "Roses", "Plants", "Bouquets"];

const Home = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProducts();
        setProducts(response);
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
    <main className="bg-gray-50">
      <section className="bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 md:grid-cols-[1.05fr_0.95fr] md:items-center md:py-14">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-rose-50 px-4 py-2 text-xs font-black uppercase tracking-widest text-rose-700">
              <SparklesIcon className="h-4 w-4" />
              Fresh arrivals daily
            </div>
            <h1 className="text-4xl font-black tracking-tight text-gray-950 md:text-6xl">
              Flowers that make the moment feel considered.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-gray-500">
              Shop curated bouquets, premium blooms, and thoughtful gifts with fast local delivery.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => navigate("/products")}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gray-950 px-6 py-4 text-sm font-black text-white shadow-xl shadow-gray-200 transition hover:-translate-y-0.5 hover:bg-rose-600"
              >
                Shop flowers
                <ArrowRightIcon className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => navigate("/shop")}
                className="rounded-2xl border border-gray-200 bg-white px-6 py-4 text-sm font-black text-gray-700 transition hover:border-rose-200 hover:text-rose-700"
              >
                Explore sellers
              </button>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-rose-100 via-white to-amber-50 p-5">
            <img
              src={featuredProducts[0]?.images?.[0]?.url || "/thumbnail.png"}
              alt="Featured flowers"
              className="aspect-[4/3] w-full rounded-[1.5rem] object-contain"
            />
            <div className="absolute bottom-6 left-6 right-6 rounded-2xl bg-white/90 p-4 shadow-xl backdrop-blur">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-600 text-white">
                  <TruckIcon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-black text-gray-950">Same-day delivery</p>
                  <p className="text-xs font-medium text-gray-500">Available for selected local sellers</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.3em] text-rose-500">Curated picks</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-gray-950">Popular right now</h2>
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {occasionChips.map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => navigate(`/products?search=${encodeURIComponent(chip)}`)}
                className="whitespace-nowrap rounded-full bg-white px-4 py-2 text-sm font-bold text-gray-600 shadow-sm transition hover:bg-rose-50 hover:text-rose-700"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {loading ? <ProductSkeleton count={8} /> : featuredProducts.map((product) => (
            <RecipeReviewCard key={product._id || product.id} product={product} />
          ))}
        </div>
      </section>
    </main>
  );
};

export default Home;
