// routes/votes.routes.js
const express = require('express');
const  Vote  = require('../models/Vote.model');
const  Poll  = require('../models/Poll.model');
const { producer } = require('../services/kafka');
const router = express.Router();

// A simple route to submit a vote
router.post('/vote', async (req, res) => {
    
    const { pollId, option } = req.body; // Expecting pollId and option from the body
    console.log('Vote route reached', { pollId, option });

    // Log the received data for debugging purposes
    console.log('Received vote:', { pollId, option });

    try {
        if (!pollId || !option) {
            return res.status(400).json({ error: 'Poll ID and Option are required' });
        }

        // Check if the poll exists
        const poll = await Poll.findByPk(pollId);
        if (!poll) {
            return res.status(404).json({ error: 'Poll not found' });
        }

        // Create the voteData object
        const voteData = {
            pollId,
            option,
            question: poll.question, // Include the poll's question
        };

        // **Save the vote data to the PostgreSQL database**
        const newVote = await Vote.create(voteData);

        // Send the voteData as a message to Kafka
        await producer.send({
            topic: 'polling_test',
            messages: [
                { value: JSON.stringify(voteData) },
            ],
        });

        res.status(200).json({ message: 'Vote submitted successfully', vote: newVote });
    } catch (error) {
        console.error('Error submitting vote:', error);
        res.status(500).json({ error: 'Failed to submit vote' });
    }
});

// Route to get all votes for a particular poll
router.get('/votes/:pollId', async (req, res) => {
    const { pollId } = req.params;

    try {
        // Query the database to get all votes for the given pollId
        const votes = await Vote.findAll({
            where: { pollId },
        });

        // If no votes are found, return a 404 response
        if (!votes || votes.length === 0) {
            return res.status(404).json({ message: 'No votes found for this poll' });
        }

        // Return the list of votes in the response
        res.status(200).json(votes);
    } catch (error) {
        console.error('Error fetching votes:', error);
        res.status(500).json({ error: 'Failed to fetch votes' });
    }
});

module.exports = router;
