/* eslint-disable */

// check input is a valid date
const validateDate = (date) => {
  const dateRegex = /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/;
  return dateRegex.test(date);
};

// check start and end are not spanning more than 2 days
const validateDateSpan = (startDate, endDate) => {
  const start = Date.parse(new Date(startDate.split(' ')[0]));
  const end = Date.parse(new Date(endDate.split(' ')[0]));

  return (end - start) / 1000 / 60 / 60 <= 24;
};

//check start is less than end date
const startLessThanEnd = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  return Date.parse(start) < Date.parse(end);
};

// check input is a valid time
const validateTime = (time) => {
  const timeVal = /^(2[0-3]|[01]?[0-9]):([0-5]?[0-9])$/;
  return timeVal.test(time);
};

// time and date validator returns obj with booleans for each value
export const validateInput = (inputObj) => {
  return {
    startDate: validateDate(inputObj.start.split(' ')[0]),
    startTime: validateTime(inputObj.start.split(' ')[1]),
    endDate: validateDate(inputObj.end.split(' ')[0]),
    endTime: validateTime(inputObj.end.split(' ')[1]),
    startLessThanEnd: startLessThanEnd(inputObj.start, inputObj.end),
    validateDateSpan: validateDateSpan(inputObj.start, inputObj.end),
  };
};
