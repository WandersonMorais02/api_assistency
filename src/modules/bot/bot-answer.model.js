import mongoose from "mongoose";

const botAnswerSchema =
  new mongoose.Schema(
    {
      intent: {
        type:
          mongoose.Schema.Types.ObjectId,

        ref: "BotIntent",

        required: true,
      },

      content: {
        type: String,
        required: true,
      },

      priority: {
        type: Number,
        default: 1,
      },

      usageCount: {
        type: Number,
        default: 0,
      },

      learned: {
        type: Boolean,
        default: false,
      },

      createdBy: {
        type:
          mongoose.Schema.Types.ObjectId,

        ref: "User",
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

export const BotAnswer =
  mongoose.model(
    "BotAnswer",
    botAnswerSchema
  );
