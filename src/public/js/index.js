const getElement = (selector) => {
  return document.querySelector(selector);
};

//#region DOM elements
const signInForm = getElement('.signIn__form');
const username = getElement('.username');
const password = getElement('.password');
const logo = getElement('.logo');
const loader = getElement('.loader');
//#endregion

signInForm.addEventListener('submit', async (ev) => {
  ev.preventDefault();
  const user = { username: username.value, password: password.value };
  if (user.username !== '' && user.password !== '') {
    fetch('./findAdmin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.message) {
          return notifyError(res.message);
        }
        loader.style.visibility = 'visible';
        window.location.replace('http://127.0.0.1:3000/main');
        window.localStorage.setItem('user', res.username);
      });
  } else {
    notifyError('Please, fill in required fields');
  }
});

//redirect to QKUM homepage on logo click
logo.addEventListener('click', () => {
  window.open('http://www.urgjenca.gov.al/', '_blank');
});

const notifyError = (message) => {
  //eslint-disable-next-line
  Toastify({
    text: message,
    duration: 5000,
    close: true,
    gravity: 'top',
    position: 'right',
    style: {
      background: 'linear-gradient(to right, #ad0000, #dd1818)',
    },
  }).showToast();
};
