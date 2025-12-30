const Feedback = require('../models/Feedback');

// ✅ Get all feedback
exports.getFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find().populate('user');
    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch feedback" });
  }
};

// ✅ Create feedback
exports.createFeedback = async (req, res) => {
  try {
    const feedback = new Feedback(req.body);
    await feedback.save();
    res.status(201).json({ message: "✅ Feedback submitted successfully", feedback });
  } catch (err) {
    res.status(500).json({ error: "Failed to submit feedback" });
  }
};

// ✅ Delete feedback
exports.deleteFeedback = async (req, res) => {
  try {
    await Feedback.findByIdAndDelete(req.params.id);
    res.json({ message: "✅ Feedback deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete feedback" });
  }
};
