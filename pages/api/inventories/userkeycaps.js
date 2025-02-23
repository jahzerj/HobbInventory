import dbConnect from "@/db/connect";
import UserKeycaps from "@/db/models/UserKeycaps";
import Keycapset from "@/db/models/Keycapset";

export default async function handler(req, res) {
  await dbConnect();

  try {
    if (req.method === "GET") {
      const userId = req.query.userId || "guest_user"; // Use guest ID if none is provided
      const userKeycaps = await UserKeycaps.findOne({ userId }).populate(
        "keycaps"
      );

      if (!userKeycaps) {
        res.status(200).json({ keycaps: [] });
        return;
      }

      res.status(200).json(userKeycaps.keycaps);
      return;
    }
    if (req.method === "POST") {
      const { keycapId } = req.body;
      if (!keycapId) {
        res.status(400).json({ message: "Keycap ID is required." });
        return;
      }

      const userId = req.body.userId || "guest_user";
      let userKeycaps = await UserKeycaps.findOne({ userId });

      if (!userKeycaps) {
        userKeycaps = new UserKeycaps({ userId, keycaps: [keycapId] });
      } else {
        if (!userKeycaps.keycaps.includes(keycapId)) {
          userKeycaps.keycaps.push(keycapId);
        }
      }

      await userKeycaps.save();
      res.status(200).json({ message: "Keycap added successfully." });
      return;
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error." });
    return;
  }

  res.status(405).json({ message: "Method not allowed." });
}
