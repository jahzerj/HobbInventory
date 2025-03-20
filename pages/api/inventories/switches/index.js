import dbConnect from "@/db/connect";
import MXSwitch from "@/db/models/MXSwitch";

export default async function handler(req, res) {
  await dbConnect();

  try {
    if (req.method === "GET") {
      const mxSwitches = await MXSwitch.find();
      res.status(200).json(mxSwitches);
      return;
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error." });
    return;
  }
  res.status(405).json({ message: "Method not allowed." });
}
