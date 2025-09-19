import mongoose, { Schema } from "mongoose";

const paymentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  type: { type: String, enum: ["payment", "subscription"], required: true },

  stripeCheckoutSessionId: { type: String, required: true },
  stripePaymentIntentId: { type: String },
  stripeSubscriptionId: { type: String },

  stripeChargeId: { type: String },
  receiptUrl: { type: String },
  balanceTransactionId: { type: String },

  amountSubtotal: { type: Number, required: true },
  amountTax: { type: Number, default: 0 },
  amountShipping: { type: Number, default: 0 },
  amountTotal: { type: Number, required: true },
  currency: { type: String, required: true },

  status: { type: String, enum: ["paid", "active", "canceled", "past_due"], required: true },

  customerEmail: { type: String },
  customerName: { type: String },
  customerAddress: { type: Object },
  shipping: { type: Object },
  promocodeId: { type: String },
  invoices: { type: [Schema.Types.Mixed], default: [] },

  completeObject: [{ type: mongoose.Schema.Types.Mixed }]
}, { timestamps: true });


const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;;