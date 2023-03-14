const jwt = require('jsonwebtoken')

const User = require('../models/user.js')
const catchAsyncError = require('./catchAsyncError.js')
const ErrorHandler = require('../utils/errorHandler.js')

exports.isAuthenticated = catchAsyncError(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]
  }

  if (!token) {
    return next(new ErrorHandler('Please login to access', 401))
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)


  req.user = await User.findById(decoded.id)

  next()
})