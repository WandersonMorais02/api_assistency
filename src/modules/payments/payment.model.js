import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    context: {
      type: String,
      enum: ["SERVICE_ORDER", "ORDER"],
      required: true,
    },

    relatedTo: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    method: {
      type: String,
      enum: [
        "CASH",
        "PIX",
        "CREDIT_CARD",
        "DEBIT_CARD",
        "BANK_TRANSFER",
        "OTHER",
      ],
      required: true,
    },

    status: {
      type: String,
      enum: ["PENDING", "PAID", "CANCELED", "REFUNDED"],
      default: "PENDING",
    },

    paidAt: {
      type: Date,
    },

    notes: {
      type: String,
      trim: true,
    },

    gateway: {
      type: String,
      enum: ["MANUAL", "MERCADO_PAGO"],
      default: "MANUAL",
    },

    gatewayPaymentId: {
      type: String,
    },

    gatewayPreferenceId: {
      type: String,
    },

    checkoutUrl: {
      type: String,
    },

    externalReference: {
      type: String,
    },

    gatewayRawResponse: {
      type: Object,
    },

    receivedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const Payment = mongoose.model("Payment", paymentSchema);
