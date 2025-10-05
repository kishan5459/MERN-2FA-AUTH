import bcrypt from "bcryptjs"
import User from "../models/user.js"
import speakeasy from "speakeasy"
import qrCode from "qrcode"
import jwt from "jsonwebtoken"

export const register = async (req, res) => {
  try {
    const { email, password, username } = req.body
    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      isMfaActive: false
    })
    console.log("New User : ", newUser)
    await newUser.save()

    res.status(201).json({
      message: "new user registered successfully"
    })
  } catch (error) {
    res.status(500).json({
      error: "error while registering user",
      message: error
    })
  }
}
export const login = async (req, res) => {
  console.log("The Authenticated user is : ", req.user)
  res.status(200).json({
    message: "User logged in successfully",
    email: req.user.email,
    username: req.user.username,
    isMfaActive: req.user.isMfaActive
  })
}

export const authStatus = async (req, res) => {
  if(req.user){
    res.status(200).json({
      message: "User logged in successfully",
      email: req.user.email,
      username: req.user.username,
      isMfaActive: req.user.isMfaActive
    })
  } 
  else {
    res.status(401).json({
      message: "Unauthorized user"
    })
  }
}

export const logout = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized user" })
  }
  req.logout((err) => {
    if (err) {
      return next(err)
    }
    req.session.destroy((err) => {
      if (err) {
        return next(err)
      }
      // clear the session cookie
      res.clearCookie("connect.sid", { path: "/" })
      return res.status(200).json({ message: "Logout successful" })
    })
  })
}


export const setup2FA = async (req, res) => { 
  try {
    console.log("The req.user is : ", req.user)
    const user = req.user

    const secret = speakeasy.generateSecret()
    console.log("The secret object is : ", secret)

    user.twoFactorSecret = secret.base32
    user.isMfaActive = true
    await user.save()

    const url = speakeasy.otpauthURL({
      secret: secret.base32,
      label: `${req.user.email}`,
      issuer: "www.kishandudhat.com",
      encoding: "base32"
    })
    const qrImageUrl = await qrCode.toDataURL(url);

    res.status(200).json({
      secret: secret.base32,
      qrCode: qrImageUrl
    })
  } catch (error) {
    res.status(500).json({
      error: "error while 2fa setup",
      message: error
    })
  }
}

export const verify2FA = async (req, res) => {
  const { token } = req.body
  const user = req.user

  const verified = speakeasy.totp.verify({
    secret: user.twoFactorSecret,
    encoding: 'base32',
    token
  })

  if(verified){
    const jwtToken = jwt.sign(
      { email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1hr" }
    )

    res.status(200).json({
      message: "2FA Successful",
      uselessJwtToken: jwtToken
    })
  }
  else {
    res.status(400).json({
      message: "Invalid 2FA Token"
    })
  }
}

export const reset2FA = async (req, res) => {
  try {
    const user = req.user
    user.twoFactorSecret = ""
    user.isMfaActive = false
    await user.save()
    res.status(200).json({
      message: "2FA reset successful"
    })
  } catch (error) {
    res.status(500).json({
      error: "Error while reseting 2FA",
      message: error
    })
  }
}

export const googleLoginSuccess = async (req, res) => {
  // Set a temporary cookie to mark Google login
  res.cookie('isGoogleLogin', 'true', {
    httpOnly: false,
    secure: true,      
    sameSite: 'none', 
    maxAge: 5 * 60 * 1000 
  });

  res.redirect(`${process.env.FRONTEND_BASEURL}/google-success?login=true`);
}
