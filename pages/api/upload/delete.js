import { v2 as cloudinary } from "cloudinary";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

// Configure Cloudinary (use the same configuration as your upload endpoint)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

export default async function handler(req, res) {
  // Verify the user is authenticated
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { public_id } = req.body;

  // Verify the public_id is in the keyboards_renders folder
  // This is a security measure to prevent deletion of other resources
  if (!public_id || !public_id.startsWith("keyboards_renders/")) {
    return res.status(400).json({
      message: "Invalid public_id. Only user-uploaded renders can be deleted.",
    });
  }

  try {
    // Delete the image from Cloudinary
    const result = await cloudinary.uploader.destroy(public_id);

    if (result.result === "ok") {
      return res.status(200).json({ message: "Image deleted successfully" });
    } else {
      return res.status(400).json({ message: "Failed to delete image" });
    }
  } catch (error) {
    console.error("Error deleting image from Cloudinary:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
}
