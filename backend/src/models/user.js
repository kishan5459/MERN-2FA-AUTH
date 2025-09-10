import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  isMfaActive: {
    type: Boolean,
    required: false
  },
  twoFactorSecret:{
    type: String,
  },
  googleApiAccessToken: {
    type: String
  },
  googleApiRefreshToken: {
    type: String
  }
}, {
  timestamps: true
})

const User = mongoose.model("User", userSchema)
export default User