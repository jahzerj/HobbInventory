import dbConnect from "@/db/connect";
import Keyboard from "@/db/models/Keyboard";

export default async function handler(req, res) {
  await dbConnect();

  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ message: "Keyboard ID is required." });
    }

    if (req.method === "GET") {
      const keyboard = await Keyboard.findById(id);

      if (!keyboard) {
        return res.status(404).json({ message: "Keyboard not found." });
      }
      return res.status(200).json(keyboard);
    }
    return res.status(405).json({ message: "Method not allowed." });
  } catch (error) {
    console.error("Error fetching keyboard:", error);
    return res.status(500).json({ message: "Internal Server Error." });
  }
}
