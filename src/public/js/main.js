//pwa- registrate service worker

const registrateServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register(
        '../serviceWorker.js'
      );
      if (registration.installing) {
        console.log('Service worker installing');
      } else if (registration.waiting) {
        console.log('Service worker installed');
      } else if (registration.active) {
        console.log('Service worker active');
      }
    } catch (error) {
      console.log(error);
    }
  }
};

registrateServiceWorker();

const getElement = (selector) => {
  return document.querySelector(selector);
};

const getValue = (selectedInput) => {
  return selectedInput.value;
};

//#region DOM elements
const fName = getElement('.name');
const lName = getElement('.lName');
const studentEmail = getElement('.email');
const studentID = getElement('.studentID');
const form = getElement('.form');
const submit = getElement('.submit');
const reset = getElement('.course__reset__input');
const courseName = getElement('.course__name__select');
const courseDate = getElement('.course__date__input');
const courseCredit = getElement('.course__credit__input');
const newCourse = getElement('.new-course');
const inputCourse = getElement('.new-course__input');
const addCourse = getElement('.new-course__button');
const blsd = getElement('.blsd');
const bls_t = getElement('.bls_t');
const acls = getElement('.acls');
const th = getElement('.th');
const import__excel = getElement('.import__excel');
const loader = getElement('.loader');
const user__initials = getElement('.user__initials');
//#endregion

const courses = [blsd, bls_t, acls, th];

//#region show/hide signOut icon
user__initials.addEventListener('mouseleave', () => {
  user__initials.innerHTML = window.localStorage.getItem('user').slice(0, 1);
});

user__initials.addEventListener('mouseenter', () => {
  user__initials.innerHTML = '<i class="fas fa-sign-out-alt"></i>';
});
//#endregion

let isUserInStorage = window.localStorage.getItem('user');
if (!isUserInStorage) {
  loader.style.visibility = 'visible';
  window.location.replace('http://127.0.0.1:3000/');
}

// signout on click
user__initials.addEventListener('click', () => {
  loader.style.visibility = 'visible';
  window.localStorage.removeItem('user');
  window.location.replace('http://127.0.0.1:3000/');
});

// create new course
addCourse.addEventListener('click', () => {
  newCourse.style.display = 'none';
  const newOption = document.createElement('option');
  newOption.classList.add('course__name__option');
  newOption.text = inputCourse.value.toUpperCase();
  courseName.appendChild(newOption);
  courseName.selectedIndex = courseName.length - 1;
});

courseName.addEventListener('click', () => {
  if (courseName.options[courseName.selectedIndex].text === 'Other') {
    newCourse.style.display = 'inline';
    //eslint-disable-next-line
    Toastify({
      node: newCourse,
      duration: 10000,
      close: true,
      style: {
        background: 'linear-gradient(to right, #50c9c3, #96deda)',
      },
      onClick: function () {
        this.duration = 0;
      },
    }).showToast();
  }
});

const getStudentData = () => {
  const first_name = getValue(fName);
  const last_name = getValue(lName);
  const email = getValue(studentEmail);
  const student_id = getValue(studentID);
  const course = getValue(courseName);
  const course_date = getValue(courseDate);
  const course_credit = getValue(courseCredit);

  const newStudent = {
    student_id,
    first_name,
    last_name,
    email,
    course,
    course_date,
    course_credit,
  };
  return newStudent;
};

//clear form
const clearForm = (formName) => {
  let form = getElement(formName);
  form.reset();
};

//check if every input has a value
const formValidation = (student) => {
  const isInputFilled = (element) => element !== '';
  return Object.values(student).every(isInputFilled);
};

reset.addEventListener('click', () => {
  clearForm('.form');
  courseName.selectedIndex = 0;
  courseDate.value = '';
  courseCredit.value = '';
});

const notifySuccess = (message, destination) => {
  return (
    //eslint-disable-next-line
    Toastify({
      text: message,
      duration: 5000,
      destination,
      newWindow: true,
      close: true,
      gravity: 'top',
      position: 'left',
      stopOnFocus: true,
      style: {
        background: 'linear-gradient(to right, #085078, #85d8ce)',
      },
    }).showToast()
  );
};

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

form.addEventListener('submit', (ev) => {
  ev.preventDefault();
  const newStudent = getStudentData();
  if (formValidation(newStudent)) {
    const fullName = `${newStudent.first_name} ${newStudent.last_name}`;
    fetch('/addStudent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newStudent),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.message) {
          notifyError(res.message);
          return;
        }
        notifySuccess(
          `${fullName} is registered in ${getValue(
            courseName
          )} course. Download certificate or check email!`,
          res.studentURL
        );
        clearForm('.form');
      });
  } else {
    notifyError('Please fill all the required data!');
  }
});

//add number of registered students in frontend
const getStatistics = () => {
  fetch('/statistics', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((res) => res.json())
    .then((res) => {
      animate(blsd, 0, res.BLSDStudents, 1000);
      animate(bls_t, 0, res.BLS_TStudents, 1000);
      animate(acls, 0, res.ACLSStudents, 1000);
      animate(th, 0, res.THStudents, 1000);
    });
};

//download file
function downloadBlob(blob, name) {
  // Convert your blob into a Blob URL (a special url that points to an object in the browser's memory)
  const blobUrl = URL.createObjectURL(blob);
  // Create a link element
  const link = document.createElement('a');
  // Set link's href to point to the Blob URL
  link.href = blobUrl;
  link.download = name;
  // Append link to the body
  document.body.appendChild(link);
  // Dispatch click event on the link
  // This is necessary as link.click() does not work on the latest firefox
  link.dispatchEvent(
    new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window,
    })
  );
  // Remove link from body
  document.body.removeChild(link);
}

courses.forEach((el) =>
  el.addEventListener('click', (ev) => {
    ev.preventDefault();
    fetch('/exportExcel', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.blob())
      .then((res) => {
        downloadBlob(res, 'Students.xlsx');
      });
  })
);

//excel to DB
const uploadFile = (inputFile) => {
  let form = new FormData();
  form.append('filename', inputFile);
  fetch('/uploadExcelFile', {
    method: 'POST',
    body: form,
  }).then((res) => {
    console.log(res.json());
    return res.json();
  });
};

import__excel.addEventListener('change', (ev) => {
  submit.value = ev.target.files[0].name;
  console.log(ev.target.files[0]);
  uploadFile(ev.target.files[0]);
});

//get statistics and initial of user on page load
window.onload = () => {
  const userFromStorage = window.localStorage.getItem('user');
  user__initials.innerHTML = userFromStorage.slice(0, 1);
  getStatistics();
};

// //animate values of stats
function animate(obj, initVal, lastVal, duration) {
  let startTime = null;
  //pass the current timestamp to the step function
  const step = (currentTime) => {
    //if the start time is null, assign the current time to startTime
    if (!startTime) {
      startTime = currentTime;
    }
    //calculate the value to be used in calculating the number to be displayed
    const progress = Math.min((currentTime - startTime) / duration, 1);
    //calculate what to be displayed using the value gotten above
    obj.innerHTML = Math.floor(progress * (lastVal - initVal) + initVal);
    //checking to make sure the counter does not exceed the last value (lastVal)
    if (progress < 1) {
      window.requestAnimationFrame(step);
    } else {
      window.cancelAnimationFrame(window.requestAnimationFrame(step));
    }
  };
  //start animating
  window.requestAnimationFrame(step);
}
