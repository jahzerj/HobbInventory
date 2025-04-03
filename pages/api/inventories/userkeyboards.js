import dbConnect from "@/db/connect";
import UserKeyboard from "@/db/models/UserKeyboard";

export default async function handler(req, res) {
  await dbConnect();

  try {
    const userId = req.query.userId || "guest_user";

    if (req.method === "GET") {
      const userKeyboards = await UserKeyboard.find({ userId });
      return res.status(200).json(userKeyboards);
    }

    if (req.method === "POST" || req.method === "PUT") {
      const {
        keyboardId,
        name,
        designer,
        layout,
        renders,
        blocker,
        switchType,
        plateMaterial,
        mounting,
        typingAngle,
        frontHeight,
        surfaceFinish,
        color,
        weightMaterial,
        buildWeight,
        pcbOptions,
        builds = [],
      } = req.body;

      if (req.method === "POST") {
        if (
          !name ||
          !designer ||
          !layout ||
          !blocker ||
          !switchType ||
          !renders
        ) {
          return res.status(400).json({
            message:
              "Missing required fields: Name, Designer, Layout, Blocker, Switch Type and Renders",
          });
        }

        const newKeyboard = await UserKeyboard.create({ ...req.body, userId });
      }

      if (req.method === "PUT") {
        if (!keyboardId) {
          return res
            .status(400)
            .json({ message: "Keyboard ID is required for updates." });
        }

        const existingKeyboard = await UserKeyboard.findOne({
          userId,
          _id: keyboardId,
        });

        const updatedKeyboard = await UserKeyboard.findOneAndUpdate(
          { userId, _id: keyboardId },
          {
            name: name ?? existingKeyboard?.name,
            designer: designer ?? existingKeyboard?.designer,
            layout: layout ?? existingKeyboard?.layout,
            renders: renders ?? existingKeyboard?.renders,
            blocker: blocker ?? existingKeyboard?.blocker,
            switchType: switchType ?? existingKeyboard?.switchType,
            plateMaterial: plateMaterial ?? existingKeyboard?.plateMaterial,
            mounting: mounting ?? existingKeyboard?.mounting,
            typingAngle: typingAngle ?? existingKeyboard?.typingAngle,
            frontHeight: frontHeight ?? existingKeyboard?.frontHeight,
            surfaceFinish: surfaceFinish ?? existingKeyboard?.surfaceFinish,
            color: color ?? existingKeyboard?.color,
            weightMaterial: weightMaterial ?? existingKeyboard?.weightMaterial,
            buildWeight: buildWeight ?? existingKeyboard?.buildWeight,
            pcbOptions: pcbOptions ?? existingKeyboard?.pcbOptions,
            builds: builds ?? existingKeyboard?.builds,
          },
          { new: true, upsert: false }
        );

        return res.status(200).json({
          message: "Keyboard updated successfully!",
          updatedKeyboard,
        });
      }
    }

    if (req.method === "DELETE") {
      const { keyboardId } = req.body;

      if (!keyboardId) {
        res
          .status(400)
          .json({ message: "Keyboard ID is required for deletion." });
        return;
      }

      await UserKeyboard.findOneAndDelete({
        userId: req.query.userId || "guest_user",
        _id: keyboardId,
      });

      res.status(200).json({ message: "Keyboard removed successfully." });
      return;
    }

    return res.status(405).json({ message: "Method Not Allowed" });
  } catch (error) {
    console.error("Error handling request:", error);
    return res.status(500).json({ message: "Internal Server Error." });
  }
}
