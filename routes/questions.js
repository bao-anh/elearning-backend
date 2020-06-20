const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');

const Question = require('../models/Question');

// @route   POST api/questions
// @desc    Create a question
// @access  Private
router.post('/', auth, async (req, res) => {
  const {
    content,
    part,
    soundLink,
    imageLink,
    script,
    childrenIds,
    correctAnswer,
    answerArray,
  } = req.body;

  try {
    const newQuestion = new Question({
      content,
      part,
      soundLink,
      imageLink,
      script,
      childrenIds,
      correctAnswer,
      answerArray,
    });

    await newQuestion.save();

    res.json(newQuestion);
  } catch (err) {
    console.error(err);
    res.status(500).send('Sever Error');
  }
});

module.exports = router;
