import mongoose from "mongoose";

const { Schema } = mongoose;

const userkeycapsSchema = new Schema({
  userId: { type: String, required: true, default: "guest_user" },
  keycaps: [{ type: Schema.ObjectId, ref: "Keycapset" }],
});

const UserKeycaps =
  mongoose.models.UserKeycaps ||
  mongoose.model("UserKeycaps", userkeycapsSchema);

export default UserKeycaps;
