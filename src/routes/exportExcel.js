const express = require('express');
const router = express.Router();
const { generateExcel } = require('../exportToExcel/excel');

router.post('/exportExcel', async (req, res) => {
  let filePath = await generateExcel();
  res.status(200).sendFile(filePath);
});

module.exports = router;
