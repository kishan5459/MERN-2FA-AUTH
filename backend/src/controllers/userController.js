import Session from "../models/session.js";
import Payment from "../models/payment.js";
import User from "../models/user.js";
import stripe from "../config/stripeConfig.js";

export const getMySessions = async (req, res) => {
  try {
    const sessions = await Session.find({ userId: req.user._id.toString() });
    res.json({ success: true, sessions });
  } catch (err) {
    console.error("Error fetching sessions:", err);
    res.status(500).json({ success: false, message: "Failed to fetch sessions" });
  }
};

export const deleteMySession = async (req, res) => {
  try {
    const { sessionId } = req.params;

    console.log(sessionId, req.user._id)

    const deleted = await Session.findOneAndDelete({
      _id: sessionId,
      userId: req.user._id.toString(),
    });

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Session not found" });
    }

    res.json({ success: true, message: "Session deleted successfully" });
  } catch (err) {
    console.error("Error deleting session:", err);
    res.status(500).json({ success: false, message: "Failed to delete session" });
  }
};

export const getMyPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, payments });
  } catch (err) {
    console.error("Error fetching payments:", err);
    res.status(500).json({ success: false, message: "Failed to fetch payments" });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password -twoFactorSecret");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.json({ success: true, user });
  } catch (err) {
    console.error("Error fetching user profile:", err);
    res.status(500).json({ success: false, message: "Failed to fetch user profile" });
  }
};

export const cancelSubscription = async (req, res) => {
  try {
    const { subscriptionId } = req.params;
    const userId = req.user._id;

    const payment = await Payment.findOne({
      user: userId,
      stripeSubscriptionId: subscriptionId,
      type: "subscription",
      status: "active",
    });

    if (!payment) {
      return res.status(404).json({ message: "Active subscription not found" });
    }

    const canceledSubscription = await stripe.subscriptions.cancel(subscriptionId);

    return res.status(200).json({
      message: "Subscription canceled successfully",
      subscription: canceledSubscription,
    });
  } catch (error) {
    console.error("Error canceling subscription:", error);
    return res.status(500).json({ message: "Failed to cancel subscription", error: error.message });
  }
}