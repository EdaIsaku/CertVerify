const express = require('express');
const router = express.Router();
router.use(express.json());

const db = require('../db/db');
const { comparePassword } = require('../utils');

router.post('/findAdmin', async (req, res) => {
  const { username, password } = req.body;
  console.log(username, password);
  const user = await db.findAdmin(username);
  console.log(user);
  if (user) {
    if (await comparePassword(password, user.password)) {
      res.status(200).send(user);
    } else {
      res.status(400).send({ message: 'Incorrect password' });
    }
  } else {
    res.status(400).send({ message: `No admin with ${username} username` });
  }
});

module.exports = router;
