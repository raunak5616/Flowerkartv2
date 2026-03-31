import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

async function listAll() {
    await mongoose.connect(process.env.MONGO_URI || process.env.MONGO_URL);
    const docs = await mongoose.connection.db.collection('orders').find().toArray();
    console.log(`\n--- ALL ORDERS (${docs.length}) ---`);
    docs.forEach(d => {
        console.log(`ID: ${d._id}, Status: ${d.status}, Assigned: ${d.assignedPartner || 'NO'}`);
    });
    process.exit(0);
}
listAll();
