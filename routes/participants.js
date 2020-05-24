const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');

const Participant = require('../models/Participant');
const Assignment = require('../models/Assignment');
const User = require('../models/User');

// @route   GET api/participants
// @desc    Get all participants
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const participants = await Participant.find();
    res.json(participants);
  } catch (err) {
    console.error(err);
    res.status(500).send('Sever Error');
  }
});

// @route   POST api/participants
// @desc    Create a new participant
// @access  Private
router.post(
  '/',
  auth,
  [
    check('userId', 'User id is required').exists(),
    check('userAnswer', 'User answer is required').exists(),
    check('score', 'Score id required').exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    const { userId, assignmentId, testId, userAnswer, score } = req.body;
    try {
      const newParticipant = new Participant({
        userId,
        assignmentId: assignmentId || null,
        testId: testId || null,
        userAnswer,
        score,
      });

      await newParticipant.save({ session });

      try {
        const user = await User.findById(userId);
        user.participantIds = [...user.participantIds, newParticipant._id];
        await user.save({ session });
      } catch (err) {
        await session.abortTransaction();
        session.endSession();
        console.error(err);
        res.status(400).json({ msg: 'User is not exist' });
      }
      // If document is belong to lesson
      if (assignmentId) {
        try {
          const assignment = await Assignment.findById(assignmentId);
          assignment.participantIds = [
            ...assignment.participantIds,
            newParticipant._id,
          ];
          await assignment.save({ session });
        } catch (err) {
          await session.abortTransaction();
          session.endSession();
          console.error(err);
          res.status(400).json({ msg: 'Assignment is not exist' });
        }
      }

      await session.commitTransaction();
      session.endSession();

      res.json(newParticipant);
    } catch (err) {
      console.error(err);
      res.status(500).json('Sever Error');
    }
  }
);

// @route   PUT api/participants
// @desc    Update a topic by id
// @access  Private
router.put('/:id', auth, async (req, res) => {
  const {
    name,
    courseId,
    lessonIds,
    assignmentIds,
    isFree,
    commentId,
    progressIds,
  } = req.body;

  try {
    let topic = await Participant.findById(req.params.id);
    topic.name = name ? name : topic.name;
    topic.courseId = courseId ? courseId : topic.courseId;
    topic.lessonIds = lessonIds ? lessonIds : topic.lessonIds;
    topic.assignmentIds = assignmentIds ? assignmentIds : topic.assignmentIds;
    topic.isFree = isFree ? isFree : topic.isFree;
    topic.commentId = commentId ? commentId : topic.commentId;
    topic.progressIds = progressIds ? progressIds : topic.progressIds;
    await topic.save();
    res.json(topic);
  } catch (err) {
    console.error(err);
    res.status(500).send('Sever Error');
  }
});

// @route   DELETE api/categories
// @desc    Delete a category by id
// @access  Private
router.delete('/', (req, res) => {
  res.send({ msg: 'Category deleted successfully' });
});

module.exports = router;
