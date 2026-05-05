const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "hackathon2026_27",
  password: "JSHS2026",
  port: 5432,
});

module.exports = pool;