const repository = require("./movie.repository");
const Movie = require('./movie');

const handler = (message) => {
  return Promise.resolve(repository.insert(new Movie(message.name, message.year, message.genre)));
}

module.exports = handler;