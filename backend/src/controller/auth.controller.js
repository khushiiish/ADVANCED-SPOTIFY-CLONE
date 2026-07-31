import { User } from "../models/user.model.js";

export const authCallback = async (req, res) => {
  try {
    const { id, firstName, lastName, imageUrl } = req.body;

    // Check if user already exists
    let user = await User.findOne({ clerkId: id });

    // Create user if not found
    if (!user) {
      user = await User.create({
        clerkId: id,
        fullName: `${firstName} ${lastName}`,
        imageUrl: imageUrl,
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Error in auth callback:", error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};