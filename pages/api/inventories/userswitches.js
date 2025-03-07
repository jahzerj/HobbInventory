import dbConnect from "@/db/connect";
import UserSwitch from "@/db/models/UserSwitch";

export default async function handler(req, res) {
  await dbConnect();

  try {
    const userId = req.query.userId || "guest_user";

    if (req.method === "GET") {
      const userSwitches = await UserSwitch.find({ userId });
      return res.status(200).json(userSwitches);
    }

    if (req.method === "POST") {
      const { name, manufacturer, image, switchType } = req.body;
      
      if (!name || !manufacturer || !image || !switchType) {
        return res
          .status(400)
          .json({
            message:
              "Missing required fields: Name, Manufacturer, Image, and Switch Type.",
          });
      }

      const newSwitch = await UserSwitch.create({ ...req.body, userId });
      return res
        .status(201)
        .json({ message: "Switch added successfully!", switch: newSwitch });
    }

    return res.status(405).json({ message: "Method Not Allowed" });
  } catch (error) {
    console.error("Error handling request:", error);
    return res.status(500).json({ message: "Internal Server Error." });
  }
}
