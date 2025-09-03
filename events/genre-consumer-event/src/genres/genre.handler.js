const repository = require("./genre.repository");
const Genre = require('./genre');

const handler = (message) => {
  return Promise.resolve(repository.insert(new Genre(message.name)));
}

module.exports = handler;