const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const { getRememberById } = require('../services/remember');
const auth = require('../middleware/auth');

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
        const remember = await getRememberById(correct[i].rememberIds[0]._id);
        remember.correct += 1;
        remember.attempt += 1;
        await remember.save();
      }

      for (j = 0; j < incorrect.length; j++) {
        const remember = await getRememberById(incorrect[j].rememberIds[0]._id);
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
