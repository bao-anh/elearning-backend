const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');

const Lesson = require('../models/Lesson');
const Topic = require('../models/Topic');

// @route   GET api/lessons
// @desc    Get all lessons
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const lessons = await Lesson.find();
    res.json(lessons);
  } catch (err) {
    console.error(err);
    res.status(500).send('Sever Error');
  }
});

// @route   GET api/lessons/:id
// @desc    Get lesson with all assigment
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id)
      .populate({
        path: 'assignmentIds',
      })
      .populate({ path: 'documentIds' });
    res.json(lesson);
  } catch (err) {
    console.error(err);
    res.status(500).send('Sever Error');
  }
});

// @route   POST api/lessons
// @desc    Create a new lessons
// @access  Private
router.post(
  '/',
  auth,
  [
    check('name', 'Name is required').not().isEmpty(),
    check('courseId', 'Course is required').exists(),
    check('orderIndex', 'Order index is required').exists(),
    check('topicId', 'Topic is required').exists(),
    check('videoLink', 'Link video is required').exists(),
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
      documentIds,
      assignmentIds,
      videoLink,
      orderIndex,
      isFree,
      commentId,
      progressIds,
    } = req.body;
    try {
      const newLesson = new Lesson({
        name,
        courseId,
        topicId,
        isFree,
        orderIndex,
        videoLink,
        commentId: commentId || null,
        assignmentIds: assignmentIds || [],
        documentIds: documentIds || [],
        progressIds: progressIds || [],
      });

      await newLesson.save({ session });

      try {
        const topic = await Topic.findById(topicId);
        topic.lessonIds = [...topic.lessonIds, newLesson._id];
        await topic.save({ session });
      } catch (err) {
        await session.abortTransaction();
        session.endSession();
        console.error(err);
        res.status(400).json({ msg: 'Topic is not exist' });
      }

      await session.commitTransaction();
      session.endSession();

      res.json(newLesson);
    } catch (err) {
      console.error(err);
      res.status(500).send('Sever Error');
    }
  }
);

// @route   PUT api/lessons
// @desc    Update a topic by id
// @access  Private
router.put('/:id', auth, async (req, res) => {
  const {
    name,
    courseId,
    topicId,
    documentIds,
    orderIndex,
    assignmentIds,
    videoLink,
    isFree,
    commentId,
    progressIds,
  } = req.body;

  try {
    let lesson = await Lesson.findById(req.params.id);
    lesson.name = name ? name : lesson.name;
    lesson.courseId = courseId ? courseId : lesson.courseId;
    lesson.topicId = topicId ? topicId : lesson.topicId;
    lesson.documentIds = documentIds ? documentIds : lesson.documentIds;
    lesson.assignmentIds = assignmentIds ? assignmentIds : lesson.assignmentIds;
    lesson.orderIndex = orderIndex ? orderIndex : lesson.orderIndex;
    lesson.videoLink = videoLink ? videoLink : lesson.videoLink;
    lesson.isFree = isFree ? isFree : lesson.isFree;
    lesson.commentId = commentId ? commentId : lesson.commentId;
    lesson.progressIds = progressIds ? progressIds : lesson.progressIds;
    await lesson.save();
    res.json(lesson);
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
