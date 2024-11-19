const http = require('http');
const socketIO = require('socket.io');
const express = require('express');
const { connectProducer, connectConsumer, producer,  } = require('./services/kafka');
const sequelize = require('./config/database');
const Poll = require('./models/Poll.model');
const Vote = require('./models/Vote.model');
const socketClient = require('socket.io-client'); // Import socket.io-client



// Initialize Express App
const app = express();
const PORT = process.env.PORT || 4000;
app.use(express.json());

// Create HTTP server and integrate it with Socket.IO
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: '*', // Allow all origins for testing
    methods: ['GET', 'POST'],
  },
});




// Health check endpoint
app.get('/', (req, res) => {
  res.send('Polling System Backend is running');
});

// WebSocket connection handler
io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);

  // Handle client events
  socket.on('testEvent', (data) => {
    console.log('Received testEvent:', data);
  });

  // Emit a welcome message to the client
  socket.emit('welcome', { message: 'Welcome to the WebSocket server!' });

  // Handle client disconnect
  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });

  socket.on('error', (error) => {
    console.error(`Socket error: ${error.message}`);
  });
});

// POST route to create a vote
app.post('/api/vote', async (req, res) => {
  try {
    const { pollId, option } = req.body;

    // Check if the poll exists
    const poll = await Poll.findOne({ where: { id: pollId } });
    if (!poll) {
      return res.status(404).json({ message: 'Poll not found' });
    }

    // Create a new vote
    const vote = await Vote.create({ pollId, option });

    // Send the vote to Kafka
    const voteData = {
      pollId,
      option,
    }; 
    
    // Send vote to Kafka for processing
    await producer.send({
      topic: 'polling_test',
      messages: [{ value: JSON.stringify({ pollId, option }) }],
    });

    res.status(201).json({ vote });
  } catch (error) {
    console.error('Error creating vote:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET route to fetch votes by pollId
app.get('/api/votes/:pollId', async (req, res) => {
  try {
    const { pollId } = req.params;

    // Find the poll first
    const poll = await Poll.findOne({ where: { id: pollId } });
    if (!poll) {
      return res.status(404).json({ message: 'Poll not found' });
    }

    // Retrieve all votes for the poll
    const votes = await Vote.findAll({ where: { pollId } });

    // Return the votes
    res.status(200).json({ votes });
  } catch (error) {
    console.error('Error retrieving votes:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// Initialize Kafka
const initializeKafka = async () => {
  await connectProducer();
  await connectConsumer();
};

// Sync the database models with a test insert
const syncDatabase = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log('Database synchronized...');

    // Test insert for Poll model
    const testPoll = await Poll.create({
      question: 'Do you like coding?',
      pollOption: { options: ['Yes', 'No'] },
    });
    console.log('Test poll inserted:', testPoll.dataValues);

    // Test insert for Vote model
    const testVote = await Vote.create({
      pollId: testPoll.id,
      option: 'Yes',
    });
    console.log('Test vote inserted:', testVote.dataValues);
  } catch (error) {
    console.error('Error during synchronization or test insert:', error);
  }
};

// Start the server
server.listen(PORT, async () => {
  console.log(`Server is running on http://localhost:${PORT}`);

  // Sync database and initialize Kafka
  await syncDatabase();
  await initializeKafka();

  // Connect the WebSocket client after the server is up and running
  const socket = socketClient('http://localhost:4000'); // Connect to the server with socket.io-client
  
  socket.on('connect', () => {
    console.log('WebSocket client connected');
    socket.emit('testEvent', { message: 'Hello Server!' });
  });

  socket.on('welcome', (data) => {
    console.log('Message from server:', data.message);
  });

  socket.on('disconnect', () => {
    console.log('WebSocket client connection closed');
  });

  socket.on('error', (error) => {
    console.error('WebSocket client error:', error.message);
  });
});

// POST route to create a poll
app.post('/api/polls', async (req, res) => {
  try {
    const { question, pollOption } = req.body;

    // Create a new poll in the database
    const newPoll = await Poll.create({
      question,
      pollOption, // Store options as JSON
    });

    res.status(201).json({ poll: newPoll });
  } catch (error) {
    console.error('Error creating poll:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET route to fetch leaderboard
app.get('/api/leaderboard', async (req, res) => {
  try {
    const leaderboard = await Vote.findAll({
      attributes: ['option', [sequelize.fn('COUNT', sequelize.col('option')), 'votes']],
      group: ['option'],
      order: [[sequelize.fn('COUNT', sequelize.col('option')), 'DESC']],
    });

    res.status(200).json(leaderboard);
  } catch (error) {
    console.error('Error retrieving leaderboard:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
