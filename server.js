require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

const personalRoutes = require('./routes/personalInfo');
const educationRoutes = require('./routes/education');
const summaryRoutes = require('./routes/summary'); 
const experienceRoutes = require('./routes/experience'); 
const skillRoutes = require('./routes/skill'); 

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/personal', personalRoutes);
app.use('/api/education', educationRoutes);
app.use('/api/summary', summaryRoutes);
app.use('/api/experience', experienceRoutes);
app.use('/api/skill', skillRoutes);

// Connect to MongoDB
mongoose.connect('mongodb+srv://prathameshshinde1052001:Pass123@cluster0.erg78.mongodb.net/builderDB')
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// User Schema
const userSchema = new mongoose.Schema({
  userId: { type: String, unique: true, default: uuidv4 }, // Unique user ID
  name: String,
  mob: String,
  email: String,
  pass: String,
});

const User = mongoose.model('User', userSchema);

// ✅ Signup API
app.post('/api/signup', async (req, res) => {
  try {
    const { name, mob, email, pass } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User with this email already exists!' });
    }

    // Generate a unique user ID
    const newUser = new User({ userId: uuidv4(), name, mob, email, pass });
    await newUser.save();

    res.status(201).json({ success: true, message: 'Registration successful!', userId: newUser.userId });
  } catch (error) {
    console.error('Signup Error:', error);
    res.status(500).json({ success: false, message: 'Error occurred while saving user data' });
  }
});

// ✅ Login API
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({ message: 'User not found' });
  }

  if (password !== user.pass) {  // Compare passwords directly (not recommended for production)
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  return res.json({ userId: user.userId, name: user.name, email: user.email, message: 'Login successful!' });
});

// Start Server
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
