import stripe from "../config/stripeConfig.js";
import { 
  handleChargeSucceeded, 
  handleChargeUpdated, 
  handleCheckoutSessionCompleted, 
  handleInvoicePaymentFailed, 
  handleInvoicePaymentSucceeded, 
  handleSubscriptionDeleted,
} from "../helpers/paymentHelpers.js"

export const CreateBasicPlanCheckoutSession = async (req, res) => {
  if (!stripe) {
    return res.status(503).json({
      message: 'Payment service unavailable',
      serviceDisabled: true,
    });
  }
  if (req.method === 'POST') {
    try {
      const stripeCustomer = await stripe.customers.create({
        email: req.user.email,
        name: req.user.username,
      });

      const params = {
        submit_type: 'pay',
        mode: 'payment',
        payment_method_types: ['card'],
        line_items: [
          {
            price: process.env.STRIPE_BASIC_PLAN_PRICE_ID,
            quantity: 1,
          },
        ],
        shipping_address_collection: {
          allowed_countries: ["US", "CA", "IN"],
        },
        shipping_options: [
          {
            shipping_rate_data: {
              type: "fixed_amount",
              fixed_amount: {
                amount: 0,
                currency: "usd",
              },
              display_name: "Free shipping",
              delivery_estimate: {
                minimum: { unit: "business_day", value: 5 },
                maximum: { unit: "business_day", value: 7 },
              },
            },
          },
          {
            shipping_rate_data: {
              type: "fixed_amount",
              fixed_amount: {
                amount: 200, // $2 shipping
                currency: "usd",
              },
              display_name: "Standard shipping",
              delivery_estimate: {
                minimum: { unit: "business_day", value: 3 },
                maximum: { unit: "business_day", value: 5 },
              },
            },
          },
        ],
        automatic_tax: { enabled: true },
        allow_promotion_codes: false,
        success_url: `${process.env.FRONTEND_BASEURL}/success`,
        cancel_url: `${process.env.FRONTEND_BASEURL}/cancel`,
        client_reference_id: req.user._id.toString(),
        customer: stripeCustomer.id,
        customer_update: {
          shipping: "auto",
          address: "auto",
        },
      };

      const session = await stripe.checkout.sessions.create(params);

      res.status(200).json(session);
    } catch (err) {
      res.status(err.statusCode || 500).json(err.message);
      console.log(err)
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}; 

export const CreateAnnualPlanCheckoutSession = async (req, res) => {
  if (!stripe) {
    return res.status(503).json({
      message: 'Payment service unavailable',
      serviceDisabled: true,
    });
  }
  if (req.method === 'POST') {
    try {
      const stripeCustomer = await stripe.customers.create({
        email: req.user.email,
        name: req.user.username,
      });

      const params = {
        mode: 'payment',
        payment_method_types: ['card'],
        line_items: [
          {
            price: process.env.STRIPE_ANNUAL_PLAN_PRICE_ID,
            quantity: 1,
          },
        ],
        shipping_address_collection: {
          allowed_countries: ["US", "CA", "IN"],
        },
        shipping_options: [
          {
            shipping_rate_data: {
              type: "fixed_amount",
              fixed_amount: {
                amount: 0,
                currency: "usd",
              },
              display_name: "Free shipping",
              delivery_estimate: {
                minimum: { unit: "business_day", value: 5 },
                maximum: { unit: "business_day", value: 7 },
              },
            },
          },
          {
            shipping_rate_data: {
              type: "fixed_amount",
              fixed_amount: {
                amount: 200, // $2 shipping
                currency: "usd",
              },
              display_name: "Standard shipping",
              delivery_estimate: {
                minimum: { unit: "business_day", value: 3 },
                maximum: { unit: "business_day", value: 5 },
              },
            },
          },
        ],
        // discounts: promoCode ? [{ promotion_code: promoCode }] : [],
        allow_promotion_codes: true,
        automatic_tax: { enabled: true },
        success_url: `${process.env.FRONTEND_BASEURL}/success`,
        cancel_url: `${process.env.FRONTEND_BASEURL}/cancel`,
        client_reference_id: req.user._id.toString(),
        customer: stripeCustomer.id,
        customer_update: {
          shipping: "auto",
          address: "auto",
        },
      };

      const session = await stripe.checkout.sessions.create(params);

      res.status(200).json(session);
    } catch (err) {
      res.status(err.statusCode || 500).json(err.message);
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
};

export const CreateNewsletterCheckoutSession = async (req, res) => {
  if (!stripe) {
    return res.status(503).json({
      message: 'Payment service unavailable',
      serviceDisabled: true,
    });
  }
  if(req.method==="POST"){
    try {
      // const { promoCode } = req.body;

      const stripeCustomer = await stripe.customers.create({
        email: req.user.email,
        name: req.user.username,
      });
  
      const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        payment_method_types: ["card"],
        line_items: [
          {
            price: process.env.STRIPE_NEWSLETTER_PRICE_ID,
            quantity: 1,
          }
        ],
        // discounts: promoCode ? [{ promotion_code: promoCode }] : [],
        allow_promotion_codes: true,
        automatic_tax: { enabled: true },
        success_url: `${process.env.FRONTEND_BASEURL}/success`,
        cancel_url: `${process.env.FRONTEND_BASEURL}/cancel`,
        client_reference_id: req.user._id.toString(),
        customer: stripeCustomer.id,
        customer_update: {
          shipping: "auto",
          address: "auto",
        },
      });
  
      res.json({ url: session.url });
    } catch (err) {
      console.error("Error creating newsletter checkout:", err.message);
      res.status(400).json({ error: err.message });
    }
  }
};

export const webhookHandler = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  const webhookSecret = process.env.STRIPE_WEB_HOOK_SECRET

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log(event)

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        // most important for checkout one time payment done
        await handleCheckoutSessionCompleted(event.data.object);
        break;

      case 'invoice.payment_succeeded':
        // most important for payment of subscription plan done (for first time and every next iteration payment)
        await handleInvoicePaymentSucceeded(event.data.object);
        break;

      case 'invoice.payment_failed':
        // for payment failure task
        await handleInvoicePaymentFailed(event.data.object);
        break;

      case 'customer.subscription.deleted':
        // useful if subscription delete/cancel by user
        await handleSubscriptionDeleted(event.data.object);
        break;
      
      case 'charge.succeeded':
        // Update existing payment with charge details
        await handleChargeSucceeded(event.data.object)

      case "charge.updated":
        // To Keep Payment in sync with final updates (e.g. new receipt URL)
        await handleChargeUpdated(event.data.object)

      case "checkout.session.completed":


      default:
        console.log(`Unhandled Stripe event type: ${event.type}`);
    }
  } catch (handlerError) {
    console.error("Error handling webhook event:", event.type, handlerError);

    // optionally return non-2xx here so Stripe retries
    return res.status(500).send();
  }

  // return a 200 to acknowledge receipt of the event
  res.json({ received: true });
};