import mongoose from "mongoose";

const { Schema } = mongoose;

const keycapdefinitionSchema = new Schema({
  name: { type: String, required: true },
  manufacturer: { type: String, required: true },
  profile: { type: String },
  material: { type: String },
  profileHeight: { type: String },
  designer: { type: String },
  geekhacklink: { type: String },
  render: { type: String, required: true },

  kits: [
    {
      name: { type: String, required: true },
      image: { type: String, required: true },
      price: { type: Number },
    },
  ],
});

const Keycapdefinition =
  mongoose.models.Keycapdefinition ||
  mongoose.model("Keycapdefinition", keycapdefinitionSchema);

export default Keycapdefinition;
