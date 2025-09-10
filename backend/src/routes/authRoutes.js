import { Router } from "express";
import { authStatus, login, logout, register, reset2FA, setup2FA, verify2FA, googleLoginSuccess } from "../controllers/authController.js";
import passport from "passport";
import { isAuthenticated } from "../middlewares/authenticate.js";
import { addIp, b4addIp } from "../middlewares/metadata.js";
import dotenv from "dotenv"

dotenv.config()

const router = Router()

// Registration Route
router.post("/register", register)

// Login Route
router.post(
  "/login", 
  passport.authenticate("local", { failureRedirect: "/login" }),
  addIp,
  login
)

// Auth Status Route
router.get("/status", authStatus)

// Logout Route
router.post("/logout", logout)

// 2FA Setup Route
router.post("/2fa/setup", isAuthenticated, setup2FA)

// 2FA Verify Route
router.post("/2fa/verify", isAuthenticated, verify2FA)

// 2FA Reset Route
router.post("/2fa/reset", isAuthenticated, reset2FA)

// Redirect user to Google for authentication
// if you are using jwt then do session false : { session: false, scope: ["profile", "email"] } refer geekyshows
// we have to go on below route from frontend
router.get(
  "/google",
  passport.authenticate("google", { 
    scope: ["profile", "email"],
    accessType: 'offline',
    prompt: 'consent'
  })
);

// Google callback URL
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.FRONTEND_BASEURL}/login`
  }),
  googleLoginSuccess
);


export default router