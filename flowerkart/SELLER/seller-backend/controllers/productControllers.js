import Product from "../mongodb/model/index.js";
import Order from "../mongodb/model/orderModel.js";
console.log("📦 productControllers file LOADED");

export const createProduct = async (req, res) => {
   console.log("🚀 createProduct HIT");

  try {
    const images = req.files.map(file => ({
      url: file.path,
      public_id: file.filename
    }));

    const product = await Product.create({
      ...req.body,
      images
    });

    res.status(201).json({ success: true, product });
  } catch (error) {
  console.error("🔥 CREATE PRODUCT ERROR 🔥");
  console.error(error);

  res.status(500).json({
    message: "Failed to create product",
    error: error.message,
    stack: error.stack,
  });
}

}

export const getProductsByShop = async (req, res) => {
  try {
    const { shopId } = req.params;
    const products = await Product.find({ shopId });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch products", error: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json({ success: true, product: updatedProduct });
  } catch (error) {
    res.status(500).json({ message: "Failed to update product", error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete product", error: error.message });
  }
};

export const getBillsByShop = async (req, res) => {
  try {
    const { shopId } = req.params;
    const orders = await Order.find({ status: { $in: ["Success", "Accepted", "Shipped", "Delivered"] } }).sort({ createdAt: -1 });

    const shopBills = orders.map(order => {
      const shopItems = order.items.filter(item => item.shopId?.toString() === shopId);
      if (shopItems.length > 0) {
        const shopAmount = shopItems.reduce((sum, item) => sum + (item.price * (item.qty || 1)), 0);
        return {
          id: order.razorpay_order_id,
          date: new Date(order.createdAt).toISOString().split('T')[0],
          time: new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          customer: "Customer",
          amount: shopAmount,
          status: "Paid",
          items: shopItems
        };
      }
      return null;
    }).filter(bill => bill !== null);

    res.status(200).json(shopBills);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch bills", error: error.message });
  }
};

export const getOrdersByShop = async (req, res) => {
  try {
    const { shopId } = req.params;
    const orders = await Order.find({ status: { $ne: "Cancelled" } }).sort({ createdAt: -1 });

    const shopOrders = orders.map(order => {
      const shopItems = order.items.filter(item => item.shopId?.toString() === shopId);
      if (shopItems.length > 0) {
        return {
          ...order._doc,
          items: shopItems,
          shopAmount: shopItems.reduce((sum, item) => sum + (item.price * (item.qty || 1)), 0)
        };
      }
      return null;
    }).filter(o => o !== null);

    res.status(200).json(shopOrders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders", error: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const updatedOrder = await Order.findOneAndUpdate(
      { razorpay_order_id: orderId },
      { status },
      { new: true }
    );
    res.status(200).json({ success: true, order: updatedOrder });
  } catch (error) {
    res.status(500).json({ message: "Failed to update order status", error: error.message });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    const { shopId } = req.params;

    // 1. Products Live
    const productsLive = await Product.countDocuments({ shopId });

    // 2. Orders Stats
    const orders = await Order.find({ status: { $ne: "Cancelled" } });

    let totalSales = 0;
    let activeOrdersCount = 0;
    const uniqueCustomers = new Set();

    orders.forEach(order => {
      const shopItems = order.items.filter(item => item.shopId?.toString() === shopId);
      
      if (shopItems.length > 0) {
        const shopAmount = shopItems.reduce((sum, item) => sum + (item.price * (item.qty || 1)), 0);
        
        // Add to total sales if order is successful or in progress
        if (["Success", "Accepted", "Shipped", "Delivered"].includes(order.status)) {
          totalSales += shopAmount;
        }

        // Active Orders are those currently being handled
        if (["Pending", "Accepted", "Shipped", "Processing"].includes(order.status)) {
          activeOrdersCount++;
        }

        if (order.userId) {
          uniqueCustomers.add(order.userId.toString());
        }
      }
    });

    res.status(200).json({
      success: true,
      stats: {
        totalSales,
        activeOrders: activeOrdersCount,
        totalCustomers: uniqueCustomers.size,
        productsLive
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch dashboard stats", error: error.message });
  }
};
