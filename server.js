const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect Neon database
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// GET all items
app.get("/warehouse", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM Items");
    res.json(result.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// SEARCH items
app.get("/warehouse/search", async (req, res) => {
  const name = req.query.name;
  try {
    const result = await pool.query(
      "SELECT * FROM Items WHERE Name ILIKE $1",
      [`%${name}%`]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.listen(3000, () => {
  console.log("API running on port 3000");
});
