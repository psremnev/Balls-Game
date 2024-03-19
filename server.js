const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

app.use('/', express.static(path.join(__dirname, 'build')));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '/index.html'));
});

app.listen(port, () => {
  console.log(`Application work on ${'http://localhost:'}${port}`);
});
