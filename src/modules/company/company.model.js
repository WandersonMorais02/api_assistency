import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    document: {
      type: String,
      trim: true,
    },

    phone: {
      type: String,
      trim: true,
    },

    whatsapp: {
      type: String,
      trim: true,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
    },

    address: {
      street: String,
      number: String,
      neighborhood: String,
      city: String,
      state: String,
      zipCode: String,
    },

    openingHours: {
      type: String,
      trim: true,
    },

    logo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Attachment",
    },

    consentTerms: {
      type: String,
      trim: true,
    },

    warrantyPolicy: {
      type: String,
      trim: true,
    },

    socialLinks: {
      instagram: String,
      facebook: String,
      tiktok: String,
      website: String,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const Company = mongoose.model("Company", companySchema);
