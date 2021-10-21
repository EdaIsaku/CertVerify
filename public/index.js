const getElement = (input) => {
  return document.querySelector(input);
};
const name = getElement('.name');
const lName = getElement('.lName');
const email = getElement('.email');
const submit = getElement('.submit');
const reset = getElement('.reset__button');
const courseName = getElement('.course__name__select');
const courseDate = getElement('.course__date__input');

//clear form
const clearForm = (formName) => {
  let form = getElement(formName);
  form.reset();
};

reset.addEventListener('click', (ev) => {
  ev.preventDefault();
  clearForm('.form');
  courseName.selectedIndex = 0;
  courseDate.value = '';
});

submit.addEventListener('click', (ev) => {
  // ev.preventDefault();
  // clearForm('.form');
});
