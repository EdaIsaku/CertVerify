const express = require('express');
const app = express();
const path = require('path');
require('dotenv').config();
const port = process.env.PORT || process.env.PORT;

const staticPath = path.join(__dirname, '/public');
app.use(express.static(staticPath));
app.use(express.json());

// const { generatePdf } = require('./utils');
const {
  init,
  addStudent,
  findStudent,
  findAllStudents,
  deleteStudent,
  // closeDB,
} = require('./db/index');

// generatePdf();

app.post('/addStudent', (req, res) => {
  const { first_name, last_name, email, course, date, credit } = req.body;
  const newStudent = { first_name, last_name, email, course, date, credit };
  addStudent(newStudent)
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => res.status(400).send(err));
});

app.post('/findStudent', async (req, res) => {
  const { email } = req.body;
  const student = await findStudent(email);
  if (student) {
    res.status(200).send(student);
  } else {
    res.status(400).send('no user with that email');
  }
});

app.post('/findAllStudents', (req, res) => {
  findAllStudents()
    .then((result) => res.status(200).send(result))
    .catch((err) => res.status(400).send(err));
});

app.post('/deleteStudent', (req, res) => {
  const { email } = req.body;
  deleteStudent(email).then((result) => res.status(200).send(result));
});

// process.on('SIGINT', () => {
//   closeDB();
// });

init().then(() => {
  console.log('DB Created successfully!');
  app.listen(port, () => {
    console.log(`Server is listening at ${port}`);
  }); //Pse me duhet serveri nese sme aktivizohet DB
});
