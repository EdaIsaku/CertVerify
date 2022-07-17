const express = require('express');
const router = express.Router();
const db = require('../db/db');

router.post('/deleteStudent', (req, res) => {
  const { email } = req.body;
  db.deleteStudent(email).then((result) => res.status(200).send(result));
});

module.exports = router;
