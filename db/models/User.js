import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    uuid: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    provider: { type: String, required: true },
    providerAccountId: { type: String, required: true },
    name: { type: String, required: true },
    image: { type: String },
  },
  { timestamps: true }
);

//Compound unique index on provider and providerAccountId to ensure unique user account
userSchema.index({ provider: 1, providerAccountId: 1 }, { unique: true });

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
