import  User  from "../models/user.model.js";

export const authCallback = async (req, res, next) => {
  try {
    const { id, firstName, lastName, imageUrl } = req.body;

    if (!id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const calculatedName = `${firstName || ""} ${lastName || ""}`.trim() || "Spotify User";
    const userImageUrl = imageUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${id}`;

    // Check if user already exists
    let user = await User.findOne({ clerkId: id });

    // Create user if not found, or update if exists
    if (!user) {
      user = await User.create({
        clerkId: id,
        fullName: calculatedName,
        imageUrl: userImageUrl,
      });
    } else {
      let shouldSave = false;
      if (calculatedName !== "Spotify User" && user.fullName !== calculatedName) {
        user.fullName = calculatedName;
        shouldSave = true;
      }
      if (imageUrl && user.imageUrl !== imageUrl) {
        user.imageUrl = imageUrl;
        shouldSave = true;
      }
      if (shouldSave) {
        await user.save();
      }
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Error in auth callback:", error);
    next(error);
  }
};
