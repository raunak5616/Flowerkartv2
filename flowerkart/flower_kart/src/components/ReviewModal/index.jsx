import { useState, useEffect } from "react";
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from "@headlessui/react";
import { Fragment } from "react";
import { submitReview } from "../../apiCalls/productapi";

const ReviewModal = ({ order, isOpen, onClose }) => {
  const [shopRating, setShopRating] = useState(5);
  const [productRatings, setProductRatings] = useState({}); // {productId: rating}
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (order?.items) {
      const initialRatings = {};
      order.items.forEach(item => {
        initialRatings[item._id || item.id] = 5;
      });
      setProductRatings(initialRatings);
    }
  }, [order]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const productFeedbacks = Object.keys(productRatings).map(prodId => ({
        productId: prodId,
        rating: productRatings[prodId]
      }));

      await submitReview(order._id, {
        shopRating,
        productFeedbacks
      });
      onClose(true); // pass true to indicate successful submission
    } catch (error) {
      console.error("Failed to submit review", error);
      alert("Something went wrong while submitting your review.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const StarRating = ({ rating, onChange, label }) => (
    <div className="flex flex-col gap-2 mb-4">
      <p className="text-sm font-bold text-gray-700">{label}</p>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => onChange(star)}
            className={`material-symbols-outlined text-2xl transition-colors ${
              star <= rating ? "text-orange-400 fill-1" : "text-gray-300"
            }`}
          >
            star
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[100]" onClose={() => {}}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-[2rem] bg-white p-8 shadow-2xl transition-all">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="material-symbols-outlined text-red-500 text-4xl">celebration</span>
                  </div>
                  <DialogTitle as="h3" className="text-2xl font-black text-gray-900">
                    Order Delivered!
                  </DialogTitle>
                  <p className="text-sm text-gray-500 font-medium mt-1">
                   How was your experience with flowerKart?
                  </p>
                </div>

                <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    <StarRating
                      label="Rate the Store"
                      rating={shopRating}
                      onChange={setShopRating}
                    />
                  </div>

                  <div className="space-y-4">
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Rate the blooms</p>
                    {order?.items?.map((item) => (
                      <div key={item._id || item.id} className="flex items-center gap-4 p-3 bg-white border border-gray-100 rounded-2xl">
                         <img 
                          src={item.images?.[0]?.url || item.images?.url || "/no-image.png"} 
                          alt={item.name} 
                          className="h-12 w-12 rounded-xl object-cover"
                        />
                        <div className="flex-1">
                           <p className="text-sm font-bold text-gray-900 truncate max-w-[150px]">{item.name}</p>
                           <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                onClick={() => setProductRatings({
                                  ...productRatings,
                                  [item._id || item.id]: star
                                })}
                                className={`material-symbols-outlined text-lg transition-colors ${
                                  star <= (productRatings[item._id || item.id] || 5) ? "text-orange-400" : "text-gray-300"
                                }`}
                              >
                                star
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8">
                  <button
                    disabled={isSubmitting}
                    onClick={handleSubmit}
                    className="w-full py-4 bg-red-gradient text-white rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-red-200 hover:opacity-90 transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Review"}
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ReviewModal;
