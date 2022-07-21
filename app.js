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

const getJson = async (req, res) => {
  const key = req.params['key'];
  const data = await redisGet(key);
  const json = JSON.parse(data);

  res.status(200).json({
    status: 'success',
    data: json,
  });
};

const setJson = (req, res) => {
  const key = req.params['key'];
  const body = req.body;
  console.log(key, ':', body);
  const value = JSON.stringify(body);
  // const key = Object.keys(body)[0];
  // const value = body[key];

  redisSet(key, value);

  res.json({
    status: 'success',
    data: req.body,
  });
};

app //
  .route('/api/v1/json/:key')
  .post(setJson)
  .get(getJson);
