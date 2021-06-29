const pool = require('../database/index');

module.exports = {
  addHelpful: function addHelpful(input, callback) {
    const helpfulQuery = 'UPDATE reviews SET helpfulness = helpfulness + 1 WHERE id = $1;';
    pool.query(helpfulQuery, [input], (err, result) => {
      if (err) {
        callback(err, null);
      } else {
        callback(null, result);
      }
    });
  },

  reportReview: function reportReview(input, callback) {
    const reportQuery = 'UPDATE reviews SET reported = true WHERE id = $1';
    pool.query(reportQuery, [input], (err, result) => {
      if (err) {
        callback(err, null);
      } else {
        callback(null, result);
      }
    });
  },
};
