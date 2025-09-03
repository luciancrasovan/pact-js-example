const {
  MatchersV3,
  MessageConsumerPact,
  asynchronousBodyHandler,
} = require("@pact-foundation/pact");
const genreEventHandler = require('./genre.handler');
const { like } = MatchersV3;
const path = require("path");

describe("Kafka handler", () => {
  const messagePact = new MessageConsumerPact({
    consumer: "GenreEventConsumer",
    provider: "EventProducer",
    dir: path.resolve(process.cwd(), "pacts"),
    logLevel: "info",
  });

  describe("receive a add genre event", () => {
    it("accepts a genre event", () => {
      return messagePact
        .expectsToReceive("a genre add event")
        .withContent({
          name: like("SciFi"),
        })
        .withMetadata({
          "contentType": "application/json",
          "topic": "genres",
        })
        .verify(asynchronousBodyHandler(genreEventHandler));
    });
  });
});
