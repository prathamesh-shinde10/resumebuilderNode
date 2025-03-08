
const mongoose = require('mongoose');
const SkillSchema = new mongoose.Schema({
    userId: { type: String, required: true, index: true }, 
    skills: [
        {
            skill: { type: String, required: true },
            per: { type: Number, required: true, min: 0, max: 100 }
        }
    ]
});



module.exports = mongoose.model('Skill', SkillSchema);

