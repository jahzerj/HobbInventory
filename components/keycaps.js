import dbConnect from "@/db/connect";
import Keycapset from "@/db/models/keycapFullobject";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    const keycapsets = await Keycapset.find();
    return res.status(200).json(keycapsets);
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}
