import UserProfile from "../mongodb/models/userProfilemodel.js";
import User from "../mongodb/models/userModel.js";
import mongoose from "mongoose";

export const updateProfile = async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;
if (!req.user || !req.user.id) {
  return res.status(401).json({ message: "Unauthorized - user not found" });
}
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    console.log("REQ.USER 👉", req.user);
    const userId = req.user.id;
    if (!userId) {
      return res.status(401).json({ message: "User ID missing from token" });
    }
    const updateData = { name, email, phone, address };

    if (req.file) {
      updateData.images = {
        url: req.file.path,
        public_id: req.file.filename
      };
    }

    let objectId;
    try {
      objectId = new mongoose.Types.ObjectId(userId);
    } catch (idError) {
      console.log("INVALID OBJECT ID 👉", userId);
      return res.status(400).json({ message: "Invalid User ID format" });
    }

    const updatedUser = await UserProfile.findOneAndUpdate(
      { userId: objectId },
      updateData,
      {
        new: true,
        upsert: true
      }
    );

    res.status(200).json({
      message: "Profile saved successfully",
      data: updatedUser
    });

  } catch (error) {
    console.error("FULL PROFILE UPDATE ERROR 👉", error);
    res.status(500).json({ message: "Error updating profile", error: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    console.log("🚀 GET PROFILE HIT for user:", req.user?.id);
    const userId = req.user.id; 
    
    if (!userId) {
      console.log("❌ NO USER ID IN req.user");
      return res.status(401).json({ message: "No user ID in token" });
    }

    const profile = await UserProfile.findOne({ userId: userId });

    if (!profile) {
      console.log("ℹ️ No extended profile found, checking basic User account...");
      const basicUser = await User.findById(userId);
      if (!basicUser) {
        console.log("❌ USER NOT FOUND IN DATABASE:", userId);
        return res.status(404).json({ message: "User not found" });
      }
      console.log("✅ BASIC USER FOUND:", basicUser.name);
      return res.status(200).json({
        name: basicUser.name,
        email: basicUser.email,
        phone: basicUser.phone,
        address: ""
      });
    }
    res.status(200).json(profile);
  } catch (error) {
    console.log("ERROR:", error);
    res.status(500).json({ message: "Error fetching profile" });
  }
};