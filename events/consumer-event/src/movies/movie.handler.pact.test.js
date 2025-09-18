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
      const movieEvent = {
        name: like("The World's End"),
        year: like("2013")
      };

      // Validate against AVRO schema
      const isValid = movieSchema.isValid(movieEvent);
      expect(isValid).toBe(true);

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
