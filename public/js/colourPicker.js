// FUNCTIONS //
const colourPickerMarkup = () => {
  const defaultColours = [
    '#000000',
    '#808080',
    '#C0C0C0',
    '#FFFFFF',
    '#800000',
    '#FF0000',
    '#FFFF00',
    '#008000',
    '#00FF00',
    '#008080',
    '#00FFFF',
    '#000080',
    '#0000FF',
    '#4f4bdb',
    '#800080',
    '#FF00FF',
  ];
  const markup = [];

  // create div for colour options
  markup.push('<div class="colour__options">');

  // add markup for colours in the array
  defaultColours.forEach((el) => {
    markup.push(
      `<div class="colour options" style="background-color: ${el}"></div>`
    );
  });

  // close div for colour options
  markup.push('</div>');

  return markup.join('');
};

// EXPORTS //
export const displayColourPicker = (DOMel) => {
  if (DOMel) {
    // add colour picker markup
    DOMel.insertAdjacentHTML('afterbegin', colourPickerMarkup());

    // ensure it begins hidden
    DOMel.firstChild.classList.remove('hide');
    DOMel.firstChild.classList.add('hide');

    // toggle between show and hide on click
    DOMel.addEventListener('click', (el) => {
      DOMel.firstChild.classList.toggle('hide');
    });
  }
};

export const changeColour = (DOMel) => {
  document.querySelector(DOMel).addEventListener('click', (el) => {
    document.querySelector(DOMel).style.backgroundColor =
      el.target.style.backgroundColor;
  });
};
