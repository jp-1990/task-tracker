const Task = require('../models/taskModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// RESPONSE // --------
const response = (res, code, data) => {
  return res.status(code).json({
    status: 'success',
    data,
  });
};

// get all tasks
exports.getAllTasks = catchAsync(async (req, res, next) => {
  const task = await Task.find({ user: { _id: req.user._id } }).sort({
    start: 1,
  });

  response(res, 200, task);
});

// create task
exports.createTask = catchAsync(async (req, res, next) => {
  if (!req.body.user) req.body.user = req.user.id;
  const task = await Task.create(req.body);

  response(res, 201, task);
});

// get task by id
exports.getTask = catchAsync(async (req, res, next) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    return next(new AppError('No document found with that ID', 404));
  }

  response(res, 200, task);
});

// update task by id
exports.updateTask = catchAsync(async (req, res, next) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: false,
  });

  if (!task) {
    return next(new AppError('No document found with that ID', 404));
  }

  response(res, 200, task);
});

// update colour by title
exports.updateColourAndGroup = catchAsync(async (req, res, next) => {
  const data = await Task.updateMany(
    { title: req.body.title },
    { colour: req.body.colour, group: req.body.group },
    {
      new: true,
      runValidators: false,
    }
  );

  if (!data) {
    return next(new AppError('No document found with that ID', 404));
  }

  response(res, 200, data);
});

// delete task by id
exports.deleteTask = catchAsync(async (req, res, next) => {
  const task = await Task.findByIdAndDelete(req.params.id);

  if (!task) {
    return next(new AppError('No document found with that ID', 404));
  }

  response(res, 204, null);
});
