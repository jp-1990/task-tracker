/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alert';
import { DOMStrings } from './domStrings';

// FUNCTIONS //
// send delete request to server based on id
const deleteTask = async (id) => {
  try {
    const res = await axios({
      method: 'DELETE',
      url: `/api/v1/tasks/${id}`,
    });
    if (res.status === 204) {
      showAlert('Successfully deleted task', 'success');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    showAlert(err.response.data.message, 'error');
  }
};

// EXPORTS //
// add listener for clicks on delete button
export const deleteButtonListener = () => {
  DOMStrings.container.addEventListener('click', (el) => {
    if (
      document.querySelector('.delete__btn') !== null &&
      document.querySelector('.delete__btn').contains(el.target)
    ) {
      const id = JSON.parse(
        document.querySelector('.log__click').parentNode.dataset.task
      )._id;
      deleteTask(id);
    }
  });
};
