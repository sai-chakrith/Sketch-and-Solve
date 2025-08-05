const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const session = require('express-session');
const path = require('path');
const cors = require('cors');

const Question = require('./models/Question');
const Result = require('./models/Result');
const Announcement = require('./models/Announcement'); // New: Import Announcement model

const app = express();
const PORT = process.env.PORT || 3000;
const axios = require('axios');

// Middleware
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 3600000 }
}));

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/teacherPage')
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// User Schema and Model
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

// ================= USER ROUTES ================= //

app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) return res.status(400).json({ success: false, message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    req.session.userId = newUser._id;

    res.status(201).json({ success: true, message: 'User registered successfully', user: { id: newUser._id, username, email } });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ success: false, message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ success: false, message: 'Invalid credentials' });

    req.session.userId = user._id;
    res.json({ success: true, message: 'Login successful', user: { id: user._id, username: user.username, email: user.email } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.get('/api/user', async (req, res) => {
  try {
    if (!req.session.userId) return res.status(401).json({ success: false, message: 'Not authenticated' });
    const user = await User.findById(req.session.userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user: { id: user._id, username: user.username, email: user.email } });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.get('/api/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).json({ success: false, message: 'Logout failed' });
    res.json({ success: true, message: 'Logged out successfully' });
  });
});

// ================= QUESTION ROUTES ================== //

app.post('/api/questions', async (req, res) => {
  try {
    const { question, category, expectedAnswer } = req.body;
    const createdBy = req.session.userId;
    if (!question || !category || !expectedAnswer || !createdBy) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }
    const newQuestion = new Question({ question, category, expectedAnswer, createdBy });
    await newQuestion.save();
    res.status(201).json({ success: true, message: "Question added successfully" });
  } catch (error) {
    console.error("Error adding question:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.get('/api/questions', async (req, res) => {
  try {
    const questions = await Question.find({});
    res.json({ success: true, questions });
  } catch (error) {
    console.error("Error fetching questions:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.post('/api/predict', async (req, res) => {
  try {
    console.log("🎯 /api/predict called");
    const { imageData, questionId, username } = req.body;
    console.log("Received data:", { questionId, username, imgLength: imageData.length });

    const question = await Question.findById(questionId);
    if (!question) return res.status(404).json({ success: false, message: "Question not found" });

    console.log("Sending image to LLaVA...");
    const llavaResponse = await axios.post('http://localhost:11434/api/generate', {
      model: "llava:7b",
      prompt: "What is in this image in one word?",
      images: [imageData],
      stream: false
    });
    console.log("LLaVA responded!");

    const caption = llavaResponse.data.response?.trim().toLowerCase();
    const expected = question.expectedAnswer.trim().toLowerCase();
    const correct = caption === expected;

    const result = new Result({ username, question: question.question, caption, correct, imageData });
    await result.save();

    res.json({ success: true, caption, correct, message: `Predicted: ${caption}, Expected: ${expected}` });
  } catch (error) {
    console.error("🔥 Prediction error:", error?.response?.data || error?.message || error);
    res.status(500).json({ success: false, message: "Prediction failed. Try again!", error: error?.response?.data || error?.message || error });
  }
});

// ================== RESULTS ROUTE ================== //
app.get('/api/results', async (req, res) => {
  try {
    const { username } = req.query;
    let query = {};
    if (username) query.username = username;
    const results = await Result.find(query).sort({ createdAt: -1 });
    res.json({ success: true, results });
  } catch (error) {
    console.error("Error fetching results:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ================== ANNOUNCEMENT ROUTES ================== //
app.post('/api/announcements', async (req, res) => {
  try {
    const { title, message } = req.body;
    if (!title || !message) return res.status(400).json({ success: false, message: "Missing title or message" });
    const newAnn = new Announcement({ title, message });
    await newAnn.save();
    res.status(201).json({ success: true, message: "Announcement posted successfully" });
  } catch (error) {
    console.error("Error posting announcement:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.get('/api/announcements', async (req, res) => {
  try {
    const announcements = await Announcement.find().sort({ createdAt: -1 });
    res.json({ success: true, announcements });
  } catch (error) {
    console.error("Error fetching announcements:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ================= START SERVER ================= //
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
