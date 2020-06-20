const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { check, validationResult } = require('express-validator');
const { handleUnprocessableEntity } = require('../util');
const auth = require('../middleware/auth');

const Question = require('../models/Question');
const Part = require('../models/Part');
const Test = require('../models/Test');
const Participant = require('../models/Participant');
const Progress = require('../models/Progress');
const Scale = require('../models/Scale');
const Toeic = require('../models/Toeic');
const User = require('../models/User');

// @route   GET api/tests/leaderboard
// @desc    Get a leaderboard by part number
// @access  Private
router.get('/leaderboard/:id', auth, async (req, res) => {
  try {
    const leaderboard = await Part.findOne({
      partNumber: req.params.id,
    }).populate({
      path: 'progressIds',
      populate: { path: 'userId', select: 'name' },
    });
    handleUnprocessableEntity(leaderboard, res);
    res.json(leaderboard.progressIds);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// @route   GET api/tests/:id
// @desc    Get result of test by id
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const test = await Participant.findById(req.params.id).populate({
      path: 'testId',
      populate: { path: 'questionIds', populate: { path: 'childrenIds' } },
    });
    handleUnprocessableEntity(test, res);
    res.json({ participantIds: [test] });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// @route   POST api/tests
// @desc    Create a toeic test
// @access  Private
router.post(
  '/random',
  [check('testType', 'Test type is required').exists()],
  auth,
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { testType } = req.body;

      if (!isNaN(Number(testType)) && testType !== '7') {
        const numberOfQuestion =
          testType === '1' || testType === '2' || testType === '5' ? 10 : 4;
        const question = await Question.find({
          part: Number(testType),
        }).populate({ path: 'childrenIds' });
        let randomQuestionIds = [];

        for (i = 0; i < numberOfQuestion; i++) {
          const randomIndex = Math.floor(Math.random() * question.length);
          randomQuestionIds.push(question[randomIndex]);
          question.splice(randomIndex, 1);
        }

        const part = await Part.findOne({
          partNumber: Number(testType),
        }).populate({
          path: 'participantIds',
          populate: {
            path: 'testId userId',
            populate: {
              path: 'questionIds',
              populate: { path: 'childrenIds' },
            },
          },
        });

        res.json({
          randomQuestionIds,
          participantIds: part.participantIds.reverse(),
        });
      } else if (testType === '7') {
        const numberOfQuestion = 3;
        const questionPart71 = await Question.find({
          part: 7.1,
        }).populate({ path: 'childrenIds' });
        const questionPart72 = await Question.find({
          part: 7.2,
        }).populate({ path: 'childrenIds' });

        const question = [...questionPart71, ...questionPart72];
        let randomQuestionIds = [];

        for (i = 0; i < numberOfQuestion; i++) {
          const randomIndex = Math.floor(Math.random() * question.length);
          randomQuestionIds.push(question[randomIndex]);
          question.splice(randomIndex, 1);
        }

        const part = await Part.findOne({
          partNumber: Number(testType),
        }).populate({
          path: 'participantIds',
          populate: {
            path: 'testId userId',
            populate: {
              path: 'questionIds',
              populate: { path: 'childrenIds' },
            },
          },
        });

        res.json({
          randomQuestionIds,
          participantIds: part.participantIds.reverse(),
        });
      } else if (testType === 'short-test') {
        const params = [
          {
            part: 1,
            numberOfQuestion: 2,
          },
          {
            part: 2,
            numberOfQuestion: 2,
          },
          {
            part: 3,
            numberOfQuestion: 1,
          },
          {
            part: 4,
            numberOfQuestion: 1,
          },
          {
            part: 5,
            numberOfQuestion: 4,
          },
          {
            part: 6,
            numberOfQuestion: 1,
          },
          {
            part: 7.1,
            numberOfQuestion: 1,
          },
          {
            part: 7.2,
            numberOfQuestion: 1,
          },
        ];

        let randomQuestionIds = [];

        for (i = 0; i < 8; i++) {
          const question = await Question.find({
            part: params[i].part,
          }).populate({
            path: 'childrenIds',
          });
          for (j = 0; j < params[i].numberOfQuestion; j++) {
            const randomIndex = Math.floor(Math.random() * question.length);
            randomQuestionIds.push(question[randomIndex]);
            question.splice(randomIndex, 1);
          }
        }

        // const toeic = await Toeic.find({}).populate({
        //   path: 'participantIds',
        //   populate: {
        //     path: 'testId userId',
        //     populate: {
        //       path: 'questionIds',
        //       populate: { path: 'childrenIds' },
        //     },
        //   },
        // });

        const toeic = await Toeic.find({}).populate({
          path: 'participantIds',
          select: '-userAnswer',
          populate: {
            path: 'testId userId',
            select: 'name',
            populate: {
              path: 'questionIds',
              select: 'childrenIds',
            },
          },
        });

        let participantIds = [];

        toeic.map((children) => {
          children.participantIds.map((participant) => {
            if (participant.testId.questionIds.length < 50)
              participantIds.push(participant);
          });
        });

        res.json({
          randomQuestionIds,
          participantIds: participantIds.reverse(),
        });
      } else if (testType === 'full-test') {
        const params = [
          {
            part: 1,
            numberOfQuestion: 10,
          },
          {
            part: 2,
            numberOfQuestion: 15,
          },
          {
            part: 3,
            numberOfQuestion: 4,
          },
          {
            part: 4,
            numberOfQuestion: 4,
          },
          {
            part: 5,
            numberOfQuestion: 20,
          },
          {
            part: 6,
            numberOfQuestion: 4,
          },
          {
            part: 7.1,
            numberOfQuestion: 3,
          },
          {
            part: 7.2,
            numberOfQuestion: 2,
          },
        ];

        let randomQuestionIds = [];

        for (i = 0; i < 8; i++) {
          const question = await Question.find({
            part: params[i].part,
          }).populate({
            path: 'childrenIds',
          });
          for (j = 0; j < params[i].numberOfQuestion; j++) {
            const randomIndex = Math.floor(Math.random() * question.length);
            randomQuestionIds.push(question[randomIndex]);
            question.splice(randomIndex, 1);
          }
        }

        const toeic = await Toeic.find({}).populate({
          path: 'participantIds',
          select: '-userAnswer',
          populate: {
            path: 'testId userId',
            select: 'name',
            populate: {
              path: 'questionIds',
              select: 'childrenIds',
            },
          },
        });

        let participantIds = [];

        toeic.map((children) => {
          children.participantIds.map((participant) => {
            if (participant.testId.questionIds.length > 50)
              participantIds.push(participant);
          });
        });

        res.json({
          randomQuestionIds,
          participantIds: participantIds.reverse(),
        });
      } else {
        console.log(testType);
      }
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  }
);

router.post(
  '/',
  [
    check('testType', 'Test type is required').exists(),
    check('assignment', 'Assignment is required').exists(),
    check('score', 'Score is required').exists(),
    check('percentComplete', 'Percent complete is required').exists(),
    check('userAnswer', 'User answer is required').exists(),
  ],
  auth,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    const {
      testType,
      assignment,
      userAnswer,
      score,
      percentComplete,
      numberOfQuestionIds,
    } = req.body;

    try {
      // Lưu thông tin bài test
      const test = new Test({
        name: assignment.name,
        questionIds: assignment.questionIds,
        duration: assignment.duration,
      });

      await test.save({ session });
      if (!isNaN(Number(testType))) {
        try {
          // Tìm kiếm part user đã làm
          const part = await Part.findOne({
            partNumber: Number(testType),
          })
            .populate({ path: 'progressIds', match: { userId: req.user._id } })
            .populate({
              path: 'participantIds',
              match: { userId: req.user._id },
              populate: { path: 'testId' },
            });
          // Những câu đầu tiên khi người dùng chưa làm bài nào
          let numberOfQuestion = 20;

          part.participantIds.forEach((children) => {
            numberOfQuestion += children.testId.questionIds.length;
          });
          // Lưu thông tin vào part
          const participant = new Participant({
            userId: req.user._id,
            testId: test._id,
            userAnswer,
            score,
          });

          await participant.save({ session });
          // Lưu lại bài làm vào trong participant của user

          part.participantIds.push(participant._id);
          await part.save({ session });

          const user = await User.findById(req.user._id);
          user.participantIds.push(participant._id);
          await user.save({ session });

          // Tính lại progress của part đó
          const newProgress =
            (numberOfQuestion * part.progressIds[0].percentComplete +
              percentComplete * assignment.questionIds.length) /
            (numberOfQuestion + assignment.questionIds.length);

          const progress = await Progress.findById(part.progressIds[0]._id);
          progress.percentComplete = Math.round(newProgress);

          await progress.save({ session });
          // Tính lại currentScore của user
          const partIds = await Part.find({}).populate({
            path: 'progressIds',
            match: { userId: req.user._id },
          });

          let listeningProgress = 0;
          let readingProgress = 0;

          partIds.forEach((children) => {
            if (
              children.partNumber === 1 ||
              children.partNumber === 2 ||
              children.partNumber === 3 ||
              children.partNumber === 4
            ) {
              if (children.partNumber === Number(testType)) {
                listeningProgress += newProgress;
              } else {
                listeningProgress += children.progressIds[0].percentComplete;
              }
            } else {
              if (children.partNumber === Number(testType)) {
                readingProgress += newProgress;
              } else {
                readingProgress += children.progressIds[0].percentComplete;
              }
            }
          });
          const scale = await Scale.findOne({});

          const listeningScore =
            scale.listening[Math.round(listeningProgress / 4)];
          const readingScore = scale.reading[Math.round(readingProgress / 3)];

          const currentScore = listeningScore + readingScore;

          const toeic = await Toeic.findOne({ userId: req.user._id });
          toeic.currentScore = currentScore;

          await toeic.save({ session });
        } catch (err) {
          await session.abortTransaction();
          session.endSession();
          console.error(err);
          res.status(400).json({ msg: 'Something when wrong in small part' });
        }
      } else if (testType === 'short-test' || testType === 'full-test') {
        const participant = new Participant({
          userId: req.user._id,
          testId: test._id,
          userAnswer,
          score,
        });
        await participant.save({ session });

        // Lưu bài làm vào mảng Toeic
        const toeic = await Toeic.findOne({ userId: req.user._id });
        toeic.participantIds.push(participant._id);
        await toeic.save({ session });

        // Lưu bài làm vào mảng User
        const user = await User.findById(req.user._id);
        user.participantIds.push(participant._id);
        await user.save({ session });

        // Tìm kiếm part user đã làm
        const partIds = await Part.find({})
          .populate({ path: 'progressIds', match: { userId: req.user._id } })
          .populate({
            path: 'participantIds',
            match: { userId: req.user._id },
            populate: { path: 'testId' },
          });

        let totalQuestionNumberIds = [20, 20, 20, 20, 20, 20, 20];
        let percentCompleteIds = [0, 0, 0, 0, 0, 0, 0];

        // Tính toán phần trăm mới của mỗi part
        partIds.forEach((part, index) => {
          part.participantIds.forEach((children) => {
            totalQuestionNumberIds[index] += children.testId.questionIds.length;
          });
          percentCompleteIds[index] = Math.round(
            (percentComplete[index] * numberOfQuestionIds[index] +
              part.progressIds[0].percentComplete *
                totalQuestionNumberIds[index]) /
              (numberOfQuestionIds[index] + totalQuestionNumberIds[index])
          );
        });
        const listeningProgress =
          percentCompleteIds[0] +
          percentCompleteIds[1] +
          percentCompleteIds[2] +
          percentCompleteIds[3];

        const readingProgress =
          percentCompleteIds[4] + percentCompleteIds[5] + percentCompleteIds[6];

        const scale = await Scale.findOne({});
        const listeningScore =
          scale.listening[Math.round(listeningProgress / 4)];
        const readingScore = scale.reading[Math.round(readingProgress / 3)];

        toeic.currentScore = listeningScore + readingScore;

        await toeic.save({ session });

        for (i = 0; i < partIds.length; i++) {
          const progress = await Progress.findById(
            partIds[i].progressIds[0]._id
          );
          progress.percentComplete = percentCompleteIds[i];
          await progress.save({ session });
        }
      }

      await session.commitTransaction();
      session.endSession();

      res.json({ msg: 'Everything done!' });
    } catch (err) {
      await session.commitTransaction();
      session.endSession();
      console.error(err);
      res.status(500).send('Sever Error');
    }
  }
);

module.exports = router;
