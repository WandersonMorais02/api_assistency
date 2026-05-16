import mongoose from "mongoose";

const botIntentSchema =
  new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
      },

      description: {
        type: String,
      },

      responses: [
        {
          type:
            mongoose.Schema.Types.ObjectId,

          ref: "BotAnswer",
        },
      ],

      confidenceThreshold: {
        type: Number,
        default: 0.3,
      },

      usageCount: {
        type: Number,
        default: 0,
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

export const BotIntent =
  mongoose.model(
    "BotIntent",
    botIntentSchema
  );
