const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const morgan = require('morgan');
const helmet = require('helmet');

const AppError = require('./utils/appError');
const taskRouter = require('./routes/taskRoutes');
const userRouter = require('./routes/userRoutes');
const viewRouter = require('./routes/viewRoutes');
const globalErrorHandler = require('./controllers/errorController.js');

const app = express();

// VIEW OPTIONS // --------
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// GLOBAL MIDDLEWARE // --------
// location of static assets
app.use(express.static(path.join(__dirname, 'public')));

// helmet sets security headers
app.use(helmet());

// development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// body parser
app.use(express.json({ limit: '20kb' }));

// cookie parser
app.use(cookieParser());

// test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// ROUTES // --------
// used routes
app.use('/', viewRouter);
app.use('/api/v1/tasks', taskRouter);
app.use('/api/v1/users', userRouter);

// catching unhandled routes
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// error handler
app.use(globalErrorHandler);

// EXPORT APP // --------
module.exports = app;
