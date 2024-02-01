const express = require('express');
const app = express();
const cors = require('cors');
const port = 3000;


// server.js
const express = require('express');
const app = express();
const port = 3000;

app.get('/ping', (req, res) => {
  res.send('Pong!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
