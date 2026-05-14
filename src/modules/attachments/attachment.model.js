import mongoose from "mongoose";

const attachmentSchema = new mongoose.Schema(
  {
    originalName: {
      type: String,
      required: true,
      trim: true,
    },

    filename: {
      type: String,
      required: true,
    },

    path: {
      type: String,
      required: true,
    },

    url: {
      type: String,
      required: true,
    },

    mimetype: {
      type: String,
      required: true,
    },

    size: {
      type: Number,
      required: true,
    },

    category: {
      type: String,
      enum: ["image", "document", "audio", "video"],
      required: true,
    },

    context: {
      type: String,
      enum: [
        "PRODUCT_IMAGE",
        "DEVICE_IMAGE",
        "JOB_IMAGE",
        "JOB_RESUME",
        "CONSENT_DOCUMENT",
        "CONSENT_AUDIO",
        "CONSENT_VIDEO",
        "SERVICE_ORDER_ATTACHMENT",
      ],
      required: true,
    },

    relatedTo: {
      type: mongoose.Schema.Types.ObjectId,
    },

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const Attachment = mongoose.model("Attachment", attachmentSchema);
