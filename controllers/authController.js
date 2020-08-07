//const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');

const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/userModel');
//const sendEmail = require('../utils/email');

// sign json web token
const signJWT = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

// create, sign and send the token as a response
const createSendJWT = (user, code, res) => {
  const token = signJWT(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);
  user.password = undefined;

  res.status(code).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

// signup user
exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });
  createSendJWT(newUser, 201, res);
});

// login user
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400)); // check if email and password exist
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(
      new AppError('Please provide correct email and password!', 401)
    ); // check if user exists and password is correct
  }

  createSendJWT(user, 200, res);
});

// logout user
exports.logout = async (req, res) => {
  res.cookie('jwt', 'loggedOut', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    status: 'success',
  });
};

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  // check if jwt exists
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  // if not call next
  if (!token) {
    return next(new AppError('Please log in to gain access!', 401));
  }
  // verify token
  const verifiedToken = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET
  );
  // check if user exists
  const currentUser = await User.findById(verifiedToken.userId);
  if (!currentUser) {
    return next(
      new AppError('The user connected to this token does not exist!', 401)
    );
  }
  // check if token is still valid
  if (currentUser.passwordChangedAfter(verifiedToken.iat)) {
    return next(
      new AppError('Password recently changed! Please log in again!', 401)
    );
  }
  // grant access
  req.user = currentUser;
  next();
});

exports.isLoggedIn = async (req, res, next) => {
  try {
    // check if jwt exists
    if (req.cookies.jwt) {
      const token = req.cookies.jwt;

      // verify token
      const verifiedToken = await promisify(jwt.verify)(
        token,
        process.env.JWT_SECRET
      );

      // check if user exists
      const currentUser = await User.findById(verifiedToken.userId);
      if (!currentUser) {
        return next();
      }

      // check if token is still valid
      if (currentUser.passwordChangedAfter(verifiedToken.iat)) {
        return next();
      }
      // grant access
      res.locals.user = currentUser;
      return next();
    }
    next();
  } catch (err) {
    return next();
  }
};

exports.restrictAccess = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {});

exports.resetPassword = catchAsync(async (req, res, next) => {});

exports.updatePassword = catchAsync(async (req, res, next) => {});
