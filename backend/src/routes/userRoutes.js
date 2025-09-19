import { Router } from "express";
import { isAuthenticated } from "../middlewares/authenticate.js";
import { cancelSubscription, deleteMySession, getMe,  getMyPayments, getMySessions } from "../controllers/userController.js";

const router = Router()

router.get(
  "/my-sessions",
  isAuthenticated,
  getMySessions
)

router.delete(
  "/my-sessions/:sessionId",
  isAuthenticated,
  deleteMySession
)

router.get(
  "/my-payments",
  isAuthenticated,
  getMyPayments
)

router.delete(
  "/my-payments/:subscriptionId",
  isAuthenticated,
  cancelSubscription
)

router.get(
  "/me",
  isAuthenticated,
  getMe
)

export default router