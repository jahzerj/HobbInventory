import dbConnect from "@/db/connect";
import UserSwitch from "@/db/models/UserSwitch";

export default async function handler(req, res) {
  await dbConnect();

  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ message: "Switch ID is required." });
    }

    if (req.method === "GET") {
      const mxswitch = await UserSwitch.findById(id);

      if (!mxswitch) {
        return res.status(404).json({ message: "Switch not found." });
      }
      return res.status(200).json(mxswitch);
    }
    return res.status(405).json({ message: "Method not allowed." });
  } catch (error) {
    console.error("Error fetching switch:", error);
    return res.status(500).json({ message: "Internal Server Error." });
  }
}
