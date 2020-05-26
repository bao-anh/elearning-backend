const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');

const Assignment = require('../models/Assignment');
const Topic = require('../models/Topic');
const Lesson = require('../models/Lesson');
const Question = require('../models/Question');

// @route   GET api/assigments
// @desc    Get all assigments
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const assigments = await Assignment.find();
    res.json(assigments);
  } catch (err) {
    console.error(err);
    res.status(500).send('Sever Error');
  }
});

// @route   GET api/assigments/:id
// @desc    Get assignment by id
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const assigment = await Assignment.findById(req.params.id)
      .populate({
        path: 'questionIds',
        populate: { path: 'childrenIds' },
      })
      .populate({
        path: 'participantIds',
        populate: { path: 'userId' },
      })
      .populate({ path: 'progressIds', match: { userId: req.user._id } });

    let newAssignment = assigment;
    newAssignment.participantIds = assigment.participantIds.reverse();

    res.json(newAssignment);
  } catch (err) {
    console.error(err);
    res.status(500).send('Sever Error');
  }
});

// @route   POST api/assigments
// @desc    Create a new assigments
// @access  Private
router.post(
  '/',
  auth,
  [
    check('name', 'Name is required').not().isEmpty(),
    check('courseId', 'Course is required').exists(),
    check('topicId', 'Topic is required').exists(),
    check('duration', 'Duration is not valid').isNumeric(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    const {
      name,
      courseId,
      topicId,
      lessonId,
      questionIds,
      participantIds,
      timeToShowUp,
      duration,
      passPercent,
      orderIndex,
      isFree,
      commentId,
      progressIds,
    } = req.body;
    try {
      const newAssignment = new Assignment({
        name,
        courseId,
        topicId,
        isFree,
        timeToShowUp,
        duration,
        orderIndex,
        passPercent,
        commentId: commentId || null,
        lessonId: lessonId || null,
        participantIds: participantIds || [],
        questionIds: questionIds || [],
        progressIds: progressIds || [],
      });

      await newAssignment.save({ session });

      // If assignment inside a lesson
      if (newAssignment.lessonId) {
        try {
          if (!timeToShowUp)
            return res.status(400).json({ msg: 'Time to show up is required' });
          const lesson = await Lesson.findById(lessonId);
          lesson.assignmentIds = [...lesson.assignmentIds, newAssignment._id];
          await lesson.save({ session });
        } catch (err) {
          await session.abortTransaction();
          session.endSession();
          console.error(err);
          res.status(400).json({ msg: 'Lesson is not exist' });
        }
      }
      // If assignment inside a topic
      else {
        try {
          const topic = await Topic.findById(topicId);
          topic.assignmentIds = [...topic.assignmentIds, newAssignment._id];
          await topic.save({ session });
        } catch (err) {
          await session.abortTransaction();
          session.endSession();
          console.error(err);
          res.status(400).json({ msg: 'Topic is not exist' });
        }
      }

      await session.commitTransaction();
      session.endSession();

      res.json(newAssignment);
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      console.error(err);
      res.status(500).send('Sever Error');
    }
  }
);

// @route   PUT api/assigments
// @desc    Update a topic by id
// @access  Private
router.put('/:id', auth, async (req, res) => {
  const {
    name,
    courseId,
    topicId,
    lessonId,
    questionIds,
    participantIds,
    timeToShowUp,
    orderIndex,
    duration,
    passPercent,
    isFree,
    commentId,
    progressIds,
  } = req.body;

  try {
    let assigment = await Assignment.findById(req.params.id);
    assigment.name = name ? name : assigment.name;
    assigment.courseId = courseId ? courseId : assigment.courseId;
    assigment.topicId = topicId ? topicId : assigment.topicId;
    assigment.orderIndex = orderIndex ? orderIndex : assigment.orderIndex;
    assigment.lessonId = lessonId ? lessonId : assigment.lessonId;
    assigment.questionIds = questionIds ? questionIds : assigment.questionIds;
    assigment.participantIds = participantIds
      ? participantIds
      : assigment.participantIds;
    assigment.timeToShowUp = timeToShowUp
      ? timeToShowUp
      : assigment.timeToShowUp;
    assigment.duration = duration ? duration : assigment.duration;
    assigment.passPercent = passPercent ? passPercent : assigment.passPercent;
    assigment.isFree = isFree ? isFree : assigment.isFree;
    assigment.commentId = commentId ? commentId : assigment.commentId;
    assigment.progressIds = progressIds ? progressIds : assigment.progressIds;
    await assigment.save();
    res.json(assigment);
  } catch (err) {
    console.error(err);
    res.status(500).send('Sever Error');
  }
});

// @route   PUT api/assigments/:id/random
// @desc    Random pick a question to assignment
// @access  Private
router.put('/:id/random', auth, async (req, res) => {
  const { questionIds } = req.body;

  try {
    let assigment = await Assignment.findById(req.params.id);

    let questions = await Question.find({ part: 7.2 }).select('_id');
    let questionArr = questions;
    let newQuestionIds = [];
    const min = 3;
    const max = 4;
    const randomNumberOfElement = Math.floor(
      Math.random() * (max - min + 1) + min
    );

    for (i = 0; i < randomNumberOfElement; i++) {
      const newItemElement = Math.floor(Math.random() * questionArr.length);
      newQuestionIds.push(questionArr[newItemElement]._id);
      questionArr.splice(newItemElement, 1);
    }

    const shuffle = (array) => {
      array.sort(() => Math.random() - 0.5);
    };

    shuffle(newQuestionIds);

    assigment.questionIds = newQuestionIds;

    await assigment.save();
    res.json(assigment);
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
