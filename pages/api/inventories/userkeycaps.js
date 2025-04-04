import dbConnect from "@/db/connect";
import UserKeycap from "@/db/models/UserKeycap";
import Keycapdefinition from "@/db/models/Keycapdefinition";

export default async function handler(req, res) {
  await dbConnect();
  const userId = req.query.userId || "guest_user";

  try {
    if (req.method === "GET") {
      const userKeycaps = await UserKeycap.find({ userId });
      return res.status(200).json(userKeycaps);
    }

    if (req.method === "POST" || req.method === "PUT") {
      const {
        userId,
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
      } = req.body;

      if (!name) {
        res.status(400).json({
          message: "Keycap name is required.",
        });
        return;
      }

      // Check if keycap came from dropdown selection
      if (keycapDefinitionId) {
        // For keycaps from the dropdown, verify it exists in the master database
        const keycapExists = await Keycapdefinition.findById(
          keycapDefinitionId
        );
        if (!keycapExists) {
          return res
            .status(404)
            .json({ message: "Keycap set not found in database" });
        }

        // Use the existing keycap definition ID
        const updatedKeycaps = await UserKeycap.findOneAndUpdate(
          { userId, keycapDefinitionId },
          {
            userId,
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
          message: "Keycap selection updated.",
          updatedKeycaps,
        });
        return;
      } else {
        // For manually entered keycaps, don't create a master keycap definition
        // Just create a UserKeycap with no reference to master collection
        const updatedKeycaps = await UserKeycap.findOneAndUpdate(
          { userId, name }, // Find by name for manually entered keycaps
          {
            userId,
            // No keycapDefinitionId field set - this is a user-only keycap
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
      const { keycapDefinitionId } = req.body;

      if (!keycapDefinitionId) {
        res
          .status(400)
          .json({ message: "Keycap definition ID is required for deletion." });
        return;
      }

      await UserKeycap.findOneAndDelete({
        userId: req.query.userId || "guest_user",
        keycapDefinitionId,
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
