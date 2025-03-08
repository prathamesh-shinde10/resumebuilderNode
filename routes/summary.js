const express = require('express');
const router = express.Router();
const Summary = require('../model/Summary'); 

// ✅ Save or update summary for a user
router.post('/', async (req, res) => {
  try {
    const { userId, text } = req.body;

    if (!userId || !text) {
      return res.status(400).json({ message: 'User ID and text are required.' });
    }

    let summary = await Summary.findOne({ userId });

    if (summary) {
      summary.text = text;
      await summary.save();
      return res.json({ message: 'Summary updated successfully!', summary });
    } else {
      summary = new Summary({ userId, text });
      await summary.save();
      return res.json({ message: 'Summary saved successfully!', summary });
    }
  } catch (error) {
    console.error('Error saving summary:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Fetch summary for a specific user
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const summary = await Summary.findOne({ userId });

    if (!summary) {
      return res.status(404).json({ message: 'No summary found' });
    }

    res.json(summary);
  } catch (error) {
    console.error('Error fetching summary:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
