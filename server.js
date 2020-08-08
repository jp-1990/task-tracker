const mongoose = require('mongoose');
const dotenv = require('dotenv');

// shutdown on uncaught exception
process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  console.log(err);
  console.log('Uncaught exception! Shutting down...');
  process.exit(1);
});

// env variable config file
dotenv.config({ path: './config.env' });

// require app after config file
const app = require('./app');

// DATABASE CONNECTION // --------
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
console.log(DB);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('connected to database...');
  });

// SERVER // --------
const port = 3000;
const server = app.listen(port, () => {
  console.log(`app running on port ${port}...`);
});

// shutdown on unhandled rejection
process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log(err);
  console.log('Unhandled rejection! Shutting down...');
  server.close(() => {
    process.exit(1);
  });
});
