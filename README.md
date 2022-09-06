# simple-json

`simple-json` is an [express](https://github.com/expressjs/express) based API.

`simple-json` is under active development. It so far implements

- a `get` endpoint, which sends JSON data, and
- a `post` endpoint, which receives JSON data
- several routes used for `authentication`
- a [redis datastore](https://redis.io/) used as a database substitute.
- cors to limit requests to allowed origins
- a simple [DOMPurify](https://www.npmjs.com/package/dompurify) setup to sanitize incoming data

The app is hosted using a [Heroku dyno](https://www.heroku.com/dynos).

`simple-json` serves as a Backend for a list App, [FWL](https://github.com/xylnx/fwl), but ultimately will be used as a general JSON store.

## Scripts

`npm start`
run the API

`npm run dev`
run the API using nodemon
