import mongoose from "mongoose";

const botTrainingSchema =
  new mongoose.Schema(
    {
      originalMessage: {
        type: String,
        required: true,
      },

      normalizedMessage: {
        type: String,
      },

      detectedTokens: [
        String,
      ],

      unknownTokens: [
        String,
      ],

      resolvedIntents: [
        {
          type:
            mongoose.Schema.Types.ObjectId,

          ref: "BotIntent",
        },
      ],

      finalResponse: {
        type: String,
      },

      trainedBy: {
        type:
          mongoose.Schema.Types.ObjectId,

        ref: "User",
      },

      approved: {
        type: Boolean,
        default: false,
      },
    },
    {
      timestamps: true,
    }
  );

export const BotTraining =
  mongoose.model(
    "BotTraining",
    botTrainingSchema
  );
