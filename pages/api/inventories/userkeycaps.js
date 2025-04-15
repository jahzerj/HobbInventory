import dbConnect from "@/db/connect";
import UserKeycap from "@/db/models/UserKeycap";
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
      const userKeycaps = await UserKeycap.find({ userId: userEmail });
      return res.status(200).json(userKeycaps);
    }

    if (req.method === "POST" || req.method === "PUT") {
      const {
        keycapDefinitionId,
        name,
        manufacturer,
        profile,
        material,
        profileHeight,
        designer,
        geekhacklink,
        render,
        kits,
        selectedKits,
        selectedColors = [],
        notes = [],
        _id,
      } = req.body;

      if (!name) {
        res.status(400).json({
          message: "Keycap name is required.",
        });
        return;
      }

      // Check if keycap came from dropdown selection
      if (keycapDefinitionId) {
        // Instead of finding by keycapDefinitionId, create a new entry each time
        // unless _id is provided (for updates)
        const query = _id ? { _id } : { _id: new mongoose.Types.ObjectId() };

        const updatedKeycaps = await UserKeycap.findOneAndUpdate(
          query,
          {
            userId: userEmail,
            keycapDefinitionId,
            name,
            manufacturer,
            profile,
            material,
            profileHeight,
            designer,
            geekhacklink,
            render,
            kits,
            selectedKits,
            selectedColors,
            notes,
          },
          { new: true, upsert: true }
        );

        res.status(200).json({
          message: _id ? "Keycap updated." : "Keycap added to your collection.",
          updatedKeycaps,
        });
        return;
      } else {
        // For manually entered keycaps
        // Use _id for updates, otherwise create a new entry each time
        const query = _id ? { _id } : { _id: new mongoose.Types.ObjectId() };

        const updatedKeycaps = await UserKeycap.findOneAndUpdate(
          query,
          {
            userId: userEmail,
            name,
            manufacturer,
            profile,
            material,
            profileHeight,
            designer,
            geekhacklink,
            render,
            kits,
            selectedKits,
            selectedColors,
            notes,
          },
          { new: true, upsert: true }
        );

        res.status(200).json({
          message: "Keycap added to your collection.",
          updatedKeycaps,
        });
        return;
      }
    }

    // ...existing DELETE logic is fine...
    if (req.method === "DELETE") {
      const { _id, keycapId } = req.body;
      const idToDelete = _id || keycapId;

      if (!idToDelete) {
        res
          .status(400)
          .json({ message: "Keycap ID is required for deletion." });
        return;
      }

      await UserKeycap.findOneAndDelete({
        userId: userEmail,
        _id: idToDelete,
      });

      res.status(200).json({ message: "Keycapset removed successfully." });
      return;
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
    return;
  }

  res.status(405).json({ message: "Method not allowed." });
}
