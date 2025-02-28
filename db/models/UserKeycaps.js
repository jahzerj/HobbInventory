import mongoose from "mongoose";
// import "./Keycapset";

const { Schema } = mongoose;

const userkeycapsSchema = new Schema({
  userId: { type: String, required: true, default: "guest_user" },
  keycapSetId: {
    type: Schema.Types.ObjectId,
    ref: "Keycapset",
    required: true,
  },
  selectedKits: [{ type: String }],
  selectedColors: [{ type: String, maxlength: 4 }],
  notes: [
    {
      text: { type: String, maxlength: 100 },
      timestamp: { type: Date, default: Date.now },
    },
  ],
});

const UserKeycaps =
  mongoose.models.UserKeycaps ||
  mongoose.model("UserKeycaps", userkeycapsSchema);

export default UserKeycaps;
