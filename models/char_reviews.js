/* eslint-disable max-len */
/* eslint-disable no-multi-str */
const pool = require('../database/index');

module.exports = {
  // getMeta: function getMeta(input, callback) {
  //   const metaQuery = 'SELECT\
  //       jsonb_object_agg(sumratings.rating, sumratings.count) AS ratings,\
  //       jsonb_object_agg(countrecommend.recommend, countrecommend.count) AS recommended,\
  //       jsonb_object_agg(charObj.name, json_build_object(charObj.id, charObj.value)) as characteristics\
  //       FROM\
  //       reviews, characteristics, char_reviews,\
  //       (SELECT reviews.rating, count(reviews.rating) AS count FROM reviews WHERE reviews.product_id=$1 GROUP BY reviews.rating) AS sumratings,\
  //       (SELECT reviews.recommend, count(reviews.recommend) FROM reviews WHERE reviews.product_id=$1 GROUP BY reviews.recommend) AS countrecommend,\
  //       (SELECT characteristics.id AS id, characteristics.name, AVG(char_reviews.value) AS value FROM characteristics, char_reviews, reviews WHERE characteristics.id=char_reviews.char_id AND characteristics.product_id=$1 GROUP BY characteristics.id) AS charObj\
  //       WHERE characteristics.product_id=$1\
  //       AND reviews.product_id=$1\
  //       AND reviews.id=char_reviews.reviews_id\
  //       AND characteristics.id=char_reviews.char_id\
  //       LIMIT 5';
  //   pool.query(metaQuery, [input], (err, result) => {
  //     if (err) {
  //       callback(err, null);
  //     } else {
  //       callback(null, result);
  //     }
  //   });
  // },

  getAsyncMeta: function getMeta(productId, callback) {
    const metaData = { product_id: productId };
    metaData.ratings = {};
    metaData.recommend = {};
    metaData.characteristics = {};

    pool.query('SELECT reviews.rating, count(reviews.rating) AS count FROM reviews WHERE reviews.product_id=$1 GROUP BY reviews.rating', [productId])
      .then((res) => {
        res.rows.forEach((r) => {
          metaData.ratings[r.rating] = Number(r.count);
        });
      })
      .catch((err) => {
        console.log(err.stack);
      });
    pool.query('SELECT reviews.recommend, count(reviews.recommend) FROM reviews WHERE reviews.product_id=$1 GROUP BY reviews.recommend', [productId])
      .then((res) => {
        res.rows.forEach((r) => {
          metaData.recommend[r.recommend] = r.count;
        });
      })
      .catch((err) => {
        console.log(err.stack);
      });
    pool.query(`select * from char_agg where product_id = ${productId}`)
      .then((res) => {
        res.rows.forEach((r) => {
          metaData.characteristics[r.name] = { id: r.id, value: Number(r.value) };
        });
        callback(null, metaData);
      })
      .catch((err) => {
        callback(err.stack, null);
      });
  },

};

// get characteristics --- SELECT chars.name, chars.id, AVG(rc.value) as value FROM characteristics AS chars
//      INNER JOIN char_reviews AS rc ON chars.id = rc.char_id WHERE chars.product_id = $1 GROUP BY chars.id;

//  SELECT
//         jsonb_object_agg(sumratings.rating, sumratings.count) AS ratings,
//         jsonb_object_agg(countrecommend.recommend, countrecommend.count) AS recommended,
//         jsonb_object_agg(charObj.name, json_build_object(charObj.id, charObj.value))
//         FROM
//         reviews, characteristics, char_reviews,
//         (SELECT reviews.rating, count(reviews.rating) AS count FROM reviews WHERE reviews.product_id=$1 GROUP BY reviews.rating) AS sumratings,
//         (SELECT reviews.recommend, count(reviews.recommend) FROM reviews WHERE reviews.product_id=$1 GROUP BY reviews.recommend) AS countrecommend,
//         (SELECT characteristics.id AS id, characteristics.name, AVG(char_reviews.value) AS value FROM characteristics, char_reviews, reviews WHERE characteristics.id=char_reviews.char_id AND characteristics.product_id=$1 GROUP BY characteristics.id) AS charObj
//         WHERE characteristics.product_id=$1
//         AND reviews.product_id=$1
//         AND reviews.id=char_reviews.reviews_id
//         AND characteristics.id=char_reviews.char_id
//         LIMIT 5
