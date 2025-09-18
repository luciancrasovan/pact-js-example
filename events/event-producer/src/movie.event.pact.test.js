const {
  MessageProviderPact,
  providerWithMetadata,
} = require('@pact-foundation/pact');
const { createMovie } = require('./movie.event');
const path = require('path');
const avro = require('avsc');
const fs = require('fs');

// Load AVRO schema from file
const schemaFile = fs.readFileSync(path.resolve(__dirname, '../../schemas/movie.avsc'), 'utf8');
const movieSchema = avro.Type.forSchema(JSON.parse(schemaFile));

describe('Event producer tests', () => {
  const provider = new MessageProviderPact({
    messageProviders: {
      'a movie add event': providerWithMetadata(() => {
        const message = createMovie("The World's End", "2013");
        // Validate the message against AVRO schema
        const isValid = movieSchema.isValid(message);
        expect(isValid).toBe(true);
        // Return the message (in practice this would be encoded, but for Pact testing we keep it as object)
        return message;
      }, {
        topic: 'movies',
        contentType: 'application/avro'
      }),
    },
    logLevel: 'info',
    provider: 'EventProducer',
    providerVersion: process.env.GITHUB_SHA,
    providerVersionBranch: process.env.GITHUB_BRANCH,
    consumerVersionSelectors: [
      { mainBranch: true },
      { matchingBranch: true },
      { deployedOrReleased: true }
    ],
    pactBrokerUrl: process.env.PACT_BROKER_BASE_URL,
    pactBrokerToken: process.env.PACT_BROKER_TOKEN,
    pactUrls: [process.env.PACT_BROKER_BASE_URL],
    publishVerificationResult: true,
  });

  describe('send a movie add event', () => {
    it('sends a valid movie', () => {
      return provider.verify();
    });
  });
});