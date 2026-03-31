import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductById } from "../../apiCalls/productapi";
import RecipeReviewCard from "../../components/productCard";

export const ShopByProduct = () => {

    const { id } = useParams();   

    const [productsbyshop, setProductsByShop] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const fetchProductByShop = async () => {
            try {

                const data = await getProductById(id);
                console.log("🔥 shop By Product ===" , data);  // pass shop id
                setProductsByShop(data);

            } catch (error) {

                console.error("🔥 FETCH PRODUCTS BY SHOP ERROR 🔥", error);

            } finally {

                setLoading(false);

            }
        };

        fetchProductByShop();

    }, [id]);

    if (loading) {
        return <p className="text-center mt-10">Products are loading...</p>;
    }

    if (!productsbyshop || productsbyshop.length === 0) {
        return <p className="text-center mt-10">No products found for this shop.</p>;
    }

    return (
        <main className="flex flex-wrap gap-6 justify-center mt-4">
            {productsbyshop.map((product) => (
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