import dbConnect from "@/db/connect";
import UserKeyboard from "@/db/models/UserKeyboard";
import mongoose from "mongoose";

export default async function handler(req, res) {
  await dbConnect();
  const userId = req.query.userId || "guest_user";

  try {
    if (req.method === "GET") {
      const userKeyboards = await UserKeyboard.find({ userId });
      return res.status(200).json(userKeyboards);
    }

    if (req.method === "POST" || req.method === "PUT") {
      const {
        userId,
        keyboardId,
        name,
        designer,
        layout,
        renders,
        blocker,
        switchType,
        plateMaterial,
        mounting,
        typingAngle,
        frontHeight,
        surfaceFinish,
        color,
        weightMaterial,
        buildWeight,
        pcbOptions,
        builds = [],
        notes = [],
        _id,
      } = req.body;

      if (
        !name ||
        !designer ||
        !layout ||
        !blocker ||
        !switchType ||
        !renders
      ) {
        console.error("Missing required fields");
        res.status(400).json({
          message:
            "Missing required fields: Name, Designer, Layout, Blocker, Switch Type and Renders",
        });
        return;
      }

      // Use _id for updates, otherwise create a new entry each time
      const query = _id ? { _id } : { _id: new mongoose.Types.ObjectId() };

      // Create or update the UserKeyboard entry
      const updatedKeyboard = await UserKeyboard.findOneAndUpdate(
        query,
        {
          userId,
          keyboardId, // This can be null for manual entries
          name,
          designer,
          layout,
          renders,
          blocker,
          switchType,
          plateMaterial,
          mounting,
          typingAngle,
          frontHeight,
          surfaceFinish,
          color,
          weightMaterial,
          buildWeight,
          pcbOptions,
          builds,
          notes,
        },
        { new: true, upsert: true }
      );

      res.status(200).json({
        message: _id
          ? "Keyboard updated."
          : "Keyboard added to your collection.",
        updatedKeyboard,
      });
      return;
    }

    if (req.method === "DELETE") {
      const { keyboardId } = req.body;

      if (!keyboardId) {
        res
          .status(400)
          .json({ message: "Keyboard ID is required for deletion." });
        return;
      }

      await UserKeyboard.findOneAndDelete({
        userId: req.query.userId || "guest_user",
        _id: keyboardId,
      });

      res.status(200).json({ message: "Keyboard removed successfully." });
      return;
    }
  } catch (error) {
    console.error("Internal Server Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
    return;
  }

  res.status(405).json({ message: "Method not allowed." });
}
