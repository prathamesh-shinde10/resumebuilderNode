const express = require('express');
const router = express.Router();
const Education = require('../model/Education'); 

//POST: Save new education details (Prevent duplicate entries)
router.post('/', async (req, res) => { 
  try {
    console.log("Received education data:", req.body); // Debugging log

    const educationData = req.body;

    if (!Array.isArray(educationData) || educationData.length === 0) {
      return res.status(400).json({ message: 'Invalid education data format' });
    }

    if (!educationData.every(entry => entry.userId)) {
      return res.status(400).json({ message: 'User ID is required for each education entry' });
    }

    const userId = educationData[0].userId;

    // ✅ Ensure newEntries is properly declared
    const newEntries = educationData.map(entry => ({
      ...entry,
      percentage: entry.percentage ? Number(entry.percentage) : 0  // ✅ Convert percentage to number
    }));

    console.log("🔹 Data before saving to DB:", newEntries); // Debugging log

    if (newEntries.length === 0) {
      return res.status(400).json({ message: 'No valid education data to save.' });
    }

    const savedEducation = await Education.insertMany(newEntries);
    console.log("✅ Saved in MongoDB:", savedEducation); // Debugging log
    res.status(201).json({ message: 'Education details saved successfully!', savedEducation });

  } catch (error) {
    console.error('❌ Error saving education data:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});



//  GET: Fetch education details for a specific user

router.get('/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const educationDetails = await Education.find({ userId });

    //  Ensure ID is returned
    const formattedEducation = educationDetails.map(entry => ({
      ...entry.toObject(),
      id: entry._id.toString() // Ensure `id` is always available
    }));

    res.json(formattedEducation);
  } catch (error) {
    console.error('Error fetching education data:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});


// ✅ DELETE: Remove an education entry
router.delete('/:id', async (req, res) => {
  try {
    const eduId = req.params.id;
    console.log(` Deleting entry with ID: ${eduId}`); 

    const deletedEducation = await Education.findByIdAndDelete(eduId);

    if (!deletedEducation) {
      console.warn(' Entry not found in DB.');
      return res.status(404).json({ success: false, message: 'Education entry not found' });
    }

    console.log(' Entry deleted from DB:', deletedEducation);
    res.json({ success: true, message: 'Education entry deleted successfully' });
  } catch (error) {
    console.error('Error deleting education:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});



module.exports = router;
