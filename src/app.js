const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 3000;

const multer = require('multer');
const upload = multer();

const staticPath = path.join(__dirname, '/public');
app.use(express.static(staticPath));
app.use(express.json());

const rootRouter = require('./routes/index');
app.use(rootRouter);

const { statistics } = require('./utils');
const db = require('./db/db');

const { excelToDb } = require('./exportToExcel/excel');
const { logger } = require('./logger/logger');

const log = (req, res, next) => {
  console.log('test middleware');
  next();
};

app.get('/main', log, (req, res) => {
  res.status(200).sendFile(path.join(__dirname, './public/main.html'));
});

app.get('/me/:course/:id', async (req, res) => {
  const { id, course } = req.params;
  let filePath = path.join(
    __dirname,
    `/Certificates/${course}_Certificates/${id}.pdf`
  );
  const file = fs.createReadStream(filePath);
  res.setHeader('Content-Type', 'application/pdf');
  return file.pipe(res);
});

app.post('/statistics', async (req, res) => {
  const stats = await statistics();
  res.status(200).send(stats);
});

app.post('/uploadExcelFile', upload.single('filename'), async (req, res) => {
  const { fileBuffer } = req.file.buffer;
  try {
    await excelToDb(fileBuffer);
    res.status(200).send('ok');
  } catch (error) {
    logger.error(error);
    console.log(error);
  }
});

process.on('SIGINT', () => {
  db.closeDB();
});

db.init().then(() => {
  logger.info('DB Created successfully!');
  app.listen(port, () => {
    logger.info(`Server is listening at ${port}`);
  });
});

module.exports = {
  app,
};
