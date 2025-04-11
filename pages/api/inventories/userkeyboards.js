import dbConnect from "@/db/connect";
import UserKeyboard from "@/db/models/UserKeyboard";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  // Early return if not authenticated
  if (!session) {
    return res.status(401).json({ message: "Not authorized" });
  }

  await dbConnect();

  //Use the session user's ID
  const userId = session.user.id;
  try {
    if (req.method === "GET") {
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

      // For updates: find the keyboard by _id AND ensure it belongs to the current user
      if (_id) {
        query = { _id, userId: session.user.id };
      } else {
        // For new keyboards: generate a new _id
        query = { _id: new mongoose.Types.ObjectId() };
      }

      // Always use the session user's ID for new entries or updates
      const updatedKeyboard = await UserKeyboard.findOneAndUpdate(
        query,
        {
          userId: session.user.id, // Force the authenticated user's ID
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

      // Only allow deletion of the user's own keyboards
      await UserKeyboard.findOneAndDelete({
        userId: session.user.id,
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
