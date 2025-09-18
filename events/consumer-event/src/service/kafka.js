const { Kafka } = require('kafkajs');
const avro = require('avsc');
const fs = require('fs');
const path = require('path');

const clientId = 'movie-event';

// Load AVRO schema
const schemaFile = fs.readFileSync(path.resolve(__dirname, '../../../schemas/movie.avsc'), 'utf8');
const movieSchema = avro.Type.forSchema(JSON.parse(schemaFile));

const kafka = new Kafka({
  clientId: clientId,
  brokers: ['localhost:29092']
});

const consumer = kafka.consumer({ groupId: clientId });

const consumeMovieStream = async (handler) => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'movies', fromBeginning: false });
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      try {
        // Deserialize the message using AVRO schema
        const decodedMessage = movieSchema.fromBuffer(message.value);
        await handler(decodedMessage);
      } catch (e) {
        console.error('unable to handle message', e);
      }
    },
  })
}

module.exports = consumeMovieStream