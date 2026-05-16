import mongoose from "mongoose";

const chatMessageSchema = new mongoose.Schema(
  {
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ChatRoom",
      required: true,
    },

    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    type: {
      type: String,
      enum: [
        "TEXT",
        "IMAGE",
        "FILE",
        "SYSTEM",
        "BOT",
      ],
      default: "TEXT",
    },

    content: {
      type: String,
      required: true,
      trim: true,
    },

    attachments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Attachment",
      },
    ],

    readBy: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },

        readAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    metadata: {
      confidence: Number,
      intent: String,
      tokens: [String],
    },

    isEdited: {
      type: Boolean,
      default: false,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const ChatMessage = mongoose.model(
  "ChatMessage",
  chatMessageSchema
);
