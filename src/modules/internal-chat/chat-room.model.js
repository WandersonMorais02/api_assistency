import mongoose from "mongoose";

const chatRoomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },

    type: {
      type: String,
      enum: [
        "PRIVATE",
        "GROUP",
        "SUPPORT",
        "BOT",
      ],
      default: "PRIVATE",
    },

    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ChatMessage",
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

export const ChatRoom = mongoose.model(
  "ChatRoom",
  chatRoomSchema
);
