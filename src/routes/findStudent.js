const express = require('express');
const router = express.Router();
const db = require('../db/db');

router.post('/findStudent', async (req, res) => {
  const email = req.body.email;
  await db.findStudent(email).then((result) => {
    if (result === undefined) {
      res.status(400).send('Student is not registered yet!');
    } else {
      res.status(200).send(result);
    }
  });
});

module.exports = router;
