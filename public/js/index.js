/* eslint-disable */
import '@babel/polyfill';
import { loginListener, logoutListener, signupListener } from './login';
import { createTaskListeners } from './createTask';
import {
  updateTaskBox,
  updateTaskColourAndGroup,
  closeUpdateTaskBox,
} from './updateTask';
import { populateTimeline, tasks, modifiedTasks } from './taskContainer';
import {
  displaySelectedMonthYear,
  prevMonthListener,
  nextMonthListener,
  prevYearListener,
  nextYearListener,
} from './dateContainer';
import { deleteButtonListener } from './deleteTask';
import {
  createSummaryListeners,
  taskSummary,
  createTaskKey,
} from './taskSummary';

// event listener to get back to timeline if a logged in user ends up on the login page
if (document.querySelector('.btn--timeline')) {
  document.querySelector('.btn--timeline').addEventListener('click', () => {
    window.location.assign('/');
  });
}

// logout listener
logoutListener();

// SIGNUP //
const signup = '/signup';
if (window.location.pathname === signup) {
  //add event listener and function to signup
  signupListener();
}

// LOGIN //
const login = '/login';
if (window.location.pathname === login) {
  // add event listener and function to login
  loginListener();
}

// HOME PAGE //
const home = '/';
if (window.location.pathname === home) {
  // use values from local storage or new Date();
  displaySelectedMonthYear();

  // listeners to select month and year
  prevMonthListener();
  nextMonthListener();
  prevYearListener();
  nextYearListener();

  // add listener for the 'create' button and form submit
  createTaskListeners(updateTaskColourAndGroup);

  // populate task timeline using the tasks array

  populateTimeline(modifiedTasks(tasks));

  // event listeners on click for update task box
  updateTaskBox();
  closeUpdateTaskBox();
  deleteButtonListener();

  // tasks summary
  createSummaryListeners(displaySelectedMonthYear, modifiedTasks(tasks));

  // display key
  createTaskKey(displaySelectedMonthYear, modifiedTasks(tasks));

  if (screen.width >= 1920) {
    document.querySelector('.task__summary').classList.remove('hide');
    taskSummary(displaySelectedMonthYear, modifiedTasks(tasks));
  }
}
