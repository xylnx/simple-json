// Express
const express = require('express');
const app = express();

// Middleware
app.use(express.json());

// Start server
const port = 3001;
app.listen(port, () => {
  console.log(`Simple JSON is running on port ${port}.`);
});

const testJson = { msg: 'bonjour, bruv' };

const getJson = (req, res) => {
  res.status(200).json(testJson);
};

const createJson = (req, res) => {
  const body = req.body;
  console.log(body);
  res.json({
    status: 'success',
    data: req.body,
  });
};

app //
  .route('/api/v1/json')
  .get(getJson)
  .post(createJson);
