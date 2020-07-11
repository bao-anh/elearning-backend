const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { check, validationResult } = require('express-validator');
const { handleUnprocessableEntity } = require('../util');
const {
  getCourseById,
  getAllCourseWithPopulate,
  getCourseByIdWithPopulate,
  getAllCourseWithPopulateProgress,
} = require('../services/course');
const { getCategoryById } = require('../services/category');
const auth = require('../middleware/auth');

const Course = require('../models/Course');

// @route   GET api/courses
// @desc    Get all course with user's progress
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const course = await getAllCourseWithPopulate(req.user._id);
    handleUnprocessableEntity(course, res);
    res.json(course);
  } catch (err) {
    console.error(err);
    res.status(500).send('Sever Error');
  }
});

// @route   GET api/courses/:id
// @desc    Get course with its member and document
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const topic = await getCourseByIdWithPopulate(req.params.id, req.user._id);
    handleUnprocessableEntity(topic, res);
    res.json(topic);
  } catch (err) {
    console.error(err);
    res.status(500).send('Sever Error');
  }
});

// @route   GET api/courses/:id/topics
// @desc    Get course with its topics and user's progress
// @access  Private
router.get('/:id/topics', auth, async (req, res) => {
  try {
    const topic = await getCourseByIdWithPopulate(req.params.id, req.user._id);
    handleUnprocessableEntity(topic, res);
    res.json(topic);
  } catch (err) {
    console.error(err);
    res.status(500).send('Sever Error');
  }
});

// @route   GET api/courses/:userId
// @desc    Get all course with category and user's progress
// @access  Private
router.get('/get-all-with-category', auth, async (req, res) => {
  try {
    const course = await getAllCourseWithPopulateProgress(req.user._id);
    handleUnprocessableEntity(course, res);
    res.json(course);
  } catch (err) {
    console.error(err);
    res.status(500).send('Sever Error');
  }
});

// @route   POST api/courses
// @desc    Create a courses
// @access  Private
router.post(
  '/',
  auth,
  [
    check('name', 'Name is required').not().isEmpty(),
    check('categoryId', 'CategoryId is required').exists(),
    check('currentPrice', 'Current price is not valid').isNumeric(),
    check('realPrice', 'Real price is not valid').isNumeric(),
    check('banner', 'Banner is required').not().isEmpty(),
    check('avatar', 'Avatar is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty(),
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
      categoryId,
      currentPrice,
      realPrice,
      banner,
      avatar,
      description,
      memberIds,
      topicIds,
      documentIds,
      commentId,
      progressIds,
    } = req.body;
    try {
      const newCourse = new Course({
        name,
        categoryId,
        currentPrice,
        realPrice,
        banner,
        avatar,
        description,
        memberIds: memberIds || [],
        topicIds: topicIds || [],
        documentIds: documentIds || [],
        commentId: commentId || null,
        progressIds: progressIds || [],
      });

      await newCourse.save({ session });

      try {
        const category = await getCategoryById(categoryId);
        category.courseIds = [...category.courseIds, newCourse._id];
        await category.save({ session });
      } catch (err) {
        await session.abortTransaction();
        session.endSession();
        console.error(err);
        res.status(400).json({ msg: 'Category is not exist' });
      }

      await session.commitTransaction();
      session.endSession();

      res.json(newCourse);
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      console.error(err);
      res.status(500).send('Sever Error');
    }
  }
);

// @route   PUT api/courses
// @desc    Update a course
// @access  Private
router.put('/:id', auth, async (req, res) => {
  const {
    name,
    currentPrice,
    realPrice,
    banner,
    avatar,
    description,
    memberIds,
    topicIds,
    documentIds,
    commentId,
    progressIds,
  } = req.body;

  try {
    let course = await getCourseById(req.params.id);
    course.name = name ? name : course.name;
    course.currentPrice = currentPrice ? currentPrice : course.currentPrice;
    course.realPrice = realPrice ? realPrice : course.realPrice;
    course.banner = banner ? banner : course.banner;
    course.realPrice = realPrice ? realPrice : course.realPrice;
    course.avatar = avatar ? avatar : course.avatar;
    course.description = description ? description : course.description;
    course.memberIds = memberIds ? memberIds : course.memberIds;
    course.topicIds = topicIds ? topicIds : course.topicIds;
    course.documentIds = documentIds ? documentIds : course.documentIds;
    course.commentId = commentId ? commentId : course.commentId;
    course.progressIds = progressIds ? progressIds : course.progressIds;
    await course.save();
    res.json(course);
  } catch (err) {
    console.error(err);
    res.status(500).send('Sever Error');
  }
});

// @route   GET api/courses/:id/user
// @desc    Update member in memberIds
// @access  Private
router.put('/:id/user', auth, async (req, res) => {
  try {
    const course = await getCourseById(req.params.id);

    course.memberIds.push(req.user._id);
    await course.save();

    res.json(course);
  } catch (err) {
    console.error(err);
    res.status(500).send('Sever Error');
  }
});

module.exports = router;
