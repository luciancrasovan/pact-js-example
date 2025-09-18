const {
  MatchersV3,
  MessageConsumerPact,
  asynchronousBodyHandler,
} = require("@pact-foundation/pact");
const movieEventHandler = require('./movie.handler');
const { like } = MatchersV3;
const path = require("path");
const avro = require('avsc');
const fs = require('fs');

// Load AVRO schema from file
const schemaFile = fs.readFileSync(path.resolve(__dirname, '../../../schemas/movie.avsc'), 'utf8');
const movieSchema = avro.Type.forSchema(JSON.parse(schemaFile));

describe("Kafka handler", () => {
  const messagePact = new MessageConsumerPact({
    consumer: "ConsumerEvent",
    provider: "EventProducer",
    dir: path.resolve(process.cwd(), "pacts"),
    logLevel: "info",
  });

  describe("receive a add movie event", () => {
    it("accepts a movie event with valid AVRO schema", () => {
      const actualData = {
        name: "The World's End",
        year: "2013"
      };

      // Validate and encode the data using AVRO
      const isValid = movieSchema.isValid(actualData);
      expect(isValid).toBe(true);

      // Create Pact matcher version for the contract
      const movieEvent = {
        name: like(actualData.name),
        year: like(actualData.year)
      };

      return messagePact
          .expectsToReceive("a movie add event")
          .withContent(movieEvent)
          .withMetadata({
            "contentType": "application/avro",
            "topic": "movies",
            "schemaType": "avro"
          })
          .verify(asynchronousBodyHandler(movieEventHandler));
    });
  });
});