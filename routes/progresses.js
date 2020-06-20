const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { check, validationResult } = require('express-validator');
const { getAllProgress, getProgressById } = require('../services/progress');
const {
  getAssignmentByIdWithPopulateProgress,
} = require('../services/assignment');
const { getTopicByIdWithPopulateProgress } = require('../services/topic');
const { getLessonByIdWithPopulateProgress } = require('../services/lesson');
const { getCourseByIdWithPopulateProgress } = require('../services/course');
const { handleUnprocessableEntity } = require('../util');
const auth = require('../middleware/auth');

const Progress = require('../models/Progress');

// @route   GET api/progress
// @desc    Get all progress
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const progress = await getAllProgress();
    handleUnprocessableEntity(progress, res);
    res.json(progress);
  } catch (err) {
    console.error(err);
    res.status(500).send('Sever Error');
  }
});

// @route   GET api/progress/:id
// @desc    Get progress by id
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const progress = await getProgressById(req.params.id);
    handleUnprocessableEntity(progress, res);
    res.json(progress);
  } catch (err) {
    console.error(err);
    res.status(500).send('Sever Error');
  }
});

// @route   POST api/progress
// @desc    Create a new progress
// @access  Private
router.post(
  '/',
  auth,
  [
    check('userId', 'User id is required').exists(),
    check('percentComplete', 'Percent complete is not valid').isNumeric(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    const {
      userId,
      percentComplete,
      lessonId,
      assignmentId,
      topicId,
      courseId,
    } = req.body;

    try {
      // set progress in assignment
      const newAssignment = await getAssignmentByIdWithPopulateProgress(
        assignmentId,
        req.user._id
      );
      if (newAssignment.progressIds.length) {
        let progress = await getProgressById(newAssignment.progressIds[0]._id);
        progress.percentComplete = percentComplete + progress.percentComplete;

        await progress.save({ session });
      } else {
        const progress = new Progress({
          userId,
          percentComplete: percentComplete,
        });
        await progress.save({ session });

        // nếu chưa có progressIds sẵn trong assignment thì tạo thêm
        newAssignment.progressIds.push(progress._id);

        await newAssignment.save({ session });
      }
      // check if assignment is in a lesson.

      let accPercentComplete = percentComplete;

      if (lessonId) {
        try {
          const lesson = await getLessonByIdWithPopulateProgress(
            lessonId,
            req.user._id
          );

          let lessonProgress = 0;
          // duyệt tất cả mảng assignmentIds
          lesson.assignmentIds.forEach((assignment) => {
            // cộng tất cả những assignment nào đã có progress
            if (assignment.progressIds.length) {
              lessonProgress += assignment.progressIds[0].percentComplete;
            }
          });

          lessonProgress =
            (lessonProgress + accPercentComplete) / lesson.assignmentIds.length;

          lessonProgress = lessonProgress > 100 ? 100 : lessonProgress;
          accPercentComplete = accPercentComplete / lesson.assignmentIds.length;

          if (lesson.progressIds.length) {
            let progress = await getProgressById(lesson.progressIds[0]._id);
            progress.percentComplete = lessonProgress;

            await progress.save({ session });
          } else {
            const progress = new Progress({
              userId,
              percentComplete: lessonProgress,
            });

            await progress.save({ session });
            lesson.progressIds.push(progress._id);
            await lesson.save({ session });
          }

          // tăng phần trăm hoàn thành của topic
          const topic = await getTopicByIdWithPopulateProgress(
            topicId,
            req.user._id
          );

          let topicProgress = 0;

          topic.assignmentIds.forEach((assignment) => {
            // cộng tất cả những assignment nào đã có progress
            if (assignment.progressIds.length) {
              topicProgress += assignment.progressIds[0].percentComplete;
            }
          });

          topic.lessonIds.forEach((lesson) => {
            // cộng tất cả những lesson nào đã có progress
            if (lesson.progressIds.length) {
              topicProgress += lesson.progressIds[0].percentComplete;
            }
          });

          topicProgress =
            (topicProgress + accPercentComplete) /
            (topic.lessonIds.length + topic.assignmentIds.length);

          topicProgress = topicProgress > 100 ? 100 : topicProgress;
          accPercentComplete =
            accPercentComplete /
            (topic.lessonIds.length + topic.assignmentIds.length);

          if (topic.progressIds.length) {
            let progress = await getProgressById(topic.progressIds[0]._id);

            progress.percentComplete = topicProgress;
            await progress.save({ session });
          } else {
            const progress = new Progress({
              userId,
              percentComplete: topicProgress,
            });
            await progress.save({ session });

            topic.progressIds.push(progress._id);
            await topic.save({ session });
          }

          // tăng phần trăm hoàn thành của course
          const course = await getCourseByIdWithPopulateProgress(
            courseId,
            req.user._id
          );

          let courseProgress = 0;

          course.topicIds.forEach((topic) => {
            if (topic.progressIds.length) {
              courseProgress += topic.progressIds[0].percentComplete;
            }
          });

          courseProgress =
            (courseProgress + accPercentComplete) / course.topicIds.length;

          courseProgress = courseProgress > 100 ? 100 : courseProgress;

          if (course.progressIds.length) {
            let progress = await getProgressById(course.progressIds[0]._id);

            progress.percentComplete = courseProgress;
            await progress.save({ session });
          } else {
            const progress = new Progress({
              userId,
              percentComplete: courseProgress,
            });

            await progress.save({ session });
            course.progressIds.push(progress._id);
            await course.save({ session });
          }
        } catch (err) {
          await session.abortTransaction();
          session.endSession();
          console.error(err);
          res
            .status(400)
            .json({ msg: 'Something when wrong in assignment of lesson' });
        }
      } else {
        try {
          // tăng phần trăm hoàn thành của topic
          const topic = await getTopicByIdWithPopulateProgress(
            topicId,
            req.user._id
          );

          let topicProgress = 0;

          topic.assignmentIds.forEach((assignment) => {
            // cộng tất cả những assignment nào đã có progress
            if (assignment.progressIds.length) {
              topicProgress += assignment.progressIds[0].percentComplete;
            }
          });

          topic.lessonIds.forEach((lesson) => {
            // cộng tất cả những lesson nào đã có progress
            if (lesson.progressIds.length) {
              topicProgress += lesson.progressIds[0].percentComplete;
            }
          });

          topicProgress =
            (topicProgress + accPercentComplete) /
            (topic.lessonIds.length + topic.assignmentIds.length);

          topicProgress = topicProgress > 100 ? 100 : topicProgress;
          accPercentComplete =
            accPercentComplete /
            (topic.lessonIds.length + topic.assignmentIds.length);

          if (topic.progressIds.length) {
            let progress = await getProgressById(topic.progressIds[0]._id);

            progress.percentComplete = topicProgress;
            await progress.save({ session });
          } else {
            const progress = new Progress({
              userId,
              percentComplete: topicProgress,
            });
            await progress.save({ session });

            topic.progressIds.push(progress._id);
            await topic.save({ session });
          }

          // tăng phần trăm hoàn thành của course
          const course = await getCourseByIdWithPopulateProgress(
            courseId,
            req.user._id
          );

          let courseProgress = 0;

          course.topicIds.forEach((topic) => {
            if (topic.progressIds.length) {
              courseProgress += topic.progressIds[0].percentComplete;
            }
          });

          courseProgress =
            (courseProgress + accPercentComplete) / course.topicIds.length;

          courseProgress = courseProgress > 100 ? 100 : courseProgress;

          if (course.progressIds.length) {
            let progress = await getProgressById(course.progressIds[0]._id);

            progress.percentComplete = courseProgress;
            await progress.save({ session });
          } else {
            const progress = new Progress({
              userId,
              percentComplete: courseProgress,
            });

            await progress.save({ session });
            course.progressIds.push(progress._id);
            await course.save({ session });
          }
        } catch (err) {
          await session.abortTransaction();
          session.endSession();
          console.error(err);
          res
            .status(400)
            .json({ msg: 'Something is when wrong in assignment of topic' });
        }
      }

      await session.commitTransaction();
      session.endSession();

      res.json(newAssignment);
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      console.error(err);
      res.status(400).json({ msg: 'Assignment is not exist' });
    }
  }
);

module.exports = router;
