import { useState, useEffect } from "react";
import axios from "axios";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const shopId = localStorage.getItem("shopId");
    try {
      const response = await axios.get(`http://localhost:8080/api/products/${shopId}`);
      setProducts(response.data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  const groupedProducts = products.reduce((acc, product) => {
    const category = product.category || "Uncategorized";
    acc[category] = acc[category] || [];
    acc[category].push(product);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Product Directory</h1>
            <p className="text-gray-500 text-sm mt-1">Structured view of your digital inventory</p>
          </div>
          <div className="text-right">
             <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Live Catalog</span>
             <p className="text-sm font-bold text-gray-800">{products.length} Items Listed</p>
          </div>
        </header>

        {products.length === 0 ? (
          <div className="bg-white rounded-3xl p-20 text-center shadow-sm border">
            <div className="text-gray-400 text-6xl mb-4">🏠</div>
            <h3 className="text-xl font-semibold text-gray-800">Empty Directory</h3>
            <p className="text-gray-500 mt-2">No products are currently available in this section.</p>
          </div>
        ) : (
          Object.keys(groupedProducts).map((category) => (
            <div key={category} className="mb-16">
              <div className="flex items-center gap-4 mb-6">
                <h2 className="text-sm font-black text-gray-400 uppercase tracking-[0.3em]">{category}</h2>
                <div className="flex-1 h-px bg-gray-200"></div>
              </div>

              <div className="space-y-4">
                {groupedProducts[category].map((product) => (
                  <div
                    key={product._id}
                    className="bg-white rounded-2xl p-4 flex flex-col md:flex-row items-center gap-8 shadow-sm hover:shadow-md transition-all group border border-gray-100"
                  >
                    {/* IMAGE */}
                    <div className="relative h-20 w-20 flex-shrink-0">
                      <img
                        src={product.images?.[0]?.url || "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab"}
                        alt={product.name}
                        className="h-full w-full object-cover rounded-xl border border-gray-50 group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>

                    {/* NAME & DESC */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-lg font-bold text-gray-800 group-hover:text-red-600 transition-colors truncate uppercase tracking-tight">
                          {product.name}
                        </h3>
                        {product.discount > 0 && (
                          <span className="bg-red-50 text-red-600 text-[9px] font-black px-2 py-0.5 rounded-full border border-red-100">
                             {product.discount}% OFF
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 line-clamp-1">
                        {product.description || "The premium choice for quality and aesthetics. Sourced directly from our certified gardens."}
                      </p>
                    </div>

                    {/* STATS */}
                    <div className="flex items-center gap-12 text-center md:text-left">
                       <div>
                          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Pricing</p>
                          <p className="text-sm font-black text-gray-900">₹{product.price}</p>
                       </div>
                       <div>
                          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Inventory</p>
                          <p className={`text-sm font-bold ${product.stock < 10 ? "text-red-500" : "text-gray-800"}`}>
                             {product.stock} Units
                          </p>
                       </div>
                       <div className="hidden lg:block">
                          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Ref ID</p>
                          <p className="text-xs font-mono text-gray-400 uppercase">#{product._id.slice(-6)}</p>
                       </div>
                    </div>

                    {/* STATUS TAG */}
                    <div className="flex-shrink-0">
                       <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-tighter border ${
                         product.stock > 0 ? "bg-green-50 text-green-600 border-green-100" : "bg-red-50 text-red-600 border-red-100"
                       }`}>
                         {product.stock > 0 ? "In Stock" : "Sold Out"}
                       </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Products;
