import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: "d:/flowerKart/flowerkart/SELLER/seller-backend/.env" });

async function checkOrders() {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connected to DB");
        
        const orders = await mongoose.connection.db.collection('orders').find({}).limit(5).toArray();
        console.log("Sample Orders Found:", orders.length);
        
        orders.forEach(order => {
            console.log("\n--- Order ID:", order.razorpay_order_id, "Status:", order.status);
            if (order.items) {
                order.items.forEach((item, i) => {
                    console.log(`  Item ${i}: ${item.name || item.title}`);
                    console.log(`    shopId: ${item.shopId} (Type: ${typeof item.shopId})`);
                });
            } else {
                console.log("  No items in order.");
            }
        });

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkOrders();
