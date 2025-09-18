const { Kafka } = require("kafkajs");
const { createMovie } = require("./movie.event");
const avro = require('avsc');
const fs = require('fs');
const path = require('path');

const clientId = "movie-event";
const brokers = ["localhost:29092"];

// Load AVRO schema
const schemaFile = fs.readFileSync(path.resolve(__dirname, '../../../schemas/movie.avsc'), 'utf8');
const movieSchema = avro.Type.forSchema(JSON.parse(schemaFile));

const kafka = new Kafka({ clientId, brokers });
const producer = kafka.producer();

const produce = async (name, year) => {
    await producer.connect();
    const message = createMovie(name, year);

    // Validate message against schema
    if (!movieSchema.isValid(message)) {
        throw new Error('Invalid message format');
    }

    // Serialize message using AVRO
    const buffer = movieSchema.toBuffer(message);

    await producer.send({
        topic: "movies",
        messages: [
            {
                key: "1",
                value: buffer, // Send serialized AVRO buffer
            }
        ],
    });
}

module.exports = produce;