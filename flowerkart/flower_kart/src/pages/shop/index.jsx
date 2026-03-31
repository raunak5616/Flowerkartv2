import { useEffect, useState } from "react";
import { getShop } from "../../apiCalls/shopApi";
import ShopCard from "../../components/shopCard";
import { useNavigate } from "react-router-dom";

const Shop = () => {

    const navigate = useNavigate();
    const [shop, setShop] = useState([]);
    const [loading, setLoading] = useState(true);

    const handleShopClick = (id) => {
        navigate(`/shop/${id}`);
    };

    useEffect(() => {

        const fetchShop = async () => {
            try {
                const response = await getShop();
                console.log("Shop data:", response);
                setShop(response);
            } catch (error) {
                console.error("🔥 FETCH SHOP ERROR 🔥", error);
            } finally {
                setLoading(false);
            }
        };

        fetchShop();

    }, []);

    if (loading) {
        return <p className="text-center mt-10">Loading shops...</p>;
    }

    if (!shop || shop.length === 0) {
        return <p className="text-center mt-10">No shops available at the moment.</p>;
    }

    return (
        <main className="flex flex-wrap gap-6 justify-center mt-4">
           {shop.map((shops) => (
  <div
    key={shops._id}
    className="flex"
    style={{ width: "345px" }}
  >
    <ShopCard
      shop={shops}
      onClick={handleShopClick}
    />
  </div>
))}
        </main>
    );
};

export default Shop;