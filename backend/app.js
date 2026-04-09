const express = require("express");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors({
  origin: "http://localhost:5173"
}));

app.use(express.json());

// Test route (IMPORTANT — don’t skip this)
app.get("/", (req, res) => {
  res.send("API is working 🚀");
});

module.exports = app;