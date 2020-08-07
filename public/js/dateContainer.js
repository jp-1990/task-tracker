/* eslint-disable */
import { DOMStrings } from './domStrings';
import {
  populateTimeline,
  clearTimeline,
  tasks,
  modifiedTasks,
} from './taskContainer';
import { taskSummary, createTaskKey } from './taskSummary';

const now = new Date();

export const monthsArray = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

// if the month is stored in local, use that, otherwise default to current month
const selectedMonth = () => {
  if (DOMStrings.monthDiv) {
    if (!localStorage.month) {
      DOMStrings.monthDiv.innerHTML = monthsArray[now.getMonth()];
      window.localStorage.setItem('month', monthsArray[now.getMonth()]);
    } else {
      DOMStrings.monthDiv.innerHTML = window.localStorage.getItem('month');
    }
    return monthsArray.indexOf(window.localStorage.getItem('month'));
  }
};

// if the year is stored in local, use that, otherwise default to current month
const selectedYear = () => {
  if (DOMStrings.yearDiv) {
    if (!localStorage.year) {
      DOMStrings.yearDiv.innerHTML = now.getFullYear();
      window.localStorage.setItem('year', now.getFullYear());
    } else {
      DOMStrings.yearDiv.innerHTML = window.localStorage.getItem('year');
    }
    return window.localStorage.getItem('year') * 1;
  }
};

export const displaySelectedMonthYear = () => {
  return { month: selectedMonth(), year: selectedYear() };
};

export const prevMonthListener = () => {
  if (DOMStrings.monthYearContainer) {
    DOMStrings.prevMonth.addEventListener('click', (el) => {
      // remove all children from .log__task
      clearTimeline();

      // get current month
      let curMonth = monthsArray.indexOf(window.localStorage.getItem('month'));
      // if current month is january, display previous year
      if (curMonth === 0) {
        curMonth = 12;
        window.localStorage.setItem(
          'year',
          parseInt(window.localStorage.getItem('year')) - 1
        );
        DOMStrings.yearDiv.innerHTML = window.localStorage.getItem('year');
      }

      // display prev month
      DOMStrings.monthDiv.innerHTML = monthsArray[curMonth - 1];
      window.localStorage.setItem('month', monthsArray[curMonth - 1]);

      populateTimeline(modifiedTasks(tasks));
      if (document.querySelector('.task__summary__container')) {
        taskSummary(displaySelectedMonthYear, modifiedTasks(tasks));
      }
      if (document.querySelector('.task__key')) {
        createTaskKey(displaySelectedMonthYear, modifiedTasks(tasks));
      }
    });
  }
};

export const nextMonthListener = () => {
  if (DOMStrings.monthYearContainer) {
    DOMStrings.nextMonth.addEventListener('click', (el) => {
      // remove all children from .log__task
      clearTimeline();

      // get current month
      let curMonth = monthsArray.indexOf(window.localStorage.getItem('month'));
      // if current month is december, display next year
      if (curMonth === 11) {
        curMonth = -1;
        window.localStorage.setItem(
          'year',
          parseInt(window.localStorage.getItem('year')) + 1
        );
        DOMStrings.yearDiv.innerHTML = window.localStorage.getItem('year');
      }

      // display next month
      DOMStrings.monthDiv.innerHTML = monthsArray[curMonth + 1];
      window.localStorage.setItem('month', monthsArray[curMonth + 1]);

      populateTimeline(modifiedTasks(tasks));
      if (document.querySelector('.task__summary__container')) {
        taskSummary(displaySelectedMonthYear, modifiedTasks(tasks));
      }
      if (document.querySelector('.task__key')) {
        createTaskKey(displaySelectedMonthYear, modifiedTasks(tasks));
      }
    });
  }
};

export const prevYearListener = () => {
  if (DOMStrings.monthYearContainer) {
    DOMStrings.prevYear.addEventListener('click', (el) => {
      // remove all children from .log__task
      clearTimeline();
      window.localStorage.setItem(
        'year',
        parseInt(window.localStorage.getItem('year')) - 1
      );
      DOMStrings.yearDiv.innerHTML = window.localStorage.getItem('year');
      populateTimeline(modifiedTasks(tasks));
      if (document.querySelector('.task__summary__container')) {
        taskSummary(displaySelectedMonthYear, modifiedTasks(tasks));
      }
      if (document.querySelector('.task__key')) {
        createTaskKey(displaySelectedMonthYear, modifiedTasks(tasks));
      }
    });
  }
};

export const nextYearListener = () => {
  if (DOMStrings.monthYearContainer) {
    DOMStrings.nextYear.addEventListener('click', (el) => {
      // remove all children from .log__task
      clearTimeline();
      window.localStorage.setItem(
        'year',
        parseInt(window.localStorage.getItem('year')) + 1
      );
      DOMStrings.yearDiv.innerHTML = window.localStorage.getItem('year');
      populateTimeline(modifiedTasks(tasks));
      if (document.querySelector('.task__summary__container')) {
        taskSummary(displaySelectedMonthYear, modifiedTasks(tasks));
      }
      if (document.querySelector('.task__key')) {
        createTaskKey(displaySelectedMonthYear, modifiedTasks(tasks));
      }
    });
  }
};
