const express = require('express');
const bodyParser = require('body-parser');
const reviews = require('../models/reviews');
const photos = require('../models/photos');
const characteristics = require('../models/characteristics');

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
    req.body.name, req.body.email];
  function addValues(input) {
    const charInput = req.body.characteristics;
    let charValues = [];
    const charKeys = Object.keys(charInput);
    charKeys.forEach((key) => {
      charValues.push(`(${key}, ${input}, ${charInput[key]})`);
    });
    return charValues.join(',');
  }
  reviews.addReview(reviewInput, addValues, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.status(200).send(result);
    }
  });
});

app.get('/photos/:id', (req, res) => {
  photos.getPhotos([req.params.id], (err, result) => {
    if (err) {
      res.status(400).send(err);
    } else {
      res.status(200).send(result.rows);
    }
  });
});

app.get('/characteristics/:id', (req, res) => {
  characteristics.getChar([req.params.id], (err, result) => {
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
