const express = require('express');
const router = express.Router();
const db = require('../db/db');
const { v4: uuid4 } = require('uuid');
const { generatePdf } = require('../utils');
const email = require('../mail/mail');
const { logger } = require('../logger/logger');

router.post('/addStudent', async (req, res) => {
  const student = req.body;
  const id = uuid4();
  const studentURL = `me/${student.course}/${id}`;
  let success = await db.addStudent(student, id).catch((err) => {
    res.status(400).send({
      status: err.status,
      message: 'Student already registered!',
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
      .then((result) => {
        console.log('email sent');
        logger.info('info', `Email sent...${result}`);
      })
      .catch((error) => logger.error('error', error.message));
    email.sendErrors();
    res
      .status(200)
      .send({ message: 'Student successfully registered!', url: studentURL });
  }
});

module.exports = router;
