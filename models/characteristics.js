const pool = require('../database/index');

module.exports = {
  getChar(productId, callback) {
    const getAllQuery = 'select * from characteristics where product_id = $1';
    pool.query(getAllQuery, productId, (err, result) => {
      if (err) {
        callback(err, null);
      } else {
        callback(null, result);
      }
    });
  },

};
