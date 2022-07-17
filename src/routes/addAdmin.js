const express = require('express');
const router = express.Router();
router.use(express.json());
const db = require('../db/db');
const { hashPassword } = require('../utils');

router.post('/addAdmin', async (req, res) => {
  const { username, password } = req.body;
  let existingUser = await db.findAdmin(username).then((res) => {
    return res;
  });
  if (existingUser === undefined) {
    let user = {};
    user['username'] = username;
    hashPassword(password, (hash) => {
      user['password'] = hash;
      db.addAdmin(user);
    });
    res
      .status(200)
      .send({ message: `${user.username} can now register students!` });
  } else {
    res.status(400).send({ message: 'Already registered as an admin!' });
  }
});

module.exports = router;
