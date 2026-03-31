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

  if (loading) {
    return <p className="text-center mt-10">Loading products...</p>;
  }

  return (
    <main className="flex flex-wrap gap-6 justify-center mt-4">
      {products.map((product) => (
        <div
          key={product._id || product.id}
          className="flex"
          style={{ width: "345px" }}
        >
          <RecipeReviewCard product={product} />
        </div>
      ))}
    </main>
  );
};

export default Home;
