const pool = require('../database/index');

module.exports = {
  getProductReviews(productId, callback) {
    const getAllQuery = 'select * from reviews where product_id = $1 AND reported = false ORDER BY helpfulness DESC, date DESC';
    pool.query(getAllQuery, productId, (err, result) => {
      if (err) {
        callback(err, null);
      } else {
        callback(null, result);
      }
    });
  },

  addReview(reviewInput, addValues, callback) {
    // eslint-disable-next-line no-multi-str
    (async () => {
      // note: we don't try/catch this because if connecting throws an exception
      // we don't need to dispose of the client (it will be undefined)
      const client = await pool.connect();
      try {
        await client.query('BEGIN');
        const queryText = 'INSERT INTO reviews (product_id, rating, date, summary, body, recommend, reviewer_name, reviewer_email) values ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id';
        const res = await client.query(queryText, reviewInput);
        // console.log(charValues);
        const values = addValues(res.rows[0].id);
        const insertCharQuery = `INSERT INTO char_reviews (char_id, reviews_id, value) VALUES ${values}`;
        // let insertCharValues = [parseInt(current), res.rows[0].id, charInput[current]];
        await client.query(insertCharQuery);
        await client.query('COMMIT');
      } catch (e) {
        await client.query('ROLLBACK');
        callback(e, null);
      } finally {
        callback(null);
        client.release();
      }
    })().catch((e) => console.error(e.stack));
  },

};

// {
//   "product_id": 18078,
//   "rating": 5,
//   "summary": "Pretty neat product",
//   "name": "Billy Joe Bob",
//   "body": "Puppies really are the best! Kitties are wonderful too though! Honestly, just animals in general rock!",
//   "recommend": true,
//   "email": "test@gmail.com"
// }
