import dbConnect from "@/db/connect";
import dbConnectn from "@/db/connect";
import Keycapset from "@/db/models/Keycapset";

export default async function handler(req, res) {
  await dbConnect();

  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ message: "Keycap ID is required." });
    }

    if (req.method === "GET") {
      const keycap = await Keycapset.findById(id).populate("kits");

      if (!keycap) {
        return res.status(404).json({ message: "Keycap not found." });
      }
      return res.status(200).json(keycap);
    }
    return res.status(405).json({ message: "Method not allowed." });
  } catch (error) {
    console.error("Error fetching keycap:", error);
    return res.status(500).json({ message: "Internal Server Error." });
  }
}
