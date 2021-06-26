const pool = require('../database/index');

module.exports = {
  getPhotos(productId, callback) {
    const getAllQuery = 'select * from photos where reviews_id = $1';
    pool.query(getAllQuery, productId, (err, result) => {
      if (err) {
        callback(err, null);
      } else {
        callback(null, result);
      }
    });
  },

};
