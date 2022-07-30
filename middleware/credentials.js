const allowedOrigins = require('../config/allowedOrigins');

const credentials = (req, res, next) => {
  console.log(allowedOrigins);
  const origin = req.headers.origin;
  // if origin is in allowedOrigins listen
  if (allowedOrigins.includes(origin)) {
    // set this header on the response
    res.header('Access-Control-Allow-Credentials', true);
  }
  next();
};

module.exports = credentials;
