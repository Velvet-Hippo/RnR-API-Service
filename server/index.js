const express = require('express');
const bodyParser = require('body-parser');
const reviews = require('../models/reviews');
const { addHelpful, reportReview } = require('../models/helpful-report');

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

app.post('/reviews', (req, res) => {
  const reviewInput = [req.body.product_id, req.body.rating,
    new Date(), req.body.summary, req.body.body, req.body.recommend,
    req.body.name, req.body.email, req.body.photos.toString()];
  const charInput = req.body.characteristics;
  reviews.addReview(reviewInput, charInput, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.status(200).send(result);
    }
  });
});

app.put('/reviews/:id/helpful', (req, res) => {
  const input = req.params.id;
  addHelpful(input, (err, result) => {
    if (err) {
      res.status(400).send(err);
    } else {
      res.status(200).send(result.rows);
    }
  });
});

app.put('/reviews/:id/report', (req, res) => {
  const input = req.params.id;
  reportReview(input, (err, result) => {
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
