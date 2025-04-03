import dbConnect from "@/db/connect";
import Keyboard from "@/db/models/Keyboard";

export default async function handler(req, res) {
  await dbConnect();

  try {
    if (req.method === "GET") {
      const keyboards = await Keyboard.find();
      res.status(200).json(keyboards);
      return;
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error." });
    return;
  }
  res.status(405).json({ message: "Method not allowed." });
}
