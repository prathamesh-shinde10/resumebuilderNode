// const express = require('express');
// const router = express.Router();
// const mongoose = require('mongoose');
// const Skill = require('../model/Skill'); 

// // Save or update skill
// router.post('/', async (req, res) => {
//   const { userId, skills } = req.body;

//   if (!userId || !Array.isArray(skills) || skills.length === 0) {
//       return res.status(400).json({ message: 'Invalid input data' });
//   }

//   try {
//       const updatedSkill = await Skill.findOneAndUpdate(
//           { userId }, // Find by userId
//           { $push: { skills: { $each: skills } } }, // Push new skills into the existing array
//           { new: true, upsert: true } // Create if not exists, return updated doc
//       );

//       res.status(201).json({ message: 'Skill added successfully', skill: updatedSkill });
//   } catch (error) {
//       res.status(500).json({ error: error.message });
//   }
// });






// // Get skills by userId
// router.get('/:userId', async (req, res) => {
//   try {
//       const { userId } = req.params;
      
//       // Find a single record for the user
//       const skillRecord = await Skill.findOne({ userId });

//       if (!skillRecord) {
//           return res.json({ userId, skills: [] });
//       }

//       res.json(skillRecord);
//   } catch (error) {
//       res.status(500).send('Server Error');
//   }
// });


// // Delete skill
// router.delete('/delete/:skillId', async (req, res) => {
//     try {
//         await Skill.findOneAndUpdate({ 'skills._id': req.params.skillId }, { $pull: { skills: { _id: req.params.skillId } } });
//         res.status(200).json({ message: 'Skill deleted successfully' });
//     } catch (error) {
//         res.status(500).json({ error: 'Server error' });
//     }
// });

// module.exports = router;

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Skill = require('../model/Skill');

// Add new skills only (no update)
router.post('/', async (req, res) => {
  const { userId, skills } = req.body;

  if (!userId || !Array.isArray(skills) || skills.length === 0) {
    return res.status(400).json({ message: 'Invalid input data' });
  }

  try {
    let skillRecord = await Skill.findOne({ userId });

    if (!skillRecord) {
      // If no skills exist, create a new entry
      skillRecord = new Skill({ userId, skills });
    } else {
      // Append only new skills (avoid duplicates)
      const existingSkillNames = new Set(skillRecord.skills.map(s => s.skill.toLowerCase()));

      const newSkills = skills.filter(skill => 
        !existingSkillNames.has(skill.skill.toLowerCase())
      );

      if (newSkills.length === 0) {
        return res.status(400).json({ message: 'Skills already exist' });
      }

      skillRecord.skills.push(...newSkills);
    }

    await skillRecord.save();
    res.status(201).json({ message: 'Skills added successfully', skills: skillRecord.skills });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get skills by userId
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const skillRecord = await Skill.findOne({ userId });

    if (!skillRecord) {
      return res.json({ userId, skills: [] });
    }

    res.json(skillRecord);
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
});

// Delete skill by skillId
router.delete('/delete/:skillId', async (req, res) => {
  try {
    const updatedSkill = await Skill.findOneAndUpdate(
      { 'skills._id': req.params.skillId }, 
      { $pull: { skills: { _id: req.params.skillId } } },
      { new: true } // Return updated document
    );

    if (!updatedSkill) {
      return res.status(404).json({ message: 'Skill not found' });
    }

    res.status(200).json({ message: 'Skill deleted successfully', skills: updatedSkill.skills });

  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
