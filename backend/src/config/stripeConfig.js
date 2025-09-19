import Stripe from 'stripe';
import dotenv from "dotenv"

dotenv.config()

let stripe = null;
const STRIPE_KEY = process.env.STRIPE_SECRET_KEY;

if (STRIPE_KEY) {
  try {
    stripe = new Stripe(STRIPE_KEY);
  } catch (error) {
    console.warn('Stripe initialization failed:', error);
  }
}

export default stripe