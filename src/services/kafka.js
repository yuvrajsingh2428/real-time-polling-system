const { Kafka, Partitioners, logLevel } = require('kafkajs');
const Vote = require('../models/Vote.model'); // Use the Vote model to store votes
const Poll = require('../models/Poll.model'); // Use Poll model to get poll details
const Leaderboard = require('../models/Leaderboard.model');  // Import the Leaderboard model

// Kafka configuration with retry settings
const kafka = new Kafka({
  clientId: 'polling-system',
  brokers: ['process.env.KAFKA_BROKER' || 'kafka:9092'],
  requestTimeout: 30000,
  connectionTimeout: 30000,
  metadataMaxAge: 60000,
  logLevel: logLevel.ERROR,
  retry: {
    initialRetryTime: 100,
    retries: 8, // Retry 8 times for metadata fetching and request failures
  },
});

// Declare producer and consumer
const producer = kafka.producer({
  createPartitioner: Partitioners.LegacyPartitioner,
});

const consumer = kafka.consumer({ groupId: 'polling-group', sessionTimeout: 30000 });

// Connect the producer
const connectProducer = async () => {
  try {
    await producer.connect();
    console.log('Kafka Producer connected');
  } catch (error) {
    console.error('Error connecting Kafka Producer:', error);
  }
};

// Connect the consumer
const connectConsumer = async () => {
  try {
    await consumer.connect();
    console.log('Kafka Consumer connected');
    
    await consumer.subscribe({ topic: 'polling_test', fromBeginning: true });

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          // Parse the message received
          const voteData = JSON.parse(message.value.toString());
          const { pollId, option } = voteData;

          // Fetch the poll from the database
          const poll = await Poll.findOne({ where: { id: pollId } });

          if (!poll) {
            console.error('Poll not found');
            return;
          }

          // Create a new vote and associate it with the poll
          const newVote = await Vote.create({
            pollId: poll.id,
            option,
            question: poll.question, // Store the poll question
          });

          console.log(`New vote recorded: ${newVote.option} for poll: ${newVote.question}`);

          // Emit the vote to all connected clients
          io.emit('newVote', { vote: newVote });

          // Update the leaderboard after each vote
          await updateLeaderboard(pollId, option);

        } catch (error) {
          console.error('Error processing message', error);
        }
      },
    });
  } catch (error) {
    console.error('Error connecting Kafka Consumer:', error);
  }
};

// Update leaderboard and emit via WebSocket
const updateLeaderboard = async (pollId, option) => {
  let leaderboardEntry = await Leaderboard.findOne({
    where: { pollId, option },
  });

  if (leaderboardEntry) {
    leaderboardEntry.voteCount += 1;
    await leaderboardEntry.save();
  } else {
    leaderboardEntry = await Leaderboard.create({
      pollId,
      option,
      voteCount: 1,
    });
  }

  // Emit updated leaderboard to clients via WebSocket
  io.emit('leaderboardUpdate', { leaderboard: await getLeaderboard() });
};

// Get the leaderboard
const getLeaderboard = async () => {
  return await Leaderboard.findAll({
    order: [['voteCount', 'DESC']],
    limit: 10, // Show top 10 leaderboard entries
  });
};

// Export functions to connect producer and consumer
module.exports = { producer, consumer, connectProducer, connectConsumer };
