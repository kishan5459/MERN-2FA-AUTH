import Payment from "../models/payment.js";
import stripe from "../config/stripeConfig.js"

// Checkout session completed (done)
export const handleCheckoutSessionCompleted = async (session) => {
  console.log("handleCheckoutSessionCompleted : ", session);

  const userId = session.client_reference_id;
  let promoCodeId = null;

  if (session.discounts && session.discounts.length > 0) {
    const discount = session.discounts[0];
    promoCodeId = discount.promotion_code;
  }

  if (session.mode === "payment") {
    // One-time payment
    await Payment.create({
      user: userId,
      type: "payment",
      stripeCheckoutSessionId: session.id,
      stripePaymentIntentId: session.payment_intent,
      amountSubtotal: session.amount_subtotal,
      amountTax: session.total_details?.amount_tax ?? 0,
      amountShipping: session.total_details?.amount_shipping ?? 0,
      amountTotal: session.amount_total,
      currency: session.currency,
      status: "paid",
      customerEmail: session.customer_details?.email,
      customerName: session.customer_details?.name,
      customerAddress: session.customer_details?.address,
      shipping: session.shipping,
      promocodeId: promoCodeId,
      completeObject: [{checkout_complete: session}]
    });
  }

  if (session.mode === "subscription") {
    // Subscription
    await Payment.create({
      user: userId,
      type: "subscription",
      stripeCheckoutSessionId: session.id,
      stripeSubscriptionId: session.subscription,
      amountSubtotal: session.amount_subtotal,
      amountTax: session.total_details?.amount_tax ?? 0,
      amountShipping: session.total_details?.amount_shipping ?? 0,
      amountTotal: session.amount_total,
      currency: session.currency,
      status: "active",
      customerEmail: session.customer_details?.email,
      customerName: session.customer_details?.name,
      customerAddress: session.customer_details?.address,
      shipping: session.shipping,
      promocodeId: promoCodeId,
      completeObject: [{checkout_complete: session}]
    });
  }
};

// Invoice paid (fires for subscriptions every billing cycle) (done)
export const handleInvoicePaymentSucceeded = async (invoice) => {
  console.log("handleInvoicePaymentSucceeded : ", invoice);

  const payment = await Payment.findOne({ stripeSubscriptionId: invoice.parent.subscription_details.subscription });

  if (payment) {
    payment.status = "active";
  
    payment.invoices.push({
      invoiceId: invoice.id,
      amountPaid: invoice.amount_paid,
      currency: invoice.currency,
      paidAt: invoice.status_transitions?.paid_at
        ? new Date(invoice.status_transitions.paid_at * 1000)
        : null,
      hostedInvoiceUrl: invoice.hosted_invoice_url,
      invoicePdf: invoice.invoice_pdf,
    });
  
    payment.completeObject.push({ payment_succeeded: invoice });
  
    await payment.save();
  }   
};

// Invoice payment failed
export const handleInvoicePaymentFailed = async (invoice) => {
  console.log("handleInvoicePaymentFailed : ", invoice);

  await Payment.findOneAndUpdate(
    { stripeSubscriptionId: invoice.subscription },
    { 
      $set: {
        status: "past_due"
      },
      $push: {
        completeObject: {
          invoice_failed: invoice
        }
      }
    },
    { new: true }
  );
};

// Subscription canceled/deleted (done)
export const handleSubscriptionDeleted = async (subscription) => {
  console.log("handleSubscriptionDeleted : ", subscription);

  await Payment.findOneAndUpdate(
    { stripeSubscriptionId: subscription.id },
    { 
      $set: {
        status: "canceled"
      },
      $push: {
        completeObject: {
          subscription_delete: subscription
        }
      }
    },
    { new: true }
  );
};

// Charge succeeded (one-time payments + first subscription payment) ( done )
export const handleChargeSucceeded = async (charge) => {
  console.log("handleChargeSucceeded : ", charge);

  await Payment.findOneAndUpdate(
    { stripePaymentIntentId: charge.payment_intent },
    {
      $set: {
        stripeChargeId: charge.id,
        receiptUrl: charge.receipt_url,
        balanceTransactionId: charge.balance_transaction,
        status: "paid",
      },
      $push: {
        completeObject: {
          charge_succeeded: charge
        }
      }
    },
    { new: true }
  );
};

// Charge updated (receipt URL, refunds, etc.) ( done )
export const handleChargeUpdated = async (charge) => {
  console.log("handleChargeUpdated : ", charge);

  await Payment.findOneAndUpdate(
    { stripePaymentIntentId: charge.payment_intent },
    {
      $set: {
        receiptUrl: charge.receipt_url,
        balanceTransactionId: charge.balance_transaction,
      },
      $push: {
        completeObject: {
          charge_upadate: charge
        }
      }
    },
    { new: true }
  );
};

//========= For Reference Only ==========

// Option you may use ( if want )

// shipping_options: [{ shipping_rate: 'shr_YOUR_ID' }],

// Explanation of events

// invoice.upcoming
// If you want to remind users that a renewal is coming. Not required.

// checkout.session.completed
// Fires when a Checkout Session finishes. For both one-time and subscription signups. Use this to mark that the user started a purchase, record which plan they chose, store session & metadata.

// invoice.paid
// For a subscription, this fires when the invoice for a subscription period is paid (renewals, or the first recurring invoice). Use this to grant/renew access every billing period.

// invoice.payment_failed
// When Stripe fails to collect payment for a subscription renewal (card declined etc.). Use this to notify user, maybe limit access, retry logic.

// customer.subscription.deleted
// When subscription is cancelled (or ended). Revoke access, mark status in your DB.