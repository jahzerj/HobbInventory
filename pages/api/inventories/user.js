import dbConnect from "@/db/connect";
import User from "@/db/models/User";
import { v4 as uuidv4 } from "uuid";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "POST") {
    try {
      const { email, provider, providerAccountId, name, image } = req.body;

      // Find existing user by account
      let user = await User.findOne({ provider, providerAccountId });

      //If not found, create a new user
      if (!user) {
        user = await User.create({
          uuid: uuidv4(),
          email,
          provider,
          providerAccountId,
          name,
          image,
        });
      }
      return res.status(201).json(user);
    } catch (error) {
      console.error("User API error:", error);
      return res
        .status(500)
        .json({ message: "Error creating, retrieving user" });
    }
  }
  return res.status(405).json({ message: "Method not allowed" });
}
