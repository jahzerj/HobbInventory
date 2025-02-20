import dbConnect from "@/db/connect";
import Keycapset from "@/db/models/Keycapset";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    const keycapsets = await Keycapset.find();
    return response.status(200).json(keycapsets);
  } else {
    return response.status(405).json({ message: "Method not allowed" });
  }
}
