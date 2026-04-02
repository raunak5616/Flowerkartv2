import razorpay from "../utils/razorpay.js";
import crypto from "crypto";
import Order from "../mongodb/models/paymentModel.js";
import Product from "../mongodb/models/productModel.js";
import ShopAccount from "../mongodb/models/shop.model.js";

export const createOrder = async (req, res) => {
  try {
    const { amount, userId, cartItems, deliveryAddress, coordinates } = req.body;

    // Fetch shop details for delivery
    let shopInfo = { id: null, address: "", location: null };
    if (cartItems && cartItems.length > 0) {
      const firstItem = cartItems[0];
      const shopId = firstItem.shopId || firstItem.sellerId;
      if (shopId) {
        const shop = await ShopAccount.findById(shopId);
        if (shop) {
          shopInfo = {
            id: shop._id,
            address: shop.address || "Shop Address",
            location: shop.location || null
          };
        }
      }
    }

    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: "order_" + Date.now(),
    });

    const newOrder = new Order({
      userId,
      items: cartItems,
      amount,
      deliveryAddress,
      coordinates,
      shopId: shopInfo.id,
      shopAddress: shopInfo.address,
      shopLocation: shopInfo.location,
      razorpay_order_id: order.id,
      status: "Pending"
    });
    
    await newOrder.save();
    res.json(order);
  } catch (error) {
    console.error("Razorpay order error:", error);
    res.status(500).json({ error: error.message });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    const existingOrder = await Order.findOne({ razorpay_order_id });
    if (existingOrder) {
      existingOrder.razorpay_payment_id = razorpay_payment_id;
      existingOrder.razorpay_signature = razorpay_signature;
      existingOrder.status = isAuthentic ? "Success" : "Failed";
      await existingOrder.save();
    }

    if (isAuthentic) {
      if (existingOrder && existingOrder.items) {
        for (const item of existingOrder.items) {
          const productId = item._id || item.id;
          if (productId) {
            await Product.findByIdAndUpdate(productId, {
              $inc: { stock: -(item.qty || 1) }
            });
          }
        }
      }
      res.json({ success: true, message: "Payment verified", order: existingOrder });
    } else {
      res.status(400).json({ success: false, message: "Invalid signature", order: existingOrder });
    }
  } catch (err) {
    res.status(500).json({ error: "Verification failed" });
  }
};

export const updatePaymentStatus = async (req, res) => {
  try {
    const { razorpay_order_id, status } = req.body;
    await Order.findOneAndUpdate({ razorpay_order_id }, { status });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to update status" });
  }
};
