// Express
const express = require('express');
const app = express();

// Cors
const credentials = require('./middleware/credentials');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');

// Authentication
// verfiy JWT => custom middleware to check access rights
const verifyJWT = require('./middleware/verifyJWT');
const cookieParser = require('cookie-parser');

// Redis
const { redisSet, redisGet } = require('./useRedis');

// Helpers
// DOMPurify => clean incoming stings
const { cleanData } = require('./cleanData');

/* ++++++++++++++++++++++++++++++ */

// Middleware
app.use(credentials);
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

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

  // console.log(req.params);
  // console.log(key);

  const data = await redisGet(key);
  console.log(data);

  // Check data
  // No content here, you hit a non existing route
  if (!data) return res.sendStatus(204);

  let json;
  try {
    json = JSON.parse(data);
  } catch (err) {
    console.log(err.message);
    res.status(400).json({
      status: 'error',
      error: err.message,
      data: data,
    });
    return;
  }

  // Send back data
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

  try {
    redisSet(key, cleanedVal);
  } catch (err) {
    res.status(400).json({
      status: 'error, could not write to DB',
      error: err,
      data: req.body,
    });
  }

  res.status(200).json({
    status: 'success',
    data: req.body,
  });
};

const registerController = require('./controllers/registerController');
app.post('/api/v1/register', registerController.handleNewUser);

const authController = require('./controllers/authController');
app.post('/api/v1/auth', authController.handleLogin);

const refreshTokenController = require('./controllers/refreshTokenController');
app.get('/api/v1/refresh', refreshTokenController.handleRefreshToken);

const logoutController = require('./controllers/logoutController');
app.get('/api/v1/logout', logoutController.handleLogout);

// Apply middleware only to the routes below,
// here: protecting routes using JWT
//app.use(verfiyJWT);

app //
  .route('/api/v1/json/:key')
  .post(setJson)
  .get(verifyJWT, getJson);
// .get(verfiyJWT, getJson); // apply middleware only to one route
