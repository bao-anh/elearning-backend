const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');

const Toeic = require('../models/Toeic');
const Part = require('../models/Part');
const Scale = require('../models/Scale');
const Progress = require('../models/Progress');
const User = require('../models/User');

// @route   GET api/toeic
// @desc    Get toeic by userId
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const toeic = await Toeic.findOne({ userId: req.user._id }).populate({
      path: 'partIds',
      populate: { path: 'progressIds', match: { userId: req.user._id } },
    });
    res.json(toeic);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/toeic
// @desc    Update toeic by userId
// @access  Private
router.put('/scores', auth, async (req, res) => {
  try {
    const toeic = await Toeic.findOne({ userId: req.user._id });
    toeic.targetScore = req.body.targetScore;
    await toeic.save();
    res.json(toeic);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// @route   GET api/questions
// @desc    Query question
// @access  Public
router.post(
  '/scores',
  [
    check('currentScore', 'Current score is required').isNumeric(),
    check('targetScore', 'Target score is required').isNumeric(),
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

      const { currentScore, targetScore } = req.body;

      try {
        const scale = await Scale.findOne({});
        const roundingCurrentScore = Math.round(currentScore / 2 / 5) * 5;
        const currentPercentReadingScore = scale.reading.indexOf(
          roundingCurrentScore
        );
        const currentPercentListeningScore = scale.listening.indexOf(
          roundingCurrentScore
        );
        // Đưa phần trăm hoàn thành vào listening part
        [1, 2, 3, 4].forEach(async (partNumber) => {
          const progress = new Progress({
            userId: req.user._id,
            percentComplete: currentPercentListeningScore,
          });

          await progress.save({ session });

          const part = await Part.findOne({ partNumber });
          part.progressIds.push(progress._id);
          await part.save({ session });
        });
        // Đưa phần trăm hoàn thành vào reading part
        [5, 6, 7].forEach(async (partNumber) => {
          const progress = new Progress({
            userId: req.user._id,
            percentComplete: currentPercentReadingScore,
          });

          await progress.save({ session });

          const part = await Part.findOne({ partNumber });
          part.progressIds.push(progress._id);
          await part.save({ session });
        });

        const toeicPartIds = await Part.find({}).select('_id');

        const toeic = new Toeic({
          userId: req.user._id,
          partIds: toeicPartIds.map((part) => part._id),
          minScore: Math.round(currentScore / 5) * 5,
          currentScore: Math.round(currentScore / 5) * 5,
          targetScore: Math.round(targetScore / 5) * 5,
        });

        await toeic.save({ session });

        const user = await User.findById(req.user._id);
        user.toeicId = toeic._id;
        await user.save({ session });

        res.json(toeic);
      } catch (err) {
        await session.abortTransaction();
        session.endSession();
        console.error(err);
        res.status(400).json({ msg: 'Scale is not exist' });
      }

      await session.commitTransaction();
      session.endSession();
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
