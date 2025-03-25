import dbConnect from "@/db/connect";
import Keycapdefinition from "@/db/models/Keycapdefinition";

export default async function handler(req, res) {
  await dbConnect();

  try {
    if (req.method === "GET") {
      const keycaps = await Keycapdefinition.find();
      res.status(200).json(keycaps);
      return;
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error." });
    return;
  }
  res.status(405).json({ message: "Method not allowed." });
}
