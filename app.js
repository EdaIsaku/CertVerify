const express = require('express');
const app = express();
const path = require('path');
const port = process.env.PORT || 3000;

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
  closeDB,
} = require('./db/index');

// generatePdf();
init();

app.post('/addStudent', (req, res) => {
  const newStudent = req.body;
  addStudent(newStudent)
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => res.status(400).send(err));
});

app.post('/findStudent', (req, res) => {
  const student = req.body;
  findStudent(student)
    .then((result) => res.status(200).send(result))
    .catch((err) => res.status(400).send(err));
});

app.post('/findAllStudents', (req, res) => {
  findAllStudents()
    .then((result) => res.status(200).send(result))
    .catch((err) => res.status(400).send(err));
});

app.post('/deleteStudent', (req, res) => {
  const student = req.body;
  deleteStudent(student).then((result) => res.status(200).send(result));
});

process.on('SIGINT', () => {
  closeDB();
});

app.listen(port, () => {
  console.log(`Server is listening at ${port}`);
});
