/* eslint-disable max-len */
/* eslint-disable no-multi-str */
const pool = require('../database/index');

module.exports = {

  getAsyncMeta: function getMeta(productId, callback) {
    const metaData = { product_id: productId };
    metaData.ratings = {};
    metaData.recommend = {};
    metaData.characteristics = {};

    pool.query(`
    SELECT JSONB_OBJECT_AGG(countRating.rating, countRating.value) AS ratings,
    JSONB_OBJECT_AGG(countRecommend.recommend, countRecommend.value) AS recommendations,
    JSONB_OBJECT_AGG(metaData.name, JSON_BUILD_OBJECT('id', metaData.id, 'value', metaData.value)) AS characteristics FROM
    (SELECT rating, COUNT(rating) as value FROM reviews WHERE product_id = ${productId} GROUP BY rating) AS countRating,
    (SELECT recommend, COUNT(recommend) as value FROM reviews WHERE product_id = ${productId} GROUP BY recommend) AS countRecommend,
    (SELECT name, id, value FROM char_agg WHERE product_id = ${productId}) AS metaData;`)
      .then((res) => {
        const result = {
          product_id: productId,
          page: 1,
          count: 5,
          ratings: res.rows[0].ratings,
          recommendations: res.rows[0].recommendations,
          characteristics: res.rows[0].characteristics,
        };
        callback(null, result);
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
