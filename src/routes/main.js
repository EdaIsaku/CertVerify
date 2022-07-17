const express = require('express');
const router = express.Router();
router.use(express.json());
const path = require('path');

router.get('/main', (req, res) => {
  console.log(__dirname);
  res.status(200).sendFile(path.join(__dirname, '../../public/main.html'));
});

module.exports = router;
