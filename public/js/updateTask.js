/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alert';
import { DOMStrings } from './domStrings';
import { displayColourPicker, changeColour } from './colourPicker';
import { validateInput } from './validateInput';

// FUNCTIONS //
// calculate the length of the task in hours and minutes
const taskDuration = (start, end) => {
  const milliseconds = end - start;
  const hours = Math.floor(milliseconds / 1000 / 60 / 60);
  const mins = (milliseconds / 1000 / 60) % 60;

  return mins > 0 ? `${hours} hours, ${mins} minutes` : `${hours} hours`;
};

// markup for task update div
const updateMarkup = (taskData) => {
  const start = new Date(taskData.start);
  const end = new Date(taskData.end);

  const markup = `
    <div class="log__click">
      <div class="log__click__titlebox" style="background-color: ${
        taskData.colour
      }; color:${taskData.luminance < 0.4 ? 'rgb(255,255,255)' : 'rgb(0,0,0)'}">
        <h3>Details</h3>
        <ion-icon name="close" style="color:${
          taskData.luminance < 0.4 ? 'rgb(255,255,255)' : 'rgb(0,0,0)'
        }"></ion-icon>
      </div>
      <div class="log__click__duration">
        <p>[Duration: ${taskDuration(start, end)}]</p>
      </div>
      <form class="update-form" autocomplete="off">
        <div class="form__group">
          <label class="form__label" for="title--update">Title</label> 
          <input type="text" id="title--update" placeholder="${
            taskData.title
          }"></input>
        </div>
        <div class="form__group">
          <label class="form__label" for="group--update">Group</label> 
          <input type="text" id="group--update" placeholder="${
            taskData.group
          }"></input>
        </div>
        <div class="form__group">
          <label class="form__label" for="description--update">Notes</label> 
          <input type="text" id="description--update" placeholder="${
            taskData.description
          }"></input>
        </div>
        <div class="form__group">
          <label class="form__label" for="start--updateDate">Start</label> 
          <input type="text" size="7" id="start--updateDate" placeholder="${
            start.toLocaleString().split(',')[0]
          }"></input>
          <input type="text" size="3" id="start--updateTime" placeholder="${start
            .toLocaleTimeString()
            .substring(0, 5)}"></input>
        </div>
        <div class="form__group">
          <label class="form__label" for="end--updateDate">End</label> 
          <input type="text" size="7" id="end--updateDate" placeholder="${
            end.toLocaleString().split(',')[0]
          }"></input>
          <input type="text" size="3" id="end--updateTime" placeholder="${end
            .toLocaleTimeString()
            .substring(0, 5)}"></input>
        </div>

        <div class="colour__picker">
          <p>Colour</p>
          <div class="colour selected" style="background-color: ${
            taskData.colour
          }"></div>
        </div>

        <div class="log__click__buttons">
          <div class="update__btn">
            <button class="btn btn--update" style="background-color: ${
              taskData.colour
            };color:${
    taskData.luminance < 0.4 ? 'rgb(255,255,255)' : 'rgb(0,0,0)'
  }">Update</button>
          </div>
          <div class="delete__btn">
            <button type="button" class="btn btn--delete">Delete</button>
          </div>
        </div>
        
      </form>        
    </div>`;
  return markup;
};

// get update data from the update form
const readUpdateValues = () => {
  const idSelector = (id) => {
    return document.getElementById(id);
  };

  const calcDateTime = (startOrEnd) => {
    const date =
      idSelector(`${startOrEnd}--updateDate`).value ||
      idSelector(`${startOrEnd}--updateDate`).placeholder;
    const time =
      idSelector(`${startOrEnd}--updateTime`).value ||
      idSelector(`${startOrEnd}--updateTime`).placeholder;
    return `${date.split('/')[2]}-${date.split('/')[1]}-${
      date.split('/')[0]
    } ${time}`;
  };

  return {
    title:
      idSelector('title--update').value ||
      idSelector('title--update').placeholder,
    group:
      idSelector('group--update').value ||
      idSelector('group--update').placeholder,
    description:
      idSelector('description--update').value ||
      idSelector('description--update').placeholder,
    start: calcDateTime('start'),
    end: calcDateTime('end'),
    color: document.querySelector('.selected').style.backgroundColor,
  };
};

// send update data to server
const updateTask = async (id, updateData) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: `/api/v1/tasks/${id}`,
      data: {
        title: updateData.title,
        description: updateData.description,
        start: updateData.start,
        end: updateData.end,
      },
    });
    if (res.data.status === 'success') {
      showAlert('Successfully updated task', 'success');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    showAlert(err.response.data.message, 'error');
  }
};

// identify which log was the clicked element and return it, else false
const logTarget = (target) => {
  let result;
  if (document.querySelector('.log')) {
    document.querySelectorAll('.log').forEach((el) => {
      if (
        el === target &&
        el.firstChild !== document.querySelector('.log__click')
      ) {
        result = el;
      }
    });
  }
  return result ? result : false;
};

// remove existing log__click box
const removeUpdateTaskBox = () => {
  if (document.querySelector('.log__click')) {
    document
      .querySelector('.log__click')
      .parentNode.removeChild(document.querySelector('.log__click'));
  }
};

// display update box based on the log
const displayUpdateTaskBox = (log) => {
  log.insertAdjacentHTML(
    'afterbegin',
    updateMarkup(JSON.parse(log.dataset.task))
  );
};

// if the update task form exists, add event listener and functions to update task
const updateTaskListeners = (id) => {
  if (document.querySelector('.update-form')) {
    // update task on form submit
    document.querySelector('.update-form').addEventListener('submit', (el) => {
      const updateData = readUpdateValues();
      el.preventDefault();
      const validatedInput = validateInput(updateData);

      if (Object.values(validatedInput).every(Boolean)) {
        updateTask(id, updateData);
        updateTaskColourAndGroup(
          updateData.title,
          updateData.group,
          updateData.color
        );
      } else {
        showAlert('Check date or time input', 'error');
      }
    });
  }
};

// EXPORTS //
// send updated color and group to server (updates color and group of all tasks with the same name)
export const updateTaskColourAndGroup = async (title, group, colour) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: `/api/v1/tasks/`,
      data: {
        title,
        group,
        colour,
      },
    });
    if (res.data.status === 'success') {
      showAlert('Successfully updated task colour', 'success');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    showAlert(err.response.data.message, 'error');
  }
};

// create and display update box, add listener for submit event on update form
export const updateTaskBox = () => {
  DOMStrings.container.addEventListener('click', (el) => {
    const log = logTarget(el.target);

    if (log) {
      removeUpdateTaskBox();
      displayUpdateTaskBox(log);
      displayColourPicker(document.querySelector('.selected'));
      changeColour('.selected');
      updateTaskListeners(JSON.parse(log.dataset.task)._id);
    }
  });
};

// // close update tasks box on clicking 'X'
export const closeUpdateTaskBox = () => {
  DOMStrings.container.addEventListener('click', (el) => {
    if (
      document.querySelector(
        '.log__click__titlebox > ion-icon[name="close"]'
      ) !== null &&
      document
        .querySelector('.log__click__titlebox > ion-icon[name="close"]')
        .contains(el.target)
    ) {
      removeUpdateTaskBox();
    }
  });
};
