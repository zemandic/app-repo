const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello from your CI/CD Node.js App!');
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
