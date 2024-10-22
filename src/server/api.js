const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// In-memory storage (replace with a database in production)
let users = [];
let attendance = [];

// Routes
app.get('/users', (req, res) => {
  res.json(users);
});

app.post('/users', (req, res) => {
  const newUser = req.body;
  users.push(newUser);
  res.status(201).json(newUser);
});

app.get('/attendance', (req, res) => {
  res.json(attendance);
});

app.post('/attendance', (req, res) => {
  const newRecord = req.body;
  attendance.push(newRecord);
  res.status(201).json(newRecord);
});

// Start server
app.listen(port, () => {
  console.log(`API server running on port ${port}`);
});