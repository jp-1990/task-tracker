export const hideAlert = () => {
  const el = document.querySelector('.alert');
  if (el) {
    el.parentElement.removeChild(el);
  }
};

export const showAlert = (msg, action) => {
  hideAlert();
  const markup = `<div class="alert ${action}">${msg}</div>`;
  document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
  window.setTimeout(() => {
    document.querySelector('.alert').classList.add('fade');
  }, 2750);
  window.setTimeout(hideAlert, 3000);
};
