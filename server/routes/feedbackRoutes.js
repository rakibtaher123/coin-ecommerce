const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');

// ✅ GET: সব ফিডব্যাক দেখানো
router.get('/', async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ submittedAt: -1 });
    res.status(200).json(feedbacks);
  } catch (err) {
    console.error("Error fetching feedback:", err);
    res.status(500).json({ error: "Failed to fetch feedback" });
  }
});

// ✅ POST: নতুন ফিডব্যাক পাঠানো
router.post('/', async (req, res) => {
  try {
    const { userName, email, message } = req.body;

    if (!userName || !email || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newFeedback = new Feedback({ userName, email, message });
    await newFeedback.save();

    res.status(201).json({ message: "✅ Feedback submitted", feedback: newFeedback });
  } catch (err) {
    console.error("Error submitting feedback:", err);
    res.status(500).json({ error: "Failed to submit feedback" });
  }
});

module.exports = router;
