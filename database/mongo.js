const mongoose = require('mongoose');

const reviews = new mongoose.Schema({
  review_data: {
    review_id: Number,
    rating: Number,
    summary: String,
    recommend: Boolean,
    body: String,
    reviewer_name: String,
    helpfulness: Number,
    date: Date,
    response: String,
    product_id: {
      id: Number,
      recommended: Number,
      rating: Number,
    },

    photos: [
      {
        url: String,
      },
    ],
  },
  char_data: {
    char_id: {
      value: Number,
      name: String,
    },
  },

});
