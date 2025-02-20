import dbConnect from "@/db/connect";
import Keycapset from "@/db/models/Keycapset";

export default async function handler(req, res) {
  await dbConnect();

  try {
    if (req.method === "GET") {
      const keycapset = await Keycapset.find().populate("kits");
      res.status(200).json(keycapset);
      return;
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error." });
    return;
  }
  res.status(405).json({ message: "Method not allowed." });
}
