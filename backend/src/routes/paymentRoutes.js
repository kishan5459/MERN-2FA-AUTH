import dotenv from "dotenv"
import { Router } from "express"
import { 
  CreateAnnualPlanCheckoutSession, 
  CreateBasicPlanCheckoutSession, 
  CreateNewsletterCheckoutSession 
} from "../controllers/paymentController.js";
import { isAuthenticated } from "../middlewares/authenticate.js";

const router = Router()

router.post(
  "/stripe/checkout/basic", 
  isAuthenticated,
  CreateBasicPlanCheckoutSession
);

router.post(
  "/stripe/checkout/annual", 
  isAuthenticated,
  CreateAnnualPlanCheckoutSession
);

router.post(
  "/stripe/checkout/newsletter",
  isAuthenticated,
  CreateNewsletterCheckoutSession
);

export default router