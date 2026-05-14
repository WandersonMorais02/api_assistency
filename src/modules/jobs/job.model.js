import mongoose from "mongoose";

const jobApplicationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    message: {
      type: String,
      trim: true,
    },

    resume: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Attachment",
    },

    status: {
      type: String,
      enum: ["PENDING", "REVIEWING", "APPROVED", "REJECTED"],
      default: "PENDING",
    },
  },
  { timestamps: true }
);

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    requirements: [
      {
        type: String,
        trim: true,
      },
    ],

    benefits: [
      {
        type: String,
        trim: true,
      },
    ],

    location: {
      type: String,
      trim: true,
    },

    type: {
      type: String,
      enum: ["FULL_TIME", "PART_TIME", "FREELANCE", "INTERNSHIP"],
      default: "FULL_TIME",
    },

    image: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Attachment",
    },

    applications: [jobApplicationSchema],

    isPublished: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const Job = mongoose.model("Job", jobSchema);
