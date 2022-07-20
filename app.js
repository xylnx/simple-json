// Express
const express = require('express');
const app = express();

// Redis
const { redisSet, redisGet } = require('./useRedis');

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

const setJson = (req, res) => {
  const body = req.body;
  const key = Object.keys(body)[0];
  const value = body[key];
  redisSet(key, value);
  console.log(body);
  console.log({ key }, { value });
  res.json({
    status: 'success',
    data: req.body,
  });
};

app //
  .route('/api/v1/json')
  .get(getJson)
  .post(setJson);
