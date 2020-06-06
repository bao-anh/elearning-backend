const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');

const Set = require('../models/Set');
const Remember = require('../models/Remember');

// @route   PUI api/terms
// @desc    Update terms by userId
// @access  Private
router.put(
  '/:setId',
  [
    check('setId', 'Set id is required').exists(),
    check('correct', 'Correct is required').exists(),
    check('incorrect', 'Incorrect is required').exists(),
  ],
  auth,
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { correct, incorrect } = req.body;

      for (i = 0; i < correct.length; i++) {
        const remember = await Remember.findById(correct[i].rememberIds[0]._id);
        remember.correct += 1;
        remember.attempt += 1;
        await remember.save();
      }

      for (j = 0; j < incorrect.length; j++) {
        const remember = await Remember.findById(
          incorrect[j].rememberIds[0]._id
        );
        remember.attempt += 1;
        await remember.save();
      }

      res.json('Updated term');
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
