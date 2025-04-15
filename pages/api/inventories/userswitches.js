import dbConnect from "@/db/connect";
import UserSwitch from "@/db/models/UserSwitch";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  // Get session and authenticate
  const session = await getServerSession(req, res, authOptions);

  // Check for valid session
  if (!session || !session.user || !session.user.email) {
    console.error("No valid session user email found:", session);
    return res
      .status(401)
      .json({ message: "Valid user session with email required" });
  }

  await dbConnect();

  // Use session.user.email as the identifier
  const userEmail = session.user.email;

  try {
    if (req.method === "GET") {
      const userSwitches = await UserSwitch.find({ userId: userEmail });
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

        // Use userEmail from session instead of from request
        const newSwitch = await UserSwitch.create({
          ...req.body,
          userId: userEmail,
        });
        return res
          .status(201)
          .json({ message: "Switch added successfully!", switch: newSwitch });
      }

      if (req.method === "PUT") {
        if (!switchId) {
          return res
            .status(400)
            .json({ message: "Switch ID is required for updates." });
        }

        const existingSwitch = await UserSwitch.findOne({
          userId: userEmail,
          _id: switchId,
        });

        if (!existingSwitch) {
          return res
            .status(404)
            .json({ message: "Switch not found or unauthorized" });
        }

        const updatedSwitch = await UserSwitch.findOneAndUpdate(
          { userId: userEmail, _id: switchId },
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
        return res
          .status(400)
          .json({ message: "Switch ID is required for deletion" });
      }

      const result = await UserSwitch.findOneAndDelete({
        userId: userEmail,
        _id: switchId,
      });

      if (!result) {
        return res
          .status(404)
          .json({ message: "Switch not found or unauthorized" });
      }

      return res.status(200).json({ message: "Switch removed successfully." });
    }

    return res.status(405).json({ message: "Method Not Allowed" });
  } catch (error) {
    console.error("Error handling request:", error);
    return res.status(500).json({ message: "Internal Server Error." });
  }
}
