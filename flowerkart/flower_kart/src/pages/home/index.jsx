import { useEffect, useState } from "react";
import { getProducts } from "../../apiCalls/productapi";
import RecipeReviewCard from "../../components/productCard";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProducts();
        setProducts(response);
      } catch (err) {
        console.error("🔥 FETCH PRODUCTS ERROR 🔥", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []); // ✅ runs once on mount

  const SkeletonCard = () => (
    <div className="bg-white rounded-[2rem] p-4 border border-gray-100 flex flex-col h-[480px] w-full animate-skeleton">
      <div className="h-56 w-full rounded-[1.5rem] bg-gray-100 mb-6" />
      <div className="flex-1 space-y-4">
        <div className="h-4 w-1/4 bg-gray-100 rounded" />
        <div className="h-6 w-3/4 bg-gray-100 rounded" />
        <div className="h-4 w-full bg-gray-100 rounded" />
        <div className="mt-auto flex justify-between items-center">
          <div className="h-10 w-24 bg-gray-100 rounded" />
          <div className="h-12 w-12 bg-gray-100 rounded-2xl" />
        </div>
      </div>
    </div>
  );

  return (
    <main className="max-w-7xl mx-auto px-4 py-8 w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {loading ? (
          Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
        ) : (
          products.map((product) => (
            <RecipeReviewCard 
              key={product._id || product.id} 
              product={product} 
            />
          ))
        )}
      </div>
    </main>
  );
};

export default Home;
