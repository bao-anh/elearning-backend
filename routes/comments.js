const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { check, validationResult } = require('express-validator');
const {
  getCourseById,
  getCourseByIdWithPopulateComment,
} = require('../services/course');
const {
  getTopicById,
  getTopicByIdWithPopulateComment,
} = require('../services/topic');
const {
  getLessonById,
  getLessonByIdWithPopulateComment,
} = require('../services/lesson');
const {
  getAssignmentById,
  getAssignmentByIdWithPopulateComment,
} = require('../services/assignment');
const auth = require('../middleware/auth');

const Comment = require('../models/Comment');

// @route   GET api/comments/:courses/:id
// @desc    Get all comment of course
// @access  Private
router.get('/courses/:id', auth, async (req, res) => {
  try {
    const course = await getCourseByIdWithPopulateComment(req.params.id);
    res.send(course);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// @route   GET api/comments/:topics/:id
// @desc    Get all comment of topic
// @access  Private
router.get('/topics/:id', auth, async (req, res) => {
  try {
    const topic = await getTopicByIdWithPopulateComment(req.params.id);
    res.send(topic);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// @route   GET api/comments/:lessons/:id
// @desc    Get all comment of lesson
// @access  Private
router.get('/lessons/:id', auth, async (req, res) => {
  try {
    const lesson = await getLessonByIdWithPopulateComment(req.params.id);
    res.send(lesson);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// @route   GET api/comments/:assigments/:id
// @desc    Get all comment of assigment
// @access  Private
router.get('/assignments/:id', auth, async (req, res) => {
  try {
    const assigment = await getAssignmentByIdWithPopulateComment(req.params.id);
    res.send(assigment);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// @route   POST api/comments/:parentId
// @desc    Create comment
// @access  Private
router.post(
  '/:parentId',
  [
    check('position', 'Position is required').exists(),
    check('message', 'Message is required').exists(),
  ],
  auth,
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const session = await mongoose.startSession();
      session.startTransaction();

      const { position, message } = req.body;

      const comment = new Comment({
        message,
        userId: req.user._id,
        likeIds: [],
        childrenIds: [],
      });

      try {
        await comment.save({ session });

        if (position === 'course') {
          const course = await getCourseById(req.params.parentId);
          if (course.commentIds) course.commentIds.unshift(comment._id);
          else course.commentIds = [comment._id];
          await course.save({ session });
        } else if (position === 'topic') {
          const topic = await getTopicById(req.params.parentId);
          if (topic.commentIds) topic.commentIds.unshift(comment._id);
          else topic.commentIds = [comment._id];
          await topic.save({ session });
        } else if (position === 'lesson') {
          const lesson = await getLessonById(req.params.parentId);
          if (lesson.commentIds) lesson.commentIds.unshift(comment._id);
          else lesson.commentIds = [comment._id];
          await lesson.save({ session });
        } else if (position === 'assignment') {
          const assignment = await getAssignmentById(req.params.parentId);
          if (assignment.commentIds) assignment.commentIds.unshift(comment._id);
          else assignment.commentIds = [comment._id];
          await assignment.save({ session });
        } else if (position === 'children') {
          const parentComment = await Comment.findById(req.params.parentId);
          parentComment.childrenIds.push(comment._id);
          await parentComment.save({ session });
        }
      } catch (err) {
        await session.abortTransaction();
        session.endSession();
        console.error(err);
        res.status(400).json({ msg: 'Something when wrong' });
      }

      await session.commitTransaction();
      session.endSession();

      res.json(comment);
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  }
);

// @route   DELETE api/comments/:parentIds
// @desc    Delete comment
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    const { parentId, position } = req.query;

    try {
      if (position === 'course') {
        const course = await getCourseById(parentId);

        const newCommentIds = course.commentIds.filter(
          (commentId) => commentId !== req.params.id
        );

        course.commentIds = newCommentIds;
        await course.save({ session });

        const comment = await Comment.findById(req.params.id);
        if (comment.childrenIds.length) {
          for (i = 0; i < comment.childrenIds.length; i++) {
            await Comment.findByIdAndDelete(comment.childrenIds[i], {
              session,
            });
          }
        }

        await Comment.findByIdAndDelete(req.params.id, { session });
      } else if (position === 'topic') {
        const topic = await getTopicById(parentId);

        const newCommentIds = topic.commentIds.filter(
          (commentId) => commentId !== req.params.id
        );

        topic.commentIds = newCommentIds;
        await topic.save({ session });

        const comment = await Comment.findById(req.params.id);
        if (comment.childrenIds.length) {
          for (i = 0; i < comment.childrenIds.length; i++) {
            await Comment.findByIdAndDelete(comment.childrenIds[i], {
              session,
            });
          }
        }

        await Comment.findByIdAndDelete(req.params.id, { session });
      } else if (position === 'lesson') {
        const lesson = await getLessonById(parentId);

        const newCommentIds = lesson.commentIds.filter(
          (commentId) => commentId !== req.params.id
        );

        lesson.commentIds = newCommentIds;
        await lesson.save({ session });

        const comment = await Comment.findById(req.params.id);
        if (comment.childrenIds.length) {
          for (i = 0; i < comment.childrenIds.length; i++) {
            await Comment.findByIdAndDelete(comment.childrenIds[i], {
              session,
            });
          }
        }

        await Comment.findByIdAndDelete(req.params.id, { session });
      } else if (position === 'assignment') {
        const assignment = await getAssignmentById(parentId);

        const newCommentIds = assignment.commentIds.filter(
          (commentId) => commentId !== req.params.id
        );

        assignment.commentIds = newCommentIds;
        await assignment.save({ session });

        const comment = await Comment.findById(req.params.id);
        if (comment.childrenIds.length) {
          for (i = 0; i < comment.childrenIds.length; i++) {
            await Comment.findByIdAndDelete(comment.childrenIds[i], {
              session,
            });
          }
        }

        await Comment.findByIdAndDelete(req.params.id, { session });
      } else if (position === 'children') {
        const parentComment = await Comment.findById(parentId);

        const newCommentIds = parentComment.childrenIds.filter(
          (childrenId) => childrenId !== req.params.id
        );

        parentComment.childrenIds = newCommentIds;
        await parentComment.save({ session });

        await Comment.findByIdAndDelete(req.params.id, { session });
      }
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      console.error(err);
      res.status(400).json({ msg: 'Something when wrong' });
    }

    await session.commitTransaction();
    session.endSession();

    res.json('Comment deleted successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/comments/:id
// @desc    Update comment by id
// @access  Private
router.put(
  '/:id',
  [check('message', 'Message is required').exists()],
  auth,
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const session = await mongoose.startSession();
      session.startTransaction();

      const { message } = req.body;

      try {
        const comment = await Comment.findById(req.params.id);
        comment.message = message;
        comment.date = new Date();
        await comment.save({ session });
      } catch (err) {
        await session.abortTransaction();
        session.endSession();
        console.error(err);
        res.status(400).json({ msg: 'Something when wrong' });
      }

      await session.commitTransaction();
      session.endSession();

      res.json('Comment updated successfully');
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  }
);

// @route   PUT api/comments/:id/like
// @desc    Like or dislike a comment
// @access  Private
router.put(
  '/:id/like',
  [check('isLike', 'Like is required').exists()],
  auth,
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const session = await mongoose.startSession();
      session.startTransaction();

      const { isLike } = req.body;

      try {
        const comment = await Comment.findById(req.params.id);
        if (isLike) {
          comment.likeIds.push(req.user._id);
        } else {
          const newLikeIds = comment.likeIds.filter(
            (likeId) => likeId != req.user._id
          );
          comment.likeIds = [...newLikeIds];
        }
        await comment.save({ session });
      } catch (err) {
        await session.abortTransaction();
        session.endSession();
        console.error(err);
        res.status(400).json({ msg: 'Something when wrong' });
      }

      await session.commitTransaction();
      session.endSession();

      res.json('Comment updated successfully');
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
