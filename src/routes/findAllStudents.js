const express = require('express');
const router = express.Router();
const db = require('../db/db');

router.post('/findAllStudents', (req, res) => {
  db.findAllStudents()
    .then((result) => res.status(200).send(result))
    .catch((err) => res.status(400).send(err));
});

module.exports = router;
