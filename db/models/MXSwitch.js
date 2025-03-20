import mongoose from "mongoose";

const { Schema } = mongoose;

const mxswitchSchema = new Schema({
  name: { type: String, required: true },
  manufacturer: { type: String, required: true },
  image: { type: String, required: true },
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
});

const MXSwitch =
  mongoose.models.MXSwitch || mongoose.model("MXSwitch", mxswitchSchema);

export default MXSwitch;
