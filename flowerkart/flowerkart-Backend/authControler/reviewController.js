import Order from "../mongodb/models/paymentModel.js";
import Product from "../mongodb/models/productModel.js";
import Shop from "../mongodb/models/shop.model.js";

export const submitReview = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { shopRating, productFeedbacks } = req.body; // productFeedbacks: [{ productId, rating }]

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    if (order.status !== "Delivered") {
      return res.status(400).json({ error: "Order must be delivered to provide feedback" });
    }

    if (order.isReviewed) {
      return res.status(400).json({ error: "Order already reviewed" });
    }

    // 1. Update Product Ratings
    for (const feedback of productFeedbacks) {
      const product = await Product.findById(feedback.productId);
      if (product) {
        const totalRating = product.rating * product.numReviews + feedback.rating;
        product.numReviews += 1;
        product.rating = totalRating / product.numReviews;
        await product.save();
      }
    }

    // 2. Update Shop Rating (based on the first product's shopId)
    if (order.items && order.items.length > 0) {
      // Assuming all items from same shop for now, or we can handle per item
      const sampleProduct = await Product.findById(order.items[0]._id || order.items[0].id);
      if (sampleProduct && sampleProduct.shopId) {
        const shop = await Shop.findById(sampleProduct.shopId);
        if (shop) {
          const totalShopRating = shop.rating * shop.numReviews + shopRating;
          shop.numReviews += 1;
          shop.rating = totalShopRating / shop.numReviews;
          await shop.save();
        }
      }
    }

    // 3. Mark Order as Reviewed
    order.isReviewed = true;
    await order.save();

    res.json({ success: true, message: "Review submitted successfully" });
  } catch (error) {
    console.error("🔥 SUBMIT REVIEW ERROR 🔥", error);
    res.status(500).json({ error: "Failed to submit review" });
  }
};
