const express = require("express");
const router = express.Router();
const pool = require("../db");

// POST /register
router.post("/", async (req, res) => {
  try {
    const { name, email, college, team } = req.body;

    await pool.query(
      "INSERT INTO users (name, email, college, team) VALUES ($1, $2, $3, $4)",
      [name, email, college, team]
    );

    res.json({ message: "Registered Successfully ✅" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;