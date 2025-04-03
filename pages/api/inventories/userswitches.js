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

    if (req.method === "POST" || req.method === "PUT") {
      const {
        switchId,
        name,
        manufacturer,
        image,
        quantity,
        switchType,
        factoryLubed,
        springWeight,
        topMaterial,
        bottomMaterial,
        stemMaterial,
        isLubed,
        isFilmed,
        notes = [],
      } = req.body;

      if (req.method === "POST") {
        if (!name || !manufacturer || !image || !switchType) {
          return res.status(400).json({
            message:
              "Missing required fields: Name, Manufacturer, Image, and Switch Type.",
          });
        }

        const newSwitch = await UserSwitch.create({ ...req.body, userId });
        return res
          .status(201)
          .json({ messsage: "Switch added successfully!", switch: newSwitch });
      }

      if (req.method === "PUT") {
        if (!switchId) {
          return res
            .status(400)
            .json({ message: "Switch ID is required for updates." });
        }

        const existingSwitch = await UserSwitch.findOne({
          userId,
          _id: switchId,
        });

        const updatedSwitch = await UserSwitch.findOneAndUpdate(
          { userId, _id: switchId },
          {
            switchId,
            name: name ?? existingSwitch?.name,
            manufacturer: manufacturer ?? existingSwitch?.manufacturer,
            image: image ?? existingSwitch?.image,
            quantity: quantity ?? existingSwitch?.quantity,
            switchType: switchType ?? existingSwitch?.switchType,
            factoryLubed: factoryLubed ?? existingSwitch?.factoryLubed,
            springWeight: springWeight ?? existingSwitch?.springWeight,
            topMaterial: topMaterial ?? existingSwitch?.topMaterial,
            bottomMaterial: bottomMaterial ?? existingSwitch?.bottomMaterial,
            stemMaterial: stemMaterial ?? existingSwitch?.stemMaterial,
            isLubed: isLubed ?? existingSwitch?.isLubed,
            isFilmed: isFilmed ?? existingSwitch?.isFilmed,
            notes: notes ?? existingSwitch?.notes,
          },
          { new: true, upsert: false }
        );

        return res
          .status(200)
          .json({ message: "Switch updated successfully.", updatedSwitch });
      }
    }

    if (req.method === "DELETE") {
      const { switchId } = req.body;

      if (!switchId) {
        res.status(400).json({ message: "Switch ID is required for deletion" });
        return;
      }

      await UserSwitch.findOneAndDelete({
        userId: req.query.userId || "guest_user",
        _id: switchId,
      });

      res.status(200).json({ message: "Switch removed successfully." });
      return;
    }

    return res.status(405).json({ message: "Method Not Allowed" });
  } catch (error) {
    console.error("Error handling request:", error);
    return res.status(500).json({ message: "Internal Server Error." });
  }
}
