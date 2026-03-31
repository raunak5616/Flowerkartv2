import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

async function listAll() {
    await mongoose.connect(process.env.MONGO_URI);
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log("COLLECTIONS IN DELIVERY_BACKEND DB:");
    collections.forEach(c => console.log("- ", c.name));
    
    const docs = await mongoose.connection.db.collection('orders').find().toArray();
    console.log(`\n--- ORDERS IN DELIVERY_BACKEND (${docs.length}) ---`);
    docs.forEach(d => {
        console.log(`ID: ${d._id}, Status: ${d.status}, Assigned: ${d.assignedPartner || 'NO'}`);
    });
    process.exit(0);
}
listAll();
