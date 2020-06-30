const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { check, validationResult } = require('express-validator');
const { getOneScale } = require('../services/scale');
const auth = require('../middleware/auth');
const { getQuestionByPartNumberSelectId } = require('../services/question');

const Scale = require('../models/Scale');
const Progress = require('../models/Progress');
const Course = require('../models/Course');
const Topic = require('../models/Topic');
const Lesson = require('../models/Lesson');
const Assignment = require('../models/Assignment');
const Document = require('../models/Document');
const Question = require('../models/Question');
const { findById } = require('../models/Scale');

// @route   POST api/scales
// @desc    Create a toeic scale
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const scale = await getOneScale();
    res.json(scale);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// @route   POST api/scales
// @desc    Create a toeic scale
// @access  Private
router.post(
  '/',
  [
    check('listening', 'Listening is required').exists(),
    check('reading', 'Reading answer is required').exists(),
  ],
  auth,
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { listening, reading } = req.body;

      const newScale = new Scale({
        listening,
        reading,
      });

      await newScale.save();

      res.json(newScale);
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  }
);

// @route   OPERATION api/scales/...
// @desc    Use this route to operate app
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    await Progress.findByIdAndDelete(req.params.id);
    res.send('Done');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// @route   OPERATION api/scales/...
// @desc    Use this route to operate app
// @access  Private
router.post('/add-topic', auth, async (req, res) => {
  try {
    const { data } = req.body;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const course = await Course.findById('5ec3e76580def926785bb6b1');
      for (i = 0; i < data.length; i++) {
        const topic = new Topic({
          name: data[i].name,
          courseId: '5ec3e76580def926785bb6b1',
          lessonIds: [],
          assignmentIds: [],
          progressIds: [],
        });

        await topic.save({ session });

        course.topicIds.push(topic._id);
        await course.save({ session });
      }
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      console.error(err);
      res.status(400).json({ msg: 'Server error' });
    }

    await session.commitTransaction();
    session.endSession();

    res.send('Added topic');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// @route   OPERATION api/scales/...
// @desc    Use this route to operate app
// @access  Private
router.post('/add-children-of-topic/:topicId', auth, async (req, res) => {
  try {
    const { data } = req.body;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const topic = await Topic.findById(req.params.topicId);
      for (i = 0; i < data.length; i++) {
        if (data[i].type == 3) {
          const assignment = new Assignment({
            name: data[i].name,
            courseId: '5ec3e76580def926785bb6b1',
            orderIndex: data[i].orderIndex + 1,
            topicId: req.params.topicId,
            duration: 300,
            passPercent: 100,
            progressIds: [],
          });
          await assignment.save({ session });

          topic.assignmentIds.push(assignment._id);
          await topic.save({ session });
        } else if (data[i].type == 1) {
          const lesson = new Lesson({
            name: data[i].name,
            courseId: '5ec3e76580def926785bb6b1',
            orderIndex: data[i].orderIndex + 1,
            videoLink: 'https://www.youtube.com/watch?v=QONzSMqxzWU',
            topicId: req.params.topicId,
            assignmentIds: [],
            progressIds: [],
          });
          await lesson.save({ session });

          topic.lessonIds.push(lesson._id);
          await topic.save({ session });
        }
      }
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      console.error(err);
      res.status(400).json({ msg: 'Server error' });
    }

    await session.commitTransaction();
    session.endSession();

    res.send('Added children of topic');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// @route   OPERATION api/scales/...
// @desc    Use this route to operate app
// @access  Private
router.post('/add-assignment-of-lesson/:lessonId', auth, async (req, res) => {
  try {
    const { data } = req.body;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const lesson = await Lesson.findById(req.params.lessonId);
      for (i = 0; i < 2; i++) {
        const assignment = new Assignment({
          name: `Practice ${i + 1}`,
          courseId: '5ec3e76580def926785bb6b1',
          topicId: '5ef9da6137b2583984a4d38e',
          orderIndex: i + 1,
          lessonId: req.params.lessonId,
          timeToShowUp: (i + 1) * 30,
          duration: 300,
          passPercent: 100,
          progressIds: [],
        });

        await assignment.save({ session });

        lesson.assignmentIds.push(assignment._id);
        await lesson.save({ session });
      }
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      console.error(err);
      res.status(400).json({ msg: 'Server error' });
    }

    await session.commitTransaction();
    session.endSession();

    res.send('Added assignment of lesson');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// @route   OPERATION api/scales/...
// @desc    Use this route to operate app
// @access  Private
router.post('/add-document-of-lesson/:lessonId', auth, async (req, res) => {
  try {
    const { data } = req.body;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const lesson = await Lesson.findById(req.params.lessonId);
      const course = await Course.findById('5ec3e76580def926785bb6b1');
      for (i = 0; i < data.length; i++) {
        const document = new Document({
          name: data[i].title,
          courseId: '5ec3e76580def926785bb6b1',
          lessonId: req.params.lessonId,
          link: data[i].url,
        });

        await document.save({ session });

        lesson.documentIds.push(document._id);
        course.documentIds.push(document._id);
        await lesson.save({ session });
        await course.save({ session });
      }
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      console.error(err);
      res.status(400).json({ msg: 'Server error' });
    }

    await session.commitTransaction();
    session.endSession();

    res.send('Added document of lesson');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// @route   OPERATION api/scales/...
// @desc    Use this route to operate app
// @access  Private
router.post(
  '/add-question-of-assignment/:assignmentId',
  auth,
  async (req, res) => {
    try {
      const { part, min, max } = req.body;

      const session = await mongoose.startSession();
      session.startTransaction();

      try {
        let assigment = await Assignment.findById(req.params.assignmentId);

        let questions = await getQuestionByPartNumberSelectId(part);
        let questionArr = questions;
        let newQuestionIds = [];
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

        await assigment.save({ session });
      } catch (err) {
        await session.abortTransaction();
        session.endSession();
        console.error(err);
        res.status(400).json({ msg: 'Server error' });
      }

      await session.commitTransaction();
      session.endSession();

      res.send('Added question of assignment');
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  }
);

// @route   OPERATION api/scales/...
// @desc    Use this route to operate app
// @access  Private
router.delete('/delete-children-of-topic/:topicId', auth, async (req, res) => {
  try {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      let topic = await Topic.findById(req.params.topicId);

      for (i = 0; i < topic.lessonIds.length; i++) {
        await Lesson.findByIdAndDelete(topic.lessonIds[i]._id);
      }

      for (i = 0; i < topic.assignmentIds.length; i++) {
        await Lesson.findByIdAndDelete(topic.assignmentIds[i]._id);
      }

      topic.lessonIds = [];
      topic.assignmentIds = [];

      await topic.save({ session });
      res.send('Delete successfully');
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      console.error(err);
      res.status(400).json({ msg: 'Server error' });
    }

    await session.commitTransaction();
    session.endSession();

    res.send('Added question of assignment');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// @route   OPERATION api/scales/...
// @desc    Use this route to operate app
// @access  Private
router.put('/change-lesson-video/:courseId', auth, async (req, res) => {
  try {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      let lessons = await Lesson.find({ courseId: req.params.courseId });

      for (i = 0; i < lessons.length; i++) {
        const lesson = await Lesson.findById(lessons[i]._id);
        lesson.videoLink = 'https://www.youtube.com/watch?v=YkB61bexdc0';
        await lesson.save({ session });
      }

      res.send('Change video link successfully');
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      console.error(err);
      res.status(400).json({ msg: 'Server error' });
    }

    await session.commitTransaction();
    session.endSession();

    res.send('Added question of assignment');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
