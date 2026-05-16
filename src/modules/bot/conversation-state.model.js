import mongoose from "mongoose";

const conversationStateSchema = new mongoose.Schema(
  {
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ChatRoom",
      required: true,
      index: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },

    currentIntent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BotIntent",
    },

    detectedIntents: [
      {
        intent: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "BotIntent",
        },

        confidence: {
          type: Number,
          default: 0,
        },
      },
    ],

    knownEntities: {
      deviceType: String,
      brand: String,
      model: String,
      issue: String,
      serviceOrderProtocol: String,
    },

    missingFields: [
      {
        type: String,
      },
    ],

    askedFields: [
      {
        type: String,
      },
    ],

    stage: {
      type: String,
      enum: [
        "START",
        "TRIAGE",
        "COLLECTING_INFO",
        "READY_TO_ANSWER",
        "WAITING_HUMAN",
        "RESOLVED",
      ],
      default: "START",
    },

    lastUserMessage: {
      type: String,
    },

    lastBotMessage: {
      type: String,
    },

    metadata: {
      tokens: [String],
      unknownTokens: [String],
      confidence: Number,
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

export const ConversationState = mongoose.model(
  "ConversationState",
  conversationStateSchema
);
