
import mongoose from "mongoose";
export async function connectToDb(){
try {
    console.log("connecting to database🔁");
    await mongoose.connect(process.env.MONGO_URL);
    console.log ("connected 🚀");
} catch (error) {
    console.log(error);
    process.exit(1);
}
}