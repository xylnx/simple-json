const allowedOriginis = require('./allowedOrigins');

// Check if origin is listed in the imported allowedOriginis array
// Throw error if not
const corsOptions = {
  origin: (origin, callback) => {
    console.log({ origin });
    if (allowedOriginis.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  optionsSuccessStatus: 200,
};

module.exports = corsOptions;
