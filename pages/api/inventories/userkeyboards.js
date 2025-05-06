import dbConnect from "@/db/connect";
import UserKeyboard from "@/db/models/UserKeyboard";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  // Check for session and user.uuid
  if (!session || !session.user || !session.user.uuid) {
    console.error("No valid session user uuid found:", session);
    res.status(401).json({ message: "Valid user session required" });
    return;
  }

  await dbConnect();

  // Use session.user.uuid as the identifier
  const userId = session.user.uuid;

  try {
    if (req.method === "GET") {
      // Find by userId
      const userKeyboards = await UserKeyboard.find({ userId });
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
        // Query by _id and userId
        query = { _id, userId };
      } else {
        query = { _id: new mongoose.Types.ObjectId() };
      }

      const updateDoc = {
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

      // Delete by _id and userId
      const deleteResult = await UserKeyboard.findOneAndDelete({
        _id: keyboardId,
        userId,
      });

      return res
        .status(200)
        .json({ message: "Keyboard removed successfully." });
    }
  } catch (error) {
    console.error("API Error:", error);
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({
        message: "Validation error. Please check your input data.",
        details: error.errors,
      });
    }
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }

  res.status(405).json({ message: "Method not allowed." });
}
