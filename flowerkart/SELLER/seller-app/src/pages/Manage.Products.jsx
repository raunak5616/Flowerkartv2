import { useState, useEffect } from "react";
import axios from "axios";

export const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({});

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const shopId = localStorage.getItem("shopId");
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/${shopId}`);
      setProducts(response.data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/${id}`, editValues);
      setEditingId(null);
      fetchProducts();
      alert("Product updated successfully!");
    } catch (error) {
      alert("Failed to update product");
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/${id}`);
      fetchProducts();
      alert("Product deleted successfully!");
    } catch (error) {
      alert("Failed to delete product");
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
        <header className="mb-12 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Manage Catalog</h1>
            <p className="text-gray-500 text-sm mt-1">Full control over your digital storefront</p>
          </div>
          <div className="bg-red-gradient text-white px-6 py-2 rounded-2xl text-xs font-black shadow-lg">
            {products.length} TOTAL ITEMS
          </div>
        </header>

        {products.length === 0 ? (
          <div className="bg-white rounded-3xl p-20 text-center shadow-sm border">
            <div className="text-gray-400 text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-gray-800">Your catalog is empty</h3>
            <p className="text-gray-500 mt-2">Add products to manage them here.</p>
          </div>
        ) : (
          Object.keys(groupedProducts).map((category) => (
            <div key={category} className="mb-16">
              <div className="flex items-center gap-4 mb-8">
                <h2 className="text-xl font-black text-gray-800 uppercase tracking-widest">{category}</h2>
                <div className="flex-1 h-px bg-gray-200"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {groupedProducts[category].map((product) => (
                  <div
                    key={product._id}
                    className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 group border border-gray-100"
                  >
                    {/* IMAGE SECTION */}
                    <div className="relative h-56 overflow-hidden">
                      <img
                        src={product.images?.[0]?.url || "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab"}
                        alt={product.name}
                        className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute top-4 right-4 flex flex-col gap-2">
                         <span className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black text-gray-800 shadow-sm">
                           REF: {product._id.slice(-6).toUpperCase()}
                         </span>
                      </div>
                    </div>

                    {/* CONTENT SECTION */}
                    <div className="p-8">
                      {editingId === product._id ? (
                        <div className="space-y-4">
                           <input
                             className="w-full text-lg font-bold text-gray-800 border-b-2 border-red-500 outline-none p-2 bg-gray-50 rounded-t-lg"
                             defaultValue={product.name}
                             onChange={(e) => setEditValues({ ...editValues, name: e.target.value })}
                           />
                           <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-[10px] font-bold text-gray-400 uppercase">Stock</label>
                                <input
                                  type="number"
                                  className="w-full border rounded-xl p-2 outline-none focus:ring-2 focus:ring-red-500"
                                  defaultValue={product.stock}
                                  onChange={(e) => setEditValues({ ...editValues, stock: Number(e.target.value) })}
                                />
                              </div>
                              <div>
                                <label className="text-[10px] font-bold text-gray-400 uppercase">Price</label>
                                <input
                                  type="number"
                                  className="w-full border rounded-xl p-2 outline-none focus:ring-2 focus:ring-red-500"
                                  defaultValue={product.price}
                                  onChange={(e) => setEditValues({ ...editValues, price: Number(e.target.value) })}
                                />
                              </div>
                           </div>
                           <div className="flex gap-2 pt-2">
                             <button onClick={() => handleUpdate(product._id)} className="flex-1 bg-green-500 text-white py-2 rounded-xl text-xs font-bold shadow-md">SAVE</button>
                             <button onClick={() => setEditingId(null)} className="flex-1 bg-gray-100 text-gray-600 py-2 rounded-xl text-xs font-bold">CANCEL</button>
                           </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex justify-between items-start mb-4">
                            <h3 className="text-xl font-bold text-gray-800 group-hover:text-red-600 transition-colors uppercase tracking-tight">
                              {product.name}
                            </h3>
                            <div className="text-right">
                              <p className="text-xl font-black text-gray-900">₹{product.price}</p>
                              <p className={`text-[10px] font-bold uppercase mt-1 ${product.stock < 10 ? "text-red-500 animate-pulse" : "text-gray-400"}`}>
                                {product.stock} Units left
                              </p>
                            </div>
                          </div>

                          <div className="h-px bg-gray-50 w-full mb-6"></div>

                          <div className="flex gap-2">
                            <button 
                              onClick={() => { setEditingId(product._id); setEditValues(product); }}
                              className="flex-1 border border-gray-100 text-gray-700 py-3 rounded-2xl text-xs font-bold hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                            >
                              <span className="material-symbols-outlined text-sm">edit</span>
                              Quick Edit
                            </button>
                            <button 
                              onClick={() => deleteProduct(product._id)}
                              className="w-12 border border-red-50 border-red-100 text-red-500 rounded-2xl flex items-center justify-center hover:bg-red-50 transition-all"
                            >
                              <span className="material-symbols-outlined text-sm">delete</span>
                            </button>
                          </div>
                        </>
                      )}
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
