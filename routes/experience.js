const express = require('express');
const router = express.Router();
const Experience = require('../model/Experience'); 

// ✅ Create a new experience entry
router.post('/', async (req, res) => {
  try {
    const newExperience = new Experience(req.body);
    await newExperience.save();
    res.status(201).json({ message: 'Experience added successfully', data: newExperience });
  } catch (error) {
    console.error('Error saving experience:', error);
    res.status(500).json({ message: 'Error saving experience', error });
  }
});

// ✅ Fetch experience for a specific user
router.get("/:userId", async (req, res) => {
  try {
      const userId = req.params.userId;
      const experiences = await Experience.find({ userId });

      if (!experiences || experiences.length === 0) {
          return res.status(404).json({ message: "Experience not found" });
      }

      res.json(experiences);
  } catch (error) {
      res.status(500).json({ message: "Server error", error });
  }
});

// ✅ Delete an experience entry by ID
router.delete('/:id', async (req, res) => {
  try {
    await Experience.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Experience entry deleted successfully' });
  } catch (error) {
    console.error('Error deleting experience:', error);
    res.status(500).json({ message: 'Error deleting experience', error });
  }
});

module.exports = router;






