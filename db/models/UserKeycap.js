import mongoose from "mongoose";

const { Schema } = mongoose;

const userkeycapSchema = new Schema({
  userId: { type: String, required: true, default: "guest_user" },

  // Keycap details
  name: { type: String, required: true },
  manufacturer: { type: String },
  profile: { type: String, required: true },
  material: { type: String },
  profileHeight: { type: String },
  designer: { type: String },
  geekhacklink: { type: String },
  render: { type: String, required: true },

  // Kits from keycapdefinition
  kits: [
    {
      name: { type: String, required: true },
      image: { type: String, required: true },
      price: { type: Number },
    },
  ],

  // Selected kits (just the names)
  selectedKits: [{ type: String }],

  // User customizations
  selectedColors: [{ type: String, maxlength: 6 }],
  notes: [
    {
      _id: { type: String, required: true },
      text: { type: String, maxlength: 100 },
      timestamp: { type: Date, default: Date.now },
    },
  ],

  // Reference to keycapdefinition (optional)
  keycapDefinitionId: { type: Schema.Types.ObjectId, ref: "Keycapdefinition" },
});

const UserKeycap =
  mongoose.models.UserKeycap || mongoose.model("UserKeycap", userkeycapSchema);

export default UserKeycap;
