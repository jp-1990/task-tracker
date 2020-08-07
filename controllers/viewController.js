const Task = require('../models/taskModel');
const catchAsync = require('../utils/catchAsync');

exports.getTimeline = catchAsync(async (req, res, next) => {
  if (res.locals.user) {
    const tasks = await Task.find({ user: res.locals.user._id }).sort({
      start: 1,
    });

    res.status(200).render('timeline', {
      title: 'Timeline',
      data: {
        tasks,
      },
    });
  }
});

exports.getLogin = catchAsync(async (req, res, next) => {
  res.status(200).render('login', {
    title: 'Login',
  });
});

exports.getSignup = catchAsync(async (req, res, next) => {
  res.status(200).render('signup', {
    title: 'Sign up',
  });
});
