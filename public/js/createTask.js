/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alert';
import { DOMStrings } from './domStrings';
import { displayColourPicker, changeColour } from './colourPicker';
import { validateInput } from './validateInput';

// FUNCTIONS //
// add listener for the 'create' button
const createButtonListener = () => {
  // ensure create form begins hidden
  DOMStrings.createForm.classList.remove('hide');
  DOMStrings.createForm.classList.add('hide');

  // toggle between show and hide on click
  DOMStrings.createButton.addEventListener('click', () => {
    DOMStrings.createForm.classList.toggle('hide');
    displayColourPicker(document.querySelector('.colour-value'));
    changeColour('.colour-value');
  });
};

const hideCreateForm = () => {
  document
    .querySelector('.create__form__titlebox > ion-icon[name="close"]')
    .addEventListener('click', () => {
      DOMStrings.createForm.classList.toggle('hide');
    });
};

// 'create form' input object
const createInput = () => {
  return {
    title: document.getElementById('title').value,
    group: document.getElementById('group').value,
    description: document.getElementById('description').value,
    start: `${document.getElementById('start-date').value} ${
      document.getElementById('start-time').value
    }`,
    end: `${document.getElementById('end-date').value} ${
      document.getElementById('end-time').value
    }`,
    colour:
      document.querySelector('.colour-value').style.backgroundColor ||
      '#1fbbfd',
  };
};

// create a new task in the database
const createTask = async (input) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/tasks',
      data: {
        title: input.title,
        group: input.group,
        description: input.description,
        start: input.start,
        end: input.end,
        colour: input.colour,
      },
    });
    if (res.data.status === 'success') {
      showAlert('Successfully created task', 'success');
      window.setTimeout(() => {
        location.assign('/');
      }, 500);
    }
  } catch (err) {
    showAlert(err.response.data.message, 'error');
  }
};

// if the create task form exists, add event listener and function to create task
const createFormListener = (updateTaskColour) => {
  document.querySelector('.create-form').addEventListener('submit', (el) => {
    el.preventDefault();
    const input = createInput();
    const validatedInput = validateInput(input);
    if (Object.values(validatedInput).every(Boolean)) {
      createTask(input);
      updateTaskColour(input.title, input.group, input.colour);
    } else {
      showAlert('Check date or time input', 'error');
    }
  });
};

// EXPORTS //
// create listeners for create button and create form
export const createTaskListeners = (updateTaskColour) => {
  createButtonListener();
  createFormListener(updateTaskColour);
  hideCreateForm();
};
