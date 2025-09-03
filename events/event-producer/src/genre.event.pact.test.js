const {
  MessageProviderPact,
  providerWithMetadata,
} = require('@pact-foundation/pact');
const { createGenre } = require('./genre.event');

describe('Genre event producer tests', () => {
  const provider = new MessageProviderPact({
    messageProviders: {
      'a genre add event': providerWithMetadata(() => createGenre("SciFi"), {
        topic: 'genres',
        contentType: 'application/json'
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

  describe('send a genre add event', () => {
    it('sends a valid genre', () => {
      return provider.verify();
    });
  });
});