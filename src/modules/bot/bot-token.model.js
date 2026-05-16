import mongoose from "mongoose";

const botTokenSchema =
  new mongoose.Schema(
    {
      token: {
        type: String,
        required: true,
        unique: true,
        trim: true,
      },

      normalized: {
        type: String,
        required: true,
        index: true,
      },

      intents: [
        {
          type:
            mongoose.Schema.Types.ObjectId,

          ref: "BotIntent",
        },
      ],

      weight: {
        type: Number,
        default: 1,
      },

      occurrences: {
        type: Number,
        default: 0,
      },

      learned: {
        type: Boolean,
        default: false,
      },

      autoLearned: {
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

export const BotToken =
  mongoose.model(
    "BotToken",
    botTokenSchema
  );
