import mongoose from "mongoose";

const { Schema } = mongoose;

const userkeyboardSchema = new Schema(
  {
    userId: { type: String, required: true },
    name: { type: String, required: true },
    designer: { type: String, required: true },
    layout: { type: String, required: true },
    renders: [{ type: String, required: true }],
    blocker: {
      type: String,
      enum: ["Winkey", "Winkeyless", "HHKB"],
      required: true,
    },
    switchType: {
      type: String,
      enum: ["MX", "EC", "HE", "Alps"],
      required: true,
    },
    plateMaterial: [{ type: String }],
    mounting: [{ type: String }],
    typingAngle: { type: String },
    frontHeight: { type: String },
    surfaceFinish: { type: String },
    color: { type: String },
    weightMaterial: { type: String },
    buildWeight: { type: String },
    pcbOptions: {
      thickness: {
        type: String,
        enum: ["1.2mm", "1.6mm"],
      },
      material: {
        type: String,
        enum: ["FR4", "CEM"],
      },
      backspace: [
        {
          type: String,
          enum: ["Full BS", "Split BS"],
        },
      ],
      layoutStandard: [
        {
          type: String,
          enum: ["ISO", "ANSI"],
        },
      ],
      leftShift: [
        {
          type: String,
          enum: ["Split LS", "Full LS"],
        },
      ],
      capslock: [
        {
          type: String,
          enum: ["NormalCapslock", "SteppedCapslock"],
        },
      ],
      rightShift: [
        {
          type: String,
          enum: ["Split Right Shift", "Full Right Shift"],
        },
      ],
      numpad: {
        enter: [
          {
            type: String,
            enum: ["Split Enter", "Full Enter"],
          },
        ],
        plus: [
          {
            type: String,
            enum: ["Split Plus", "Full Plus"],
          },
        ],
        zero: [
          {
            type: String,
            enum: ["Split Zero", "Full Zero"],
          },
        ],
        orientation: [
          {
            type: String,
            enum: ["Normal", "Inverted"],
          },
        ],
      },
      spacebar: [
        {
          type: String,
          enum: ["10u", "7u", "6.25u", "6u", "Split"],
        },
      ],
      flexCuts: { type: Boolean, default: false },
    },
    builds: [
      {
        name: { type: String, required: true },
        plate: { type: String, required: true },
        switches: [
          {
            switchId: { type: Schema.Types.ObjectId, ref: "UserSwitch" },
            quantity: { type: Number },
            position: { type: String },
          },
        ],
        stabilizers: {
          type: { type: String, enum: ["Screw-in", "Snap-in", "Plate-mount"] },
          brand: String,
          lubed: { type: Boolean, default: false },
        },
        modifications: [
          {
            type: String,
            description: String,
            date: { type: Date, default: Date.now },
          },
        ],
        photos: [String],
        active: { type: Boolean, default: true },
        buildDate: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

const UserKeyboard =
  mongoose.models.UserKeyboard ||
  mongoose.model("UserKeyboardKit", userkeyboardSchema);

export default UserKeyboard;
