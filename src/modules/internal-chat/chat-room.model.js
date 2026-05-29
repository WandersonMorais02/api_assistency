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
    },

    publicToken: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },

    customer: {
      name: {
        type: String,
        trim: true,
      },
      phone: {
        type: String,
        trim: true,
      },
      email: {
        type: String,
        trim: true,
        lowercase: true,
      },
    },

    status: {
      type: String,
      enum: ["OPEN", "WAITING", "CLOSED"],
      default: "OPEN",
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
