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

    if (req.method === "POST") {
      const { keycapSetId, selectedKits } = req.body;

      if (!keycapSetId || !selectedKits) {
        res
          .status(400)
          .json({ message: "Keycap ID and selected kits is required." });
        return;
      }

      const updatedKeycaps = await UserKeycaps.findOneAndUpdate(
        { userId, keycapSetId },
        { keycapSetId, selectedKits },
        { new: true, upsert: true }
      );

      res
        .status(200)
        .json({ message: "Keycap selected updated.", updatedKeycaps });
      return;
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error." });
    return;
  }

  res.status(405).json({ message: "Method not allowed." });
}
