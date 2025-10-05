import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local"
import { Strategy as GoogleStrategy } from "passport-google-oauth20"
import bcrypt from "bcryptjs"
import User from "../models/user.js";

// done(error, user, options)

// hover on LocalStrategy
passport.use(new LocalStrategy(
  { usernameField: 'email' },
  async (email, password, done) => {
    try {
      const user = await User.findOne({ email })
      console.log("from local : ", user)
      if(!user) return done(null, false, { message: "User not found" })

      const isMatch = await bcrypt.compare(password, user.password)
      console.log(user, isMatch)
      if(isMatch) return done(null, user)
      else return done(null, false, { message: "Incorrect Password" })
    } catch (error) {
      return done(error)
    }
  }
))

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `${process.env.BACKEND_BASE_URL}/api/auth/google/callback` // it is same as Google callback URL route (2nd route)
},
async (accessToken, refreshToken, profile, done) => {
  console.log("Profile : ", profile)
  try {
    // Find or create user in your DB based on Google profile id
    let user = await User.findOne({ email: profile._json.email });

    if (!user) {
      const lastSixDigitsID = profile.id.substring(profile.id.length - 6)
      const lastTwoDigitsName = profile._json.name.substring(profile._json.name.length - 2)
      const defaultHashedPassword = await bcrypt.hash(`${lastTwoDigitsName}${lastSixDigitsID}`, 10)
      user = new User({
        username: profile._json.name,
        email: profile._json.email,
        password: defaultHashedPassword,
        isMfaActive: false,
        googleApiAccessToken: accessToken,
        googleApiRefreshToken: refreshToken
      });
      await user.save();
    }
    done(null, user);
  } catch (err) {
    console.log("google : ", err)
    done(err);
  }
}
));

// in serializeUser function value passed done is used to give value of connect.sid cookie
// docs : Registers a function used to serialize user objects into the session. (hover on serilizeUser)
passport.serializeUser((user, done) => {
  console.log("We are inside serializeUser function")
  done(null, user._id)
})

// in below function we get cookie value and set user in req object
// docs : Registers a function used to deserialize user objects out of the session. (hover on deserilizeUser)
passport.deserializeUser(async (_id, done) => {
  console.log("We are inside deserializeUser function")
  try {
    const user = await User.findById(_id)
    done(null, user)
  } catch (error) {
    done(error)
  }
})
