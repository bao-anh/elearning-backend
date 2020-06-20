const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { check, validationResult } = require('express-validator');
const { handleUnprocessableEntity } = require('../util');
const { getAllDocument, getDocumentById } = require('../services/document');
const { getCourseById } = require('../services/course');
const { getLessonById } = require('../services/lesson');
const auth = require('../middleware/auth');

const Document = require('../models/Document');

// @route   GET api/documents
// @desc    Get all documents
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const documents = await getAllDocument();
    handleUnprocessableEntity(documents, res);
    res.json(documents);
  } catch (err) {
    console.error(err);
    res.status(500).send('Sever Error');
  }
});

// @route   POST api/documents
// @desc    Create a new documents
// @access  Private
router.post(
  '/',
  auth,
  [
    check('name', 'Name is required').not().isEmpty(),
    check('link', 'Link is required').exists(),
    check('courseId', 'Course id required').exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    const { name, link, courseId, lessonId } = req.body;
    try {
      const newDocument = new Document({
        name,
        link,
        courseId: courseId || null,
        lessonId: lessonId || null,
      });

      await newDocument.save({ session });

      // If document is belong to course
      try {
        const course = await getCourseById(courseId);
        course.documentIds = [...course.documentIds, newDocument._id];
        await course.save({ session });
      } catch (err) {
        await session.abortTransaction();
        session.endSession();
        console.error(err);
        res.status(400).json({ msg: 'Course is not exist' });
      }
      // If document is belong to lesson
      if (lessonId) {
        try {
          const lesson = await getLessonById(lessonId);
          lesson.documentIds = [...lesson.documentIds, newDocument._id];
          await lesson.save({ session });
        } catch (err) {
          await session.abortTransaction();
          session.endSession();
          console.error(err);
          res.status(400).json({ msg: 'Lesson is not exist' });
        }
      }

      await session.commitTransaction();
      session.endSession();

      res.json(newDocument);
    } catch (err) {
      console.error(err);
      res.status(500).json('Sever Error');
    }
  }
);

// @route   PUT api/documents
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
    let topic = await getDocumentById(req.params.id);
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
