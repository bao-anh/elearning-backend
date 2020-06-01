const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');

const Question = require('../models/Question');
const Part = require('../models/Part');
const Toeic = require('../models/Toeic');
const Participant = require('../models/Participant');
const User = require('../models/User');

// @route   GET api/questions
// @desc    Query question
// @access  Public
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'participantIds',
      select: 'score testId assignmentId date',
    });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

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
