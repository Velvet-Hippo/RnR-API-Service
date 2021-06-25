const express = require('express');
const bodyParser = require('body-parser');
const reviews = require('../models/reviews');

const port = 3000;
const app = express();
app.use(bodyParser.json());

app.get('/reviews/:id', (req, res) => {
  reviews.getProductReviews([req.params.id], (err, result) => {
    if (err) {
      res.status(400).send(err);
    } else {
      res.status(200).send(result.rows);
    }
  });
});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`listening on port ${port}`);
});
