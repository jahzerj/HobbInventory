import dbConnect from "@/db/connect";
import UserKeyboard from "@/db/models/UserKeyboard";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  // Check for session and user.email
  if (!session || !session.user || !session.user.email) {
    console.error("No valid session user email found:", session);
    res.status(401).json({ message: "Valid user session with email required" });
    return;
  }

  await dbConnect();

  // Use session.user.email as the identifier
  const userEmail = session.user.email;

  try {
    if (req.method === "GET") {
      // Find by userEmail (stored in the userId field)
      const userKeyboards = await UserKeyboard.find({ userId: userEmail });
      return res.status(200).json(userKeyboards);
    }

    if (req.method === "POST" || req.method === "PUT") {
      const {
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

      let query;
      if (_id) {
        // Query by _id and userEmail (stored in userId field)
        query = { _id, userId: userEmail };
      } else {
        query = { _id: new mongoose.Types.ObjectId() };
      }

      const updateDoc = {
        userId: userEmail,
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
        builds,
        notes,
      };

      const updatedKeyboard = await UserKeyboard.findOneAndUpdate(
        query,
        updateDoc,
        { new: true, upsert: true, runValidators: true }
      );

      res.status(200).json({
        message: _id
          ? "Keyboard updated."
          : "Keyboard added to your collection.",
        keyboard: updatedKeyboard,
      });
      return;
    }

    if (req.method === "DELETE") {
      const { keyboardId } = req.body;

      // Delete by _id and userEmail (stored in userId field)
      const deleteResult = await UserKeyboard.findOneAndDelete({
        _id: keyboardId,
        userId: userEmail,
      });

      return res
        .status(200)
        .json({ message: "Keyboard removed successfully." });
    }
  } catch (error) {
    // ... error handling ...
    console.error("API Error:", error);
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({
        /* ... */
      });
    }
    return res.status(500).json({
      /* ... */
    });
  }

  res.status(405).json({ message: "Method not allowed." });
}
