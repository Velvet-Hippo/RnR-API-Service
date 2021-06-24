const express = require('express');

const app = express();
const port = process.env.port || 3000;

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`listening on ${port}`);
});
