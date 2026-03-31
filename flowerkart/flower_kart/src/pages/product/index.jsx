import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getProducts } from "../../apiCalls/productapi";
import RecipeReviewCard from "../../components/productCard";

export default function Product() {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get("search") || "";

  useEffect(() => {
    const fetchproduct = async () => {
      try {
        const response = await getProducts();
        setProducts(response);
      } catch (error) {
        console.error("🔥 FETCH PRODUCT ERROR 🔥", error);
      }
    };
    fetchproduct();
  }, []);

  const categories = ["All", ...new Set(products.map((p) => p.category))];

  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
    const matchesSearch = !searchTerm || 
      p.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      p.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex flex-col md:flex-row bg-gray-50 min-h-screen">
      
      {/* Sidebar - Desktop */}
      <div className="hidden md:block w-56 bg-white shadow-md sticky top-0 h-screen overflow-y-auto">
        <h2 className="p-4 font-bold text-lg border-b">Categories</h2>
        <ul className="space-y-1 p-3">
          {categories.map((cat, index) => (
            <li
              key={index}
              onClick={() => setSelectedCategory(cat)}
              className={`p-2 rounded-md cursor-pointer transition-colors ${
                selectedCategory === cat
                  ? "bg-red-gradient text-white font-semibold shadow-sm"
                  : "hover:bg-gray-100"
              }`}
            >
              {cat}
            </li>
          ))}
        </ul>
      </div>

      {/* Category Scroll - Mobile */}
      <div className="md:hidden bg-white shadow-sm sticky top-0 z-10 p-2 overflow-x-auto whitespace-nowrap scrollbar-hide">
        <div className="flex gap-2 px-2">
          {categories.map((cat, index) => (
            <button
              key={index}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                selectedCategory === cat
                  ? "bg-red-gradient text-white border-red-600 shadow-sm"
                  : "bg-white text-gray-600 border-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Section */}
      <div className="flex-1 p-4 md:p-6">
        <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">
          Buy {selectedCategory === "All" ? "Products" : selectedCategory} Online
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filteredProducts.map((product) => (
            <div key={product._id} className="flex justify-center">
              <RecipeReviewCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}