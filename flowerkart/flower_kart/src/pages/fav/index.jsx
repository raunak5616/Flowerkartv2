import RecipeReviewCard from "../../components/productCard";
import { useCart } from "../../context/card.context/useCartContext"

const fav = () => {
    const { favourite } = useCart();

    return (
        <main className="flex flex-wrap gap-6 justify-center mt-4 p-4">
            {
                favourite.length > 0 ? (
                    favourite.map((item) => (
                        <div key={item._id || item.id} className="flex" style={{ width: "345px" }}>
                            <RecipeReviewCard product={item} />
                        </div>
                    ))
                ) : (
                    <p className="w-full text-center text-gray-500 mt-10">No favorite items</p>
                )
            }
        </main>
    )
}

export default fav;