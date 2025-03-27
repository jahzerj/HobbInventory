import mongoose from "mongoose";

const { Schema } = mongoose;

const userkeyboardkitSchema = new Schema(
  {
    userId: { type: String, required: true },
    name: { type: String, required: true },
    designer: { type: String, required: true },
    layout: { type: String, required: true },
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
    plateMaterial: { type: String },
    mounting: { type: String },
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
    notes: [
      {
        _id: { type: String, required: true },
        text: { type: String, maxlength: 100 },
        timestamp: { type: Date, default: Date.now },
      },
    ],
    keyboardKitId: { type: Schema.Types.ObjectId, ref: "KeyboardKit" },
  },
  { timestamps: true }
);

const UserKeyboardKit =
  mongoose.models.UserKeyboardKit ||
  mongoose.model("UserKeyboardKit", userkeyboardkitSchema);

export default UserKeyboardKit;
