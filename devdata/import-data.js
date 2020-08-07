const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const XLSX = require('xlsx');
const Task = require('../models/taskModel');

dotenv.config({ path: './config.env' });

// Create database path variable and replace password tag with password
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

// Use mongoose to connect to the database
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to database...');
  });

// OBJECTIVE:
/*
{
  title: string
  description: string
  start: date/time
  end: date/time
}

title = cell value
description = Learning ${cell value}
start = first instance of value in block of values on row (row date + column time)
end = as above but for end, +1 column

START and END:
exclude column A
create an array containing letters in cell address for all time columns
as an array, first start value will always be i[1]
find index of i[1] in times, iterate through until index does not match to get END
if not at end of array, find index of next value and do the same
repeat to get start and end of all tasks on the row
add date
repeat for all rows

*/

//Read excel file
const learningLog = XLSX.readFile(
  'C:/Users/James/Desktop/Learning log - Copy.xlsm'
);
const sheet = learningLog.Sheets[learningLog.SheetNames[0]];

const times = [];
let dates = [];
const rows = [];

// create arrays of times, dates and row data
Object.keys(sheet).forEach((el) => {
  if (sheet[el].v) {
    // create array of 'times' from row 1
    if (/\$?[A-Z]+\$?1$/.test(el)) times.push({ cell: el, time: sheet[el].w });

    // create array of 'dates' from col 1
    if (/\$?^A\$?\d+/.test(el)) dates.push({ cell: el, date: sheet[el].w });

    // create array of data from each row
    if (rows[el.match(/\$?\d+/)[0]]) {
      const row = el.match(/\$?\d+/)[0];
      rows[row - 1].push({ cell: el, value: sheet[el].w });
    } else {
      rows.push([]);
      const row = el.match(/\$?\d+/)[0];
      rows[row - 1].push({ cell: el, value: sheet[el].w });
    }
  }
});

// remove empty array from end and times from start
rows.splice(0, 1);
rows.pop();

// convert dates to yyyy/mm/dd and remove 'date' string
dates.splice(0, 1);
dates = dates.map((el) => {
  return `${el.date.split('/')[2]}20/${el.date.split('/')[0]}/${
    el.date.split('/')[1]
  }`;
});

const tasks = [];
let taskCounter = 0;
// get tasks from rows
rows.forEach((el) => {
  const date = `${el[0].value.split('/')[2]}20/${el[0].value.split('/')[0]}/${
    el[0].value.split('/')[1]
  }`;

  el.forEach((e) => {
    e.timeIndex = times.findIndex((obj) => {
      return obj.cell.match(/\$?[A-Z]+/)[0] === e.cell.match(/\$?[A-Z]+/)[0];
    });
  });

  // populate tasks
  el.forEach((e, i) => {
    if (i > 0 && e.timeIndex !== el[i - 1].timeIndex + 1) {
      tasks.push({});
      tasks[taskCounter].title = e.value;
      tasks[taskCounter].description = '';
      tasks[taskCounter].user = {
        _id: '5f25a17b81fad94430820f38',
        name: 'James',
      };
      tasks[taskCounter].start = `${date} ${times[e.timeIndex].time}`;
    }
    if (i === el.length - 1 && e.timeIndex !== 0) {
      tasks[taskCounter].end = `${date} ${times[e.timeIndex + 1].time}`;
      taskCounter += 1;
    } else if (
      i < el.length - 1 &&
      e.timeIndex !== el[i + 1].timeIndex - 1 &&
      e.timeIndex !== 0
    ) {
      tasks[taskCounter].end = `${date} ${times[e.timeIndex + 1].time}`;
      taskCounter += 1;
    }
  });
});

//Import data to DB
const importData = async () => {
  try {
    //console.log(tasks);
    await Task.create(tasks); //if an array is passed in it creates a new entry for each element in the array
    console.log('Success');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

//Delete existing data
const deleteData = async () => {
  try {
    await Task.deleteMany();
    console.log('Success');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  //deleteData();
}
