const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');

const Question = require('../models/Question');

// @route   POST api/questions
// @desc    Create a question
// @access  Private
router.post(
  '/',
  auth,
  [
    check('content', 'Content is required').not().isEmpty(),
    check('correctAnswer', 'Correct answer is required').not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { content, part, soundLink, imageLink, correctAnswer } = req.body;

    try {
      const newQuestion = new Question({
        content,
        part,
        soundLink: soundLink || '',
        imageLink: imageLink || '',
        correctAnswer,
      });

      await newQuestion.save();

      res.json(newQuestion);
    } catch (err) {
      console.error(err);
      res.status(500).send('Sever Error');
    }
  }
);

module.exports = router;
