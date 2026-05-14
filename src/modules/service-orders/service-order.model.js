import mongoose from "mongoose";

const timelineSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      required: true,
    },

    message: {
      type: String,
      required: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const serviceOrderSchema = new mongoose.Schema(
  {
    protocol: {
      type: String,
      required: true,
      unique: true,
    },

    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },

    device: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Device",
      required: true,
    },

    technician: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    status: {
      type: String,
      enum: [
        "RECEIVED",
        "IN_ANALYSIS",
        "WAITING_APPROVAL",
        "APPROVED",
        "IN_REPAIR",
        "COMPLETED",
        "DELIVERED",
        "CANCELED",
      ],
      default: "RECEIVED",
    },

    estimatedBudget: {
      type: Number,
      default: 0,
    },

    finalPrice: {
      type: Number,
      default: 0,
    },

    approvedByClient: {
      type: Boolean,
      default: false,
    },

    diagnosis: {
      type: String,
      trim: true,
    },

    technicalReport: {
      type: String,
      trim: true,
    },

    internalNotes: {
      type: String,
      trim: true,
    },

    attachments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Attachment",
      },
    ],

    timeline: [timelineSchema],

    deliveredAt: {
      type: Date,
    },

    canceledAt: {
      type: Date,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const ServiceOrder = mongoose.model(
  "ServiceOrder",
  serviceOrderSchema
);
