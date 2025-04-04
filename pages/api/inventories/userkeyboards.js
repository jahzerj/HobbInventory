import dbConnect from "@/db/connect";
import UserKeyboard from "@/db/models/UserKeyboard";
import Keyboard from "@/db/models/Keyboard";

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
      } = req.body;

      if (
        !name ||
        !designer ||
        !layout ||
        !blocker ||
        !switchType ||
        !renders
      ) {
        res.status(400).json({
          message:
            "Missing required fields: Name, Designer, Layout, Blocker, Switch Type and Renders",
        });
        return;
      }

      // Check if keyboard came from dropdown selection
      if (keyboardId) {
        // For keyboards from the dropdown, verify it exists in the master database
        const keyboardExists = await Keyboard.findById(keyboardId);
        if (!keyboardExists) {
          return res
            .status(404)
            .json({ message: "Keyboard not found in database" });
        }

        // Use the existing keyboard ID
        const updatedKeyboard = await UserKeyboard.findOneAndUpdate(
          { userId, keyboardId },
          {
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
          },
          { new: true, upsert: true }
        );

        res.status(200).json({
          message: "Keyboard selection updated.",
          updatedKeyboard,
        });
        return;
      } else {
        // For manually entered keyboards, don't create a master keyboard
        // Just create a UserKeyboard with no reference to master collection
        const updatedKeyboard = await UserKeyboard.findOneAndUpdate(
          { userId, name }, // Find by name for manually entered keyboards
          {
            userId,
            // No keyboardId field set - this is a user-only keyboard
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
          message: "Keyboard added to your collection.",
          updatedKeyboard,
        });
        return;
      }
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
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
    return;
  }

  res.status(405).json({ message: "Method not allowed." });
}
