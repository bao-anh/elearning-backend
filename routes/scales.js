const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');

const Scale = require('../models/Scale');

// @route   POST api/scales
// @desc    Create a toeic scale
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const scale = await Scale.findOne({});
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

module.exports = router;
