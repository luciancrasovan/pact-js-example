
const {
  MatchersV3,
  MessageConsumerPact,
  asynchronousBodyHandler,
} = require("@pact-foundation/pact");
const movieEventHandler = require('./movie.handler');
const { like } = MatchersV3;
const path = require("path");
const avro = require('avsc');

// Define AVRO schema for movie events
const movieSchema = avro.Type.forSchema({
  type: 'record',
  name: 'MovieEvent',
  fields: [
    { name: 'name', type: 'string' },
    { name: 'year', type: 'string' }
  ]
});

describe("Kafka handler", () => {
  const messagePact = new MessageConsumerPact({
    consumer: "ConsumerEvent",
    provider: "EventProducer",
    dir: path.resolve(process.cwd(), "pacts"),
    logLevel: "info",
  });

  describe("receive a add movie event", () => {
    it("accepts a movie event with valid AVRO schema", () => {
      // First validate the actual data structure
      const actualData = {
        name: "The World's End",
        year: "2013"
      };

      // Validate actual data against AVRO schema
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
            "contentType": "application/json",
            "topic": "movies",
            "schemaType": "avro"
          })
          .verify(asynchronousBodyHandler(movieEventHandler));
    });
  });
});