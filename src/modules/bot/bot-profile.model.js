import mongoose from "mongoose";

const botProfileSchema =
  new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
      },

      targetRoles: [
        {
          type: String,

          enum: [
            "CLIENT",
            "ATTENDANT",
            "TECHNICIAN",
            "ADMIN",
          ],
        },
      ],

      tone: {
        type: String,

        enum: [
          "FRIENDLY",
          "PROFESSIONAL",
          "TECHNICAL",
          "CASUAL",
        ],

        default:
          "PROFESSIONAL",
      },

      responseLevel: {
        type: String,

        enum: [
          "BASIC",
          "INTERMEDIATE",
          "ADVANCED",
        ],

        default: "BASIC",
      },

      canShowTechnicalDetails: {
        type: Boolean,
        default: false,
      },

      canAskTechnicalQuestions: {
        type: Boolean,
        default: false,
      },

      affirmationPatterns: [
        String,
      ],

      connectorPatterns: [
        String,
      ],

      questionPatterns: [
        String,
      ],

      closingPatterns: [
        String,
      ],

      isActive: {
        type: Boolean,
        default: true,
      },
    },
    {
      timestamps: true,
    }
  );

export const BotProfile =
  mongoose.model(
    "BotProfile",
    botProfileSchema
  );
