const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');

const Topic = require('../models/Topic');
const Course = require('../models/Course');

// @route   GET api/topics
// @desc    Get all topics
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const topics = await Topic.find();
    res.json(topics);
  } catch (err) {
    console.error(err);
    res.status(500).send('Sever Error');
  }
});

// @route   GET api/topics/:id
// @desc    Get topic by id
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const topics = await Topic.findById(req.params.id)
      .populate({ path: 'lessonIds' })
      .populate({ path: 'assignmentIds' });
    res.json(topics);
  } catch (err) {
    console.error(err);
    res.status(500).send('Sever Error');
  }
});

// @route   POST api/topics
// @desc    Create a new topics
// @access  Private
router.post(
  '/',
  auth,
  [
    check('name', 'Name is required').not().isEmpty(),
    check('courseId', 'Course is required').exists(),
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
      lessonIds,
      assignmentIds,
      isFree,
      commentId,
      progressIds,
    } = req.body;
    try {
      const newtopic = new Topic({
        name,
        courseId,
        isFree,
        commentId: commentId || null,
        lessonIds: lessonIds || [],
        assignmentIds: assignmentIds || [],
        progressIds: progressIds || [],
      });

      await newtopic.save({ session });

      try {
        const course = await Course.findById(courseId);
        course.topicIds = [...course.topicIds, newtopic._id];
        await course.save({ session });
      } catch (err) {
        await session.abortTransaction();
        session.endSession();
        console.error(err);
        res.status(400).json({ msg: 'Course is not exist' });
      }

      await session.commitTransaction();
      session.endSession();

      res.json(newtopic);
    } catch (err) {
      console.error(err);
      res.status(500).send('Sever Error');
    }
  }
);

// @route   PUT api/topics
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
    let topic = await Topic.findById(req.params.id);
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
