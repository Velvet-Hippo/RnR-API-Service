const { Pool } = require('pg');
const config = require('./config');

const pool = new Pool(config);
// pool.query('SELECT NOW()', (err, res) => {
//   console.log(err, res);
//   pool.end();
// });

pool.connect(() => {
  // eslint-disable-next-line no-console
  console.log('connected to postgreSQL');
});

module.exports = pool;
