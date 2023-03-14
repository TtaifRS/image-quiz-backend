const passport = require("passport")
const GoogleStrategy = require("passport-google-oauth20").Strategy
const User = require('../models/user')
const catchAsyncError = require('../middlewares/catchAsyncError')
const ErrorHandler = require('../utils/errorHandler')
const sendToken = require('../utils/sendToken')


exports.signUp = catchAsyncError(async (req, res, next) => {
  const { name, email, password } = req.body

  const user = await User.create({
    name,
    email,
    password
  })

  sendToken(user, 200, res)
})

exports.login = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body

  if (!email || !password) {
    return next(new ErrorHandler('Please enter Email and Password'), 400)
  }

  const user = await User.findOne({ email }).select('+password')

  if (!user) {
    return next(new ErrorHandler('Invalid email or password', 401))
  }

  const isPasswordMatched = await user.comparePassword(password)

  if (!isPasswordMatched) {
    return next(new ErrorHandler('Invalid email or password', 401))
  }

  sendToken(user, 200, res)

})


exports.signUpWithGoogle = catchAsyncError(async (req, res, next) => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: '/api/auth/google/callback'
      }
    )
  )

  async (accessToken, refreshToken, profile, done) => {
    try {
      const user = await User.findOne({ email: profile.emails[0].value })

      if (user) {
        return done(null, user)
      }

      const newUser = new User({
        name: profile.displayName,
        email: profile.emails[0].value,
      });

      await newUser.save();

      done(null, newUser);
    } catch (error) {
      done(error, false, error.message);
    }

  }
})