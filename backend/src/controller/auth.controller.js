import  User  from "../models/user.model.js";

export const authCallback = async (req, res, next) => {
  try {
    const { id, firstName, lastName, imageUrl } = req.body;

    // Check if user already exists
    const user = await User.findOne({ clerkId: id });

    // Create user if not found
    if (!user) {
      await User.create({
        clerkId: id,
        fullName: `${firstName || ""} ${lastName || ""}`.trim(),
        imageUrl: imageUrl,
      });
    }

    res.status(200).json({
      success: true,
      
    });
  } catch (error) {
    console.error("Error in auth callback:", error);

   next(error);
    };
  }
