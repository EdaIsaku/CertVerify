const express = require('express');
const router = express.Router();
const db = require('../db/db');

router.post('/deleteAdmin', (req, res) => {
  const { username } = req.body;
  db.deleteAdmin(username).then((result) =>
    res.status(200).send({ message: 'Admin deleted' })
  );
});

module.exports = router;
