const express = require('express');
const router = express.Router();
const PersonalInfo = require('../model/PersonalInfo'); 

// Save or Update Personal Info (POST)
router.post('/', async (req, res) => {
  try {
    const { userId, name, job, add, email, mob, link } = req.body;

    if (!userId) {
      return res.status(400).json({ success: false, message: 'User ID is required.' });
    }

    let personalData = await PersonalInfo.findOne({ userId });

    if (personalData) {
      // Update existing record
      personalData.name = name;
      personalData.job = job;
      personalData.add = add;
      personalData.email = email;
      personalData.mob = mob;
      personalData.link = link;
      await personalData.save();
      return res.status(200).json({ success: true, message: 'Personal information updated successfully!' });
    }

    // Create new record
    personalData = new PersonalInfo({ userId, name, job, add, email, mob, link });
    await personalData.save();

    res.status(201).json({ success: true, message: 'Personal information saved successfully!' });

  } catch (error) {
    console.error('Error saving personal information:', error);
    res.status(500).json({ success: false, message: 'An error occurred while saving personal information.' });
  }
});


router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const personalData = await PersonalInfo.findOne({ userId });

    if (!personalData) {
      return res.status(404).json({ success: false, message: 'Personal data not found.' });
    }

    res.status(200).json({ success: true, data: personalData });
  } catch (error) {
    console.error('Error retrieving personal information:', error);
    res.status(500).json({ success: false, message: 'An error occurred while retrieving personal information.' });
  }
});


module.exports = router;
