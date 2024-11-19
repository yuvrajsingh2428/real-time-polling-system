const { producer } = require('../services/kafka');

const voteOnPoll = async (req, res) => {
  const { voteData } = req.body; // Assume voteData is an object (e.g., { vote: "option1" })

  if (!voteData) {
    return res.status(400).json({ error: 'Vote data is required' });
  }

  try {
    // Send the vote data to the Kafka topic
    await producer.send({
      topic: 'polling_test', // Kafka topic
      messages: [
        { value: JSON.stringify(voteData) }, // Send vote data as a stringified JSON
      ],
    });

    res.status(200).json({ message: 'Vote submitted successfully' });
  } catch (error) {
    console.error('Error submitting vote:', error);
    res.status(500).json({ error: 'Failed to submit vote' });
  }
};

module.exports = { voteOnPoll };
