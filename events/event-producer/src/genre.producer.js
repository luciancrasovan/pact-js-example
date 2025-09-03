const { Kafka } = require("kafkajs");
const { createGenre } = require("./genre.event");

const clientId = "genre-event";
const brokers = ["localhost:29092"];

const kafka = new Kafka({ clientId, brokers });
const producer = kafka.producer();

const produce = async (name) => {
	await producer.connect();
    const message = createGenre(name);
    await producer.send({
        topic: "genres",
        messages: [
            {
                key: "1",
                value: JSON.stringify(message),
            }
        ],
    });
}

module.exports = produce;