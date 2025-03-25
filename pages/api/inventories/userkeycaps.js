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
      const { keycapDefinitionId, selectedKits, selectedColors, notes } =
        req.body;

      if (!keycapDefinitionId || !selectedKits) {
        res.status(400).json({
          message: "Keycap definition ID and selected kits are required.",
        });
        return;
      }

      const updatedKeycaps = await UserKeycap.findOneAndUpdate(
        { userId, keycapDefinitionId },
        { keycapDefinitionId, selectedKits, selectedColors, notes },
        { new: true, upsert: true }
      );

      res
        .status(200)
        .json({ message: "Keycap selection updated.", updatedKeycaps });
      return;
    }

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
