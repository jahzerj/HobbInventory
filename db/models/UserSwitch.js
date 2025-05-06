import mongoose from "mongoose";

const { Schema } = mongoose;

const userswitchSchema = new Schema(
  {
    userId: { type: String, required: true },
    name: { type: String, required: true },
    manufacturer: { type: String, required: true },
    image: { type: String, required: true },
    quantity: { type: Number, default: 1 },
    switchType: {
      type: String,
      enum: ["Linear", "Tactile", "Clicky"],
      required: true,
    },
    factoryLubed: { type: Boolean, default: false },
    springWeight: { type: String },
    topMaterial: { type: String },
    bottomMaterial: { type: String },
    stemMaterial: { type: String },
    isLubed: { type: Boolean, default: false },
    isFilmed: { type: Boolean, default: false },
    notes: [
      {
        _id: { type: String, required: true },
        text: { type: String, maxlength: 100 },
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

const UserSwitch =
  mongoose.models.UserSwitch || mongoose.model("UserSwitch", userswitchSchema);

export default UserSwitch;
