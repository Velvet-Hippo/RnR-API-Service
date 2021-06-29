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

  addReview(reviewInput, charInput, callback) {
    // eslint-disable-next-line no-multi-str
    (async () => {
      function addValues(input) {
        const charKeys = Object.keys(charInput);
        return charKeys.map((key) => `(${key}, ${input}, ${charInput[key]})`);
      }
      // note: we don't try/catch this because if connecting throws an exception
      // we don't need to dispose of the client (it will be undefined)
      const client = await pool.connect();
      try {
        await client.query('BEGIN');
        const queryText = 'INSERT INTO reviews (product_id, rating, date, summary, body, recommend, reviewer_name, reviewer_email, photos) values ($1, $2, $3, $4, $5, $6, $7, $8, ARRAY[$9]) RETURNING id';
        const res = await client.query(queryText, reviewInput);
        const values = addValues(res.rows[0].id);
        const insertCharQuery = `INSERT INTO char_reviews (char_id, reviews_id, value) VALUES ${values.join(',')}`;
        await client.query(insertCharQuery);
        await client.query('COMMIT');
      } catch (e) {
        await client.query('ROLLBACK');
        callback(e, null);
      } finally {
        callback(null, 'successful insert');
        client.release();
      }
    })().catch((e) => console.error(e.stack));
  },
};
