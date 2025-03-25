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

    if (req.method === "POST") {
      const {
        keycapDefinitionId,
        selectedKits,
        selectedColors = [],
        notes = [],
      } = req.body;

      // If adding from keycap definition
      if (keycapDefinitionId) {
        const keycapDef = await Keycapdefinition.findById(keycapDefinitionId);
        if (!keycapDef) {
          return res
            .status(404)
            .json({ message: "Keycap definition not found" });
        }

        const userKeycap = await UserKeycap.create({
          userId,
          name: keycapDef.name,
          manufacturer: keycapDef.manufacturer,
          profile: keycapDef.profile,
          material: keycapDef.material,
          profileHeight: keycapDef.profileHeight,
          designer: keycapDef.designer,
          geekhacklink: keycapDef.geekhacklink,
          render: keycapDef.render,
          kits: keycapDef.kits,
          selectedKits,
          selectedColors,
          notes,
          keycapDefinitionId,
        });

        return res.status(201).json(userKeycap);
      }

      // If manual entry
      const userKeycap = await UserKeycap.create({
        userId,
        ...req.body,
        isManualEntry: true,
      });

      return res.status(201).json(userKeycap);
    }

    if (req.method === "POST" || req.method === "PUT") {
      const { keycapSetId, selectedKits, selectedColors, notes } = req.body;

      if (!keycapSetId || !selectedKits) {
        res
          .status(400)
          .json({ message: "Keycap ID and selected kits are required." });
        return;
      }

      const updatedKeycaps = await UserKeycap.findOneAndUpdate(
        { userId, keycapSetId },
        { keycapSetId, selectedKits, selectedColors, notes },
        { new: true, upsert: true }
      );

      res
        .status(200)
        .json({ message: "Keycap selection updated.", updatedKeycaps });
      return;
    }

    if (req.method === "DELETE") {
      const { keycapSetId } = req.body;

      if (!keycapSetId) {
        res
          .status(400)
          .json({ message: "Keycap ID is required for deletion." });
        return;
      }

      await UserKeycap.findOneAndDelete({
        userId: req.query.userId || "guest_user",
        keycapSetId,
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
