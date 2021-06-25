const pool = require('../database/index');

module.exports = {
  getProductReviews(productId, callback) {
    const getAllQuery = 'select * from reviews where product_id = $1 AND reported = false ORDER BY helpfulness DESC';
    pool.query(getAllQuery, productId, (err, result) => {
      if (err) {
        callback(err, null);
      } else {
        callback(null, result);
      }
    });
  },

};
