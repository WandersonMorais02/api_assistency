import mongoose from "mongoose";

const botTokenRelationSchema =
  new mongoose.Schema(
    {
      tokenA: {
        type: String,
        required: true,
        index: true,
      },

      tokenB: {
        type: String,
        required: true,
        index: true,
      },

      similarity: {
        type: Number,
        default: 0,
      },

      occurrences: {
        type: Number,
        default: 1,
      },

      contexts: [
        {
          type:
            mongoose.Schema.Types.ObjectId,

          ref: "BotIntent",
        },
      ],

      learnedAutomatically: {
        type: Boolean,
        default: true,
      },

      validated: {
        type: Boolean,
        default: false,
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

botTokenRelationSchema.index(
  {
    tokenA: 1,
    tokenB: 1,
  },
  {
    unique: true,
  }
);

export const BotTokenRelation =
  mongoose.model(
    "BotTokenRelation",
    botTokenRelationSchema
  );
