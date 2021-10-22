const express = require('express');
const app = express();
const path = require('path');
const port = process.env.PORT || 3000;

const staticPath = path.join(__dirname, '/public');
app.use(express.static(staticPath));

const { generatePdf } = require('./utils');

generatePdf();

app.listen(port, () => {
  console.log(`Server is listening at ${port}`);
});
