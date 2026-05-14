import mongoose from "mongoose";

const deviceSchema = new mongoose.Schema(
  {
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },

    deviceType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DeviceType",
      required: true,
    },

    brand: {
      type: String,
      required: true,
      trim: true,
    },

    model: {
      type: String,
      required: true,
      trim: true,
    },

    serialNumber: {
      type: String,
      trim: true,
    },

    imei: {
      type: String,
      trim: true,
    },

    color: {
      type: String,
      trim: true,
    },

    accessories: [
      {
        type: String,
        trim: true,
      },
    ],

    reportedIssue: {
      type: String,
      required: true,
      trim: true,
    },

    physicalCondition: {
      type: String,
      trim: true,
    },

    passwordOrPattern: {
      type: String,
      trim: true,
      select: false,
    },

    observations: {
      type: String,
      trim: true,
    },

    images: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Attachment",
      },
    ],

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Device = mongoose.model("Device", deviceSchema);
