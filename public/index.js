const getElement = (selector, all) => {
  if (all) {
    return document.querySelectorAll(all);
  }
  return document.querySelector(selector);
};

const name = getElement('.name');
const lName = getElement('.lName');
const email = getElement('.email');
const submit = getElement('.submit');
const reset = getElement('.course__reset__input');
const courseName = getElement('.course__name__select');
const courseDate = getElement('.course__date__input');
const courseCredit = getElement('.course__credit__input');
const statisticsValue = getElement('.statistics__data__value');

const getValue = (selectedInput) => {
  return selectedInput.value;
};

//clear form
const clearForm = (formName) => {
  let form = getElement(formName);
  form.reset();
};

reset.addEventListener('click', () => {
  clearForm('.form');
  courseName.selectedIndex = 0;
  courseDate.value = '';
  courseCredit.value = '';
});

//TODO clearForm
submit.addEventListener('click', (ev) => {
  ev.preventDefault();
});
