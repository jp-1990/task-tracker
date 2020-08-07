/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alert';
import { DOMStrings } from './domStrings';

const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/login',
      data: {
        email,
        password,
      },
    });
    if (res.data.status === 'success') {
      showAlert('Successfully logged in', 'success');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    showAlert(err.response.data.message, 'error');
  }
};

export const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: '/api/v1/users/logout',
    });
    if (res.data.status === 'success') {
      showAlert('Successfully logged out', 'success');
      window.setTimeout(() => {
        location.assign('/login');
      }, 1500);
    }
  } catch (err) {
    showAlert('Error logging out', 'error');
  }
};

const signup = async (userInput) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/signup',
      data: {
        name: userInput.name,
        email: userInput.email,
        password: userInput.password,
        passwordConfirm: userInput.passwordConfirm,
      },
    });
    if (res.data.status === 'success') {
      showAlert('Successfully signed up', 'success');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    showAlert(err.response.data.message, 'error');
  }
};

export const loginListener = () => {
  DOMStrings.loginButton.addEventListener('click', (el) => {
    el.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
};

export const logoutListener = () => {
  if (document.querySelector('.nav__el--logout')) {
    document
      .querySelector('.nav__el--logout')
      .addEventListener('click', logout);
  }
};

export const signupListener = () => {
  DOMStrings.signupForm.addEventListener('submit', (el) => {
    el.preventDefault();
    const userInput = {
      name: document.querySelector('.name').value,
      email: document.querySelector('.email').value,
      password: document.querySelector('.password').value,
      passwordConfirm: document.querySelector('.password--confirm').value,
    };
    signup(userInput);
  });
};
