const express = require('express');
const app = express();
const port = 4000;

app.get('/ping', (req, res) => {
  res.send('<h1>Pong!</h1>');
});

app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
});
