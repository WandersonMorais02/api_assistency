import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    unitPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false }
);

const shippingAddressSchema = new mongoose.Schema(
  {
    zipCode: {
      type: String,
      trim: true,
    },

    street: {
      type: String,
      trim: true,
    },

    number: {
      type: String,
      trim: true,
    },

    complement: {
      type: String,
      trim: true,
    },

    neighborhood: {
      type: String,
      trim: true,
    },

    city: {
      type: String,
      trim: true,
    },

    state: {
      type: String,
      trim: true,
      uppercase: true,
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
    },

    customerName: {
      type: String,
      required: true,
      trim: true,
    },

    customerPhone: {
      type: String,
      required: true,
      trim: true,
    },

    customerEmail: {
      type: String,
      trim: true,
      lowercase: true,
    },

    shippingAddress: shippingAddressSchema,

    items: [orderItemSchema],

    total: {
      type: Number,
      required: true,
      min: 0,
    },

    status: {
      type: String,
      enum: ["PENDING", "CONFIRMED", "PAID", "PROCESSING", "DELIVERED", "CANCELED"],
      default: "PENDING",
    },

    paymentStatus: {
      type: String,
      enum: ["PENDING", "PAID", "FAILED", "REFUNDED", "CANCELED"],
      default: "PENDING",
    },

    gateway: {
      type: String,
      enum: ["MANUAL", "MERCADO_PAGO"],
      default: "MANUAL",
    },

    gatewayPreferenceId: {
      type: String,
    },

    gatewayPaymentId: {
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

    notes: {
      type: String,
      trim: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const Order = mongoose.model("Order", orderSchema);
