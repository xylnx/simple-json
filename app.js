// Express
const express = require('express');
const app = express();

// Cors
const cors = require('cors');

// Redis
const { redisSet, redisGet } = require('./useRedis');

// Helpers
// DOMPurify => clean incoming stings
const { cleanData } = require('./cleanData');

/* ++++++++++++++++++++++++++++++ */

// Middleware
app.use(cors());
app.use(express.json());

/* ++++++++++++++++++++++++++++++ */

// Start server

const devPort = 3001;
// Use PORT env var on the server
// Use `devPort` locally
const port = process.env.PORT || devPort;

app.listen(port, () => {
  console.log(`Simple JSON is running on port ${port}.`);
});

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
  const value = JSON.stringify(body);
  const cleanedVal = cleanData(value);

  redisSet(key, cleanedVal);

  res.json({
    status: 'success',
    data: req.body,
  });
};

app //
  .route('/api/v1/json/:key')
  .post(setJson)
  .get(getJson);
