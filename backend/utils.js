const dotenv = require('dotenv');
const { Pool } = require('pg');
dotenv.config();
console.log(process.env.PGURI);

const pool = new Pool({
  connectionString: process.env.PGURI,
});

module.exports = pool;
