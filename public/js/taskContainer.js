/* eslint-disable */
import { DOMStrings } from './domStrings';
import { monthsArray } from './dateContainer';

// FUNCTIONS //
// create new div to contain the task
const createTaskDiv = (task, cssSelector, title) => {
  document.querySelectorAll(`.log__day`).forEach((el) => {
    const day = new Date(Date.parse(task.start)).getDate();

    if (el.innerHTML * 1 === day * 1) {
      el.parentNode.lastChild.insertAdjacentHTML(
        'beforeend',
        `<div class="log ${cssSelector}" data-task='${JSON.stringify(
          matchTask(task)
        )}'>${title}</div>`
      );
    }
  });
};

// match modified split tasks against the original to display correct details
const matchTask = (task) => {
  const target = task._id;
  let result = '';
  JSON.parse(DOMStrings.container.dataset.tasks).forEach((el) => {
    if (el._id === target) {
      result = el;
    }
  });
  return result;
};

// add style to task
const addStyle = (task, start, end, prevTask) => {
  console.log(task, start, end, prevTask);
  document.querySelectorAll(`.${task.cssSelector}`).forEach((el) => {
    // if prev task is specified adjust left margin to suit
    if (!el.style.cssText) {
      if (prevTask) {
        el.style.cssText = `color: ${
          task.luminance > 0.4 ? 'rgb(0,0,0)' : 'rgb(255,255,255)'
        }; background-color: ${task.colour}; width: ${
          end - start
        }%; margin-left: ${
          start - prevTask.percentageTimes.endPercentage
        }%;display: inline-block`;
      } else {
        // else left margin is the start percentage
        document.querySelectorAll(`.${task.cssSelector}`).forEach((el) => {
          if (!el.style.cssText)
            el.style.cssText = `color: ${
              task.luminance > 0.4 ? 'rgb(0,0,0)' : 'rgb(255,255,255)'
            }; background-color: ${task.colour}; width: ${
              end - start
            }%; margin-left: ${start}%; display: inline-block`;
        });
      }
    }
  });
};

// check if the provided month/year is the same as the month/year displayed in the DOM
const checkYearMonth = (taskYear, taskMonth) => {
  return DOMStrings.yearDiv.innerHTML * 1 === taskYear &&
    DOMStrings.monthDiv.innerHTML === monthsArray[taskMonth]
    ? true
    : false;
};

// create log structure for timeline
const createLogDivs = () => {
  // get days in selected month
  const daysInMonth = new Date(
    window.localStorage.getItem('year') * 1,
    monthsArray.indexOf(window.localStorage.getItem('month')) + 1,
    0
  ).getDate();
  // create log containers for each day in the selected month
  let n = 1;
  while (n <= daysInMonth) {
    const markup = `<div class="log__container"><div class="log__day">${n}</div><div class="log__task"></div></div>`;
    DOMStrings.taskBody.insertAdjacentHTML('beforeend', markup);
    n++;
  }
};

// EXPORTS //
// array of tasks from database
export const tasks = () => {
  return JSON.parse(DOMStrings.container.dataset.tasks);
};

// split tasks that span two days into two seperate tasks
export const modifiedTasks = (tasksArrayInput) => {
  const tasksArray = tasksArrayInput();
  for (let i = 0; i < tasksArray.length; i++) {
    const el = tasksArray[i];
    if (
      new Date(el.start).getDate() !== new Date(el.end).getDate() &&
      el.percentageTimes.endPercentage !== 100
    ) {
      // if the start date and end date are different make the first task display up to midnight
      const newTask = { ...el };
      newTask.percentageTimes = { ...el.percentageTimes };
      newTask.percentageTimes.endPercentage = 100;
      newTask.end = new Date(
        newTask.start.split('T')[0] + 'T24:00:00.000Z'
      ).toISOString();

      // add the new task to the tasks array
      tasksArray.splice(i, 0, newTask);

      // make the original task start at midnight
      el.start = new Date(
        el.end.split('T')[0] + 'T00:00:00.000Z'
      ).toISOString();
      el.percentageTimes.startPercentage = 0;
    }
  }

  return tasksArray;
};

// add tasks to DOM from tasks array
export const populateTimeline = (tasksArray) => {
  // create structure
  createLogDivs();

  tasksArray.forEach((el, index) => {
    // define variables
    const start = el.percentageTimes.startPercentage;
    const end = el.percentageTimes.endPercentage;
    const month = new Date(Date.parse(el.start)).getMonth();
    const year = new Date(Date.parse(el.start)).getFullYear();

    if (checkYearMonth(year, month)) {
      if (index > 0) {
        if (
          el.start.split('T')[0] === tasksArray[index - 1].start.split('T')[0]
        ) {
          // if the date is the same as previous task add tasks to same line
          createTaskDiv(el, el.cssSelector, el.title);
          addStyle(el, start, end, tasksArray[index - 1]);
        } else {
          // otherwise, add task as usual
          createTaskDiv(el, el.cssSelector, el.title);
          addStyle(el, start, end);
        }
      } else {
        createTaskDiv(el, el.cssSelector, el.title);
        addStyle(el, start, end);
      }
    }
  });
};

// clear the timeline
export const clearTimeline = () => {
  document.querySelectorAll('.log__container').forEach((el) => {
    el.parentNode.removeChild(el);
  });
};
