import dbConnect from "@/db/connect";
import UserKeycap from "@/db/models/UserKeycap";
import Keycapdefinition from "@/db/models/Keycapdefinition";

export default async function handler(req, res) {
  await dbConnect();
  const userId = req.query.userId || "guest_user";

  try {
    if (req.method === "GET") {
      const userKeycaps = await UserKeycap.find({ userId });
      return res.status(200).json(userKeycaps);
    }

    if (req.method === "POST" || req.method === "PUT") {
      const {
        userId,
        keycapDefinitionId,
        name,
        manufacturer,
        profile,
        material,
        profileHeight,
        designer,
        geekhacklink,
        render,
        kits,
        selectedKits,
        selectedColors = [],
        notes = [],
      } = req.body;

      if (!keycapDefinitionId && !name) {
        res.status(400).json({
          message:
            "Either keycap definition ID or keycap details are required.",
        });
        return;
      }

      // Create a new keycap definition if one wasn't provided
      let definitionId = keycapDefinitionId;
      if (!definitionId) {
        const newDefinition = await Keycapdefinition.create({
          name,
          manufacturer,
          profile,
          material,
          profileHeight,
          designer,
          geekhacklink,
          render,
          kits,
        });
        definitionId = newDefinition._id;
      }

      const updatedKeycaps = await UserKeycap.findOneAndUpdate(
        { userId, keycapDefinitionId: definitionId },
        {
          userId,
          keycapDefinitionId: definitionId,
          name,
          manufacturer,
          profile,
          material,
          profileHeight,
          designer,
          geekhacklink,
          render,
          kits,
          selectedKits,
          selectedColors,
          notes,
        },
        { new: true, upsert: true }
      );

      res
        .status(200)
        .json({ message: "Keycap selection updated.", updatedKeycaps });
      return;
    }

    if (req.method === "DELETE") {
      const { keycapDefinitionId } = req.body;

      if (!keycapDefinitionId) {
        res
          .status(400)
          .json({ message: "Keycap definition ID is required for deletion." });
        return;
      }

      await UserKeycap.findOneAndDelete({
        userId: req.query.userId || "guest_user",
        keycapDefinitionId,
      });

      res.status(200).json({ message: "Keycapset removed successfully." });
      return;
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
    return;
  }

  res.status(405).json({ message: "Method not allowed." });
}
