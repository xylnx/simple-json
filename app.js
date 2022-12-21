// Node
const fs = require('fs');

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

// db location
const path = `${__dirname}/data/`;
const fileName = 'db.json';

// Set to true to log data
const debug = true;

// Start server
const devPort = 3001;
// Use PORT env var on the server
// Use `devPort` locally
const port = process.env.PORT || devPort;

app.listen(port, () => {
  console.log(`Simple JSON is running on port ${port}.`);
});

const getJson = async (req, res) => {
  let data = null;
  data = await fs.readFile(`${path}${fileName}`, 'utf-8', (err, data) => {
    if (debug) console.log('test');
    if (debug) console.log({ data });

    if (debug) console.log('outside');
    if (debug) console.log({ data });
    // Check data
    // No content here, you hit a non existing route
    if (!data) return res.sendStatus(204);

    // Parse JSON from redis data
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

    // Send back JSON
    res.status(200).json({
      status: 'success',
      data: json,
    });
  });
};

const setJson = (req, res) => {
  const key = req.params['key'];
  const body = req.body;
  const value = JSON.stringify(body);
  const cleanedVal = cleanData(value);

  try {
    fs.writeFileSync(`${path}${fileName}`, cleanedVal);
    console.log('The file was saved!');
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

// const registerController = require('./controllers/registerController');
// app.post('/api/v1/register', registerController.handleNewUser);

const authController = require('./controllers/authController');
app.post('/api/v1/auth', authController.handleLogin);

const refreshTokenController = require('./controllers/refreshTokenController');
app.get('/api/v1/refresh', refreshTokenController.handleRefreshToken);

const logoutController = require('./controllers/logoutController');
app.get('/api/v1/logout', logoutController.handleLogout);

// Apply middleware only to the routes below,
// here: protecting routes using JWT
//app.use(verfiyJWT);
//

// TEST ENDPOINT
app.get('/api/v1/test', (req, res) => {
  res.send('TEST FWL: SUCCESS!');
});

app //
  .route('/api/v1/json/:key')
  .post(setJson)
  .get(verifyJWT, getJson);
// .get(verfiyJWT, getJson); // apply middleware only to one route
