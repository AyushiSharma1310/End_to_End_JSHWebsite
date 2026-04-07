const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "Hackathon2026-27",
  password: "JSHS2026",
  port: 5432,
});

module.exports = pool;