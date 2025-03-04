import dbConnect from "@/db/connect";
import UserKeycaps from "@/db/models/UserKeycaps";
import Keycapset from "@/db/models/Keycapset";

export default async function handler(req, res) {
  await dbConnect();

  try {
    const userId = req.query.userId || "guest_user"; // Use guest ID if none is provided

    if (req.method === "GET") {
      const userKeycaps = await UserKeycaps.find({ userId }).populate(
        "keycapSetId"
      );
      res.status(200).json(userKeycaps);
      return;
    }

    if (req.method === "POST" || req.method === "PUT") {
      const { keycapSetId, selectedKits, selectedColors, notes } = req.body;

      if (!keycapSetId || !selectedKits) {
        res
          .status(400)
          .json({ message: "Keycap ID and selected kits are required." });
        return;
      }

      const updatedKeycaps = await UserKeycaps.findOneAndUpdate(
        { userId, keycapSetId },
        { keycapSetId, selectedKits, selectedColors, notes },
        { new: true, upsert: true }
      ).populate("keycapSetId");

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

      await UserKeycaps.findOneAndDelete({ userId, keycapSetId });

      res.status(200).json({ message: "Keycapset removed successfully." });
      return;
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error." });
    return;
  }

  res.status(405).json({ message: "Method not allowed." });
}
