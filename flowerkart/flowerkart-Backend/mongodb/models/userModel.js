import mongoose, { Types } from "mongoose";

const userSchema = mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true},
    phone:{type:String,required:true},
    password:{type:String,required:true},
    role: { type: String, default: "user" }
},

{
    timestamps: true,
    collection: 'customers'
}
);

const User = mongoose.model("user",userSchema);
export default User;