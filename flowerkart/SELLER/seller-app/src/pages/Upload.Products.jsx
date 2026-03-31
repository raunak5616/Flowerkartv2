import { useState, useEffect } from "react";
import axios from "axios";

export const UploadProduct = () => {
  const [images, setImages] = useState([]);          // File objects
  const [imagePreviews, setImagePreviews] = useState([]); // Preview URLs

  const [products, setProducts] = useState({
    name: "",
    category: "",
    price: "",
    discount: "",
    stock: "",
    description: ""
  });

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);

    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const onProductChnage = (e) => {
    setProducts({
      ...products,
      [e.target.name]: e.target.value
    });
  };

  useEffect(() => {
    return () => {
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imagePreviews]);

  const handleSubmit = async (e) => {
    const shopId = localStorage.getItem("shopId");
    e.preventDefault();

    const formData = new FormData();

    Object.entries(products).forEach(([key, value]) => {
      formData.append(key, value);
    });
    formData.append("shopId", shopId);
    images.forEach((file) => {
      formData.append("images", file);
    });
    const PORT = import.meta.env.VITE_BACKEND_PORT
    try {
      console.log("SUBMIT CLICKED");
      await axios.post(
        `${import.meta.env.VITE_API_URL}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      alert("Product uploaded successfully");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen  flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-3xl rounded-2xl p-6
                shadow-[0_20px_50px_rgba(0,0,0,0.35)]">

        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Upload New Product
        </h2>

        {/* FORM */}
        <form className="space-y-5" onSubmit={handleSubmit}>

          {/* PRODUCT NAME */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="Enter product name"
              onChange={onProductChnage}
              className="w-full rounded-lg border border-gray-300 px-4 py-2
                         focus:ring-2 focus:ring-red-500 focus:outline-none"
            />
          </div>

          {/* CATEGORY + PRICE */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                className="w-full rounded-lg border border-gray-300 px-4 py-2
                           focus:ring-2 focus:ring-red-500 focus:outline-none"
                name="category"
                onChange={onProductChnage}
              >
                <option>Select category</option>
                <option>Roses</option>
                <option>Lilies</option>
                <option>Sunflowers</option>
                <option>Tulips</option>
                <option>Orchids</option>
                <option>Bouquets</option>
                <option>Indoor Plants</option>
                <option>Other Flowers</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price (₹)
              </label>
              <input
                type="number"
                name="price"
                onChange={onProductChnage}
                placeholder="0"
                className="w-full rounded-lg border border-gray-300 px-4 py-2
                           focus:ring-2 focus:ring-red-500 focus:outline-none"
              />
            </div>
          </div>

          {/* DISCOUNT + STOCK */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Discount (%)
              </label>
              <input
                type="number"
                name="discount"
                onChange={onProductChnage}
                placeholder="0"
                className="w-full rounded-lg border border-gray-300 px-4 py-2
                           focus:ring-2 focus:ring-red-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stock Quantity
              </label>
              <input
                type="number"
                name="stock"
                onChange={onProductChnage}
                placeholder="0"
                className="w-full rounded-lg border border-gray-300 px-4 py-2
                           focus:ring-2 focus:ring-red-500 focus:outline-none"
              />
            </div>
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Description
            </label>
            <textarea
              rows="4"
              name="description"
              onChange={onProductChnage}
              placeholder="Write product details..."
              className="w-full rounded-lg border border-gray-300 px-4 py-2
                         focus:ring-2 focus:ring-red-500 focus:outline-none"
            />
          </div>

          {/* IMAGE UPLOAD */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Images
            </label>

            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-600
                         file:mr-4 file:py-2 file:px-4
                         file:rounded-lg file:border-0
                         file:bg-red-500 file:text-white
                         hover:file:bg-red-600 cursor-pointer"
            />

            {/* IMAGE PREVIEW */}
            {/* IMAGE PREVIEW */}
            {imagePreviews.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-3">
                {imagePreviews.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt="preview"
                    className="h-24 w-full object-cover rounded-lg border"
                  />
                ))}
              </div>
            )}

          </div>

          {/* SUBMIT BUTTON */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-red-gradient text-white py-3 rounded-lg
                         hover:opacity-90 transition font-medium"
            >
              Upload Product
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
