import mongoose from "mongoose";

const { Schema } = mongoose;

const kitSchema = new Schema({
  price_list: { type: Array, required: true },
});

const Kit = mongoose.models.Kit || mongoose.model("Kit", kitSchema);

export default Kit;
