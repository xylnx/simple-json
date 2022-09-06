# simple-json

`simple-json` is an [express](https://github.com/expressjs/express) based API.

`simple-json` is under active development. It so far implements a `get` endpoint, which sends JSON data, and a `post` endpoint, which receives JSON data. There are several other routes used for authentication. Data is stored in a [redis data store](https://redis.io/). The app is hosted using a [Heroku dyno](https://www.heroku.com/dynos).

`simple-json` serves as a Backend for a list App, [FWL](https://github.com/xylnx/fwl), but ultimately will be used as a general JSON store.

## Scripts

`npm start`
run the API

`npm run dev`
run the API using nodemon
