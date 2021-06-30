const express = require('express');
const bodyParser = require('body-parser');
const db = require('../database/index');
const reviews = require('../models/reviews');
const { getAsyncMeta } = require('../models/char_reviews');
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
  const productId = req.body.product_id;
  reviews.addReview(reviewInput, charInput, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.status(200).send(result);
      db.query(`UPDATE char_agg SET value = calc.value
      FROM (SELECT
        char.id, AVG(rc.value) AS value
        FROM characteristics AS char
        INNER JOIN char_reviews AS rc
        ON char.id = rc.char_id
        WHERE product_id = ${productId}
        GROUP BY char.id) AS calc
      WHERE char_agg.id = calc.id;`);
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

app.get('/meta/:id', (req, res) => {
  const input = req.params.id;
  getAsyncMeta(input, (err, result) => {
    if (err) {
      res.status(400).send(err);
    } else {
      res.status(200).send(result);
    }
  });
});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`listening on port ${port}`);
});
