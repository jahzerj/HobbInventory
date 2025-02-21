import mongoose from "mongoose";
import "./Kit";

const { Schema } = mongoose;

const keycapsetSchema = new Schema({
  name: { type: String, required: true },
  keycapstype: { type: String, required: true },
  designer: { type: String, required: false },
  profile: { type: String, required: true },
  link: { type: String, required: false },
  render_pics: { type: Array, required: false },
  kits: [{ type: Schema.ObjectId, ref: "Kit" }],
});

const Keycapset =
  mongoose.models.Keycapset || mongoose.model("Keycapset", keycapsetSchema);

export default Keycapset;
