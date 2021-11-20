const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();
require('dotenv').config();
const port = process.env.PORT || process.env.PORT;
const { v4: uuid4 } = require('uuid');

const multer = require('multer');
const upload = multer();

const staticPath = path.join(__dirname, '/public');
app.use(express.static(staticPath));
app.use(express.json());

const { generatePdf, statistics } = require('./utils');
const db = require('./db/index');

const { generateExcel, excelToDb } = require('./public/exportToExcel/excel');
const email = require('./public/mail/mail');
const { infoLogger, errorLogger } = require('./public/logger/logger');

app.post('/addStudent', async (req, res) => {
  const student = req.body;
  const id = uuid4();
  const studentURL = `/me/${id}`;
  let success = await db.addStudent(student, id).catch((err) => {
    res.status(400).send({
      status: err.status,
      message: 'Student already registered',
    });
  });
  if (success === true) {
    generatePdf(student);
    email
      .sendEmail(
        student.course,
        student.email,
        student.first_name,
        student.last_name,
        id
      )
      .then((result) => infoLogger.log('info', `Email sent...${result}`))
      .catch((error) => errorLogger.log('error', error.message));
    email.sendErrors();
    res.status(200).send({ studentURL });
  }
});

app.post('/findStudent', async (req, res) => {
  const email = req.body.email;
  await db.findStudent(email).then((result) => {
    if (result === undefined) {
      res.status(400).send('Student is not registered yet!');
    } else {
      res.status(200).send(result);
    }
  });
});

app.get('/me/:id', async (req, res) => {
  const { id } = req.params;
  let filePath = path.join(__dirname, 'BLSD_Certificates', `${id}.pdf`);
  const file = fs.createReadStream(filePath);
  res.setHeader('Content-Type', 'application/pdf');
  return file.pipe(res);
});

app.post('/findAllStudents', (req, res) => {
  db.findAllStudents()
    .then((result) => res.status(200).send(result))
    .catch((err) => res.status(400).send(err));
});

app.post('/deleteStudent', (req, res) => {
  const { email } = req.body;
  db.deleteStudent(email).then((result) => res.status(200).send(result));
});

app.post('/statistics', async (req, res) => {
  const stats = await statistics();
  res.status(200).send(stats);
});

app.post('/exportExcel', async (req, res) => {
  let filePath = await generateExcel();
  res.status(200).sendFile(filePath);
});

app.post('/uploadExcelFile', upload.single('filename'), async (req, res) => {
  const { fileBuffer } = req.file.buffer;
  try {
    await excelToDb(fileBuffer);
  } catch (error) {
    console.log(error);
  }
  res.status(200).send('ok');
});

process.on('SIGINT', () => {
  db.closeDB();
});

db.init().then(() => {
  infoLogger.log('info', 'DB Created successfully!');
  app.listen(port, () => {
    infoLogger.log('info', `Server is listening at ${port}`);
  }); //Pse me duhet serveri nese sme aktivizohet DB
});
