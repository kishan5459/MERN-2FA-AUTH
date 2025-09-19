import express, { json, urlencoded } from "express"
import session from "express-session"
import passport from "passport"
import dotenv from "dotenv"
import cors from "cors"
import { dbConnect } from "./config/dbConnect.js"
import authRoutes from "./routes/authRoutes.js"
import paymentRoutes from "./routes/paymentRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import "./config/passportConfig.js"
import { createCustomMongoStore } from "./config/sessionStore.js"
import { webhookHandler } from "./controllers/paymentController.js"

dotenv.config()
dbConnect()

const app = express()

const corsOptions = {
  origin: [process.env.FRONTEND_BASEURL],
  credentials: true
}
app.use(cors(corsOptions))

app.post(
  "/api/payment/stripe/webhook",
  express.raw({ type: "application/json" }),
  webhookHandler
);

app.use(json({ limit: "100mb" }))
app.use(urlencoded({ limit: "100mb", extended: true }))

const mongoStore = await createCustomMongoStore({
  mongoUrl: process.env.MONGODB_URI,
  dbName: process.env.DB_NAME,
  collectionName: "sessions"
});

app.use(session({
  secret: process.env.SESSION_SECRET || "secret",
  resave: false,
  saveUninitialized: false,
  store: mongoStore,
  cookie: {
    maxAge: 1000 * 60 * 60,
    httpOnly: true,
    sameSite: "strict",
    secure: false
  }
}));

app.use(passport.initialize())
app.use(passport.session())

app.use((req, res, next) => {
  console.log("Session object:", req.session);
  console.log("Authenticated user:", req.user);
  next();
});

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/payment", paymentRoutes)
app.use("/api/user", userRoutes)

const PORT = process.env.PORT || 7002
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})