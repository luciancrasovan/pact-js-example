const app = require('express')();
const cors = require('cors');
const consumeGenreStream = require('./src/service/kafka');
const streamHandler = require('./src/genres/genre.handler');
const port = 8080;

const init = () => {
    app.use(cors());

    consumeGenreStream(streamHandler);

    return app.listen(port, () => console.log(`Provider API listening on port ${port}...`));
};

init();